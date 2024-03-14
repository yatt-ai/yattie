import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";
import axios from "axios";

export default {
  saveCredentials(credentials, data) {
    let formattedData = this.formatData(data);

    if (!credentials) {
      credentials = {};
    }

    if (credentials.xray && credentials.xray.length > 0) {
      let matched = false;
      for (const [xrayIndex, credential] of Object.entries(credentials.xray)) {
        if (credential.user.client_id === formattedData.user.client_id) {
          credentials.xray[xrayIndex] = formattedData;
          matched = true;
        }
      }
      if (!matched) {
        credentials.xray.push(formattedData);
      }
    } else {
      credentials.xray = [formattedData];
    }

    window.ipc.invoke(IPC_HANDLERS.DATABASE, {
      func: IPC_FUNCTIONS.UPDATE_CREDENTIALS,
      data: credentials,
    });

    return credentials;
  },

  formatData(data) {
    return {
      accessToken: data.auth_token,
      type: "xray",
      url: "www.getxray.app",
      loggedInAt: data.loggedInAt,
      user: {
        client_id: data.client_id,
        client_secret: data.client_secret,
      },
    };
  },

  async fetchTestExecutions(credential) {
    const graphqlQuery = {
      query: `{
        getTestExecutions(limit: 10) {
            total
            start
            limit
            results {
                issueId
                jira(fields: ["assignee", "reporter"])
            }
        }
      }`,
    };
    const url = `https://xray.cloud.getxray.app/api/v2/graphql`;
    const authHeader = `Bearer ${credential.accessToken}`;
    const graphqlHeaders = {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    };

    await axios
      .post(url, graphqlQuery, graphqlHeaders)
      .then((response) => {
        if (response.status === 200) {
          console.log("Fetched Test Executions");

          return response.data.data.getTestExecutions.results;
        }
      })
      .catch((error) => {
        console.error("Error fetching test executions: ", error);
        throw new Error(error.message);
      });
  },
};
