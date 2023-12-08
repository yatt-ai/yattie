import { IPC_HANDLERS, IPC_FUNCTIONS } from "@/modules/constants";

export default class ElectronService {
  // Listeners
  onNewSession(callback) {
    window.ipc.on("NEW_SESSION", callback);
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
  updateState(state) {
    window.ipc.invoke(IPC_HANDLERS.DATABASE, {
      func: IPC_FUNCTIONS.UPDATE_STATE,
      data: state,
    });
  }
}
