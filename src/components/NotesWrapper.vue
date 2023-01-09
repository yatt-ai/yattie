<template>
  <v-container class="wrapper">
    <div class="content">
      <v-tiptap
        v-model="notes.content"
        :placeholder="$t('message.insert_note')"
        ref="notes"
        :toolbar="[
          'headings',
          '|',
          'bold',
          'italic',
          'underline',
          '|',
          'color',
          '|',
          'bulletList',
          'orderedList',
          '|',
          'link',
          'emoji',
          'blockquote',
        ]"
        @input="handleNotes"
      >
      </v-tiptap>
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
    async handleNotes() {
      const regex = /(<([^>]+)>)/gi;
      this.notes.text = this.notes.content.replace(regex, "");
      if (!window.ipc) return;

      await window.ipc.invoke(IPC_HANDLERS.DATABASE, {
        func: IPC_FUNCTIONS.UPDATE_NOTES,
        data: this.notes,
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
