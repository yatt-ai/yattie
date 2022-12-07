const { Menu } = require("electron");

const { SESSION_STATUSES } = require("./constants");

module.exports.changeMenuItemStatus = ({ sessionStatus }) => {
  const mainMenu = Menu.getApplicationMenu();
  const fileMenu = mainMenu.items.find((item) => item.label === "File");
  const fileSubMenus = fileMenu.submenu.items;

  if (sessionStatus === SESSION_STATUSES.PENDING) {
    fileSubMenus.find((item) => item.label === "Save Session").enabled = false;
    fileSubMenus.find(
      (item) => item.label === "Save As Test Charter"
    ).enabled = false;
    fileSubMenus.find((item) => item.label === "Reset Session").enabled = false;
  } else {
    fileSubMenus.find((item) => item.label === "Save Session").enabled = true;
    fileSubMenus.find(
      (item) => item.label === "Save As Test Charter"
    ).enabled = true;
    fileSubMenus.find((item) => item.label === "Reset Session").enabled = true;
  }
};
