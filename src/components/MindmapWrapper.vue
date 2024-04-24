<template>
  <v-container>
    <div class="wrapper">
      <svg class="mindmap-wrapper-svg" ref="mindmapWrapper"></svg>
    </div>
    <AddEvidenceDialog
      v-if="evidenceData"
      v-model="addEvidenceDialog"
      :item-data="evidenceData"
      @close="
        addEvidenceDialog = false;
        evidenceData = null;
      "
    />
    <EditEvidenceDialog
      v-if="itemToEdit"
      v-model="editEvidenceDialog"
      :item-data="itemToEdit"
      @close="
        editEvidenceDialog = false;
        itemToEdit = null;
      "
    />
  </v-container>
</template>

<script>
import Vue from "vue";
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  select,
  event,
  zoom,
  zoomIdentity,
} from "d3";
import { v4 as uuidv4 } from "uuid";
import NewNodeComponent from "./NewNodeComponent.vue";
import "@fortawesome/fontawesome-free/css/all.min.css";
import vuetify from "@/plugins/vuetify";
import i18n from "@/i18n";
import store from "@/store";

// mindmap import
import {
  d3Labels,
  d3Connections,
  d3Nodes,
  d3Drag,
  d3PanZoom,
  onTick,
  d3Connector,
  d3Selection,
} from "../modules/mindmap/utils/d3";
import { getViewBox } from "../modules/mindmap/utils/dimensions";
import "../modules/mindmap/sass/mindmap.sass";
import domtoimage from "dom-to-image-more";
import dayjs from "dayjs";
import { STATUSES, TEXT_TYPES, FILE_TYPES } from "@/modules/constants";
import AddEvidenceDialog from "@/components/dialogs/AddEvidenceDialog.vue";
import EditEvidenceDialog from "@/components/dialogs/EditEvidenceDialog.vue";
import WaveSurfer from "wavesurfer.js";
import { mapGetters } from "vuex";

export default {
  name: "MindmapWrapper",
  components: {
    EditEvidenceDialog,
    AddEvidenceDialog,
  },
  props: {
    edit: {
      type: Boolean,
      default: true,
    },
    triggerSave: {
      type: Boolean,
      default: () => false,
    },
    autoSave: {
      type: Boolean,
      default: () => true,
    },
  },
  watch: {
    items: {
      async handler() {
        this.itemLists = this.items;
        let newMap = { ...this.emojiMenu };
        this.itemLists.map(async (item) => {
          let temp = structuredClone(item);
          newMap[`menu-${temp.stepID}`] = false;
          if (this.getType(temp.fileType) === "mindmap")
            temp.data = await this.$storageService.getItemById(temp.stepID);
          return temp;
        });

        this.emojiMenu = newMap;

        if (!this.$isElectron) {
          for (let item of this.itemLists) {
            if (item.fileType === "audio/mp3") {
              item.poster = await this.generatePoster(item.filePath);
            }
          }
        }
      },
      immediate: true,
    },
    nodes: {
      async handler() {
        this.renderMap();
      },
    },
    selectedItems: function (newValue) {
      this.selected = newValue;
    },
    eventType: function (newValue) {
      this.eventName = newValue;
    },
    triggerSave: function (newValue) {
      if (newValue) {
        this.handleMindmap(true);
      }
    },
  },
  data() {
    return {
      itemLists: [],
      selected: [],
      activeSession: {},
      itemToEdit: null,
      tags: "",
      eventName: this.eventType,
      textTypes: TEXT_TYPES,
      clicks: 0,
      isDragging: false,
      itemDragging: false,
      emojiMenu: {},
      selectedId: null,
      addEvidenceDialog: false,
      evidenceData: null,
      editEvidenceDialog: false,
      posterUrl: null,

      simulation: null,
      clicked: [],
      editable: this.edit,
      selectedNodes: [],
      title: "",
    };
  },
  created() {
    // Create force simulation to position nodes that have
    // no coordinate, and add it to the component state
    this.simulation = forceSimulation()
      .force(
        "link",
        forceLink().id((node) => node.id)
      )
      .force("charge", forceManyBody())
      .force("collide", forceCollide().radius(100));
  },
  mounted() {
    this.emojiMenu = {};
    this.itemLists.map(async (item) => {
      let temp = structuredClone(item);
      this.emojiMenu[`menu-${temp.stepID}`] = false;
      if (this.getType(temp.fileType) === "mindmap")
        temp.data = await this.$storageService.getItemById(temp.stepID);
      return temp;
    });
    this.renderMap();
  },
  updated() {
    zoom().transform(select(this.$refs.mindmapWrapper), zoomIdentity);

    this.renderMap();
  },
  computed: {
    ...mapGetters({
      items: "sessionItems",
      nodes: "sessionNodes",
      connections: "sessionConnections",
    }),
    status() {
      return this.$store.state.session.status;
    },
    current() {
      return dayjs().format("MM-DD-YYYY");
    },
    currentTheme() {
      if (this.$vuetify.theme.dark) {
        return this.$vuetify.theme.themes.dark;
      } else {
        return this.$vuetify.theme.themes.light;
      }
    },
  },
  methods: {
    getType(type) {
      return FILE_TYPES[type];
    },
    formatTime(timeInSeconds) {
      const seconds = ("0" + (timeInSeconds % 60)).slice(-2);
      const minutes = ("0" + (parseInt(timeInSeconds / 60, 10) % 60)).slice(-2);
      const hours = ("0" + (parseInt(timeInSeconds / 3600, 10) % 24)).slice(-2);

      return hours + ":" + minutes + ":" + seconds;
    },
    async uploadEvidence() {
      // todo add relative handler for web app
      if (this.$isElectron) {
        const { status, message, item } =
          await this.$electronService.uploadEvidence();

        if (status === STATUSES.ERROR) {
          this.$root.$emit("set-snackbar", message);
        } else {
          const data = {
            ...item,
            timer_mark: this.$store.state.session.timer,
          };
          this.evidenceData = data;
          this.addEvidenceDialog = true;
        }
      }
    },

    checkedItem(id) {
      return this.selected.includes(id);
    },
    handleSelected($event, id) {
      if ($event.target.checked && !this.selected.includes(id)) {
        this.selected.push(id);
      } else {
        this.selected = this.selected.filter((n) => n != id);
      }
      this.$root.$emit("update-selected", this.selected);
    },
    handleChange() {
      this.saveData();
    },
    handleItemClick(id) {
      this.clicks++;
      if (this.clicks === 1) {
        setTimeout(
          function () {
            switch (this.clicks) {
              case 1:
                if (this.eventName === "click") {
                  this.handleActivateEditSession(id);
                }
                break;
              default:
                if (this.eventName === "dblclick") {
                  this.handleActivateEditSession(id);
                }
            }
            this.clicks = 0;
          }.bind(this),
          200
        );
      }
    },
    handleFollowUp($event, id) {
      this.itemLists = this.itemLists.map((item) => {
        let temp = structuredClone(item);
        if (temp.stepID === id) {
          temp.followUp = $event.target.checked;
        }
        return temp;
      });
      this.saveData();
    },
    async handleActivateEditSession(id) {
      this.itemToEdit = await this.$storageService.getItemById(id);
      this.editEvidenceDialog = true;
    },

    handleSelectedItem(id) {
      this.selectedId = id;
    },
    selectEmoji(emoji) {
      this.emojiMenu[`menu-${this.selectedId}`] = false;

      this.itemLists = this.itemLists.map((item) => {
        let temp = structuredClone(item);
        if (temp.stepID === this.selectedId) {
          if (temp.emoji.filter((item) => item.data === emoji.data).length) {
            temp.emoji = temp.emoji.filter((item) => item.data !== emoji.data);
          } else {
            temp.emoji.push(emoji);
          }
        }
        return temp;
      });
      this.saveData();
    },
    removeEmoji(id, emoji) {
      this.itemLists = this.itemLists.map((item) => {
        let temp = structuredClone(item);
        if (temp.stepID === id) {
          temp.emoji = temp.emoji.filter((item) => item.data !== emoji.data);
        }
        return temp;
      });
      this.saveData();
    },
    async saveData() {
      await this.$store.commit("setSessionItems", this.itemLists);
    },
    generatePoster(audioFilePath) {
      return new Promise((resolve, reject) => {
        const waveSurfer = WaveSurfer.create({
          container: document.createElement("div"),
          waveColor: "#6B7280",
          progressColor: "hsla(200, 100%, 30%, 0.5)",
          cursorColor: "#000",
          barWidth: 3,
        });

        waveSurfer.load(audioFilePath);

        waveSurfer.on("ready", () => {
          const peaks = waveSurfer.backend.getPeaks(512);
          if (!peaks) {
            reject("No peaks data available.");
            waveSurfer.destroy();
            return;
          }

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = 512;
          canvas.height = 128;

          context.fillStyle = "#8e8e8e";
          peaks.forEach((peak, index) => {
            const h = peak * canvas.height;
            context.fillRect(index, canvas.height / 2 - h / 2, 1, h);
          });

          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);

          waveSurfer.destroy();
        });

        waveSurfer.on("error", (error) => {
          console.error("Error with WaveSurfer:", error);
          reject(error);
        });
      });
    },
    generateMindmapData() {
      this.itemLists.map((item) => {
        let node = { ...item, id: item.stepID };
        this.nodes.push(node);
      });

      // const map = new Map();
      // this.nodes.forEach((item) => {
      //   map.set(item, item.stepID);
      // });
      // this.itemLists.forEach((item) => {
      //   if (map.has(item.stepID)) map.delete(item.stepID);
      //   else map.set(item.stepID, item);
      // });
      // const differences = Array.from(map.values());
      // differences.forEach((item) => {
      //   if(this.nodes.contains(item))
      // })
    },

    prepareNodes() {
      const render = (node) => {
        node.selected =
          this.selectedNodes.find((ele) => ele.id === node.id) !== undefined;
        node.width = node.width ?? 220;
        node.height = node.height ?? 110;
        // node.id = uuidv4();
        // const html = nodeToHTML(node);

        // const dimensions = getDimensions(html, {}, "mindmap-node");
        // node.width = dimensions.width;
        // node.height = dimensions.height;
      };

      this.nodes.forEach((node) => render(node));
    },
    /**
     * Add new class to nodes, attach drag behevior,
     * and start simulation.
     */
    prepareEditor(svg, conns, nodes, labels) {
      nodes
        .attr("class", "mindmap-node mindmap-node--editable")
        .attr("id", (d) => d.id);

      nodes.call(d3Drag(this.simulation, svg, nodes));
      // Tick the simulation 100 times
      for (let i = 0; i < 100; i += 1) {
        this.simulation.tick();
      }

      setTimeout(() => {
        this.simulation
          .alphaTarget(0.5)
          .on("tick", () => onTick(conns, nodes, labels));
      }, 200);
    },
    /**
     * Render mind map unsing D3
     */
    renderMap() {
      this.simulation = forceSimulation()
        .force(
          "link",
          forceLink().id((node) => node.id)
        )
        .force("charge", forceManyBody())
        .force("collide", forceCollide().radius(200));

      let svg = select(this.$refs.mindmapWrapper).on("click", () => {
        // Check if the left mouse button is clicked
        event.preventDefault();
        this.selectedNodes = [];
        this.renderMap();
      });
      svg.selectAll("*").remove();

      this.prepareNodes();
      // Bind data to SVG elements and set all the properties to render them
      const labels = d3Labels(svg, this.connections);
      const connections = d3Connections(svg, this.connections, labels);
      const nodes = d3Nodes(svg, this.nodes);
      // Bind vue component to the node
      const self = this;
      nodes.each(function (node) {
        const container = select(this);
        const vueComponent = new Vue({
          vuetify,
          i18n,
          store,
          render: (h) =>
            h(NewNodeComponent, {
              props: {
                node,
                editable: self.editable,
                onAdd: (content, status) =>
                  self.addNewNode(node, content, status),
                onSave: (content, status) => self.onSave(content, status),
                onRemove: () => self.removeNode(node),
                onConnect: () => self.connectNode(svg, node),
                onClick: (isAltKeyPressed) =>
                  self.clickNode(isAltKeyPressed, node),
                onTagsChanged: (newTags) => {
                  node.tags = newTags;
                },
                onAttach: (files) => {
                  node.attachments = files;
                },
              },
              vuetify,
              i18n,
              store,
            }),
          mounted() {
            this.$nextTick(() => {
              const width = this.$el.offsetWidth;
              const height = this.$el.offsetHeight;
              node.width = width; // Store the computed size in your node's data
              node.height = height; // Store the computed size in your node's data
              container.attr("width", width).attr("height", height);
            });
            // TODO: need a function to resize the node
          },
        });

        vueComponent.$mount();

        container.node().appendChild(vueComponent.$el);
      });
      d3Selection(svg, this.nodes, this.onSelectedByDrag);
      // Bind nodes and connections to the simulation
      this.simulation.nodes(this.nodes).force("link").links(this.connections);

      if (this.editable) {
        this.prepareEditor(svg, connections, nodes, labels);
      }

      // Tick the simulation 100 times
      for (let i = 0; i < 100; i += 1) {
        this.simulation.tick();
      }

      this.simulation
        .alphaTarget(0.5)
        .on("tick", () => onTick(connections, nodes, labels));

      svg
        .attr("viewBox", getViewBox(nodes.data()))
        .call(d3PanZoom(svg))
        .on("dbClick.zoom", null);
    },

    onSave(content, status) {
      this.selectedNodes.forEach((node) => {
        if (content) {
          node.content = content;
        }
        if (status) {
          node.status = status;
        }
      });
    },

    onSelectedByDrag(selectedNodes) {
      this.selectedNodes = [...selectedNodes];
      this.renderMap();
    },
    /**
     * * add new nodes
     */
    addNewNode(target, content, status) {
      const nodeId = uuidv4();
      let random_offset;
      do {
        random_offset = Math.floor(Math.random() * 400) - 200;
      } while (random_offset >= -100 && random_offset <= 100);
      this.nodes.push({
        id: nodeId,
        content: content,
        status: status,
        fx: target.fx + random_offset,
        fy: target.fy + random_offset,
      });
      this.connections.push({
        source: target.id,
        target: nodeId,
      });
      this.renderMap();
      if (this.autoSave) {
        this.handleMindmap();
      }
    },
    /**
     * remove a node
     * todo: before remove nodes check all link
     */
    removeNode(node) {
      this.nodes = this.nodes.filter((item) => item.id !== node.id);
      this.connections = this.connections.filter(
        (item) => item.source.id !== node.id && item.target.id !== node.id
      );
      this.renderMap();
      if (this.autoSave) {
        this.handleMindmap();
      }
    },

    /**
     * click on node
     */
    clickNode(isAltKeyPressed, node) {
      // Toggle the selection of the clicked node
      if (isAltKeyPressed) {
        const index = this.selectedNodes.indexOf(node);
        if (index === -1) {
          this.selectedNodes.push(node);
        } else {
          this.selectedNodes.splice(index, 1);
        }
      } else {
        // If Ctrl/Cmd is not pressed, clear the selection and select only the clicked node
        this.selectedNodes = [node];
      }
      this.renderMap();
    },

    /**
     * link on node
     */
    connectNode(svg, node) {
      this.clicked.push(node);

      if (this.clicked.length === 2) {
        // check if the previous connection exists
        const previousConnection = this.connections.find(
          ({ source, target }) =>
            (source.id === this.clicked[0].id &&
              target.id === this.clicked[1].id) ||
            (source.id === this.clicked[1].id &&
              target.id === this.clicked[0].id)
        );
        if (!previousConnection) {
          this.connections.push({
            source: this.clicked[0].id,
            target: this.clicked[1].id,
          });
        }
        this.clicked = [];
      }
      this.renderMap();
      d3Connector(svg, this.clicked[0]);
    },

    async handleMindmap() {
      var svgElement = document.querySelector(`.mindmap-wrapper-svg`);
      var mainDom = document.createElement("div");
      // var importedNode = document.importNode(svgElement.cloneNode(true), true);
      mainDom.append(svgElement.cloneNode(true));
      document.getElementsByTagName("BODY")[0].append(mainDom);
      const quality = 2;
      const rect = svgElement.getBoundingClientRect();
      const imageUrl = await domtoimage.toPng(mainDom, {
        bgcolor: "#FAFAFA",
        height: rect.height * quality,
        width: rect.width * quality,
      });
      let new_nodes = structuredClone(this.nodes);
      let new_connections = structuredClone(this.connections);

      this.$emit("submit-mindmap", {
        nodes: new_nodes,
        connections: new_connections,
        imgURI: imageUrl,
      });
      mainDom.remove();
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  /* justify-content: center; */
  overflow: hidden;
  width: 100%;
  /* height: 100vh; */
  /* background: linear-gradient(90deg, #1d8bdd 20%, #6d61b1 80%); */
  position: relative;
}
</style>
