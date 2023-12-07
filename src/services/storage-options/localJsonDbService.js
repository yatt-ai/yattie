import StorageInterface from "../storageInterface";
import { IPC_FUNCTIONS, IPC_HANDLERS } from "@/modules/constants";

export default class LocalJsonDbService extends StorageInterface {
  async getState() {
    return await window.ipc.invoke(IPC_HANDLERS.DATABASE, {
      func: IPC_FUNCTIONS.GET_STATE,
    });
  }

  async setState(state) {
    console.log(state);
  }
}
