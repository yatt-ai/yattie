import { IPC_HANDLERS, IPC_FUNCTIONS } from "@/modules/constants";

export default class ElectronService {
  setWindowSize({ width, height }) {
    window.ipc.invoke(IPC_HANDLERS.WINDOW, {
      func: IPC_FUNCTIONS.SET_WINDOW_SIZE,
      data: {
        width,
        height,
      },
    });
  }
}
