<template>
  <el-tooltip
    :disabled="disabled"
    placement="right"
  >
    <div slot="content">
      {{ code | findTJbyCode }}
    </div>
    <i
      v-if="!disabled"
      class="el-icon-suitcase-1"
    />
  </el-tooltip>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      require: true
    }
  }
}
</script>
