import { app, Menu } from "electron";
import i18n from "./i18n";

const createMenu = (win, dev) => {
  console.log(win, dev);
  const isMac = process.platform === "darwin";
  console.log(isMac);
  const template = [
    {
      label: i18n.t("menu.file"),
      id: "menu_file",
      submenu: [
        { label: i18n.t("menu.new_session"), accelerator: "Ctrl+Shift+C" },
        { label: i18n.t("menu.new_session_test"), accelerator: "Ctrl+Shift+T" },
        {
          label: i18n.t("menu.new_session_charter"),
          accelerator: "Ctrl+Shift+B",
        },
        { label: i18n.t("menu.open_session"), accelerator: "Ctrl+Shift+O" },
        { type: "separator" },
        {
          label: i18n.t("menu.save_session"),
          accelerator: "Alt+Ctrl+S",
          enabled: false,
          id: "menu_save_session",
        },
        {
          label: i18n.t("menu.save_as_charter"),
          accelerator: "Ctrl+Shift+X",
          enabled: false,
          id: "menu_save_as_charter",
        },
        {
          label: i18n.t("menu.reset_session"),
          enabled: false,
          id: "menu_reset_session",
        },
        { type: "separator" },
        {
          label: i18n.tc("menu.app_setting", 1),
          click: () => win.webContents.send("APP_SETTING", true),
        },
        { type: "separator" },
        {
          label: i18n.t("menu.exit"),
          accelerator: "Alt+F4",
          click() {
            app.quit();
          },
        },
      ],
    },
    {
      label: i18n.t("menu.edit"),
      submenu: [
        { label: i18n.t("menu.undo"), accelerator: "Ctrl+Z" },
        { label: i18n.t("menu.redo"), accelerator: "Ctrl+Shift+Z" },
        { type: "separator" },
        { label: i18n.t("menu.cut"), accelerator: "Ctrl+X" },
        { label: i18n.t("menu.copy"), accelerator: "Ctrl+C" },
        { label: i18n.t("menu.paste"), accelerator: "Ctrl+V" },
        { label: i18n.t("menu.select_all"), accelerator: "Ctrl+A" },
      ],
    },
    {
      label: "Help",
      submenu: [
        { label: i18n.t("menu.online_doc") },
        { label: i18n.t("menu.get_support") },
        { label: i18n.t("menu.check_update") },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

export default createMenu;
