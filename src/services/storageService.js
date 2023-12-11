import RestApiService from "./storage-options/restApiService";
import LocalJsonDbService from "./storage-options/localJsonDbService";

export default class StorageService {
  constructor() {
    this.storage = navigator.userAgent.includes("Electron")
      ? new LocalJsonDbService()
      : new RestApiService();
  }

  async getState() {
    return await this.storage.getState();
  }

  async updateState(state) {
    return this.storage.updateState(state);
  }

  async getConfig() {
    return await this.storage.getConfig();
  }

  async getCredentials() {
    return await this.storage.getCredentials();
  }

  async getItems() {
    return await this.storage.getItems();
  }

  async updateItems(items) {
    return this.storage.updateItems(items);
  }
}
