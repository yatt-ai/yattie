<template>
  <v-container class="wrapper">
    <div class="title">{{ $tc("caption.session_checklist", 1) }}</div>
    <p class="mt-2 mb-4">
      {{ $t("message.use_pre_post_test_checklist") }}
    </p>
    <div class="tab-bar">
      <v-tabs :height="26" hide-slider>
        <v-tab @click="tab = 'pre'" class="text-capitalize">
          {{ $tc("caption.pre_session", 1) }}
        </v-tab>
        <v-tab @click="tab = 'post'" class="text-capitalize">
          {{ $tc("caption.post_session", 1) }}
        </v-tab>
      </v-tabs>
    </div>
    <v-tabs-items v-model="tab">
      <v-tab-item class="presession-wrapper" value="pre" :transition="false">
        <div class="status">
          <v-switch
            v-model="presessionStatus"
            inset
            hide-details
            dense
            class="mt-0 pt-0"
            @change="handleStatus"
          />
          <label>{{ $tc("caption.enable_checklist", 1) }}</label>
        </div>
        <div class="content">
          <div class="overlay" v-show="!presessionStatus">&nbsp;</div>
          <div class="check-list">
            <div class="one" v-for="task in preTaskList" :key="task.id">
              <div class="input-box">
                <input
                  type="text"
                  placeholer="Add Task"
                  v-model="task.content"
                />
                <div class="check-box">
                  <input
                    type="checkbox"
                    class="item-select"
                    v-model="task.required"
                  />
                  <span class="label">{{ $tc("caption.required", 1) }}</span>
                </div>
              </div>
              <div class="func-box">
                <v-icon @click="deleteTask(task.id)">mdi-delete</v-icon>
              </div>
            </div>
          </div>
          <div class="footer">
            <button class="link" @click="addTask">
              {{ $tc("caption.add_another_task", 1) }}
            </button>
          </div>
        </div>
      </v-tab-item>
      <v-tab-item class="postsession-wrapper" value="post" :transition="false">
        <div class="status">
          <v-switch
            v-model="postsessionStatus"
            inset
            hide-details
            dense
            class="mt-0 pt-0"
            @change="handleStatus"
          />
          <label>{{ $tc("caption.enable_checklist", 1) }}</label>
        </div>
        <div class="content">
          <div class="overlay" v-show="!postsessionStatus">&nbsp;</div>
          <div class="check-list">
            <div
              class="one"
              v-for="(task, index) in postTaskList"
              :key="task.id"
            >
              <div class="input-box">
                <input
                  type="text"
                  placeholer="Add Task"
                  v-model="task.content"
                />
                <div class="check-box">
                  <input
                    type="checkbox"
                    class="item-select"
                    v-model="task.required"
                  />
                  <span class="label">{{ $tc("caption.required", 1) }}</span>
                </div>
              </div>
              <div
                class="func-box"
                v-if="
                  (index === 0 && task.content !== '') ||
                  postTaskList.length > 1
                "
              >
                <v-icon @click="deleteTask(task.id)">mdi-delete</v-icon>
              </div>
            </div>
          </div>
          <div class="footer">
            <button class="link" @click="addTask">
              {{ $tc("caption.add_another_task", 1) }}
            </button>
          </div>
        </div>
      </v-tab-item>
    </v-tabs-items>
    <!-- <div class="footer">
      <v-btn color="primary white__text text-capitalize" block>
        {{ $tc("caption.end_session", 1) }}
      </v-btn>
    </div> -->
  </v-container>
</template>
<script>
export default {
  name: "ConfigCheckListTab",
  components: {},
  props: {
    config: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    preTaskList: {
      handler: function () {
        this.updateData("presession", {
          status: this.presessionStatus,
          tasks: this.preTaskList.filter((task) => task.content !== ""),
        });
      },
      deep: true,
    },
    postTaskList: {
      handler: function () {
        this.updateData("postsession", {
          status: this.postsessionStatus,
          tasks: this.postTaskList.filter((task) => task.content !== ""),
        });
      },
      deep: true,
    },
  },
  beforeMount() {
    this.fetchData();
  },
  data() {
    return {
      preTaskList: [],
      postTaskList: [],
      presessionStatus: false,
      postsessionStatus: false,
      tab: "pre",
    };
  },
  computed: {},
  methods: {
    fetchData: function () {
      this.preTaskList = this.config.checklist.presession.tasks;
      this.postTaskList = this.config.checklist.postsession.tasks;

      if (this.preTaskList.length === 0) {
        this.preTaskList.push({
          id: new Date().getTime(),
          content: "",
          required: false,
        });
      }

      if (this.postTaskList.length === 0) {
        this.postTaskList.push({
          id: new Date().getTime(),
          content: "",
          required: false,
        });
      }

      this.presessionStatus = this.config.checklist.presession.status;
      this.postsessionStatus = this.config.checklist.postsession.status;
    },
    addTask: function () {
      if (this.tab === "pre") {
        this.preTaskList.push({
          id: new Date().getTime(),
          content: "",
          required: false,
        });
      } else {
        this.postTaskList.push({
          id: new Date().getTime(),
          content: "",
          required: false,
        });
      }
    },
    deleteTask: function (taskId) {
      if (this.tab === "pre") {
        this.preTaskList = this.preTaskList.filter(
          (task) => task.id !== taskId
        );

        this.preTaskList.push({
          id: new Date().getTime(),
          content: "",
          required: false,
        });
      } else {
        this.postTaskList = this.postTaskList.filter(
          (task) => task.id !== taskId
        );

        this.postTaskList.push({
          id: new Date().getTime(),
          content: "",
          required: false,
        });
      }
    },
    updateData: function (key, data) {
      if (!window.ipc) return;

      const config = {
        ...this.config,
        checklist: {
          ...this.config.checklist,
          [key]: data,
        },
      };

      this.$emit("submit-config", config);
    },
    handleStatus: function () {
      if (this.tab === "pre") {
        this.updateData("presession", {
          status: this.presessionStatus,
          tasks: this.preTaskList,
        });
      } else {
        this.updateData("postsession", {
          status: this.postsessionStatus,
          tasks: this.postTaskList,
        });
      }
    },
  },
};
</script>
<style scoped>
.wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
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
.check-list {
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  max-height: calc(100vh - 210px);
  overflow-y: auto;
  row-gap: 10px;
  padding: 0 20px 0 0;
}
.check-list > .one {
  display: flex;
  justify-content: space-between;
  column-gap: 10px;
}
.check-list > .one > .input-box {
  display: flex;
  border: 0;
  column-gap: 10px;
  width: 400px;
}
.check-list > .one > .input-box > input {
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
.theme--dark .check-list > .one > .input-box > input[type="text"] {
  background-color: #6b7280;
  border: 0;
  color: white;
}
.check-list > .one > .input-box > .check-box {
  display: flex;
  column-gap: 10px;
  align-items: center;
}
.check-list > .one > .input-box > .check-box > .label {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #6b7280;
}
.check-list > .one > .func-box {
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
</style>
