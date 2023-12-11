import { IPC_HANDLERS, IPC_FUNCTIONS } from "@/modules/constants";

export default class ElectronService {
  // Listeners
  onNewSession(callback) {
    window.ipc.on("NEW_SESSION", callback);
  }

  onDataChange(callback) {
    window.ipc.on("DATA_CHANGE", callback);
  }

  onMetaChange(callback) {
    window.ipc.on("META_CHANGE", callback);
  }

  // Invokers
  setWindowSize({ width, height }) {
    window.ipc.invoke(IPC_HANDLERS.WINDOW, {
      func: IPC_FUNCTIONS.SET_WINDOW_SIZE,
      data: {
        width,
        height,
      },
    });
  }

  openEditWindow(data) {
    window.ipc.invoke(IPC_HANDLERS.WINDOW, {
      func: IPC_FUNCTIONS.OPEN_EDIT_WINDOW,
      data: data,
    });
  }

  async openExternalLink(url) {
    return await window.ipc.invoke(IPC_HANDLERS.FILE_SYSTEM, {
      func: IPC_FUNCTIONS.OPEN_EXTERNAL_LINK,
      data: url,
    });
  }
}
