<template>
  <div class="wrapper">
    <svg class="mindmap-svg" ref="mountPoint"></svg>
    <div class="mindmap-btn-wrapper">
      <div
        class="mindmap-control-btn mx-1 cursor-pointer"
        onClick="alert('compass')"
      >
        <img
          :src="require('../assets/icon/compass.svg')"
          width="24"
          height="24"
        />
      </div>
      <div class="mindmap-control-btn mx-1 mt-4">
        <div class="zoom-control">
          <div class="cursor-pointer" onClick="alert('zoom in')">
            <img
              :src="require('../assets/icon/zoom-in.svg')"
              width="24"
              height="24"
            />
          </div>
          <div class="cursor-pointer" onClick="alert('zoom out')">
            <img
              :src="require('../assets/icon/zoom-out.svg')"
              width="24"
              height="24"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="mindmap-control-btn-wrapper">
      <div class="mindmap-control-btn control-btns mx-1 cursor-pointer">
        <div class="mx-2">
          <img
            :src="require('../assets/icon/edit.svg')"
            width="24"
            height="24"
          />
        </div>
        <div class="mx-2">
          <img
            :src="require('../assets/icon/rect.svg')"
            width="24"
            height="24"
          />
        </div>
        <div class="mx-2">
          <img
            :src="require('../assets/icon/link.svg')"
            width="24"
            height="24"
          />
        </div>
        <div class="mx-2">
          <img
            :src="require('../assets/icon/text.svg')"
            width="24"
            height="24"
          />
        </div>
        <div class="mx-2">
          <img
            :src="require('../assets/icon/upload.svg')"
            width="24"
            height="24"
          />
        </div>
      </div>
    </div>
  </div>
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
import NewNode from "./NewNode.vue";
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

export default {
  name: "MindmapEditor",
  props: {
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
      default: true,
    },
  },
  watch: {
    nodesData: function (newValue) {
      this.nodes = newValue;
    },
    connectionsData: function (newValue) {
      this.connections = newValue;
    },
  },
  data() {
    return {
      simulation: null,
      nodes: this.nodesData,
      connections: this.connectionsData,
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
    this.nodes = [...this.nodesData];
    this.connections = [...this.connectionsData];
    this.renderMap();
  },
  updated() {
    zoom().transform(select(this.$refs.mountPoint), zoomIdentity);

    this.renderMap();
  },
  methods: {
    prepareNodes() {
      const render = (node) => {
        node.selected =
          this.selectedNodes.find((ele) => ele.id === node.id) !== undefined;
        node.width = node.width ?? 150;
        node.height = node.height ?? 75;
        node.content = node.text ?? "";
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
     * Render mind map using D3
     */
    renderMap() {
      this.simulation = forceSimulation()
        .force(
          "link",
          forceLink().id((node) => node.id)
        )
        .force("charge", forceManyBody())
        .force("collide", forceCollide().radius(200));

      let svg = select(this.$refs.mountPoint).on("click", () => {
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
            h(NewNode, {
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
  },
};
</script>

<style scoped>
.wrapper {
  background-image: url("../assets/mindmap-workspace.png");
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  overflow: hidden;
  /* max-height: 400px; */
  position: relative;
}
.mindmap-btn-wrapper {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.mindmap-control-btn-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 10px;
  left: 10px;
}
.control-btns {
  display: flex !important;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.zoom-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
</style>
