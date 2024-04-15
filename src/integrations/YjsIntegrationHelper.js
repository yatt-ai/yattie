import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
// import Vue from "vue";
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
    if (!this.doc) this.connectToRoom(state.credentials.jira[0].user.id);

    if (!this.doc.getArray("stateArray").get(0)) {
      this.doc.getArray("stateArray").insert(0, [state]);
    }

    this.doc.getArray("stateArray").insert(0, [state]);

    const yarray = this.doc.getArray("stateArray");

    yarray.observe((event) => {
      // print updates when the data changes
      console.log({
        event,
        x: event.currentTarget,
        // This is the most necessary bit, now to share it
        xx: event.currentTarget.doc.share.get("stateArray").get(0),
      });

      // Vue.prototype.$store.commit(
      //   "updateFromNetwork",
      //   event.currentTarget.doc.share.get("stateArray").get(0)
      // );

      // import { store } from "../store/index";

      // Then use it directly
      store.commit(
        "updateFromNetwork",
        event.currentTarget.doc.share.get("stateArray").get(0)
      );

      // console.log(typeof store.commit);

      // store.mutations.updateFromNetwork(
      //   event.currentTarget.doc.share.get("stateArray").get(0)
      // );

      // this.doc.on('update', () => {
      //   const updatedState = this.doc.getArray("stateArray").toJSON();
      //   Vue.prototype.$store.commit('updateFromNetwork', updatedState);
      // });
    });
  },

  resetData() {
    this.doc = new Y.Doc();
  },
};
