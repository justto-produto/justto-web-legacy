<template>
  <el-tooltip
    placement="top"
    manual
    popper-class="pre-mapped-alert"
    :value="true"
  >
    <p slot="content">
      Para as disputas que tiverem esse campo mapeado na planilha de importação,
      <br>
      o valor presente na planilha terá prioridade sobre este!
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
