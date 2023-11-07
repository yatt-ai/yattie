const path = require("path");
const port = process.env.VUE_APP_SERVER_PORT || 64064;

const redirectURL = `http://localhost:${port}/oauth2/github/callback`;

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    next();
  });

  app.get(redirectURL, (req, res) => {
    const filePath = path.join(__dirname, "..", "github_success.html");
    res.sendFile(filePath, (err) => {
      if (err) {
        // Handle the error, maybe serve a 404 or a custom message
        console.error("Error sending file:", err);
        res.status(404).send("An error occurred.");
      }
    });
  });
};
