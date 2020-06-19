<template>
  <div
    :style="{
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, auto)`,
      gap: toPixel(spacing),
    }"
    class="jus-grid"
  >
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'JusGrid',
  props: {
    rows: {
      type: Number,
      default: 1,
    },
    columns: {
      type: Number,
      default: 1,
    },
    spacing: {
      type: Number,
      default: 24,
    },
  },
  methods: {
    toPixel: num => `${num}px`,
  },
}
</script>

<style lang="scss" scoped>
.jus-grid {
  display: grid;
  width: 100%;
  grid-auto-flow: column;
}
</style>
