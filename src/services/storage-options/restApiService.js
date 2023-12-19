import axios from "axios";
import StorageInterface from "../storageInterface";

export default class RestApiService extends StorageInterface {
  async getState() {
    const response = await axios.get(`http://localhost:3000/state`);
    return response.data;
  }

  async updateState(state) {
    console.log(state);
    // saving state endpoint here
  }

  async getConfig() {
    const response = await axios.get(`http://localhost:3000/config`);
    return response.data;
  }

  async updateConfig(config) {
    console.log(config);
    // saving credentials endpoint here
  }

  async getCredentials() {
    const response = await axios.get(`http://localhost:3000/credentials`);
    return response.data;
  }

  async getMetaData() {}

  async updateCredentials(credentials) {
    console.log(credentials);
    // saving credentials endpoint here
  }

  async getItems() {
    const response = await axios.get(`http://localhost:3000/items`);
    return response.data;
  }

  async getItemById(id) {
    console.log(id);
    const response = await axios.get(`http://localhost:3000/item`);
    return response.data;
  }

  async updateItems(items) {
    console.log(items);
    // saving state endpoint here
  }

  async deleteItems(items) {
    console.log(items);
  }

  async getNotes() {
    const response = await axios.get(`http://localhost:3000/notes`);
    return response.data;
  }

  async updateNotes(notes) {
    console.log(notes);
    // saving notes endpoint here
  }

  async createNewSession(data) {
    console.log(data);
  }

  async saveSession(data) {
    console.log(data);
  }

  async resetData() {
    console.log("Reset data request goes here");
  }

  async saveNote() {
    console.log("Save Note");
  }
}
