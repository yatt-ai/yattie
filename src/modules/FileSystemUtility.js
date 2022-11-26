const { app, remote, dialog, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const AdmZip = require("adm-zip");
const extract = require("extract-zip");
const dayjs = require("dayjs");

const configDir = (app || remote.app).getPath("userData");

const databaseUtility = require("./DatabaseUtility");
const { STATUSES } = require("./constants");

module.exports.exportItems = async (ids) => {
  const fileName = dayjs().format("YYYY-MM-DD_HH-mm-ss-ms") + ".zip";
  const { filePath } = await dialog.showSaveDialog({
    title: "Save Items",
    defaultPath: fileName,
    filters: [{ name: "Zip archives only", extensions: ["zip"] }],
    properties: ["createDirectory", "showOverwriteConfirmation"],
  });

  if (!filePath) {
    return Promise.resolve({ status: "canceled" });
  }

  return new Promise((resolve) => {
    try {
      const zip = new AdmZip();

      ids.map((id) => {
        const data = databaseUtility.getItemById(id);

        if (data.filePath) {
          zip.addLocalFile(data.filePath, data.type);
        }
      });

      zip.writeZip(filePath, (error) => {
        if (error) {
          throw error;
        }

        resolve({
          status: STATUSES.SUCCESS,
          message: "Project exported successfully",
          filePath,
        });
      });
    } catch (error) {
      resolve({ status: STATUSES.ERROR, message: error.message });
    }
  });
};

module.exports.saveSession = async (data) => {
  const fileName = "TestSession.test";
  const { filePath } = await dialog.showSaveDialog({
    title: "Save Session",
    defaultPath: fileName,
    filters: [{ name: "Test File", extensions: ["test"] }],
    properties: ["createDirectory", "showOverwriteConfirmation"],
  });

  if (!filePath) {
    return Promise.resolve({ status: "canceled", message: "No path selected" });
  }

  return new Promise(function (resolve) {
    const items = databaseUtility.getItems();
    data.sessions = items;
    const metaPath = path.join(configDir, "metadata.txt");
    const jsonStr = JSON.stringify(data);
    const encodedStr = Buffer.from(jsonStr).toString("hex");

    fs.writeFile(metaPath, encodedStr, function (error) {
      if (error) {
        return resolve({
          status: STATUSES.ERROR,
          message: error,
        });
      }
      try {
        const zip = new AdmZip();
        zip.addLocalFile(metaPath);
        fs.unlinkSync(metaPath);
        items.map((item) => {
          if (item.filePath) {
            zip.addLocalFile(item.filePath, item.type);
          }
        });

        zip.writeZip(filePath, (error) => {
          if (error) {
            return resolve({
              status: STATUSES.ERROR,
              message: error,
            });
          }

          return resolve({
            status: STATUSES.SUCCESS,
            message: "Session exported successfully",
          });
        });
      } catch (error) {
        return resolve({ status: STATUSES.ERROR, message: error.message });
      }
    });
  });
};

module.exports.openSession = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Test File", extensions: ["test"] }],
  });

  if (canceled) {
    return Promise.resolve({
      status: STATUSES.ERROR,
      message: "no file selected",
    });
  }

  const filePath = filePaths[0];
  const target = path.join(configDir, "sessions", "userMedia");
  try {
    await extract(filePath, { dir: target });
    const metaPath = path.join(
      configDir,
      "sessions",
      "userMedia",
      "metadata.txt"
    );
    const encoded = fs.readFileSync(metaPath, "utf8");
    const metadata = JSON.parse(Buffer.from(encoded, "hex").toString());
    databaseUtility.updateItems(metadata.sessions);
    delete metadata.sessions;

    return Promise.resolve({
      status: STATUSES.SUCCESS,
      message: "Session extracted successfully",
      metadata: metadata,
    });
  } catch (err) {
    return Promise.resolve({
      status: STATUSES.ERROR,
      message: "Session extract failed",
    });
  }
};

module.exports.exportSession = async (params) => {
  // show save dialog
  const fileName = dayjs().format("YYYY-MM-DD_HH-mm-ss-ms") + ".zip";
  const { filePath } = await dialog.showSaveDialog({
    title: "Save Items",
    defaultPath: fileName,
    filters: [{ name: "Zip archives only", extensions: ["zip"] }],
    properties: ["createDirectory", "showOverwriteConfirmation"],
  });

  if (!filePath) {
    return Promise.resolve({ status: "canceled" });
  }

  const pdfWin = new BrowserWindow({
    show: false,
    icon: path.join(__dirname, "../public/logo.png"),
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      webSecurity: false,
      enableRemoteModule: true,
      preload: path.join(app.getAppPath(), "preload.js"),
    },
  });

  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8080/#/print"
      : `file://${__dirname}/index.html#print`;

  pdfWin.loadURL(url);

  pdfWin.webContents.on("did-finish-load", () => {
    pdfWin.webContents.send("ACTIVE_PDF", params);
    pdfWin.webContents
      .printToPDF({})
      .then((data) => {
        const pdfName = dayjs().format("YYYY-MM-DD_HH-mm-ss-ms") + ".pdf";
        const pdfPath = path.join(
          configDir,
          "sessions",
          "tempUserMedia",
          pdfName
        );

        fs.writeFile(pdfPath, data, (error) => {
          if (error) {
            return Promise.resolve({
              status: STATUSES.ERROR,
              message: error,
            });
          }
          try {
            const zip = new AdmZip();

            const items = databaseUtility.getItems();

            items.map((item) => {
              if (item.filePath) {
                zip.addLocalFile(item.filePath, item.type);
              }
            });

            zip.addLocalFile(pdfPath);

            zip.writeZip(filePath, (error) => {
              if (error) {
                return Promise.resolve({
                  status: STATUSES.ERROR,
                  message: error,
                });
              }

              return Promise.resolve({
                status: STATUSES.SUCCESS,
                message: "Session Exported Successfully",
                filePath,
              });
            });
          } catch (error) {
            return Promise.resolve({
              status: STATUSES.ERROR,
              message: error,
            });
          }
        });
      })
      .catch((error) => {
        return Promise.resolve({
          status: STATUSES.ERROR,
          message: error,
        });
      });
  });
};
