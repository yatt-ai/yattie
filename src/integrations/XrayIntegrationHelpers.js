import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";

export default {
  saveCredentials(data) {
    let formattedData = this.formatData(data);

    const credentials = {
      xray: [formattedData],
    };

    window.ipc.invoke(IPC_HANDLERS.DATABASE, {
      func: IPC_FUNCTIONS.UPDATE_CREDENTIALS,
      data: credentials,
    });

    return credentials;
  },

  formatData(data) {
    return {
      accessToken: data.auth_token,
      loggedInAt: data.loggedInAt,
      user: {
        client_id: data.client_id,
        client_secret: data.client_secret,
      },
    };
  },
};
