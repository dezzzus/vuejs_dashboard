<template>
  <div id="app">
    <app-header></app-header>
    <div class="container app-content">
      <router-view></router-view>
    </div>
  </div>

</template>

<script>
  import appHeader from "./components/AppHeader";
  export default {
    name: 'app',
    components: {
      appHeader
    },
    data () {
      return {
      }
    }
  }
</script>

<style lang="scss">
  html {
    position: relative;
    min-height: 100%;
  }
  body {
    /* Margin bottom by footer height */
    margin-bottom: 60px;
  }
  .app-content {
    padding: 60px 15px 0;
  }
</style>
