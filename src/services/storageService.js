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

  async setState(state) {
    return this.storage.setState(state);
  }

  async getConfig() {
    return await this.storage.getConfig();
  }

  async getCredentials() {
    return await this.storage.getCredentials();
  }
}
