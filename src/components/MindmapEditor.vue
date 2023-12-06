<template>
  <div class="wrapper">
    <svg class="mindmap-svg" ref="mountPoint"></svg>
    <node-edit-dialog
      :config-item="config"
      v-model="nodeEditDialog"
      :title="title"
      @save="updateNode"
      @cancel="nodeEditDialog = false"
    />
  </div>
</template>

<script>
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  select,
  zoom,
  zoomIdentity,
} from "d3";

import {
  d3Connections,
  d3Nodes,
  d3Drag,
  d3PanZoom,
  onTick,
  d3NodeClick,
} from "../modules/mindmap/utils/d3";

import { getDimensions, getViewBox } from "../modules/mindmap/utils/dimensions";
import nodeToHTML from "../modules/mindmap/utils/nodeToHTML";
import uuidv4 from "uuid";
import "@fortawesome/fontawesome-free/css/all.min.css";
import NodeEditDialog from "./dialogs/NodeEditDialog.vue";

export default {
  name: "MindmapEditor",
  components: { NodeEditDialog },
  props: {
    configItem: {
      type: Object,
      default: () => {},
    },
    nodesData: {
      type: Array,
      default: () => [],
    },
    connectionsData: {
      type: Array,
      default: () => [],
    },
    edit: {
      type: Boolean,
      default: false,
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
    configItem: function (newValue) {
      this.config = newValue;
    },
    nodesData: function (newValue) {
      this.nodes = newValue;
    },
    connectionsData: function (newValue) {
      this.connections = newValue;
    },
    triggerSave: function (newValue) {
      if (newValue) {
        this.handleMindmap(true);
      }
    },
  },
  data() {
    return {
      config: this.configItem,
      simulation: null,
      nodes: this.nodesData,
      connections: this.connectionsData,
      editable: this.edit,
      nodeEditDialog: false,
      selected: null,
      event: "",
      title: "",
    };
  },
  created() {
    // Create force simulation to position nodes that have
    // no coordinate, and add it to the component state
    this.simulation = forceSimulation()
      .force(
        "link",
        forceLink().id((node) => node.text)
      )
      .force("charge", forceManyBody())
      .force("collide", forceCollide().radius(100));
  },
  mounted() {
    this.renderMap();
  },
  updated() {
    zoom().transform(select(this.$refs.mountPoint), zoomIdentity);

    this.renderMap();
  },
  methods: {
    prepareNodes() {
      const render = (node) => {
        node.uid = uuidv4();
        node.html = nodeToHTML(node);

        const dimensions = getDimensions(node.html, {}, "mindmap-node");
        node.width = dimensions.width;
        node.height = dimensions.height;
      };

      this.nodes.forEach((node) => render(node));
    },
    /**
     * Add new class to nodes, attach drag behevior,
     * and start simulation.
     */
    prepareEditor(svg, conns, nodes) {
      nodes
        .attr("class", "mindmap-node mindmap-node--editable")
        .attr("id", (d) => d.uid)
        .on("dbclick", (node) => {
          node.fx = null;
          node.fy = null;
        });

      nodes.call(d3Drag(this.simulation, svg, nodes));
      nodes.on("click", (d, i) => {
        this.nodeClickEvent(d3NodeClick(d, i), d);
      });
      // Tick the simulation 100 times
      for (let i = 0; i < 100; i += 1) {
        this.simulation.tick();
      }

      setTimeout(() => {
        this.simulation.alphaTarget(0.5).on("tick", () => onTick(conns, nodes));
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

      const svg = select(this.$refs.mountPoint);

      // Clear the SVG in case there's stuff already there.
      svg.selectAll("*").remove();

      this.prepareNodes();

      // Bind data to SVG elements and set all the properties to render them
      const connections = d3Connections(svg, this.connections);
      const { nodes } = d3Nodes(svg, this.nodes);

      nodes.append("title").text(() => this.$tc("caption.map_node"));

      // Bind nodes and connections to the simulation
      this.simulation.nodes(this.nodes).force("link").links(this.connections);

      if (this.editable) {
        this.prepareEditor(svg, connections, nodes);
      }

      // Tick the simulation 100 times
      for (let i = 0; i < 100; i += 1) {
        this.simulation.tick();
      }

      onTick(connections, nodes);

      svg
        .attr("viewBox", getViewBox(nodes.data()))
        .call(d3PanZoom(svg))
        .on("dbClick.zoom", null);
    },

    /**
     * node mouse click events
     */
    nodeClickEvent(event, node) {
      switch (event) {
        case "add":
          this.selected = node;
          this.event = "add";
          this.title = "";
          this.nodeEditDialog = true;
          break;
        case "edit":
          this.selected = node;
          this.event = "edit";
          this.title = this.selected.text;
          this.nodeEditDialog = true;
          break;
        case "remove":
          this.removeNode(node);
          break;
        case "click":
          this.clickNode(node);
          break;
      }
    },

    /**
     * * add new nodes
     */
    addNewNode(target, text) {
      const nodeId = uuidv4();
      this.nodes.push({
        id: nodeId,
        text: text,
        fx: target.fx,
        fy: target.fy + 200,
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
     * edit node text
     */
    editNode(target, text) {
      target.text = text;
      this.renderMap();
      if (this.autoSave) {
        this.handleMindmap();
      }
    },
    updateNode(text) {
      if (this.event === "add") {
        this.addNewNode(this.selected, text);
      } else {
        this.editNode(this.selected, text);
      }
      this.nodeEditDialog = false;
    },
    /**
     * remove a node
     * todo: before remove nodes check all link
     */
    removeNode(target) {
      this.nodes = this.nodes.filter((item) => item.id !== target.id);
      this.connections = this.connections.filter(
        (item) => item.source.id !== target.id && item.target.id !== target.id
      );
      this.renderMap();
      if (this.autoSave) {
        this.handleMindmap();
      }
    },

    /**
     * click on node text
     */
    clickNode() {},

    handleMindmap() {
      const svg = document.querySelector(`.mindmap-svg`);
      let serializer = new XMLSerializer();
      let serializedContent = serializer.serializeToString(svg);
      let base64Content = btoa(unescape(encodeURIComponent(serializedContent)));
      // TODO - Move to application/x-xmind format
      let imageUrl = "data:image/svg+xml;base64," + base64Content;
      const quality = 2;
      const image = new Image();

      image.onload = () => {
        // Create image canvas
        const canvas = document.createElement("canvas");
        // Set width and height based on SVG node
        const rect = svg.getBoundingClientRect();
        canvas.width = rect.width * quality;
        canvas.height = rect.height * quality;

        // Draw background
        const context = canvas.getContext("2d");
        context.fillStyle = "#FAFAFA";
        context.fillRect(0, 0, rect.width * quality, rect.height * quality);
        context.drawImage(
          image,
          0,
          0,
          rect.width * quality,
          rect.height * quality
        );

        let imgURI = canvas.toDataURL("image/png");
        this.$emit("submit-mindmap", {
          nodes: this.nodes,
          connections: this.connections,
          imgURI: imgURI,
        });
      };

      image.src = imageUrl;
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  overflow: hidden;
  max-height: 400px;
}
</style>
