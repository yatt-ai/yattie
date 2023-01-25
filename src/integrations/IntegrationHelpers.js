import dayjs from "dayjs";
import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";
import ClientOAuth2 from "client-oauth2";

export default {
  checkAuth(credential) {
    if (Object.keys(credential).length) {
      if (this.isTokenExpired(credential)) {
        const access_token = this.refreshAccessToken(credential);
        if (access_token) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }
    return false;
  },
  getAccessToken(credential) {
    let access_token = null;
    if (Object.keys(credential).length) {
      if (this.isTokenExpired(credential)) {
        access_token = this.refreshAccessToken(credential);
      } else {
        const type = credential.type;
        access_token = credential[type].access_token;
      }
    }
    return access_token;
  },
  isTokenExpired(data) {
    const type = data.type;
    if (type) {
      const auth = data[type];
      const now = new Date();
      const loggedAt = new Date(auth.loggedAt);
      const expireIn = auth.expires_in;
      const duration = (now.getTime() - loggedAt.getTime()) / 1000;
      if (duration > expireIn) {
        return true;
      }
      return false;
    }
    return true;
  },
  refreshAccessToken(credential) {
    return new Promise(function (resolve, reject) {
      // TODO - declare this once and import it
      // TOOD - Move all JIRA-specific items to JIRA integration module
      const auth = new ClientOAuth2({
        clientId: process.env.VUE_APP_JIRA_CLIENT_ID,
        clientSecret: process.env.VUE_APP_JIRA_CLIENT_SECRET,
        accessTokenUri: "https://auth.atlassian.com/oauth/token",
        authorizationUri:
          "https://auth.atlassian.com/authorize?audience=api.atlassian.com&prompt=consent",
        redirectUri: `http://localhost:${process.env.VUE_APP_SERVER_PORT}/oauth2/atlassian/callback`,
        scopes: [
          "read:jira-work",
          "write:jira-work",
          "read:me",
          "offline_access",
        ],
      });
      if (Object.keys(credential).length && credential.type) {
        let token = auth.createToken(
          credential[credential.type].access_token,
          credential[credential.type].refresh_token
        );
        token.refresh().then((data) => {
          credential[credential.type].access_token = data.access_token;
          credential[credential.type].expires_in = data.expires_in;
          credential[credential.type].token_type = data.token_type;
          credential[credential.type].refresh_token = data.refresh_token;
          credential[credential.type].scope = data.scope;
          credential[credential.type].loggedAt = dayjs().format(
            "MM/DD/YYYY HH:mm:ss"
          );

          window.ipc.invoke(IPC_HANDLERS.DATABASE, {
            func: IPC_FUNCTIONS.UPDATE_CREDENTIAL,
            data: credential,
          });
          return resolve(data.access_token);
        });
      } else {
        return reject();
      }
    });
  },
};
