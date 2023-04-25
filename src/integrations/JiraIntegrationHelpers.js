import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";

export default {
  saveCredentials(credentials, data) {
    // TODO - can this be generalized and the key passed?
    let formattedData = this.formatData(data);

    if (!credentials) {
      credentials = {};
    }

    if (credentials.jira && credentials.jira.length > 0) {
      let matched = false;
      for (const [jiraIndex, credential] of Object.entries(credentials.jira)) {
        if (credential.user.id === formattedData.user.id) {
          credentials.jira[jiraIndex] = formattedData;
          matched = true;
        }
      }
      if (!matched) {
        credentials.jira.push(formattedData);
      }
    } else {
      credentials.jira = [formattedData];
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
          id: data.resource.id,
          url: data.resource.url,
          name: data.resource.name,
          avatar: data.resource.avatarUrl,
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
        id: data.profile.account_id,
        email: data.profile.email,
        name: data.profile.name,
        avatar: data.profile.picture,
        locale: data.profile.locale,
        account_type: data.profile.account_type,
        verified: data.profile.email_verified,
      },
      orgs: orgs,
      url: data.url,
    };
  },
};
