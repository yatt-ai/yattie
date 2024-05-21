<template>
  <v-container>
    <div class="wrapper">
      <svg
        v-if="nodes.length"
        class="mindmap-wrapper-svg"
        ref="mindmapWrapper"
      ></svg>
      <div v-else class="center">
        {{ $tc("message.empty_workspace") }}
      </div>
      <div
        v-if="status !== 'pending' && status !== 'pause' && status !== 'end'"
      >
        <v-btn
          plain
          :style="{ color: currentTheme.secondary }"
          class="text-capitalize"
          @click="uploadEvidence"
        >
          {{ $tc("caption.upload_evidence", 1) }}
        </v-btn>
      </div>
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
  // event,
  zoom,
  zoomIdentity,
} from "d3";
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
  onNextTick,
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
import { createImageForWeb } from "@/helpers/WebHelpers";

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
        this.itemLists = structuredClone(this.items);
        let newMap = { ...this.emojiMenu };
        this.itemLists.map(async (item) => {
          newMap[`menu-${item.stepID}`] = false;
        });

        this.emojiMenu = newMap;
      },

      immediate: true,
    },
    nodes: {
      async handler() {
        this.nodesData = structuredClone(this.nodes);
        this.connectionsData = structuredClone(this.connections);
        await this.renderMap();
      },
    },
    connections: {
      async handler() {
        this.nodesData = structuredClone(this.nodes);
        this.connectionsData = structuredClone(this.connections);
        await this.renderMap();
      },
    },
    selectedNodes: {
      async handler() {
        this.$root.$emit("update-selected-nodes", this.selectedNodes);
      },
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
      isDragging: false,
      itemDragging: false,
      emojiMenu: {},
      selectedId: null,
      addEvidenceDialog: false,
      evidenceData: null,
      editEvidenceDialog: false,
      posterUrl: null,
      mindmapURL: null,
      clicks: 0,
      timer: null,
      simulation: null,
      clicked: [],
      editable: this.edit,
      selectedNodes: [],
      nodesData: [],
      connectionsData: [],
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
    this.nodesData = structuredClone(this.nodes);
    this.connectionsData = structuredClone(this.connections);
  },
  mounted() {
    this.$root.$on("render-mindmap", this.renderMindmap);
    this.$root.$on("handle-mindmap", this.handleMindmap);
    console.log("Mounted");
    this.emojiMenu = {};
    this.itemLists = structuredClone(this.items);
    let newMap = { ...this.emojiMenu };
    this.itemLists.map(async (item) => {
      newMap[`menu-${item.stepID}`] = false;
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
      // setTimeout(function () {
      this.handleActivateEditSession(id);
      // }, 200);
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
      if (this.$isElectron) {
        this.itemToEdit = await this.$storageService.getItemById(id);
      } else {
        const itemInStore = this.$store.state.session.items.find(
          (item) => item.stepID === id
        );
        this.itemToEdit = structuredClone(itemInStore);
      }
      this.editEvidenceDialog = true;
    },

    handleSelectedItem(id) {
      this.selectedId = id;
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
      const render = async (node) => {
        node.selected =
          this.selectedNodes.find((ele) => ele.id === node.id) !== undefined;
        node.connectClicked =
          this.clicked.find((ele) => ele.id === node.id) !== undefined;
        node.width = node.width ?? 200;
        node.height = node.height ?? 270;

        if (node.fileType === "audio/mp3") {
          if (!this.$isElectron) {
            let imageUrl = await this.generatePoster(node.filePath);
            let posterResult = createImageForWeb(imageUrl);
            node.poster = posterResult.item.filePath;
          }
        }
      };
      this.nodesData.forEach((node) => render(node));
    },
    /**
     * Add new class to nodes, attach drag behevior,
     * and start simulation.
     */

    updateNodes() {
      let updatedNodes, tempItems;
      updatedNodes = structuredClone(this.nodesData);
      tempItems = structuredClone(this.itemLists);
      for (let i = 0; i < tempItems.length; i++) {
        let node = updatedNodes.find((ele) => ele.id === tempItems[i].id);
        if (node) {
          tempItems[i].fx = node.fx;
          tempItems[i].fy = node.fy;
          tempItems[i].x = node.x;
          tempItems[i].y = node.y;
        }
      }
      this.$store.commit("setSessionItems", tempItems);
      this.$store.commit("setSessionNodes", updatedNodes);
    },

    updateConnections() {
      let updatedConnections = structuredClone(this.connectionsData);
      this.$store.commit("setSessionConnections", updatedConnections);
    },

    prepareEditor(svg, conns, nodes, labels) {
      nodes
        .attr("class", "mindmap-node mindmap-node--editable")
        .attr("id", (d) => d.id);
      let dragging = false;
      nodes.call(
        d3Drag(this.simulation, svg, nodes, true, dragging, this.updateNodes)
      );
      // Tick the simulation 100 times
      for (let i = 0; i < 100; i += 1) {
        this.simulation.tick();
      }

      setTimeout(() => {
        this.simulation
          .alphaTarget(0.5)
          .on("tick", () => onNextTick(conns, nodes, labels));
      }, 200);
    },

    renderMindmap() {
      this.selectedNodes = [];
      this.selectedNodes.push(this.nodesData[this.nodesData.length - 1]);
      setTimeout(() => {
        this.renderMap();
      }, 200);
    },
    /**
     * Render mind map unsing D3
     */
    async renderMap() {
      this.simulation = forceSimulation()
        .force(
          "link",
          forceLink().id((node) => node.id)
        )
        .force("charge", forceManyBody())
        .force("collide", forceCollide().radius(200));

      let svg = select(this.$refs.mindmapWrapper);
      svg.selectAll("*").remove();

      this.prepareNodes();

      // Bind data to SVG elements and set all the properties to render them
      const labels = d3Labels(svg, this.connectionsData);
      const connections = d3Connections(svg, this.connectionsData, labels);
      const nodes = d3Nodes(svg, this.nodesData);

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
                onEdit: (id) => self.handleItemClick(id),
                onSave: (content, status) => self.onSave(content, status),
                onRemove: () => self.removeNode(node),
                onConnect: () => self.connectNode(svg, node),
                onClick: (isAltKeyPressed) =>
                  self.clickNode(isAltKeyPressed, node),
                onTagsChanged: (newTags) => self.changeTags(newTags, node),
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
              // TODO: need a function to resize the node
              // const width = this.$el.offsetWidth;
              // const height = this.$el.offsetHeight;
              // node.width = width; // Store the computed size in your node's data
              // node.height = height; // Store the computed size in your node's data
              // container.attr("width", width).attr("height", height);
            });
          },
        });

        vueComponent.$mount();

        container.node().appendChild(vueComponent.$el);
      });
      d3Selection(svg, this.nodesData, this.onSelectedByDrag);
      // Bind nodes and connections to the simulation
      this.simulation
        .nodes(this.nodesData)
        .force("link")
        .links(this.connectionsData);

      if (this.editable) {
        this.prepareEditor(svg, connections, nodes, labels);
      }

      // Tick the simulation 100 times
      for (let i = 0; i < 100; i += 1) {
        this.simulation.tick();
      }

      this.simulation
        .alphaTarget(0.5)
        .on("tick", () => onNextTick(connections, nodes, labels));

      svg
        .attr("viewBox", getViewBox(nodes.data()))
        .call(d3PanZoom(svg))
        .on("dblclick.zoom", null);
      // this.$store.commit("setSessionNodes", [...this.nodes]);
      // this.$store.commit("setSessionConnections", [...this.connections]);
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
      this.clicked = [];
      this.renderMap();
    },
    /**
     * remove a node
     * todo: before remove nodes check all link
     */
    removeNode(node) {
      this.nodesData = this.nodesData.filter((item) => item.id !== node.id);
      this.connectionsData = this.connectionsData.filter(
        (item) => item.source.id !== node.id && item.target.id !== node.id
      );
      this.updateNodes();
      this.updateConnections();
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
      this.clicks++;
      if (this.clicks === 1) {
        var self = this;
        this.timer = setTimeout(function () {
          self.clicks = 0;
          self.renderMap();
        }, 300);
      } else {
        clearTimeout(this.timer);
        this.handleActivateEditSession(node.id);
        this.clicks = 0;
        this.renderMap();
      }
      if (isAltKeyPressed) {
        const index = this.selectedNodes.indexOf(node);
        if (index === -1) {
          this.selectedNodes.push(node);
        } else {
          this.selectedNodes.splice(index, 1);
        }
        this.renderMap();
      } else {
        // If Ctrl/Cmd is not pressed, clear the selection and select only the clicked node
        this.selectedNodes = [node];
      }
    },
    /**
     * Change the tages of node
     */
    changeTags(newTags, node) {
      node.tags = newTags;
      let tempItems = structuredClone(this.itemLists);
      tempItems.forEach((item) => {
        if (item.id === node.id) item.tags = newTags;
      });
      let updatedNodes = structuredClone(this.nodesData);
      updatedNodes.forEach((item) => {
        if (item.id === node.id) item.tags = newTags;
      });
      this.itemLists = tempItems;
      this.$store.commit("setSessionNodes", updatedNodes);
      this.saveData();

      this.renderMap();
    },

    /**
     * link on node
     */
    connectNode(svg, node) {
      this.clicked.push(node);
      if (this.clicked.length === 2) {
        // check if the previous connection exists
        const previousConnection = this.connectionsData.find(
          ({ source, target }) =>
            (source.id === this.clicked[0].id &&
              target.id === this.clicked[1].id) ||
            (source.id === this.clicked[1].id &&
              target.id === this.clicked[0].id)
        );
        if (!previousConnection) {
          this.connectionsData.push({
            source: this.clicked[0].id,
            target: this.clicked[1].id,
          });
        }
        this.clicked = [];
        this.updateConnections();
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
      this.mindmapURL = imageUrl;
      mainDom.remove();
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  /* height: 100vh; */
  /* background: linear-gradient(90deg, #1d8bdd 20%, #6d61b1 80%); */
  position: relative;
}

.center {
  margin-top: 10rem;
  align-items: center;
  justify-content: center;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
}
</style>
