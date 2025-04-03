<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style lang="scss">
.resize-table-th {
  position: relative;

  .table-draggable-handle {
    height: 100% !important;
    bottom: 0;
    position: absolute;
    left: auto !important;
    transform: none !important;
    right: -5px;
    z-index: 1000 !important;
    cursor: col-resize;
    touch-action: none;
  }

  .vdr {
    border: none !important;
  }
}
</style>
