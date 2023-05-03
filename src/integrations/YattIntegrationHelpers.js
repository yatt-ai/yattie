import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";

export default {
  saveCredentials(credentials, data) {
    console.log(`Saving YATT: ${JSON.stringify(data)}`);
    let formattedData = this.formatData(data);

    if (!credentials) {
      credentials = {};
    }

    if (credentials.yatt && credentials.yatt.length > 0) {
      let matched = false;
      for (const [index, credential] of credentials.yatt.entries()) {
        if (credential.user.id === formattedData.user.id) {
          credentials.yatt[index] = formattedData;
          matched = true;
        }
      }
      if (!matched) {
        credentials.yatt.push(formattedData);
      }
    } else {
      credentials.yatt = [formattedData];
    }

    window.ipc.invoke(IPC_HANDLERS.DATABASE, {
      func: IPC_FUNCTIONS.UPDATE_CREDENTIALS,
      data: credentials,
    });

    return credentials;
  },
  formatData(data) {
    return {
      accessToken: data.accessToken,
      jiraOauthTokenId: data.jiraOauthTokenId,
      expiresAt: data.expiresAt,
      type: data.type,
      loggedInAt: data.loggedInAt,
      oauthTokenIds: data.oauthTokenIds,
      user: {
        id: data.user.uid,
        email: data.user.email,
        name: data.user.first_name + " " + data.user.last_name,
        avatar: data.user.avatar_url,
        locale: data.user.preferences?.locale,
        verified: data.user.preferences?.verified,
      },
      orgs: data.orgs,
    };
  },
};
