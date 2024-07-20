<template>
  <div>
    <div
      class="node-wrapper"
      :class="{ selected: node.selected }"
      style="border: 1px solid #d0d5dd"
      @click="handleClick"
    >
      <div class="node-content">{{ node.content }}</div>
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
      BorderColorByStatus: {
        Passed: "green",
        Failed: "red",
        "In Progress": "yellow",
      },
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
      this.onClick(e.altKey);
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
  },
};
</script>

<style>
.node-wrapper {
  cursor: pointer;
  background-color: #e2e7fe;
  border-radius: 12px;
  min-width: 150px;
  min-height: 75px;
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
  background: #3df1e7 !important;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.node-content {
  font-size: 15px;
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
