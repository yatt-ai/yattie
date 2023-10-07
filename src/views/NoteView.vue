<template>
  <v-container class="wrapper">
    <div class="note-list">
      <div class="d-flex flex-column mt-2" v-for="note in notes" :key="note.id">
        <div class="note-wrapper" @dblclick="handleActiveSession(note.id)">
          <span class="comment-type">
            {{ note.comment.text }}
          </span>
        </div>
      </div>
    </div>
  </v-container>
</template>
<script>
import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";

export default {
  name: "NoteView",
  components: {},
  data() {
    return {
      notes: [],
    };
  },
  mounted() {
    if (!window.ipc) return;

    window.ipc.on("DATA_CHANGE", () => {
      this.fetchNotes();
    });

    this.fetchNotes();
  },
  computed: {},
  methods: {
    async fetchNotes() {
      if (!window.ipc) return;

      await window.ipc
        .invoke(IPC_HANDLERS.PERSISTENCE, {
          func: IPC_FUNCTIONS.GET_NOTES,
        })
        .then((notes) => {
          this.notes = notes;
        });
    },
  },
};
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 600px;
  padding: 10px;
}
.note-list {
  display: block;
  height: calc(100vh - 100px);
  overflow-y: auto;
}
.note-wrapper {
  display: flex;
  padding: 8px 14px;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
}
</style>
