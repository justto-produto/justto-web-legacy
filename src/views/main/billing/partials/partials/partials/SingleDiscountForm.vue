<!-- eslint-disable vue/no-mutating-props -->
<template>
  <el-form
    :inline="true"
    :model="value"
    size="mini"
    class="discount-inline__form"
  >
    <el-row :gutter="8">
      <el-col :span="10">
        <el-form-item label="Volume de importações">
          <el-input-number
            v-model="value.minVolume"
            :min="0"
            step-strictly
            controls-position="right"
          />
        </el-form-item>
      </el-col>

      <el-col :span="10">
        <el-form-item label="Valor do desconto">
          <div class="el-input el-input--mini">
            <money
              v-model="value.value"
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
          size="mini"
          @click="$emit('delete', value.type)"
        />
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: 'SingleDiscountForm',

  props: {
    value: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
.discount-inline__form {
  line-height: 0 !important;

  .el-row {
    line-height: 0 !important;

    .el-col {
      line-height: 0 !important;

      .el-form-item {
        margin: 0 !important;
        width: 100% !important;
        line-height: 0;

        .el-form-item__label {
          font-weight: normal !important;
          line-height: 1.5rem;
        }

        .el-form-item__content {
          line-height: 0 !important;

          .el-input-number {
            width: 100% !important;
          }
        }
      }
    }
  }
}
</style>
