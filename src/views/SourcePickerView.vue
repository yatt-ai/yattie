<template>
  <v-container>
    <div class="wrapper">
      <div class="header">
        <span :style="{ color: currentTheme.secondary }">
          {{ $t("message.select_window_to_record_session") }}
        </span>
      </div>
      <div class="content">
        <v-radio-group v-model="activeSource">
          <v-row class="session-list">
            <v-col
              class="session-item"
              cols="6"
              xs="6"
              sm="4"
              md="4"
              v-for="item in sources"
              :key="item.id"
            >
              <div class="session-img">
                <img :src="item.thumbnail" :alt="item.name" />
              </div>
              <div class="session-name">
                <p :style="{ color: currentTheme.secondary }">
                  {{ item.name }}
                </p>
              </div>
              <div class="session-radio">
                <v-radio dense :value="item.id" :ripple="false"></v-radio>
              </div>
            </v-col>
          </v-row>
        </v-radio-group>
      </div>
      <div class="footer">
        <v-btn
          class="text-capitalize"
          small
          color="white"
          :style="{ color: currentTheme.black }"
          @click="close"
        >
          {{ $tc("caption.cancel", 1) }}
        </v-btn>
        <v-btn
          class="text-capitalize"
          small
          color="primary"
          :disabled="!activeSource"
          @click="select"
        >
          {{ $tc("caption.select", 1) }}
        </v-btn>
      </div>
    </div>
  </v-container>
</template>
<script>
import {
  IPC_HANDLERS,
  IPC_FUNCTIONS,
  IPC_BIND_KEYS,
} from "../modules/constants";

export default {
  name: "SourcePickerView",
  data() {
    return {
      activeSource: "",
      sources: [],
    };
  },
  created() {
    if (!window.ipc) return;

    window.ipc.on(IPC_BIND_KEYS.MODAL_DATA, (data) => {
      this.sources = data;
    });
  },
  computed: {
    currentTheme() {
      if (this.$vuetify.theme.dark) {
        return this.$vuetify.theme.themes.dark;
      } else {
        return this.$vuetify.theme.themes.light;
      }
    },
  },
  methods: {
    close() {
      this.activeSource = "";
      if (!window.ipc) return;

      window.ipc.invoke(IPC_HANDLERS.WINDOW, {
        func: IPC_FUNCTIONS.CLOSE_MODAL_WINDOW,
        data: {
          bindKey: IPC_BIND_KEYS.CLOSED_SOURCEPICKER_DIALOG,
        },
      });
    },
    select() {
      if (!window.ipc) return;

      window.ipc.invoke(IPC_HANDLERS.WINDOW, {
        func: IPC_FUNCTIONS.CLOSE_MODAL_WINDOW,
        data: {
          bindKey: IPC_BIND_KEYS.CLOSED_SOURCEPICKER_DIALOG,
          data: { sourceId: this.activeSource },
        },
      });
    },
    setActiveSource(value) {
      this.activeSource = value;
    },
  },
};
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 400px;
  width: 100%;
  overflow-y: auto;
}

.header {
  width: 100%;
  padding: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.theme--dark .header {
  border-color: #374151;
}

.header span {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
}

.content {
  flex-grow: 1;
  overflow: auto;
  padding: 15px;
}

.footer {
  width: 100%;
  padding: 15px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  column-gap: 12px;
}

.theme--dark .footer {
  border-color: #374151;
}

.session-list .session-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.session-list .session-item .session-img {
  border-radius: 4px;
  display: flex;
  width: 100%;
  background: #000;
  justify-content: center;
}

.session-list .session-item .session-img img {
  height: 100px;
  max-width: 100%;
  object-fit: contain;
}

.session-list .session-item .session-name {
  padding: 5px;
  padding-bottom: 0;
  text-align: center;
  display: flex;
  justify-content: center;
  width: 100%;
}
.session-list .session-item .session-name p {
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  text-align: center;
  margin-bottom: 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.v-input--selection-controls__input {
  width: 16px;
  height: 16px;
}
</style>
