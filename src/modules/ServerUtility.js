const { fork } = require("child_process");
const path = require("path");
const browserUtility = require("./BrowserWindowUtility");

let serverProcess = null;

module.exports.startServer = async () => {
  const isDevelopment = process.env.NODE_ENV !== "production";
  serverProcess = fork(
    isDevelopment
      ? path.resolve(__dirname, "../public/server/Server.js")
      : path.resolve(__dirname, "./server/Server.js")
  );
  const browserWindow = browserUtility.getBrowserWindow();

  serverProcess.on("message", (data) => {
    switch (data.type) {
      case "jira":
        browserWindow.webContents.send("JIRA_LOGIN", data.accessToken);
        break;
      default:
        break;
    }
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // TODO: The above line is not idea, but the express server doesn't seem to
  //       send a 'spawn' event, so the below line doesn't work.
  //await once(serverProcess, 'spawn');
};

module.exports.stopServer = () => {
  if (serverProcess) {
    serverProcess.kill();
  }
};
