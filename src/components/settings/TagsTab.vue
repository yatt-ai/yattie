<template>
  <v-container class="wrapper">
    <div class="title">{{ $tc("caption.custom_tags", 1) }}</div>
    <p class="mt-2 mb-4">
      {{ $t("message.add_custom_tags") }}
    </p>
    <div class="content">
      <div class="tag-list">
        <div class="one" v-for="tag in tags" :key="tag.id">
          <div class="input-box">
            <input
              type="text"
              placeholder="Add tag"
              @input="
                (evt) =>
                  $store.commit('config/editTagText', {
                    id: tag.id,
                    text: evt.target.value,
                  })
              "
              :value="tag.text"
            />
          </div>
          <div class="func-box">
            <v-icon @click="$store.commit('config/deleteTag', tag.id)">
              mdi-delete
            </v-icon>
          </div>
        </div>
      </div>
      <div class="footer">
        <button
          class="link"
          @click="addTag"
          :style="{ color: currentTheme.secondary }"
        >
          {{ $tc("caption.add_another_tag", 1) }}
        </button>
      </div>
    </div>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "TabsTab",
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      config: "config/fullConfig",
      tags: "config/tags",
    }),
    currentTheme() {
      if (this.$vuetify.theme.dark) {
        return this.$vuetify.theme.themes.dark;
      } else {
        return this.$vuetify.theme.themes.light;
      }
    },
  },
  methods: {
    addTag: function () {
      this.$store.commit("config/addTag", {
        id: new Date().getTime(),
        text: "",
      });
    },
  },
};
</script>
<style scoped>
.wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 25px;
}
.tab-bar {
  margin-top: 20px;
}
.row {
  display: flex;
  column-gap: 10px;
}
.title {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.link {
  background-color: transparent !important;
  border: 0;
  outline: 0;
  color: #6d28d9;
  margin-top: 15px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.status {
  padding-left: 10px;
  padding-top: 10px;

  display: flex;
  align-items: center;
}
.status > label {
  margin-top: -3px;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: #6b7280;
}
.content {
  position: relative;
}
.content .overlay {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0);
}
.tag-list {
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  max-height: 55vh;
  overflow-y: auto;
  row-gap: 10px;
  padding: 0 20px 0 0;
}
.tag-list > .one {
  display: flex;
  justify-content: space-between;
  column-gap: 10px;
}
.tag-list > .one > .input-box {
  display: flex;
  border: 0;
  column-gap: 10px;
  width: 400px;
}
.tag-list > .one > .input-box > input {
  display: inline-flex;
  width: 100%;
  height: 32px;
  padding: 8px;

  justify-content: flex-start;
  align-items: center;
  background-color: white;
  border: 1px solid #d1d5db;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  outline: 0;

  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: #6b7280;
}
.theme--dark .tag-list > .one > .input-box > input[type="text"] {
  background-color: #6b7280;
  border: 0;
  color: white;
}
.tag-list > .one > .input-box > .check-box {
  display: flex;
  column-gap: 10px;
  align-items: center;
}
.tag-list > .one > .input-box > .check-box > .label {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #6b7280;
}
.tag-list > .one > .func-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
.footer {
  display: block;
  width: calc(100% - 40px);
}
.footer > button {
  max-width: 60% !important;
}

.v-tab {
  line-height: 1.2;
}
.v-tab.v-tab--active {
  color: #6d28d9 !important;
}
</style>
