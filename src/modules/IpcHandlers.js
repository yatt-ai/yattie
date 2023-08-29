import { ipcMain } from "electron";
import { IPC_HANDLERS, IPC_FUNCTIONS } from "./constants";
const captureUtility = require("./CaptureUtility");
const databaseUtility = require("./DatabaseUtility");
const fileSystemUtility = require("./FileSystemUtility");
const menuUtility = require("./MenuUtility");
const windowUtility = require("./WindowUtility");
const serverUtility = require("./ServerUtility");

ipcMain.handle(IPC_HANDLERS.BROWSER, async (event, args) => {
  switch (args.func) {
    default:
      return null;
  }
});

ipcMain.handle(IPC_HANDLERS.CAPTURE, async (event, args) => {
  switch (args.func) {
    case IPC_FUNCTIONS.GET_MEDIA_SOURCE:
      return captureUtility.getMediaSource();
    case IPC_FUNCTIONS.SAVE_NOTE:
      return captureUtility.saveNote(args.data);
    case IPC_FUNCTIONS.CREATE_IMAGE:
      return captureUtility.createImage(args.data);
    case IPC_FUNCTIONS.UPDATE_IMAGE:
      return captureUtility.updateImage(args.data);
    case IPC_FUNCTIONS.CREATE_VIDEO:
      return captureUtility.createVideo(args.data);
    case IPC_FUNCTIONS.UPDATE_VIDEO:
      return captureUtility.updateVideo(args.data);
    case IPC_FUNCTIONS.OPTIMIZE_VIDEO:
      return captureUtility.optimizeVideo(args.data);
    case IPC_FUNCTIONS.DELETE_FILE:
      return captureUtility.deleteFile(args.data);
    case IPC_FUNCTIONS.UPLOAD_EVIDENCE:
      return captureUtility.uploadEvidence(args.data);
    case IPC_FUNCTIONS.CREATE_AUDIO:
      return captureUtility.createAudio(args.data);
    case IPC_FUNCTIONS.UPDATE_AUDIO:
      return captureUtility.updateAudio(args.data);
    case IPC_FUNCTIONS.DROP_FILE:
      return captureUtility.dropFile(args.data);
    case IPC_FUNCTIONS.SET_APPERANCE:
      return captureUtility.setApperance(args.data);
    default:
      return null;
  }
});

ipcMain.handle(IPC_HANDLERS.WINDOW, async (event, args) => {
  switch (args.func) {
    case IPC_FUNCTIONS.SET_DEV_MODE:
      return windowUtility.setDevMode(args.data);
    case IPC_FUNCTIONS.OPEN_ADD_WINDOW:
      return windowUtility.openAddWindow(args.data);
    case IPC_FUNCTIONS.CLOSE_ADD_WINDOW:
      return windowUtility.closeAddWindow(args.data);
    case IPC_FUNCTIONS.OPEN_EDIT_WINDOW:
      return windowUtility.openEditWindow(args.data);
    case IPC_FUNCTIONS.CLOSE_EDIT_WINDOW:
      return windowUtility.closeEditWindow(args.data);
    case IPC_FUNCTIONS.OPEN_SETTING_WINDOW:
      return windowUtility.openSettingWindow(args.data);
    case IPC_FUNCTIONS.CLOSE_SETTING_WINDOW:
      return windowUtility.closeSettingWindow(args.data);
    case IPC_FUNCTIONS.OPEN_MINIMIZE_WINDOW:
      return windowUtility.openMinimizeWindow(args.data);
    case IPC_FUNCTIONS.CLOSE_MINIMIZE_WINDOW:
      return windowUtility.closeMinimizeWindow(args.data);
    case IPC_FUNCTIONS.CLOSE_SESSION_AND_MINIIMIZED_WINDOW:
      return windowUtility.closeSessionAndMinimizedWindow(args.data);
    case IPC_FUNCTIONS.SET_WINDOW_SIZE:
      return windowUtility.setWindowSize(args.data);
    case IPC_FUNCTIONS.OPEN_MODAL_WINDOW:
      return windowUtility.openModalWindow(args.data);
    case IPC_FUNCTIONS.CLOSE_MODAL_WINDOW:
      return windowUtility.closeModalWindow(args.data);
    case IPC_FUNCTIONS.OPEN_NOTES_WINDOW:
      return windowUtility.openNotesWindow(args.data);
    case IPC_FUNCTIONS.CLOSE_NOTES_WINDOW:
      return windowUtility.closeNotesWindow();
    case IPC_FUNCTIONS.MOVE_WINDOW:
      return windowUtility.moveWindow(args.data);
    default:
      return null;
  }
});

ipcMain.handle(IPC_HANDLERS.DATABASE, async (event, args) => {
  switch (args.func) {
    case IPC_FUNCTIONS.INITIALIZE_SESSION:
      return databaseUtility.initializeSession();
    case IPC_FUNCTIONS.GET_SESSION_ID:
      return databaseUtility.getSessionID();
    case IPC_FUNCTIONS.GET_STATE:
      return databaseUtility.getState();
    case IPC_FUNCTIONS.UPDATE_STATE:
      return databaseUtility.updateState(args.data);
    case IPC_FUNCTIONS.ADD_ITEM:
      return databaseUtility.addItem(args.data);
    case IPC_FUNCTIONS.GET_ITEMS:
      return databaseUtility.getItems();
    case IPC_FUNCTIONS.UPDATE_ITEM:
      return databaseUtility.updateItem(args.data);
    case IPC_FUNCTIONS.UPDATE_ITEMS:
      return databaseUtility.updateItems(args.data);
    case IPC_FUNCTIONS.DELETE_ITEMS:
      return databaseUtility.deleteItems(args.data);
    case IPC_FUNCTIONS.GET_ITEM_BY_ID:
      return databaseUtility.getItemById(args.data);
    case IPC_FUNCTIONS.GET_CONFIG:
      return databaseUtility.getConfig(args.data);
    case IPC_FUNCTIONS.UPDATE_CONFIG:
      return databaseUtility.updateConfig(args.data);
    case IPC_FUNCTIONS.GET_CREDENTIALS:
      return databaseUtility.getCredentials(args.data);
    case IPC_FUNCTIONS.UPDATE_CREDENTIALS:
      return databaseUtility.updateCredentials(args.data);
    case IPC_FUNCTIONS.GET_METADATA:
      return databaseUtility.getMetadata(args.data);
    case IPC_FUNCTIONS.UPDATE_METADATA:
      return databaseUtility.updateMetadata(args.data);
    case IPC_FUNCTIONS.UPDATE_NOTES:
      return databaseUtility.updateNotes(args.data);
    case IPC_FUNCTIONS.GET_NOTES:
      return databaseUtility.getNotes(args.data);
    case IPC_FUNCTIONS.RESET_DATA:
      return databaseUtility.resetData(args.data);
    default:
      return null;
  }
});

ipcMain.handle(IPC_HANDLERS.FILE_SYSTEM, async (event, args) => {
  switch (args.func) {
    case IPC_FUNCTIONS.EXPORT_ITEMS:
      return fileSystemUtility.exportItems(args.data);
    case IPC_FUNCTIONS.CREATE_NEW_SESSION:
      return fileSystemUtility.createNewSession(args.data);
    case IPC_FUNCTIONS.SAVE_SESSION:
      return fileSystemUtility.saveSession(args.data);
    case IPC_FUNCTIONS.OPEN_SESSION:
      return fileSystemUtility.openSession(args.data);
    case IPC_FUNCTIONS.EXPORT_SESSION:
      return fileSystemUtility.exportSession(args.data);
    case IPC_FUNCTIONS.OPEN_CONFIG_FILE:
      return fileSystemUtility.openConfigFile(args.data);
    case IPC_FUNCTIONS.OPEN_CREDENTIALS_FILE:
      return fileSystemUtility.openCredentialsFile(args.data);
    case IPC_FUNCTIONS.DRAG_ITEM:
      return fileSystemUtility.dragItem(event, args.data);
    case IPC_FUNCTIONS.OPEN_EXTERNAL_LINK:
      return fileSystemUtility.openExternalLink(args.data);
    default:
      return null;
  }
});

ipcMain.handle(IPC_HANDLERS.MENU, async (event, args) => {
  switch (args.func) {
    case IPC_FUNCTIONS.CHANGE_MENUITEM_STATUS:
      return menuUtility.changeMenuItemStatus(args.data);
  }
});

ipcMain.handle(IPC_HANDLERS.SERVER, async (event, args) => {
  switch (args.func) {
    case IPC_FUNCTIONS.START_SERVER:
      return serverUtility.startServer(args.data);
    case IPC_FUNCTIONS.STOP_SERVER:
      return serverUtility.stopServer(args.data);
  }
});
