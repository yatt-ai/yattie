<template>
  <div class="wrapper">
    <div class="header">
      <v-btn class="maximize-btn" color="primary" plain @click="maximize">
        <v-icon>mdi-window-maximize</v-icon>
      </v-btn>
    </div>
    <div class="content">
      <div class="time-counter">
        <span class="time-title">{{ $tc("caption.time", 1) }}</span>
        <span class="time-value">00:00:26</span>
      </div>
      <div class="control-panel">
        <v-btn icon class="icon-btn">
          <img
            :src="require('../assets/icon/pause-white.svg')"
            width="19"
            height="19"
          />
        </v-btn>
        <v-btn icon class="icon-btn">
          <img
            :src="require('../assets/icon/stop-white.svg')"
            width="19"
            height="19"
          />
        </v-btn>
        <v-divider vertical class="icon-divider"></v-divider>
        <v-btn icon class="icon-btn">
          <img
            :src="require('../assets/icon/camera-white.svg')"
            width="19"
            height="17"
          />
        </v-btn>
        <v-btn icon class="icon-btn">
          <img
            :src="require('../assets/icon/video-white.svg')"
            width="19"
            height="15"
          />
        </v-btn>
        <v-btn icon class="icon-btn">
          <img
            :src="require('../assets/icon/microphone-white.svg')"
            width="17"
            height="21"
          />
        </v-btn>
        <v-btn icon class="icon-btn">
          <img
            :src="require('../assets/icon/pencil-white1.svg')"
            width="17"
            height="17"
          />
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";
export default {
  name: "MinimizeView",
  components: {},
  data() {
    return {};
  },
  methods: {
    maximize() {
      console.log("maximize");
      window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
        func: IPC_FUNCTIONS.CLOSE_MINIMIZE_WINDOW,
      });
    },
  },
};
</script>
<style scoped>
.v-application {
  background: transparent !important;
}
.wrapper {
  display: flex;
  flex-direction: column;
  column-gap: 5px;
  width: 100%;
}
.header {
  display: flex;
  justify-content: flex-end;
  background: transparent;
  padding: 5px;
  width: 100%;
  height: 34px;
}
.header .maximize-btn {
  width: auto;
  height: auto;
  padding: 0;
  min-width: auto;
}
.header .maximize-btn .v-icon {
  color: #9859fb;
  font-size: 30px;
}
.content {
  background-color: #4c1d95;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 50px;
  overflow: hidden;
}
.time-counter {
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #7c3aed;
}
.time-counter .time-title {
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.2;
  text-align: center;
  text-transform: uppercase;
  color: #ddd6fe;
}
.time-counter .time-value {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.2;
  text-align: center;
  color: #fff;
}
.control-panel {
  width: 70%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px;
}
.icon-btn {
  text-align: center;
}
.icon-btn:hover {
  background: #391670;
}
.icon-divider {
  background: #6d28d9;
  margin-left: 3px;
  margin-right: 3px;
}
</style>
