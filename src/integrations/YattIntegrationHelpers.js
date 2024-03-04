import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";

import axios from "axios";
import dayjs from "dayjs";

export default {
  getHeaders(credential) {
    let authHeader;
    authHeader = `Bearer ${credential.accessToken}`;
    return {
      Authorization: authHeader,
      Accept: "application/json",
    };
  },
  async newToken(credentials) {
    const url = `${process.env.VUE_APP_YATT_API_URL}/app/profile/token`;
    const newCredentialsResponse = await axios.get(url);
    await this.saveCredentials(credentials, newCredentialsResponse.data);
  },
  async authenticateProfile(credentials, data) {
    // update profile vs sign up?
    const url = `${process.env.VUE_APP_YATT_API_URL}/app/profile/auth`;
    const credential = credentials?.yatt[0];
    const options = {
      headers: this.getHeaders(credential),
    };

    // Post to YATT
    let returnResponse = {};
    await axios
      .post(url, data, options)
      .then(async (postedSession) => {
        returnResponse = postedSession.data;
        credential.user = returnResponse.user;
        // CTODO - Save credentials won't work to replace if user uid changed.
        await this.saveCredentials(credentials, credential);
        return returnResponse;
      })
      .catch((error) => {
        returnResponse.error = error.response.data.errors;
        return returnResponse;
      });
  },
  async updateProfile(credentials, data) {
    // update profile vs sign up?
    const url = `${process.env.VUE_APP_YATT_API_URL}/app/profile`;
    const credential = credentials?.yatt[0];
    const options = {
      headers: this.getHeaders(credential),
    };

    // Post to YATT
    let returnResponse = {};
    await axios
      .patch(url, data, options)
      .then(async (postedSession) => {
        returnResponse = postedSession.data;
        credential.user = returnResponse.user;
        await this.saveCredentials(credentials, credential);
        return returnResponse;
      })
      .catch((error) => {
        returnResponse.error = error.response.data.errors;
        return returnResponse;
      });
  },
  async saveSession(credentials) {
    if (!credentials?.yatt || credentials?.yatt.length < 1) {
      await this.newToken(credentials);
    }

    // Pull case and session data
    const url = `${process.env.VUE_APP_YATT_API_URL}/yattie/executions`;
    const state = await window.ipc.invoke(IPC_HANDLERS.PERSISTENCE, {
      func: IPC_FUNCTIONS.GET_STATE,
    });

    const credential = credentials?.yatt[0];
    const options = {
      headers: this.getHeaders(credential),
    };

    // Post to YATT
    let returnResponse = {
      link: "",
    };
    await axios
      .patch(url, state, options)
      .then((postedSession) => {
        returnResponse = postedSession.data;
      })
      .catch((error) => {
        returnResponse.error = error.response.data.errors;
      });

    // Take signed attachment URLs and upload them
    returnResponse.steps.map(async (step) => {
      if (step.uploadURL) {
        const match = state.session.items.find(
          (item) => item.stepID === step.external_id
        );
        if (match?.filePath) {
          const sanitizedPath =
            match.filePath.substring(match.filePath.length - 1) !== "?"
              ? match.filePath
              : match.filePath.substring(0, match.filePath.length - 1);
          const fetchResponse = await fetch(`file://${sanitizedPath}`);
          const fileBlob = await fetchResponse.blob();
          const file = new File([fileBlob], step.uid, { type: match.fileType });
          await axios
            .put(step.uploadURL, file, {
              headers: {
                "Content-Type": match.fileType,
                "X-Upload-Content-Length": match.fileSize,
              },
            })
            .catch((error) => {
              returnResponse.error.push(...error.response.data.errors);
            });
        }
      }
    });

    // Return result (with generated "link" field)
    return returnResponse;
  },
  async saveCredentials(credentials, data) {
    let formattedData = this.formatData(data);

    if (!credentials) {
      credentials = {};
    }

    if (credentials.yatt && credentials.yatt.length > 0) {
      let matched = false;
      for (const [index, credential] of credentials.yatt.entries()) {
        if (
          credential.user.id === formattedData.user.id ||
          credential.accessToken === formattedData.accessToken
        ) {
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

    await window.ipc.invoke(IPC_HANDLERS.PERSISTENCE, {
      func: IPC_FUNCTIONS.UPDATE_CREDENTIALS,
      data: credentials,
    });

    return credentials;
  },
  formatData(data) {
    return {
      accessToken: data.accessToken,
      expiresAt: data.expiresAt,
      type: data.type || "bearer",
      loggedInAt: data.loggedInAt || dayjs().format("YYYY-MM-DD HH:mm:ss"),
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
