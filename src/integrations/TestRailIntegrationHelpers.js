import { IPC_HANDLERS, IPC_FUNCTIONS } from "@/modules/constants";
import axios from "axios";
import dayjs from "dayjs";

export default {
  saveCredentials(credentials, data) {
    // TODO - can this be generalized and the key passed
    let formattedData = this.formatData(data);

    if (!credentials) {
      credentials = {};
    }

    if (credentials.testrail && credentials.testrail.length > 0) {
      let matched = false;
      for (const [testrailIndex, credential] of Object.entries(
        credentials.testrail
      )) {
        if (credential.user.id === formattedData.user.id) {
          credentials.testrail[testrailIndex] = formattedData;
          matched = true;
        }
      }
      if (!matched) {
        credentials.testrail.push(formattedData);
      }
    } else {
      credentials.testrail = [formattedData];
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
      type: data.type,
      loggedInAt: data.loggedInAt,
      user: {
        id: data.profile.account_id,
        email: data.profile.email,
        name: data.profile.name,
      },
      url: data.url,
    };
  },

  formatHeaders(
    credentialUrl,
    accessToken,
    type = "get_projects",
    projectOrRunOrTestId = null
  ) {
    const authHeader = `Basic ${accessToken}`;
    const url_base = `https://${credentialUrl}/index.php?/api/v2`;
    const urls = {
      get_projects: `${url_base}/get_projects`,
      get_runs: `${url_base}/get_runs/${projectOrRunOrTestId}`,
      get_tests: `${url_base}/get_tests/${projectOrRunOrTestId}`,
      get_statuses: `${url_base}/get_statuses`,
      add_result: `${url_base}/add_result/${projectOrRunOrTestId}`,
    };

    return {
      url: urls[type],
      headers: {
        headers: {
          Authorization: authHeader,
          Accept: "application/json",
        },
      },
    };
  },

  async fetchProjects(credentials) {
    let projects = [];
    let first = true;

    for (const [i, credential] of Object.entries(credentials)) {
      let { url, headers } = this.formatHeaders(
        credential[0].url,
        credential[0].accessToken
      );

      return axios
        .get(url, headers)
        .then((response) => {
          if (response.status === 200) {
            if (first) {
              projects = response.data.projects.map((project) => ({
                ...project,
                credential_index: i,
              }));

              first = false;
            } else {
              projects.push(
                response.data.projects.map((project) => ({
                  ...project,
                  credential_index: i,
                }))
              );
            }
          }

          return projects;
        })
        .catch((error) => {
          if (
            credential.type === "oauth" &&
            dayjs(credential.lastRefreshed) < dayjs().subtract(4, "minute") &&
            [401, 403].includes(error.status)
          ) {
            throw new Error("Token expired");
          } else {
            throw new Error(error);
          }
        });
    }
  },

  async fetchRuns(credential, projectId, credentialIndex) {
    const { url, headers } = this.formatHeaders(
      credential.url,
      credential.accessToken,
      "get_runs",
      projectId
    );
    let runs = [];

    return axios.get(url, headers).then((response) => {
      if (response.status === 200) {
        runs = response.data.runs.map((run) => ({
          ...run,
          credential_index: credentialIndex,
        }));

        return runs;
      }
    });
  },

  async fetchTests(credential, runId, credentialIndex) {
    const { url, headers } = this.formatHeaders(
      credential.url,
      credential.accessToken,
      "get_tests",
      runId
    );
    let tests = [];

    return axios.get(url, headers).then((response) => {
      if (response.status === 200) {
        tests = response.data.tests.map((test) => ({
          ...test,
          credential_index: credentialIndex,
        }));

        return tests;
      }
    });
  },

  async getTestStatuses(credential) {
    const { url, headers } = this.formatHeaders(
      credential.url,
      credential.accessToken,
      "get_statuses"
    );

    return axios.get(url, headers).then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    });
  },

  async addResultToTest(credential, testId, statusId) {
    const { url, headers } = this.formatHeaders(
      credential.url,
      credential.accessToken,
      "add_result",
      testId
    );

    const data = {
      status_id: statusId,
    };

    axios.post(url, data, headers).then((response) => {
      if (response.status === 200) {
        console.log({ response });

        return "Hello World!";
      }
    });

    return { url, headers };
  },
};
