<template>
  <div>
    <div class="preview-wrapper" v-if="isProcessing">
      <img :src="`file://${item.poster}`" />
      <div class="progress-bar">
        <v-progress-linear
          indeterminate
          striped
          height="10"
          color="primary"
        ></v-progress-linear>
        <div class="subtitle-2">Optimizing</div>
      </div>
    </div>
    <div class="video-wrapper" v-if="!isProcessing">
      <div class="video-player">
        <video
          ref="videoPlayer"
          controls
          @loadedmetadata="logDuration"
          style="width: 100%"
        >
          <source :src="`file://${item.filePath}`" type="video/webm" />
        </video>
      </div>
      <div class="video-control">
        <div class="cut-duration">
          <div class="start-time">
            <div class="subtitle-2 label-text">Start</div>
            <v-text-field
              placeholder="00:00"
              v-mask="'##:##'"
              outlined
              dense
              v-model="start"
              hide-details="true"
            ></v-text-field>
          </div>
          <div class="divider"><span>-</span></div>
          <div class="end-time">
            <div class="subtitle-2 label-text">End</div>
            <v-text-field
              placeholder="00:00"
              v-mask="'##:##'"
              outlined
              dense
              v-model="end"
              hide-details="true"
            ></v-text-field>
          </div>
          <div class="duration-time">
            <span class="">Length: {{ durationTime }}</span>
          </div>
        </div>
        <div>
          <v-btn class="mr-2 text-capitalize" fill small color="white">
            Cancel
          </v-btn>
          <v-btn
            class="text-capitalize"
            fill
            small
            color="primary"
            @click="() => handleVideo(false)"
          >
            Apply
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";
export default {
  name: "VideoWrapper",
  components: {},
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    processing: {
      type: Boolean,
      default: () => false,
    },
    triggerSave: {
      type: Boolean,
      default: () => false,
    },
  },
  watch: {
    item: function (newValue) {
      this.sessionItem = newValue;
    },
    processing: function (newValue) {
      console.log(newValue);
      this.isProcessing = newValue;
    },
    triggerSave: function (oldValue, newValue) {
      if (oldValue !== newValue) {
        this.handleVideo(true);
      }
    },
  },
  data() {
    return {
      sessionItem: this.item,
      start: "00:00",
      end: "00:00",
      isProcessing: this.processing,
      duration: 0,
    };
  },
  mounted() {},
  computed: {
    durationTime() {
      try {
        const date = new Date(null);
        const temp = parseFloat(this.duration).toFixed(2);
        date.setSeconds(temp);
        const result = date.toISOString().substr(14, 5);
        this.setEndTime(result);
        return result;
      } catch (e) {
        return "Infinite";
      }
    },
  },
  methods: {
    async handleVideo(needCallback = false) {
      const startVal = this.calculateTime(this.start);
      const endVal = this.calculateTime(this.end);
      const temp = parseInt(endVal - startVal);
      const duration = parseInt(this.duration);
      if (temp !== duration) {
        this.isProcessing = true;
        await window.ipc.invoke(IPC_HANDLERS.CAPTURE, {
          func: IPC_FUNCTIONS.UPDATE_VIDEO,
          data: {
            filePath: this.sessionItem.filePath,
            start: startVal,
            end: endVal,
          },
        });
        this.isProcessing = false;
      }
      if (needCallback) {
        this.$root.$emit("save-data", this.item);
      }
    },
    logDuration() {
      this.duration = this.$refs.videoPlayer.duration;
    },
    setEndTime(value) {
      this.end = value;
    },
    calculateTime(value) {
      const timeArr = value.split(":");
      const minutes = parseInt(timeArr[0]);
      const seconds = parseInt(timeArr[1]);
      const time = minutes * 60 + seconds;
      return time;
    },
  },
};
</script>
<style scoped>
.preview-wrapper {
  text-align: center;
  position: relative;
}
.preview-wrapper img {
  width: 100%;
  filter: brightness(0.5);
  z-index: 99;
}
.progress-bar {
  position: absolute;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 300px;
  z-index: 999;
}
.progress-bar .subtitle-2 {
  font-size: 14px;
  color: #d1d5db;
}
.v-progress-linear {
  border-radius: 12px;
  height: 10px;
  width: 100%;
}
.video-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}
.video-wrapper .video-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.video-wrapper .video-control .cut-duration {
  display: flex;
  column-gap: 5px;
}
.video-wrapper .video-control .cut-duration .start-time {
  width: 65px;
}
.video-wrapper .video-control .cut-duration .end-time {
  width: 65px;
}
.video-wrapper .video-control .cut-duration .divider {
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: #6b7280;
  padding-top: 20px;
}
.video-wrapper .video-control .cut-duration .duration-time {
  display: flex;
  align-items: center;
}

.video-wrapper .video-control .cut-duration .duration-time span {
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: #6b7280;
  padding-top: 20px;
}
</style>
