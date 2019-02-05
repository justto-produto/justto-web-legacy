<template>
  <div class="jus-management-filters">
    <el-form :model="filtersForm" label-position="top">
      <el-form-item label="Campanha">
        <el-select v-model="filtersForm.campaign" placeholder="Selecione uma opção" clearable>
          <el-option v-for="campaign in ['Campanha 1', 'Campanha 2', 'Campanha 3']" :key="campaign" :value="campaign"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Estratégia">
        <el-select v-model="filtersForm.strategy" placeholder="Selecione uma opção" clearable>
          <el-option v-for="strategy in ['Estratégia 1', 'Estratégia 2', 'Estratégia 3']" :key="strategy" :value="strategy"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Ordenar por:" class="jus-management-filters__favorite">
        <div>
          <div>
            <jus-icon icon="golden-star" /> Casos favoritos
          </div>
          <el-switch v-model="filtersForm.favorites" />
        </div>
      </el-form-item>
      <el-form-item label="Estado">
        <el-select v-model="filtersForm.state" placeholder="Selecione uma opção" clearable>
          <el-option v-for="state in ['Estado 1', 'Estado 2', 'Estado 3']" :key="state" :value="state"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Comarca">
        <el-select v-model="filtersForm.city" placeholder="Selecione uma opção" clearable>
          <el-option v-for="city in ['Comarca 1', 'Comarca 2', 'Comarca 3']" :key="city" :value="city"/>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'JusManagementFilters',
  data () {
    return {
      filtersForm: {
        campaign: '',
        strategy: '',
        state: '',
        city: '',
        favoritesFilter: false
      }
    }
  }
}
</script>

<style lang="scss">
.jus-management-filters {
  &__favorite {
    .el-form-item__content > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        vertical-align: text-top;
      }
    }
  }
}
</style>
