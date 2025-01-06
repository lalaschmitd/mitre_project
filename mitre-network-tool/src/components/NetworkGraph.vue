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

    <!-- Tooltip -->
    <div id="tooltip" style="display: none;"></div>
  </div>
</template>

<script>
import cytoscape from "cytoscape";
import axios from "axios"; // Für API-Aufrufe zum Backend

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
      selectedNodesList: [],
      showPopup: false,
      selectedNodeAttributes: {},
      currentNode: null,
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

      // Tooltip-Events für Knoten
      this.cy.on("mouseover", "node", (event) => {
        const node = event.target;
        const tooltip = document.getElementById("tooltip");
        const { left, top } = this.cy.container().getBoundingClientRect();

        tooltip.style.left = `${event.renderedPosition.x + left}px`;
        tooltip.style.top = `${event.renderedPosition.y + top}px`;
        tooltip.innerHTML = `
          <strong>${node.data("attributes").name || "Kein Name"}</strong><br>
          ${node.data("attributes").description || "Keine Beschreibung"}
        `;
        tooltip.style.display = "block";
      });

      this.cy.on("mouseout", "node", () => {
        const tooltip = document.getElementById("tooltip");
        tooltip.style.display = "none";
      });

      this.cy.on("tap", "node", (event) => {
        const node = event.target;
        this.handleNodeClick(node);
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
    async addNode(position) {
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

      // API-Aufruf zum Backend, um Name und Beschreibung basierend auf dem Typ abzurufen
      let attributes = { name: "", description: "" };
      try {
        const response = await axios.post("http://localhost:3000/api/get-node-details", {
          nodeType: this.selectedNodeType,
        });
        if (response.data) {
          attributes = response.data;
          console.log("Erhaltene Attribute:", attributes); // Debugging
        }
      } catch (error) {
        console.error("Error fetching node details:", error);
      }

      const newNode = this.cy.add({
        group: "nodes",
        data: {
          id: id,
          label: label,
          type: this.selectedNodeType,
          attributes: attributes,
        },
        position: position,
      });
      console.log("Neuer Knoten hinzugefügt:", newNode.data());

      this.openPopup(newNode);
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
      } else if (this.selectedAction === "editLabel") {
        this.editNodeLabel(node);
      } else {
        this.openPopup(node);
      }
    },
    openPopup(node) {
      this.showPopup = true;
      this.currentNode = node;
      this.selectedNodeAttributes = { ...node.data("attributes") };
    },
    closePopup() {
      this.showPopup = false;
      this.selectedNodeAttributes = {};
      this.currentNode = null;
    },
    saveAttributes() {
      if (this.currentNode) {
        this.currentNode.data("attributes", { ...this.selectedNodeAttributes });
      }
      this.closePopup();
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
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
</style>
