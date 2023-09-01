export const migrationStruct = {
  up: {
    config: {
      "useLocal": "localOnly",
      "apperance": "appearance",
      "showIssue": "",
      "summary": "summaryRequired",
      "templates": (templates) => {
        return templates.reduce((final, template, i) => {
          return Object.assign(
            final,
            {[`${template.type}`]: template.precondition}
          );
        }, {});
      },
      "config": "..",
    },
    data: {
      "items": (items) => {
        return items.map((item) => {
          item.type = item.sessionType;
          delete item.sessionType;
          return item;
        });
      },
    },
    meta: {
      "meta": "",
      "dataPath": "sessionDataPath",
    },
  },
  down: {
    config: {
      "localOnly": "useLocal",
    },
    data: {
      "items": {
        "type": "sessionType",
      },
    },
  },
}
