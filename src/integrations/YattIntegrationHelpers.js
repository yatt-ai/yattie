import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";

import axios from "axios";

export default {
  getHeaders(credential) {
    let authHeader;
    authHeader = `Bearer ${credential.accessToken}`;
    return {
      Authorization: authHeader,
      Accept: "application/json",
    };
  },
  async saveSession(credentials) {
    // CTODO
    // Pull case and session data
    const url = `${process.env.VUE_APP_YATT_API_URL}/yattie/executions`;
    const session = await window.ipc.invoke(IPC_HANDLERS.PERSISTENCE, {
      func: IPC_FUNCTIONS.GET_CURRENT_SESSION,
    });
    if (!credentials?.yatt || credentials?.yatt.length < 1) {
      // CTODO - create credentials
    }

    const credential = credentials?.yatt[0];
    const options = {
      headers: this.getHeaders(credential),
    };

    // Post to YATT
    let returnResponse = {
      link: "",
    };
    await axios
      .patch(url, session, options)
      .then((postedSession) => {
        returnResponse.link = postedSession.data.link;
      })
      .catch((error) => {
        returnResponse.error = {
          message: JSON.stringify(error.response.data.errors),
        };
      });
    return returnResponse;

    // Return result (with generated "link" field)
  },
  saveCredentials(credentials, data) {
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

    window.ipc.invoke(IPC_HANDLERS.PERSISTENCE, {
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
