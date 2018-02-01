<template>
<section class="card">
  <section class="widget widget-simple-sm story_refresh">
    <div class="heading">Searching New Content</div>
    <div class="time">
      <i class="fa fa-refresh" aria-hidden="true" :class="{ 'fa-spin': spin }"></i> <span>{{ counter }}s</span>
    </div>
    <button type="button" class="btn btn-rounded btn-inline btn-primary-outline" @click='refresh()'>Refresh</button>
  </section>
</section>
</template>

<style lang="scss" scoped>
  .story_refresh {
    margin: 0;
    color: #919fa9;
    padding: 10px;
    .heading {
      margin-top: 110px;
    }
    .time {
      font-size: 1.3em;
      margin: 70px 0;
    }
    button {
      margin-bottom: 73px;
    }
  }
</style>

<script>
export default {
  name: 'story-refresh',
  props: ['counter', 'spin'],
  data () {
    return { }
  },
  methods: {
    refresh () {
      this.$emit('refreshStories')
    }
  }
}
</script>