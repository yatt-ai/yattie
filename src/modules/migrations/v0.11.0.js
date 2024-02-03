const uuidv4 = require("uuid");
const { DEFAULT_FILE_TYPES } = require("../constants");

export const migrationStruct = {
  up: {
    config: {
      config: "..",
      useLocal: "localOnly",
      apperance: "theme",
      showIssue: "",
      appLabel: "",
      summary: "summaryRequired",
      templates: (templates) => {
        return templates.reduce((final, template) => {
          return Object.assign(final, {
            [`${template.type}`]: template.precondition,
          });
        }, {});
      },
    },
    data: {
      items: (items) => {
        return items.map((item) => {
          item.sessionID = item.id;
          item.caseID = uuidv4();

          delete item.id;
          delete item.sessionType;
          return item;
        });
      },
    },
    credentials: {
      credentials: "..",
    },
  },
  // CTODO - no dupe keys for multiple transitions... (templates)
  down: {
    config: {
      localOnly: "config.useLocal",
      theme: "config.apperance",
      defaultColor: "config.defaultColor",
      commentType: "config.commentType",
      audioCapture: "config.audioCapture",
      videoQuality: "config.videoQuality",
      debugMode: "config.debugMode",
      summaryRequired: "config.summary",
      ai: "config.ai",
      templates: "config.templates",
      checklist: "config.checklist",
      hotkeys: "config.hotkeys",
      version: "config.version",
      // eslint-disable-next-line no-dupe-keys
      templates: (templates) => {
        let newTemplates = [];
        for (const [type, content] of Object.entries(templates)) {
          newTemplates.push({
            type,
            precondition: content,
            issue: "",
            isBug: false,
          });
        }
        return newTemplates;
      },
    },
    data: {
      items: (items) => {
        return items.map((item) => {
          item.fileType = DEFAULT_FILE_TYPES[item.fileType].type;
          delete item.type;
          return item;
        });
      },
    },
    credentials: {
      yatt: "credentials.yatt",
      jira: "credentials.jira",
      testrail: "credentials.testrail",
      version: "",
    },
  },
};
