<template>
  <el-descriptions
    title="Valores por volume"
    :column="1"
  >
    <el-descriptions-item
      v-for="(tariff, tIndex) in tariffs"
      :key="`tariff#${tIndex}`"
      :label="vomumetryTariffTypes[tariff.type].label"
    >
      {{ tariff.value | currency }}
    </el-descriptions-item>

    <el-descriptions-item v-if="!haveTariffs">
      Nenhuma tarifa cadastrada
    </el-descriptions-item>

    <el-descriptions-item>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-edit"
        @click="$emit('click', $event)"
      >
        {{ haveTariffs ? "Editar" : "Cadastrar" }}
      </el-button>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
import { TARIFF_TYPES } from '@/constants/billing'

export default {
  name: 'VolumetryTariffsDescription',

  props: {
    tariffs: {
      type: Array,
      required: true
    }
  },

  data: () => ({
    vomumetryTariffTypes: TARIFF_TYPES
  }),

  computed: {
    haveTariffs() {
      return this.tariffs.length > 0
    }
  }
}
</script>

<style>
</style>
