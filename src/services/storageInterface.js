export default class StorageInterface {
  async getState() {
    throw new Error("Method 'getState()' must be implemented.");
  }

  // eslint-disable-next-line
  async updateState(state) {
    throw new Error("Method 'updateState()' must be implemented.");
  }

  async getConfig() {
    throw new Error("Method 'getConfig()' must be implemented.");
  }

  async getCredentials() {
    throw new Error("Method 'getCredentials()' must be implemented.");
  }

  // eslint-disable-next-line
  async updateCredentials(credentials) {
    throw new Error("Method 'updateCredentials()' must be implemented.");
  }

  async getItems() {
    throw new Error("Method 'fetchItems()' must be implemented.");
  }

  // eslint-disable-next-line
  async updateItems(state) {
    throw new Error("Method 'updateItems()' must be implemented.");
  }

  async getNotes() {
    throw new Error("Method 'getNotes()' must be implemented.");
  }

  // eslint-disable-next-line
  async updateNotes(notes) {
    throw new Error("Method 'updateNotes()' must be implemented.");
  }
}
