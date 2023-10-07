const uuidv4 = require("uuid");

export const migrationStruct = {
  up: {
    config: {
      "config": "..",
      "useLocal": "localOnly",
      "apperance": "theme",
      "showIssue": "",
      "appLabel": "",
      "summary": "summaryRequired",
      "templates": (templates) => {
        return templates.reduce((final, template, i) => {
          return Object.assign(
            final,
            {[`${template.type}`]: template.precondition}
          );
        }, {});
      },
    },
    data: {
      "items": (items) => {
        return items.map((item) => {
          item.sessionId = item.id;
          item.caseId = uuidv4();
          item.type = item.sessionType;

          delete item.id;
          delete item.sessionType;
          return item;
        });
      },
    },
    credentials: {
      "credentials": "..",
    },
  },
  down: {
    config: {
      "localOnly": "config.useLocal",
      "theme": "config.apperance",
      "defaultColor": "config.defaultColor",
      "commentType": "config.commentType",
      "audioCapture": "config.audioCapture",
      "videoQuality": "config.videoQuality",
      "debugMode": "config.debugMode",
      "summaryRequired": "config.summary",
      "ai": "config.ai",
      "templates": "config.templates",
      "checklist": "config.checklist",
      "hotkeys": "config.hotkeys",
      "version": "config.version",
      "templates": (templates) => {
        let newTemplates = [];
        for (const [type, content] of Object.entries(templates)) {
          newTemplates.push({
            type,
            precondition: content,
            issue: "",
            isBug: false
          })
        }
        return newTemplates;
      },
    },
    data: {
      "items": (items) => {
        return items.map((item) => {
          item.sessionType = item.type;
          delete item.type;
          return item;
        });
      },
    },
    credentials: {
      "yatt": "credentials.yatt",
      "jira": "credentials.jira",
      "testrail": "credentials.testrail",
      "version": "",
    },
  },
};
