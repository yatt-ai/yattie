const open = require("open");
const path = require("path");
const ClientOAuth2 = require("client-oauth2");
const port = process.env.VUE_APP_SERVER_PORT;
const auth = new ClientOAuth2({
  clientId: process.env.VUE_APP_JIRA_CLIENT_ID,
  clientSecret: process.env.VUE_APP_JIRA_CLIENT_SECRET,
  accessTokenUri: "https://auth.atlassian.com/oauth/token",
  authorizationUri:
    "https://auth.atlassian.com/authorize?audience=api.atlassian.com&prompt=consent",
  redirectUri: `http://localhost:${port}/oauth2/atlassian/callback`,
  scopes: ["read:jira-work", "write:jira-work", "read:me", "offline_access"],
});
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/oauth2/atlassian", (req, res) => {
    var uri = auth.code.getUri();
    open(uri, (err) => {
      console.log(err);
    });
    return res.send(uri);
  });
  app.get("/oauth2/atlassian/callback", (req, res) => {
    auth.code.getToken(req.originalUrl).then((user) => {
      const data = {
        type: "jira",
        accessToken: user.data,
      };
      process.send(data);

      return res.sendFile(path.join(__dirname, "../jira.html"));
    });
  });
};
