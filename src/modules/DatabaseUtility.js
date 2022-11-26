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

let configDb, dataDb;
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

  const config = {
    useLocal: true,
    apperance: "light",
    showIssue: false,
    appLabel: false,
    defaultColor: false,
    commentType: "Comment",
    audioCapture: false,
    videoQuality: "high",
    debugMode: false,
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
    ],
    checklist: {
      presession: {
        tasks: [],
        status: false,
      },
      postsession: {
        tasks: [],
        status: false,
      }
    }
  };

  configDb = new JSONdb(path.join(configDir, "config.json"), jsonDbConfig);
  dataDb = new JSONdb(path.join(configDir, "data.json"), jsonDbConfig);

  try {
    if (!configDb.has("config") || !configDb.get("config").checklist) {
      configDb.set("config", config);
    }
    dataDb.set("items", []);
  } catch (error) {
    console.log(error);
  }
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
    const config = configDb.get("config");
    return Promise.resolve({ config: config, status: STATUSES.SUCCESS });
  } catch (error) {
    return Promise.resolve({ config: {}, status: STATUSES.ERROR });
  }
};

module.exports.updateConfig = (config) => {
  try {
    configDb.set("config", config);
  } catch (error) {
    console.log(error);
  }
};
