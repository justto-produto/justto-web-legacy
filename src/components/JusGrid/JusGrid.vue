<template>
  <div
    :style="{
      gridAutoFlow: flow,
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridTemplateRows: `repeat(${rowsCount}, auto)`,
      gap: toPixel(spacing),
    }"
    class="jus-grid"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'JusGrid',
  props: {
    flow: {
      type: String,
      default: null,
      validator: val => ['column', 'row'].includes(val)
    },
    rows: {
      type: Number,
      default: null
    },
    columns: {
      type: Number,
      default: 1
    },
    spacing: {
      type: Number,
      default: 24
    }
  },
  computed: {
    rowsCount() {
      return this.rows || 'auto-fit'
    }
  },
  methods: {
    toPixel: num => `${num}px`
  }
}
</script>

<style lang="scss" scoped>
.jus-grid {
  display: grid;
  width: 100%;
}
</style>
