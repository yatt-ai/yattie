import StorageInterface from "../storageInterface";
import { IPC_FUNCTIONS, IPC_HANDLERS } from "@/modules/constants";

export default class LocalJsonDbService extends StorageInterface {
  async getState() {
    return await window.ipc.invoke(IPC_HANDLERS.DATABASE, {
      func: IPC_FUNCTIONS.GET_STATE,
    });
  }

  async updateState(state) {
    window.ipc.invoke(IPC_HANDLERS.DATABASE, {
      func: IPC_FUNCTIONS.UPDATE_STATE,
      data: state,
    });
  }

  async getConfig() {
    return await window.ipc.invoke(IPC_HANDLERS.DATABASE, {
      func: IPC_FUNCTIONS.GET_CONFIG,
    });
  }

  async getCredentials() {
    return await window.ipc.invoke(IPC_HANDLERS.DATABASE, {
      func: IPC_FUNCTIONS.GET_CREDENTIALS,
    });
  }

  async updateCredentials(credentials) {
    window.ipc.invoke(IPC_HANDLERS.DATABASE, {
      func: IPC_FUNCTIONS.UPDATE_CREDENTIALS,
      data: credentials,
    });
  }

  async getItems() {
    return await window.ipc.invoke(IPC_HANDLERS.DATABASE, {
      func: IPC_FUNCTIONS.GET_ITEMS,
    });
  }

  async updateItems(items) {
    window.ipc.invoke(IPC_HANDLERS.DATABASE, {
      func: IPC_FUNCTIONS.UPDATE_ITEMS,
      data: items,
    });
  }

  async getNotes() {
    return await window.ipc.invoke(IPC_HANDLERS.DATABASE, {
      func: IPC_FUNCTIONS.GET_NOTES,
    });
  }

  async updateNotes(notes) {
    await window.ipc.invoke(IPC_HANDLERS.DATABASE, {
      func: IPC_FUNCTIONS.UPDATE_NOTES,
      data: notes,
    });
  }
}
