<template>
  <article>
    <span class="classification">
      {{ value.name }}
      <div
        v-for="details in value.details"
        :key="details.id"
      >
        <i class="el-icon-right" />
        {{ details.name }}
      </div>
    </span>
  </article>
</template>

<script>
export default {
  name: 'InfoClassification',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
