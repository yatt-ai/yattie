import { IPC_HANDLERS, IPC_FUNCTIONS } from "@/modules/constants";

export default class ElectronService {
  // Listeners
  onNewSession(callback) {
    window.ipc.on("NEW_SESSION", callback);
  }

  onSaveSession(callback) {
    window.ipc.on("SAVE_SESSION", callback);
  }

  onActiveSession(callback) {
    window.ipc.on("ACTIVE_SESSION", callback);
  }

  onResetSession(callback) {
    window.ipc.on("RESET_SESSION", callback);
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

  async openAddWindow(data) {
    await window.ipc.invoke(IPC_HANDLERS.WINDOW, {
      func: IPC_FUNCTIONS.OPEN_ADD_WINDOW,
      data: { width: 700, height: 800, data },
    });
  }

  async closeAddWindow() {
    return await window.ipc.invoke(IPC_HANDLERS.WINDOW, {
      func: IPC_FUNCTIONS.CLOSE_ADD_WINDOW,
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

  async uploadEvidence() {
    return await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
      func: IPC_FUNCTIONS.UPLOAD_EVIDENCE,
    });
  }

  async dragItem(item) {
    return await window.ipc.invoke(IPC_HANDLERS.FILE_SYSTEM, {
      func: IPC_FUNCTIONS.DRAG_ITEM,
      data: item,
    });
  }

  async dropFile(event) {
    const f = event.dataTransfer.files[0];
    return await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
      func: IPC_FUNCTIONS.DROP_FILE,
      data: {
        path: f.path,
        name: f.name,
      },
    });
  }

  async getMediaSource() {
    return await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
      func: IPC_FUNCTIONS.GET_MEDIA_SOURCE,
    });
  }

  async createImage(imgURI, isPoster = false) {
    return await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
      func: IPC_FUNCTIONS.CREATE_IMAGE,
      data: { url: imgURI, isPoster },
    });
  }

  async createVideo(buffer) {
    return await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
      func: IPC_FUNCTIONS.CREATE_VIDEO,
      data: { buffer },
    });
  }

  async optimizeVideo(filePath) {
    return window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
      func: IPC_FUNCTIONS.OPTIMIZE_VIDEO,
      data: {
        filePath,
      },
    });
  }

  async createAudio(buffer) {
    return await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
      func: IPC_FUNCTIONS.CREATE_AUDIO,
      data: { buffer },
    });
  }

  async exportItems(items) {
    return await window.ipc.invoke(IPC_HANDLERS.FILE_SYSTEM, {
      func: IPC_FUNCTIONS.EXPORT_ITEMS,
      data: items,
    });
  }

  async changeMenuBySessionStatus(sessionStatus) {
    return await window.ipc.invoke(IPC_HANDLERS.MENU, {
      func: IPC_FUNCTIONS.CHANGE_MENUITEM_STATUS,
      data: { sessionStatus },
    });
  }

  async deleteFile(filePath) {
    return await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
      func: IPC_FUNCTIONS.DELETE_FILE,
      data: { filePath },
    });
  }
}
