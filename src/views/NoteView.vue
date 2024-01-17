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
export default {
  name: "NoteView",
  components: {},
  data() {
    return {
      notes: [],
    };
  },
  mounted() {
    if (this.$isElectron) {
      this.$electronService.onDataChange(this.fetchNotes);
    }
    this.fetchNotes();
  },
  computed: {},
  methods: {
    async fetchNotes() {
      return await this.$storageService.getNotes();
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
