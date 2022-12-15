<template>
  <v-container class="wrapper">
    <!-- <div class="top-wrapper">
      <v-icon @click="back">mdi-arrow-left-thin</v-icon>
    </div> -->
    <div class="note-list">
      <div class="d-flex flex-column mt-2" v-for="note in notes" :key="note.id">
        <!-- <div class="d-flex justify-space-between py-2">
          <div>
            <v-icon>mdi-clock-time-five-outline</v-icon>
            <span class="ml-2">{{ calculateTime(note.time) }}</span>
          </div>
          <div class="d-flex align-center">
            <input
              type="checkbox"
              class="item-select"
              :value="note.id"
              :checked="checkedNote(note.id)"
              @change="handleSelected($event, note.id)"
            />
          </div>
        </div> -->
        <div class="note-wrapper" @dblclick="handleActiveSession(note.id)">
          <span class="comment-type">
            {{ note.comment.text }}
          </span>
        </div>
      </div>
    </div>
    <!-- <div
      class="d-flex justify-space-between button-wrapper"
      v-if="selected.length"
    >
      <v-btn
        class="text-capitalize font-weight-regular white--text"
        color="primary"
        height="30"
        fill
        small
        @click="deleteConfirmDialog = true"
      >
        <v-icon left>mdi-delete</v-icon> Delete
      </v-btn>
      <v-btn
        class="text-capitalize font-weight-regular"
        color="white"
        height="30"
        fill
        small
        @click="exportNotes"
      >
        <v-icon left>mdi-download</v-icon> Export
      </v-btn>
    </div>
    <div class="d-flex justify-center mt-2 button-wrapper">
      <v-btn
        class="text-capitalize font-weight-regular white--text"
        color="primary"
        block
        height="30"
        @click="showNoteDialog"
      >
        Add note
      </v-btn>
    </div>
    <NoteDialog v-model="noteDialog" @submit-note="addNote" />
    <DeleteConfirmDialog
      v-model="deleteConfirmDialog"
      title="Confirm delete"
      :text="`Are you sure you want to delete?`"
      @confirm="deleteNotes"
      @cancel="deleteConfirmDialog = false"
    /> -->
  </v-container>
</template>
<script>
// import dayjs from "dayjs";
// import NoteDialog from "../components/dialogs/NoteDialog.vue";
// import DeleteConfirmDialog from "../components/dialogs/DeleteConfirmDialog.vue";

import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";

export default {
  name: "NoteView",
  components: {
    // NoteDialog,
    // DeleteConfirmDialog,
  },
  data() {
    return {
      // timer: 0,
      // noteDialog: false,
      // deleteConfirmDialog: false,
      // selected: [],
      notes: [],
    };
  },
  mounted() {
    // this.$root.$on("close-notedialog", this.hideNoteDialog);

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
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.GET_NOTES,
        })
        .then((notes) => {
          this.notes = notes;
        });
    },
    // calculateTime(time) {
    //   if (time > 0) {
    //     const seconds = ("0" + (time % 60)).slice(-2);
    //     const minutes = ("0" + (parseInt(time / 60, 10) % 60)).slice(-2);
    //     const hours = ("0" + (parseInt(time / 3600, 10) % 24)).slice(-2);

    //     return hours + ":" + minutes + ":" + seconds;
    //   } else {
    //     return "-- : -- : --";
    //   }
    // },
    // checkedNote(id) {
    //   if (this.selected.includes(id)) {
    //     return true;
    //   }
    //   return false;
    // },
    // handleSelected($event, id) {
    //   if ($event.target.checked && !this.selected.includes(id)) {
    //     this.selected.push(id);
    //   } else {
    //     this.selected = this.selected.filter((n) => n != id);
    //   }
    // },
    // handleActiveSession(id) {
    //   if (!window.ipc) return;

    //   window.ipc
    //     .invoke(IPC_HANDLERS.DATABASE, {
    //       func: IPC_FUNCTIONS.GET_ITEM_BY_ID,
    //       data: id,
    //     })
    //     .then((data) => {
    //       this.activeSession = data;
    //       this.$emit("submit-session", this.activeSession);
    //     });
    // },
    // async addNote(comment) {
    //   const date = dayjs().format("MM/DD/YYYY HH:mm:ss");
    //   const fileName = dayjs().format("YYYY-MM-DD_HH-mm-ss-ms") + ".txt";

    //   // Save Note
    //   await window.ipc
    //     .invoke(IPC_HANDLERS.CAPTURE, {
    //       func: IPC_FUNCTIONS.SAVE_NOTE,
    //       data: { fileName: fileName, comment: comment },
    //     })
    //     .then((filePath) => {
    //       const newNote = {
    //         id: Date.now(),
    //         sessionType: "note",
    //         fileType: "text",
    //         fileName: fileName,
    //         filePath: filePath,
    //         comment: comment,
    //         time: this.timer,
    //         createdAt: date,
    //       };

    //       this.notes.push(newNote);

    //       window.ipc.invoke(IPC_HANDLERS.DATABASE, {
    //         func: IPC_FUNCTIONS.UPDATE_NOTES,
    //         data: this.notes,
    //       });
    //     });

    //   this.noteDialog = false;
    // },
    // async deleteNotes() {
    //   await window.ipc.invoke(IPC_HANDLERS.DATABASE, {
    //     func: IPC_FUNCTIONS.DELETE_ITEMS,
    //     data: this.selected,
    //   });

    //   await window.ipc.invoke(IPC_HANDLERS.DATABASE, {
    //     func: IPC_FUNCTIONS.DELETE_NOTES,
    //     data: this.selected,
    //   });
    //   this.selected = [];
    //   this.deleteConfirmDialog = false;
    // },
    // async exportNotes() {
    //   await window.ipc.invoke(IPC_HANDLERS.FILE_SYSTEM, {
    //     func: IPC_FUNCTIONS.EXPORT_NOTES,
    //     data: this.selected,
    //   });
    //   this.selected = [];
    // },
    // showNoteDialog() {
    //   this.noteDialog = true;
    // },
    // hideNoteDialog() {
    //   this.noteDialog = false;
    // },
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
