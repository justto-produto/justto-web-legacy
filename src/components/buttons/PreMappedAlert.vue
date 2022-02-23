<template>
  <el-tooltip
    placement="top"
    popper-class="pre-mapped-alert"
  >
    <p slot="content">
      Caso essa informação esteja na planilha de importação,
      <br>
      prevalecerá a informação da planilha.
    </p>

    <i class="el-icon-warning el-input__icon" />
  </el-tooltip>
</template>

<script>
export default {
  name: 'PreMappedAlert'
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

i {
  color: $--color-warning;
}
</style>

<style lang="scss">
.pre-mapped-alert {
  p {
    text-align: center;
  }
}
</style>
