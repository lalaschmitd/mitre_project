<template>
  <div id="app">
    <h1>MITRE Network Tool</h1>
    <NetworkGraph />
  </div>
</template>

<script>
import NetworkGraph from "./components/NetworkGraph.vue";

export default {
  name: "App",
  components: {
    NetworkGraph,
  },
};
</script>