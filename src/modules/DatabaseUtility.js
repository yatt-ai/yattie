const JSONdb = require("simple-json-db");
const { app, remote } = require("electron");
const path = require("path");
const fs = require("fs");
const browserUtility = require("./BrowserWindowUtility");
const { STATUSES } = require("./constants");

const configDir = (app || remote.app).getPath("userData");
const jsonDbConfig = {
  jsonSpaces: 2,
};

const currentVersion = app.getVersion();

let metaDb, configDb, credentialDb, dataDb, configVersion;
let browserWindow;

const defaultMeta = {
  configPath: path.join(configDir, "config.json"),
  credentialsPath: path.join(configDir, "credentials.json"),
  sessionDataPath: "",
  version: currentVersion,
};

const defaultConfig = {
  useLocal: true,
  apperance: "light",
  showIssue: false,
  appLabel: false,
  defaultColor: "#1976D2FF",
  commentType: "Comment",
  audioCapture: false,
  videoQuality: "high",
  debugMode: false,
  summary: false,
  ai: {
    enabled: false,
  },
  templates: [
    {
      type: "Screenshot",
      precondition: {
        content: "",
        text: "",
      },
      issue: "",
      isBug: false,
    },
    {
      type: "Video",
      precondition: {
        content: "",
        text: "",
      },
      issue: "",
      isBug: false,
    },
    {
      type: "Audio",
      precondition: {
        content: "",
        text: "",
      },
      issue: "",
      isBug: false,
    },
    {
      type: "Note",
      precondition: {
        content: "",
        text: "",
      },
      issue: "",
      isBug: false,
    },
    {
      type: "File",
      precondition: {
        content: "",
        text: "",
      },
      issue: "",
      isBug: false,
    },
    {
      type: "Mindmap",
      precondition: {
        content: "",
        text: "",
      },
      issue: "",
      isBug: false,
    },
  ],
  checklist: {
    presession: {
      tasks: [],
      status: false,
    },
    postsession: {
      tasks: [],
      status: false,
    },
  },
  hotkeys: {
    general: {
      cancel: ["ctrl", "c"],
      save: ["ctrl", "s"],
    },
    home: {
      quickTest: ["ctrl", "q"],
      newExploratorySession: ["ctrl", "e"],
      openExploratorySession: ["ctrl", "o"],
    },
    sessionPlanning: {
      title: ["ctrl", "t"],
      charter: ["ctrl", "h"],
      timeLimit: ["ctrl", "l"],
      preconditions: ["ctrl", "p"],
      checklist: ["ctrl", "e"],
      start: "general.save",
    },
    workspace: {
      pause: ["ctrl", "p"],
      resume: "workspace.pause",
      stop: ["ctrl", "h"],
      videoStart: ["ctrl", "v"],
      videoStop: "workspace.videoStart",
      screenshot: ["ctrl", "r"],
      audioStart: ["ctrl", "a"],
      audioStop: "workspace.audioStart",
      note: ["ctrl", "n"],
      mindmap: ["ctrl", "m"],
      changeSource: ["ctrl", "o"],
      createIssue: ["ctrl", "i"],
      back: ["ctrl", "b"],
    }, // Dialogs on workspace use general.save and general.cancel
    evidence: {
      name: ["ctrl", "n"],
      followUp: ["ctrl", "f"],
      comment: ["ctrl", "d"],
      tags: ["ctrl", "t"],
      type: ["ctrl", "y"],
      save: "general.save",
      cancel: "general.cancel",
    },
  },
};

module.exports.initializeSession = () => {
  const sessionPath = path.join(configDir, "sessions");
  if (!fs.existsSync(sessionPath)) {
    createRootSessionDirectory();
  }

  metaDb = new JSONdb(path.join(configDir, "meta.json"), jsonDbConfig);
  let metadata = {
    version: currentVersion,
  };
  if (metaDb) {
    metadata = this.getMetadata();
  }

  if (!metadata.configPath) {
    metadata.configPath = defaultMeta.configPath;
  }
  configDb = new JSONdb(metadata.configPath, jsonDbConfig);

  if (!metadata.credentialsPath) {
    metadata.credentialsPath = defaultMeta.credentialsPath;
  }
  credentialDb = new JSONdb(metadata.credentialsPath, jsonDbConfig);

  if (metadata.sessionDataPath) {
    if (fs.existsSync(metadata.sessionDataPath)) {
      dataDb = new JSONdb(metadata.sessionDataPath, jsonDbConfig);
    } else {
      metaDb.set("sessionDataPath", "");
    }
  }

  if (metadata.version) {
    configVersion = metadata.version;
  } else {
    configVersion = "";
  }

  try {
    for (const [key, value] of Object.entries(metadata)) {
      metaDb.set(key, value);
    }

    if (!configDb.has("config")) {
      configDb.set("config", defaultConfig);
    } else {
      // Recursively ensure all keys that should exist, do.
      let currentConfig = configDb.get("config");
      const recursivelyMerge = (oldConfig, newConfig) => {
        if (!(oldConfig instanceof Object) || Array.isArray(oldConfig)) {
          if (!oldConfig || oldConfig.constructor !== newConfig.constructor) {
            // Overwriting if the type has changed in the default
            return newConfig;
          }
          return oldConfig;
        }
        if (!(newConfig instanceof Object) || Array.isArray(newConfig)) {
          return newConfig;
        }

        let builtConfig = {};
        for (const key of Object.keys(newConfig)) {
          builtConfig[key] = recursivelyMerge(
            oldConfig[key],
            newConfig[key],
            `path.${key}`
          );
        }
        for (const key of Object.keys(oldConfig)) {
          // Preserving keys in the config but not in default
          if (!Object.keys(newConfig).includes(key)) {
            builtConfig[key] = oldConfig[key];
          }
        }
        return builtConfig;
      };
      // TODO - Handle migrations after merge
      let fixedConfig = recursivelyMerge(currentConfig, defaultConfig);
      configDb.set("config", fixedConfig);
    }

    if (!credentialDb.has("credentials")) {
      credentialDb.set("credentials", {});
    }
  } catch (error) {
    console.log(error);
  }

  // TODO - Migrations for config files
  //        Right now, it just overwrites.
  if (configVersion !== currentVersion) {
    let newMeta = metaDb.get("meta");
    newMeta.version = currentVersion;
    configVersion = currentVersion;
    for (const [key, value] of Object.entries(newMeta)) {
      metaDb.set(key, value);
    }
  }
};

const createRootSessionDirectory = () => {
  let sessionPaths = [path.join(configDir, "sessions")];
  sessionPaths.forEach((path) => {
    fs.mkdirSync(path, { recursive: true });
  });
};

const removeItemById = (id) => {
  const data = dataDb.get("items");
  const updatedData = data.filter((item) => item.id !== id);
  dataDb.set("items", updatedData);
};

const getItemById = (id) => {
  const data = dataDb.get("items");
  const item = data.find((item) => item.id === id);

  return item;
};

module.exports.createNewSession = (state) => {
  if (dataDb) {
    // TODO - ditching current session, should we save it or do something?
  }
  const sessionDataPath = path.join(
    configDir,
    "sessions",
    state.id,
    "sessionData.json"
  );

  metaDb.set("sessionDataPath", sessionDataPath);
  dataDb = new JSONdb(sessionDataPath, jsonDbConfig);
  dataDb.set("id", state.id);
  delete state.id;
  dataDb.set("state", state);
  dataDb.set("items", []);
  dataDb.set("notes", {
    content: "",
    text: "",
  });
};

module.exports.getSessionID = () => {
  try {
    if (dataDb) {
      return dataDb.get("id");
    }
    return "";
  } catch (error) {
    console.log(error);
    return "";
  }
};

module.exports.getState = () => {
  try {
    if (dataDb) {
      return dataDb.get("state");
    }
    return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

module.exports.updateState = (state) => {
  if (dataDb) {
    let currentState;
    try {
      currentState = dataDb.get("state");
    } catch (error) {
      console.log(error);
      currentState = {};
    }
    dataDb.set("state", {
      ...currentState,
      ...state,
    });
  }
};

module.exports.getItems = () => {
  if (dataDb) {
    try {
      return dataDb.get("items");
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  return [];
};

module.exports.addItem = (item) => {
  try {
    let items = dataDb.get("items") || [];
    items.push(item);
    dataDb.set("items", items);
    browserWindow = browserUtility.getBrowserWindow();
    browserWindow.webContents.send("DATA_CHANGE");
  } catch (error) {
    console.log(error);
  }
};

module.exports.updateItems = (items) => {
  try {
    dataDb.set("items", items);
    browserWindow = browserUtility.getBrowserWindow();
    browserWindow.webContents.send("DATA_CHANGE");
  } catch (error) {
    console.log(error);
  }
};

module.exports.deleteItems = (ids) => {
  try {
    ids.map((id) => {
      removeItemById(id);
    });
    browserWindow = browserUtility.getBrowserWindow();
    browserWindow.webContents.send("DATA_CHANGE");
    return Promise.resolve({
      status: STATUSES.SUCCESS,
      message: "Element removed successfully",
    });
  } catch (error) {
    return Promise.resolve({ status: STATUSES.ERROR, message: error.message });
  }
};

module.exports.getItemById = (id) => {
  try {
    const data = getItemById(id);
    return data;
  } catch (error) {
    return null;
  }
};

module.exports.getConfig = () => {
  try {
    return configDb.get("config");
  } catch (error) {
    return {};
  }
};

module.exports.updateConfig = (config) => {
  try {
    configDb.set("config", config);
    browserWindow = browserUtility.getBrowserWindow();
    browserWindow.webContents.send("CONFIG_CHANGE");
  } catch (error) {
    console.log(error);
  }
};

module.exports.getCredentials = () => {
  try {
    return credentialDb.get("credentials");
  } catch (error) {
    return {};
  }
};

module.exports.updateCredentials = (credentials) => {
  try {
    credentialDb.set("credentials", credentials);
    browserWindow = browserUtility.getBrowserWindow();
    browserWindow.webContents.send("CREDENTIAL_CHANGE");
  } catch (error) {
    console.log(error);
  }
};

module.exports.getMetadata = () => {
  try {
    let metadata = {};
    for (const key of Object.keys(defaultMeta)) {
      metadata[key] = metaDb.get(key);
    }
    return metadata;
  } catch (error) {
    console.log(`Unable to retrieve metadata: ${error}`);
    return {};
  }
};

module.exports.updateMetadata = (meta) => {
  try {
    for (const [key, value] of Object.entries(meta)) {
      metaDb.set(key, value);
    }
    if (meta.configPath) {
      configDb = new JSONdb(meta.configPath, jsonDbConfig);
    }
    if (meta.credentialsPath) {
      credentialDb = new JSONdb(meta.credentialsPath, jsonDbConfig);
    }
    if (meta.sessionDataPath) {
      dataDb = new JSONdb(meta.sessionDataPath, jsonDbConfig);
    }
    browserWindow = browserUtility.getBrowserWindow();
    browserWindow.webContents.send("META_CHANGE");
  } catch (error) {
    console.log(error);
  }
};

module.exports.getNotes = () => {
  try {
    const data = dataDb.get("notes");
    return data;
  } catch (error) {
    return [];
  }
};

module.exports.updateNotes = (notes) => {
  try {
    dataDb.set("notes", notes);
    browserWindow = browserUtility.getBrowserWindow();
    browserWindow.webContents.send("DATA_CHANGE");
  } catch (error) {
    console.log(error);
  }
};

module.exports.resetData = () => {
  try {
    dataDb.set("items", []);
    dataDb.set("notes", {
      content: "",
      text: "",
    });
    browserWindow = browserUtility.getBrowserWindow();
    browserWindow.webContents.send("DATA_CHANGE");
  } catch (error) {
    console.log(error);
  }
};
