import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

// Figure this out
let doc = null;
let state = {};

export default {
  doc,
  state,

  connectToRoom(user_id) {
    const doc = new Y.Doc();
    const wsProvider = new WebsocketProvider(
      "ws://localhost:3000",
      `yattie-share-${user_id}`,
      doc
    );

    wsProvider.on("status", (event) => {
      console.log(event.status); // logs "connected" or "disconnected"
    });

    this.doc = doc;

    return doc;
  },

  updateRoomState(state) {
    this.state = {
      ...this.state,
      ...state,
    };
  },
};
