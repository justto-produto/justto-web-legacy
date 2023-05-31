<template>
  <el-descriptions
    :column="1"
    title="Descontos por importação"
  >
    <el-descriptions-item
      v-for="(discount, dIndex) in discounts"
      :key="`discount#${dIndex}`"
    >
      Acima de {{ discount.minVolume }} disputas importadas, desconta-se {{ discount.value | currency }}.
    </el-descriptions-item>

    <el-descriptions-item v-if="!haveDiscounts">
      Nenhum desconto cadastrado.
    </el-descriptions-item>

    <el-descriptions-item>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-edit"
        @click="$emit('click', $event)"
      >
        {{ haveDiscounts ? 'Editar' : 'Cadastrar' }}
      </el-button>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
export default {
  name: 'DiscountsDescription',

  props: {
    discounts: {
      type: Array,
      required: true
    }
  },

  computed: {
    haveDiscounts() {
      return this.discounts.length > 0
    }
  }
}
</script>

<style>
</style>
