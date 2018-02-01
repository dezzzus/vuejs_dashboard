<template>
  <td v-if="status == 'sent'">
    <i class="fa fa-check fa-2x" aria-hidden="true"></i>
  </td>
  <td v-else-if="status == 'suggested'">
    <button type="button" class="btn btn-inline btn-secondary">Send</button>
  </td>
  <td v-else>
    <img src="../assets/loader.svg">
  </td>
</template>

<style lang="scss" scoped>
  td {
    border: none;
    font-size: 85%;
    text-align: center;
    padding: 0;
    i {
      color: #22b14c;
    }
    img {
      max-width: 35px;
    }
  }
  button {
    font-size: 85%;
    margin: 0;
    padding: 5px 3px;
    text-transform: uppercase;
  }
</style>

<script>
export default {
  name: 'story-option',
  props: ['status'],
  data () {
    return { }
  }
}
</script>