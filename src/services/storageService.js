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

  async updateCredentials(credentials) {
    return this.storage.updateCredentials(credentials);
  }

  async getItems() {
    return await this.storage.getItems();
  }

  async getItemById(id) {
    return await this.storage.getItemById(id);
  }

  async updateItems(items) {
    return this.storage.updateItems(items);
  }

  async getNotes() {
    return await this.storage.getNotes();
  }

  async updateNotes(notes) {
    return this.storage.updateNotes(notes);
  }
}
