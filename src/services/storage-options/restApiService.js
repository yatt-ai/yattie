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

  async getCredentials() {
    const response = await axios.get(`http://localhost:3000/credentials`);
    return response.data;
  }

  async getItems() {
    const response = await axios.get(`http://localhost:3000/items`);
    return response.data;
  }

  async updateItems(items) {
    console.log(items);
    // saving state endpoint here
  }
}
