<template>
  <el-form
    :inline="true"
    :model="value"
    size="mini"
    class="tariff-inline__form"
  >
    <el-row :gutter="8">
      <el-col :span="10">
        <el-form-item label="Franquia">
          <el-input-number
            v-model="value.volumeLimit"
            :disabled="contractInactive"
            :readonly="contractInactive"
            :class="{ 'is-inactive': contractInactive }"
            controls-position="right"
            type="number"
          />
        </el-form-item>
      </el-col>

      <el-col :span="10">
        <el-form-item label="Valor Adicional">
          <div class="el-input el-input--mini">
            <money
              v-model="value.value"
              :disabled="contractInactive"
              :readonly="contractInactive"
              :class="{ 'is-inactive': contractInactive }"
              class="el-input__inner"
            />
          </div>
        </el-form-item>
      </el-col>

      <el-col :span="4">
        <el-button
          type="danger"
          icon="el-icon-delete"
          class="mt20"
          plain
          @click="$emit('delete', value.type)"
        />
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    },

    contractInactive: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style lang="scss">
.tariff-inline__form {
  line-height: 0 !important;

  .el-row {
    line-height: 0 !important;

    .el-col {
      line-height: 0 !important;

      .el-form-item {
        margin: 0 !important;

        .el-form-item__content {
          line-height: 0 !important;
        }
      }
    }
  }
}
</style>
