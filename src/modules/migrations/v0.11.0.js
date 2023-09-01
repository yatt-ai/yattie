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
          item.type = item.sessionType;
          delete item.sessionType;
          return item;
        });
      },
    },
    //credentials: {
    //  credentials: "..",
    //},
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
};
