<template>
  <div class="task-wrapper">
    <div class="subtitle-2 label-text">Checklist</div>
    <div class="list">
      <div class="one" v-for="task in tasks" :key="task.id">
        <input type="checkbox" v-model="task.checked" />
        <span class="content">
          {{ task.content }}{{ task.required ? "*" : "" }}
        </span>
      </div>
    </div>
    <div class="error1" v-if="showError">
      <div class="icon">
        <img
          :src="require('../assets/icon/error.svg')"
          width="16"
          height="16"
        />
      </div>
      <div class="content">
        <div class="title">{{ errorData.title }}</div>
        <div class="desc">{{ errorData.description }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "CheckTaskWrapper",
  props: {
    showError: {
      type: Boolean,
      default: () => false,
    },
    tasks: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      defaut: () => "pressession",
    },
  },
  computed: {
    errorData: function () {
      if (this.type === "preseesion") {
        return {
          title: "Required checkboxes",
          description:
            "You can't begin your session without checking all required(*) pre-session checkboxes.",
        };
      } else {
        return {
          title: "Required checkboxes",
          description:
            "You can't end your session without checking all required(*) post-session checkboxes.",
        };
      }
    },
  },
  data() {
    return {};
  },
};
</script>
<style scoped>
.task-wrapper {
  display: block;
  padding: 12px;
}
.task-wrapper .list {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  margin-top: 10px;
}
.task-wrapper .list > .one {
  display: flex;
  align-items: center;
  column-gap: 10px;
}
.task-wrapper .list > .one > input[type="checkbox"]:checked {
  accent-color: #7c3aed;
}
.task-wrapper .list > .one > content {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}
.error1 {
  background-color: #fef2f2 !important;
  padding: 10px;
  display: flex;
  column-gap: 10px;
  margin-top: 10px;
}
.error1 > .content > .title {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #991b1b;
}
.error1 > .content > .desc {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #b91c1c;
  margin-top: 5px;
}
</style>
