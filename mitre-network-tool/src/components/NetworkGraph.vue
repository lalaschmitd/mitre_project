<template>
  <div>
    <div style="margin-bottom: 10px;">
      <select v-model="selectedNodeType">
        <option value="Router">Router</option>
        <option value="Switch">Switch</option>
        <option value="Access Point">Access Point</option>
        <option value="Computer">Computer</option>
        <option value="Smartphone">Smartphone</option>
        <option value="IoT Device">IoT Device</option>
        <option value="Printer">Printer</option>
        <option value="NAS">NAS</option>
        <option value="Modem">Modem</option>
        <option value="Internet">Internet</option>
      </select>
      <button @click="setAction('addNode')">Add Node</button>
      <button @click="setAction('addEdge')">Add Edge</button>
      <button @click="setAction('remove')">Remove</button>
      <button @click="setAction('editLabel')">Edit Label</button>
      <button @click="saveNetwork">Save Network</button>
      <input type="file" @change="loadNetwork" />
    </div>
    <div
      id="network-container"
      style="width: 100%; height: 500px; border: 1px solid #ccc;"
      @click="handleClick"
    ></div>
  </div>
</template>

<script>
import cytoscape from "cytoscape";

export default {
  data() {
    return {
      cy: null,
      selectedAction: null,
      selectedNodeType: "Router",
      nodeCounters: {
        Router: 1,
        Switch: 1,
        "Access Point": 1,
        Computer: 1,
        Smartphone: 1,
        "IoT Device": 1,
        Printer: 1,
        NAS: 1,
        Modem: 1,
        Internet: 1,
      },
      freeIds: {
        Router: [],
        Switch: [],
        "Access Point": [],
        Computer: [],
        Smartphone: [],
        "IoT Device": [],
        Printer: [],
        NAS: [],
        Modem: [],
        Internet: [],
      },
      selectedNodesList: [], // Initialisiert die Liste für ausgewählte Knoten
    };
  },
  mounted() {
    this.initCytoscape();
  },
  methods: {
    initCytoscape() {
      this.cy = cytoscape({
        container: document.getElementById("network-container"),
        elements: [],
        style: [
          {
            selector: "node",
            style: {
              "background-color": "#0074D9",
              label: "data(label)",
              "text-valign": "top",
              "text-halign": "center",
              "font-size": "12px",
              color: "#000000",
            },
          },
          {
            selector: "edge",
            style: {
              width: 2,
              "line-color": "#AAAAAA",
            },
          },
        ],
        layout: { name: "preset" },
      });

      this.cy.on("tap", "node", (event) => {
        const node = event.target;
        this.handleNodeClick(node);
        this.editNodeLabel(node);
      });

      this.cy.on("tap", "edge", (event) => {
        this.handleEdgeClick(event.target);
      });
    },
    setAction(action) {
      this.selectedAction = action;
    },
    handleClick(event) {
      if (this.selectedAction === "addNode") {
        const rect = this.cy.container().getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const zoom = this.cy.zoom();
        const pan = this.cy.pan();

        const graphX = (x - pan.x) / zoom;
        const graphY = (y - pan.y) / zoom;

        this.addNode({ x: graphX, y: graphY });
      }
    },
    addNode(position) {
      let id;
      const freeIdList = this.freeIds[this.selectedNodeType];

      if (freeIdList.length > 0) {
        id = freeIdList.pop();
      } else {
        const counter = this.nodeCounters[this.selectedNodeType];
        id = `${this.selectedNodeType.toLowerCase()}${counter}`;
        this.nodeCounters[this.selectedNodeType]++;
      }

      const label = `${this.selectedNodeType} ${id.match(/\d+/)[0]}`;

      this.cy.add({
        group: "nodes",
        data: {
          id: id,
          label: label,
          type: this.selectedNodeType,
        },
        position: position,
      });
    },
    handleNodeClick(node) {
      if (this.selectedAction === "addEdge") {
        this.selectedNodesList.push(node.id());
        if (this.selectedNodesList.length === 2) {
          this.addEdge(this.selectedNodesList[0], this.selectedNodesList[1]);
          this.selectedNodesList = [];
        }
      } else if (this.selectedAction === "remove") {
        const nodeType = node.data("type");
        const nodeId = node.data("id");
        if (nodeType) {
          this.freeIds[nodeType].push(nodeId);
        }
        node.remove();
      }
    },
    handleEdgeClick(edge) {
      if (this.selectedAction === "remove") {
        edge.remove();
      }
    },
    addEdge(sourceId, targetId) {
      this.cy.add({
        group: "edges",
        data: { source: sourceId, target: targetId },
      });
    },
    editNodeLabel(node) {
      if (this.selectedAction === "editLabel") {
        const newLabel = prompt("Enter new label for the node:", node.data("label"));
        if (newLabel !== null && newLabel.trim() !== "") {
          node.data("label", newLabel);
        }
      }
    },
    saveNetwork() {
      const networkData = this.cy.json();
      const blob = new Blob([JSON.stringify(networkData)], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "network.json";
      link.click();

      URL.revokeObjectURL(url);
    },
    loadNetwork(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const networkData = JSON.parse(e.target.result);
          this.cy.json(networkData);
          console.log("Network loaded successfully");
        } catch (error) {
          console.error("Error loading network:", error);
          alert("Invalid file format. Please upload a valid JSON file.");
        }
      };
      reader.readAsText(file);
    },
  },
};
</script>

<style scoped>
#network-container {
  cursor: pointer;
}
button,
select,
input {
  margin-right: 10px;
}
</style>
