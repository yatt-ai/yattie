export default class StorageInterface {
  async getState() {
    throw new Error("Method 'getState()' must be implemented.");
  }

  // eslint-disable-next-line
  async setState(state) {
    throw new Error("Method 'setState()' must be implemented.");
  }

  async getConfig() {
    throw new Error("Method 'getConfig()' must be implemented.");
  }

  async getCredentials() {
    throw new Error("Method 'getCredentials()' must be implemented.");
  }
}
