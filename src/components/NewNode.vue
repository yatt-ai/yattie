<template>
  <div>
    <div
      v-if="
        node.shape === 'rectangle' || node.shape === 'ellipse' || !node.shape
      "
      class="node-wrapper"
      :class="{ selected: node.selected }"
      :style="{
        backgroundColor: node.color ? node.color : '#e2e7fe',
        minWidth: node.shape === 'rectangle' ? '200px' : '100px',
        borderRadius: node.shape === 'ellipse' ? '100%' : '12px',
      }"
      @click="handleClick"
      @contextmenu.prevent="showContextMenu($event, node)"
    >
      <div class="node-content">{{ node.content }}</div>
    </div>
    <div v-else>
      <svg width="100" height="100">
        <polygon
          v-if="node.shape === 'triangle'"
          points="50,0 100,100 0,100"
          class="node-wrapper"
          :class="{ selected: node.selected }"
          :style="{
            fill: node.color ? node.color : '#e2e7fe',
          }"
          @click="handleClick"
          @contextmenu.prevent="showContextMenu($event, node)"
        />

        <text
          v-if="node.shape === 'triangle'"
          x="50"
          y="75"
          text-anchor="middle"
          fill="black"
          font-size="13"
          font-weight="600"
        >
          {{ node.content }}
        </text>
        <polygon
          v-if="node.shape === 'downward-triangle'"
          class="node-wrapper"
          :class="{ selected: node.selected }"
          :style="{
            fill: node.color ? node.color : '#e2e7fe',
          }"
          @click="handleClick"
          @contextmenu.prevent="showContextMenu($event, node)"
          points="50,100 100,0 0,0"
        />
        <text
          v-if="node.shape === 'downward-triangle'"
          x="50"
          y="25"
          text-anchor="middle"
          fill="black"
          font-size="13"
          font-weight="600"
        >
          {{ node.content }}
        </text>
        <polygon
          v-if="node.shape === 'diamond'"
          class="node-wrapper"
          :class="{ selected: node.selected }"
          :style="{
            fill: node.color ? node.color : '#e2e7fe',
          }"
          @click="handleClick"
          @contextmenu.prevent="showContextMenu($event, node)"
          points="50,0 100,50 50,100 0,50"
        />
        <text
          v-if="node.shape === 'diamond'"
          x="50"
          y="50"
          text-anchor="middle"
          fill="black"
          font-size="13"
          font-weight="600"
        >
          {{ node.content }}
        </text>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewNode",
  props: {
    node: {
      type: Object,
      default: () => {},
    },
    editable: {
      type: Boolean,
      default: false,
    },
    onAdd: {
      type: Function,
    },
    onSave: {
      type: Function,
    },
    onRemove: {
      type: Function,
    },
    onClick: {
      type: Function,
    },
    onContextmenu: {
      type: Function,
    },
    onConnect: {
      type: Function,
    },
    onTagsChanged: {
      type: Function,
    },
    onAttach: {
      type: Function,
    },
  },
  data() {
    return {
      tag: "",
      tags: this.node.tags ?? [],
      attachments: this.node.attachments ?? [],
      // border colors map with status as key
      nodeEditDialog: false,
      content: "",
      status: "",
      shape: "rectangle",
      BorderColorByStatus: {
        Passed: "green",
        Failed: "red",
        "In Progress": "yellow",
      },
      targetRow: {},
    };
  },
  methods: {
    handleClickTagsInput(e) {
      e.stopPropagation();
    },
    handleTagsChanged(newTags) {
      this.tags = newTags;
      this.onTagsChanged(newTags);
    },
    handleAdd(e) {
      e.stopPropagation();
      this.content = "";
      this.status = "";
      this.nodeEditDialog = true;
    },
    handleSubmit(title, type) {
      if (this.content) this.onSave(title, type);
      else this.onAdd(title, type);
      this.nodeEditDialog = false;
    },
    handleRemove(e) {
      e.stopPropagation();
      this.onRemove();
    },
    handleConnect(e) {
      e.stopPropagation();
      this.onConnect();
    },
    handleClick(e) {
      e.stopPropagation();
      this.content = this.node.content;
      this.status = this.node.status;
      if (!e.altKey) this.nodeEditDialog = true;
      this.onClick(e.altKey, e.clientX, e.clientY);
    },
    handleContextMenu(e) {
      alert("Context menu");
      e.preventDefault();
      e.stopPropagation();
      this.onContextmenu();
    },
    handleFileUpload(e) {
      e.stopPropagation();
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      const fileType = file.type.split("/")[0];
      this.onAttach([...this.attachments, { type: fileType, url: imageUrl }]);
      console.log(this.attachments);
    },
    handleUpload(e) {
      e.stopPropagation();
    },
    updateNode() {
      alert("Update");
    },
    showContextMenu(event, node) {
      event.preventDefault();
      this.showMenu = true;
      this.targetRow = node;
      this.onContextmenu(event.clientX, event.clientY);
    },

    closeContextMenu() {
      this.showMenu = false;
    },
  },
};
</script>

<style>
.node-wrapper {
  cursor: pointer;
  border: 1px solid #d0d5dd;
  stroke: #d0d5dd;
  border-radius: 12px;
  min-width: 100px;
  min-height: 100px;
  padding: 8px;
  transition: background-color 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}

.node-wrapper:hover {
  background-color: #c5ebdc;
}

.selected {
  background: #b2b7ee !important;
  fill: #b2b7ee !important;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.node-content {
  font-size: 13px;
  font-weight: 600;
  align-items: center;
  text-align: center;
}

.node-attachments {
  display: flex;
  flex-wrap: wrap;
}

.node-attachments img {
  width: 24px;
  height: 24px;
  border-radius: 2px;
  gap: 2px;
}

.vue-tags-input {
  background-color: #dce5eb !important;
}

.ti-input {
  border: unset !important;
  padding: 0 !important;
}

.ti-tags {
  padding: 0 !important;
}

.ti-tags li {
  padding: 2px 4px !important;
}

i {
  font-size: 10px; /* You can adjust the size as per your requirement */
}
</style>
