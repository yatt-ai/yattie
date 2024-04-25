import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import store from "../store/index";

// Todo: Figure this out
let doc = null;

export default {
  doc,

  connectToRoom(user_id) {
    const doc = new Y.Doc();
    const wsProvider = new WebsocketProvider(
      "ws://localhost:3000",
      `yattie-share-${user_id}`,
      doc
    );

    wsProvider.on("status", (event) => {
      console.log({ status: event.status, doc }); // logs "connected" or "disconnected"
    });

    this.doc = doc;

    return this.doc.getArray("stateArray").get(0);
  },

  updateRoomState(state) {
    if (
      !this.doc &&
      state.credentials &&
      state.credentials.jira &&
      state.credentials.jira.length > 0
    ) {
      this.connectToRoom(state.credentials.jira[0].user.id);
    }

    if (!this.doc.getArray("stateArray").get(0)) {
      this.doc.getArray("stateArray").insert(0, [state]);
    } else {
      this.doc.getArray("stateArray").insert(0, [state]);
    }

    const yarray = this.doc.getArray("stateArray");

    yarray.observe((event) => {
      store.commit(
        "updateFromNetwork",
        event.currentTarget.doc.share.get("stateArray").get(0)
      );
    });
  },

  resetData() {
    this.doc = new Y.Doc();
  },
};
