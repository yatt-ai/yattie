<template>
  <v-container class="wrapper">
    <div class="content">
      <TextEditor
        placeholder="Insert your note here"
        @update-data="updateNotes"
        :content="notes.content"
        :height="250"
      />
    </div>
  </v-container>
</template>
<script>
import TextEditor from "./TextEditor.vue";

import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";

export default {
  name: "NoteView",
  components: {
    TextEditor,
  },
  data() {
    return {
      notes: { text: "", content: "" },
    };
  },
  mounted() {
    this.fetchNotes();
  },
  methods: {
    async fetchNotes() {
      if (!window.ipc) return;

      await window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.GET_NOTES,
        })
        .then((notes) => {
          this.notes = notes;
        });
    },
    async updateNotes(data) {
      if (!window.ipc) return;

      await window.ipc.invoke(IPC_HANDLERS.DATABASE, {
        func: IPC_FUNCTIONS.UPDATE_NOTES,
        data: { ...data },
      });
    },
  },
};
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
}
.content {
  overflow: hidden;
}
.footer {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
