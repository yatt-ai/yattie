import { IPC_HANDLERS, IPC_FUNCTIONS } from "@/modules/constants";

export default class ElectronService {
  // Listeners

  onOpenSettingWindow(callback) {
    window.ipc.on("APP_SETTING", callback);
  }
  onOpenAboutWindow(callback) {
    window.ipc.on("ABOUT_DIALOG", callback);
  }

  onOpenChildWindow(callback) {
    window.ipc.on("OPEN_CHILD_WINDOW", callback);
  }

  onCloseChildWindow(callback) {
    window.ipc.on("CLOSE_CHILD_WINDOW", callback);
  }
  onNewSession(callback) {
    window.ipc.on("NEW_SESSION", callback);
  }

  onOpenSession(callback) {
    window.ipc.on("OPEN_SESSION", callback);
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

  onConfigChange(callback) {
    window.ipc.on("CONFIG_CHANGE", callback);
  }

  onCredentialChange(callback) {
    window.ipc.on("CREDENTIAL_CHANGE", callback);
  }

  onSetTheme(callback) {
    window.ipc.on("SET_THEME", callback);
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

  async openSettingWindow() {
    return await window.ipc.invoke(IPC_HANDLERS.WINDOW, {
      func: IPC_FUNCTIONS.OPEN_SETTING_WINDOW,
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

  async openEditWindow(data) {
    return await window.ipc.invoke(IPC_HANDLERS.WINDOW, {
      func: IPC_FUNCTIONS.OPEN_EDIT_WINDOW,
      data: data,
    });
  }

  async closeEditWindow() {
    return await window.ipc.invoke(IPC_HANDLERS.WINDOW, {
      func: IPC_FUNCTIONS.CLOSE_EDIT_WINDOW,
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

  async updateImage(item, url) {
    return await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
      func: IPC_FUNCTIONS.UPDATE_IMAGE,
      data: { item, url },
    });
  }

  async updateAudio(item) {
    return await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
      func: IPC_FUNCTIONS.UPDATE_AUDIO,
      data: { item },
    });
  }

  async createVideo(buffer) {
    return await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
      func: IPC_FUNCTIONS.CREATE_VIDEO,
      data: { buffer },
    });
  }

  async updateVideo(item, start, end, previousDuration) {
    return await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
      func: IPC_FUNCTIONS.UPDATE_VIDEO,
      data: {
        item,
        start,
        end,
        previousDuration,
      },
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

  async openSession() {
    return await window.ipc.invoke(IPC_HANDLERS.FILE_SYSTEM, {
      func: IPC_FUNCTIONS.OPEN_SESSION,
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

  async setAppearance(appearance) {
    return await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
      func: IPC_FUNCTIONS.SET_APPEARANCE,
      data: { appearance },
    });
  }
}
