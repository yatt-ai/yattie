import { ipcMain } from "electron";
import { IPC_HANDLERS, IPC_FUNCTIONS } from "./constants";
const captureUtility = require("./CaptureUtility");
const databaseUtility = require("./DatabaseUtility");
const fileSystemUtility = require("./FileSystemUtility");

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
    case IPC_FUNCTIONS.CREATE_TEMP_USER_MEDIA:
      return captureUtility.createTempUserMedia(args.data);
    case IPC_FUNCTIONS.SAVE_USER_MEDIA:
      return captureUtility.saveUserMedia(args.data);
    case IPC_FUNCTIONS.UPDATE_USER_MEDIA:
      return captureUtility.updateUserMedia(args.data);

    case IPC_FUNCTIONS.OPEN_ADD_WINDOW:
      return captureUtility.openAddWindow(args.data);
    case IPC_FUNCTIONS.CLOSE_ADD_WINDOW:
      return captureUtility.closeAddWindow(args.data);
    case IPC_FUNCTIONS.OPEN_EDIT_WINDOW:
      return captureUtility.openEditWindow(args.data);
    case IPC_FUNCTIONS.CLOSE_EDIT_WINDOW:
      return captureUtility.closeEditWindow(args.data);
    case IPC_FUNCTIONS.OPEN_SETTING_WINDOW:
      return captureUtility.openSettingWindow(args.data);
    case IPC_FUNCTIONS.CLOSE_SETTING_WINDOW:
      return captureUtility.closeSettingWindow(args.data);
    case IPC_FUNCTIONS.SET_WINDOW_SIZE:
      return captureUtility.setWindowSize(args.data);
    case IPC_FUNCTIONS.GET_IMAGE_DATA:
      return captureUtility.getImageData(args.data);
    case IPC_FUNCTIONS.SET_APPERANCE:
      return captureUtility.setApperance(args.data);
    default:
      return null;
  }
});

ipcMain.handle(IPC_HANDLERS.DATABASE, async (event, args) => {
  switch (args.func) {
    case IPC_FUNCTIONS.INITIALIZE_SESSION:
      return databaseUtility.initializeSession();
    case IPC_FUNCTIONS.GET_ITEMS:
      return databaseUtility.getItems();
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
    default:
      return null;
  }
});

ipcMain.handle(IPC_HANDLERS.FILE_SYSTEM, async (event, args) => {
  switch (args.func) {
    case IPC_FUNCTIONS.EXPORT_ITEMS:
      return fileSystemUtility.exportItems(args.data);
    case IPC_FUNCTIONS.SAVE_SESSION:
      return fileSystemUtility.saveSession(args.data);
    case IPC_FUNCTIONS.OPEN_SESSION:
      return fileSystemUtility.openSession(args.data);
    case IPC_FUNCTIONS.EXPORT_SESSION:
      return fileSystemUtility.exportSession(args.data);
    default:
      return null;
  }
});
