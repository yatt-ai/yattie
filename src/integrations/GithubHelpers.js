import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";

export default {
  saveCredentials(credentials, data) {
    // TODO - can this be generalized and the key passed?
    let formattedData = this.formatData(data);

    if (!credentials) {
      credentials = {};
    }

    if (credentials.github && credentials.github.length > 0) {
      let matched = false;
      for (const [githubIndex, credential] of Object.entries(
        credentials.github
      )) {
        if (credential.user.id === formattedData.user.id) {
          credentials.github[githubIndex] = formattedData;
          matched = true;
        }
      }
      if (!matched) {
        credentials.github.push(formattedData);
      }
    } else {
      credentials.github = [formattedData];
    }

    window.ipc.invoke(IPC_HANDLERS.DATABASE, {
      func: IPC_FUNCTIONS.UPDATE_CREDENTIALS,
      data: credentials,
    });

    return credentials;
  },

  formatData(data) {
    let orgs = [];
    if (Array.isArray(data.resource)) {
      for (const org of data.resource) {
        orgs.push({
          id: org.id,
          url: org.url,
          name: org.name,
          avatar: org.avatarUrl,
        });
      }
    } else {
      orgs = [
        {
          id: data.id,
          url: data.url,
          name: data.name,
          avatar: data.avatarUrl,
        },
      ];
    }

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      clientId: data.clientId,
      clientSecret: data.clientSecret,
      yattOauthTokenId: data.yattOauthTokenId,
      expiresAt: data.expiresAt,
      type: data.type,
      loggedInAt: data.loggedInAt,
      lastRefreshed: data.lastRefreshed,
      user: {
        id: data.profile.id,
        email: data.profile.email,
        name: data.profile.name,
        avatar: data.profile.avatar_url,
        locale: data.profile.locale,
        account_type: data.profile.account_type,
      },
      orgs: orgs,
      url: data.url,
    };
  },
};
