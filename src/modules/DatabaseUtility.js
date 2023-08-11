const JSONdb = require("simple-json-db");
const { app, remote } = require("electron");
const path = require("path");
const fs = require("fs");
const uuidv4 = require("uuid");
const browserUtility = require("./BrowserWindowUtility");
const { STATUSES } = require("./constants");

const configDir = (app || remote.app).getPath("userData");
const jsonDbConfig = {
  jsonSpaces: 2,
};

const currentVersion = app.getVersion();

let metaDb, configDb, credentialDb, dataDb;
let browserWindow;

module.exports.initializeSession = () => {
  const sessionPath = path.join(configDir, "sessions");
  if (fs.existsSync(sessionPath)) {
    fs.rmdir(sessionPath, { recursive: true }, (err) => {
      if (err) {
        console.log(err);
      }
      createSessionDirectory();
    });
  } else {
    createSessionDirectory();
  }

  const defaultMeta = {
    configPath: path.join(configDir, "config.json"),
    credentialsPath: path.join(configDir, "credentials.json"),
    dataPath: path.join(configDir, "data.json"),
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
    version: currentVersion,
  };

  const defaultCredentials = {
    version: currentVersion,
  };

  metaDb = new JSONdb(path.join(configDir, "meta.json"), jsonDbConfig);

  const fileMeta = applyMigrations(
    "meta",
    currentVersion,
    metaDb.get("meta")
  );
  const metaData = {
    ...defaultMeta,
    ...fileMeta,
  };

  // CTODO remove comments
  //if (metaDb.has("meta")) {
  //  metaData = metaDb.get("meta");
  //}

  //if (!metaData.configPath) {
  //  metaData.configPath = defaultMeta.configPath;
  //}
  configDb = new JSONdb(metaData.configPath, jsonDbConfig);

  //if (!metaData.credentialsPath) {
  //  metaData.credentialsPath = defaultMeta.credentialsPath;
  //}
  credentialDb = new JSONdb(metaData.credentialsPath, jsonDbConfig);

  //if (!metaData.dataPath) {
  //  metaData.dataPath = defaultMeta.dataPath;
  //}
  dataDb = new JSONdb(metaData.dataPath, jsonDbConfig);

  try {
    metaDb.set("meta", metaData);

    //if (!configDb.has("config") || !configDb.get("config").checklist) {
    const fileConfig = applyMigrations(
      "config",
      currentVersion,
      configDb.get("config")
    );
    configDb.set("config", {
      ...defaultConfig,
      ...fileConfig,
    );
    //}

    //if (!credentialDb.has("credentials")) {
    const fileCredentials = applyMigrations(
      "credentials",
      currentVersion,
      credentialDb.get("credentials")
    );
    credentialDb.set("credentials", {
      ...defaultCredentials,
      ...fileCredentials,
    );
    //  credentialDb.set("credentials", { version: currentVersion });
    //}

    // CTODO - allow recovery of current file
    dataDb.set("id", uuidv4());
    dataDb.set("items", []);
    dataDb.set("notes", {
      content: "",
      text: "",
    });
    dataDb.set("version", currentVersion);
  } catch (error) {
    console.log(error);
  }

};

const applyMigrations = (type, newVersion, data) => {
  if ( newVersion === data?.version ) {
    return data;
  }

// Split newVersion and data.version to compare

// let direction = "up";
// List files in order and determine which apply between the two versions
// if data.version > newVersion then order files in DESC - direction = "down";
// else order files in ASC

// let migratedData = Object.assign(data, {});
// for each migration file
  // for each key, value in migration[direction][type]
    // migratedData[value] = migratedData[key];
    // delete migratedData[key];
    /// CTODO handle subkeys!!!

// return migratedData;

};

const createSessionDirectory = () => {
  let sessionPaths = [
    path.join(configDir, "sessions", "tempUserMedia"),
    path.join(configDir, "sessions", "userMedia"),
  ];
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

module.exports.getItems = () => {
  try {
    return dataDb.get("items");
  } catch (error) {
    console.log(error);
    return [];
  }
};

module.exports.addItem = (item) => {
  try {
    let items = dataDb.get("items");
    items.push(item);
    dataDb.set("items", items);
    browserWindow = browserUtility.getBrowserWindow();
    browserWindow.webContents.send("DATA_CHANGE");
  } catch (error) {
    console.log(error);
  }
};

module.exports.updateItem = (newItem) => {
  try {
    debugger;
    let items = dataDb.get("items").map((item) => {
      if (item.id === newItem.id) {
        return newItem;
      }
      return item;
    });
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

module.exports.getMetaData = () => {
  try {
    return metaDb.get("meta");
  } catch (error) {
    return {};
  }
};

module.exports.updateMetaData = (meta) => {
  try {
    metaDb.set("meta", meta);
    configDb = new JSONdb(meta.configPath, jsonDbConfig);
    credentialDb = new JSONdb(meta.credentialsPath, jsonDbConfig);
    dataDb = new JSONdb(meta.dataPath, jsonDbConfig);
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
