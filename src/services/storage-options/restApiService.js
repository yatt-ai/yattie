import axios from "axios";
import dayjs from "dayjs";
import StorageInterface from "../storageInterface";

export default class RestApiService extends StorageInterface {
  async getState() {
    const response = await axios.get(`http://localhost:3000/state`);
    return response.data;
  }

  async updateState(state) {
    const data = {
      case: state.case,
      session: state.session,
    };
    const credential = state.auth.credentials?.yatt[0];
    let authHeader;
    authHeader = `Bearer ${credential.accessToken}`;
    const options = {
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    };
    let returnResponse = {
      link: "",
    };
    await axios
      .patch(`http://localhost:5000/v1/yattie/executions`, data, options)
      .then((postedSession) => {
        returnResponse = postedSession.data;
      })
      .catch((error) => {
        returnResponse.error = error.response.data.errors;
      });

    returnResponse.steps.map(async (step) => {
      if (step.uploadURL) {
        const match = state.session.items.find(
          (item) => item.stepID === step.external_id
        );
        if (match?.filePath) {
          const fetchResponse = await fetch(match.filePath);
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
  }

  async getConfig() {
    // const response = await axios.get(`http://localhost:8082/config`);
    // return response.data;
    return {
      useLocal: true,
      apperance: "light",
      showIssue: false,
      appLabel: false,
      defaultColor: "#1976D2FF",
      commentType: "Comment",
      audioCapture: false,
      videoQuality: "high",
      debugMode: false,
      summary: false,
      ai: {
        enabled: false,
      },
      templates: [
        {
          type: "Screenshot",
          precondition: {
            content: "",
            text: "",
          },
          issue: "",
          isBug: false,
        },
        {
          type: "Video",
          precondition: {
            content: "",
            text: "",
          },
          issue: "",
          isBug: false,
        },
        {
          type: "Audio",
          precondition: {
            content: "",
            text: "",
          },
          issue: "",
          isBug: false,
        },
        {
          type: "Note",
          precondition: {
            content: "",
            text: "",
          },
          issue: "",
          isBug: false,
        },
        {
          type: "File",
          precondition: {
            content: "",
            text: "",
          },
          issue: "",
          isBug: false,
        },
        {
          type: "Mindmap",
          precondition: {
            content: "",
            text: "",
          },
          issue: "",
          isBug: false,
        },
      ],
      checklist: {
        presession: {
          tasks: [],
          status: false,
        },
        postsession: {
          tasks: [],
          status: false,
        },
      },
      hotkeys: {
        general: {
          cancel: ["ctrl", "c"],
          save: ["ctrl", "s"],
        },
        home: {
          quickTest: ["ctrl", "q"],
          newExploratorySession: ["ctrl", "e"],
          openExploratorySession: ["ctrl", "o"],
        },
        sessionPlanning: {
          title: ["ctrl", "t"],
          charter: ["ctrl", "h"],
          timeLimit: ["ctrl", "l"],
          preconditions: ["ctrl", "p"],
          checklist: ["ctrl", "e"],
          start: "general.save",
        },
        workspace: {
          pause: ["ctrl", "p"],
          resume: "workspace.pause",
          stop: ["ctrl", "h"],
          videoStart: ["ctrl", "v"],
          videoStop: "workspace.videoStart",
          screenshot: ["ctrl", "r"],
          audioStart: ["ctrl", "a"],
          audioStop: "workspace.audioStart",
          note: ["ctrl", "n"],
          mindmap: ["ctrl", "m"],
          changeSource: ["ctrl", "o"],
          createIssue: ["ctrl", "i"],
          back: ["ctrl", "b"],
        },
        evidence: {
          name: ["ctrl", "n"],
          followUp: ["ctrl", "f"],
          comment: ["ctrl", "d"],
          tags: ["ctrl", "t"],
          type: ["ctrl", "y"],
          save: "general.save",
          cancel: "general.cancel",
        },
      },
    };
  }

  async updateConfig(config) {
    console.log(config);
    // saving credentials endpoint here
  }

  async getCredentials() {
    const { data } = await axios.get(
      "http://localhost:5000/v1/app/signup/token"
    );
    console.log(data);
    return {
      yatt: [
        {
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
        },
      ],
    };
  }

  async getMetaData() {}

  async updateCredentials(credentials) {
    console.log(credentials);
    // saving credentials endpoint here
  }

  async getItems() {
    // const response = await axios.get(`http://localhost:8082/items`);
    // return response.data;
    return [];
  }

  async getItemById(id) {
    console.log(id);
    const response = await axios.get(`http://localhost:8082/item`);
    return response.data;
  }

  async updateItems(items) {
    console.log(items);
    // saving state endpoint here
  }

  async deleteItems(items) {
    console.log(items);
  }

  async getNotes() {
    const response = await axios.get(`http://localhost:8082/notes`);
    return response.data;
  }

  async updateNotes(notes) {
    console.log(notes);
    // saving notes endpoint here
  }

  async createNewSession(data) {
    console.log(data);
  }

  async saveSession(data) {
    console.log(data);
  }

  async resetData() {
    console.log("Reset data request goes here");
  }

  async saveNote() {
    console.log("Save Note");
  }
}
