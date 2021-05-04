<template>
  <el-tooltip
    :disabled="disabled"
    :placement="placement"
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
      require: true,
      default: () => '9999999-99.9999.9.99.9999'
    },
    placement: {
      type: String,
      default: () => 'right'
    }
  }
}
</script>
