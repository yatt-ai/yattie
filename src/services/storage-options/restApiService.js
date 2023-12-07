import axios from "axios";
import StorageInterface from "../storageInterface";

export default class RestApiService extends StorageInterface {
  async getState() {
    const response = await axios.get(`http://localhost:3000/state`);
    return response.data;
  }

  async setState(value) {
    console.log(value);
    // saving state endpoint here
  }
}
