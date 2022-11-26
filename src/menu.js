import { app, Menu } from "electron";

const createMenu = (win, dev) => {
  console.log(win, dev);
  const isMac = process.platform === "darwin";
  console.log(isMac);
  const template = [
    {
      label: "File",
      submenu: [
        { label: "New Session", accelerator: "Ctrl+Shift+C" },
        { label: "New Session for Existing Test", accelerator: "Ctrl+Shift+T" },
        {
          label: "New Session for Existing Charter",
          accelerator: "Ctrl+Shift+B",
        },
        { label: "Open Saved Session", accelerator: "Ctrl+Shift+O" },
        { type: "separator" },
        { label: "Save Session", accelerator: "Alt+Ctrl+S" },
        { label: "Save As Test Charter", accelerator: "Ctrl+Shift+X" },
        { label: "Reset Session" },
        { type: "separator" },
        { label: "Delete Session" },
        { type: "separator" },
        {
          label: "App Settings",
          click: () => win.webContents.send("APP_SETTING", true),
        },
        { type: "separator" },
        {
          label: "Exit",
          accelerator: "Alt+F4",
          click() {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "Ctrl+Z" },
        { label: "Redo", accelerator: "Ctrl+Shift+Z" },
        { type: "separator" },
        { label: "Cut", accelerator: "Ctrl+X" },
        { label: "Copy", accelerator: "Ctrl+C" },
        { label: "Paste", accelerator: "Ctrl+V" },
        { label: "Select All", accelerator: "Ctrl+A" },
      ],
    },
    {
      label: "Help",
      submenu: [
        { label: "Online Documentation" },
        { label: "Get Support" },
        { label: "Check for updates" },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

export default createMenu;
