<template>
  <div class="jus-management-filters">
    <el-form :model="filters" label-position="top">
      <el-row :gutter="20">
        <!--  CAMPANHA -->
        <el-col :span="24">
          <el-form-item label="Campanha">
            <el-select v-model="filters.campaign" placeholder="Selecione uma opção" clearable>
              <el-option v-for="campaign in ['Campanha 1', 'Campanha 2', 'Campanha 3']" :key="campaign" :value="campaign"/>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- STATUS -->
        <el-col v-if="isEngagement" :span="12">
          <el-form-item label="Status">
            <el-radio-group v-model="filters.status">
              <el-radio-button label="paused">Pausados</el-radio-button>
              <el-radio-button label="active">Ativos</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- FIM DA NEGOCIAÇÃO -->
        <el-col :span="12">
          <el-form-item label="Fim da negociação">
            <el-date-picker v-model="filters.dueDate" placeholder="Selecione uma data" />
          </el-form-item>
        </el-col>
        <!-- ESTRATÉGIA -->
        <el-col :span="12">
          <el-form-item label="Estratégia">
            <el-select v-model="filters.strategy" placeholder="Selecione uma opção" clearable>
              <el-option v-for="strategy in ['Estratégia 1', 'Estratégia 2', 'Estratégia 3']" :key="strategy" :value="strategy"/>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- FAVORITOS -->
        <el-col :span="12">
          <el-form-item label="Ordenar por:" class="jus-management-filters__favorite">
            <div>
              <div>
                <jus-icon icon="golden-star" /> Casos favoritos
              </div>
              <el-switch v-model="filters.favorites" />
            </div>
          </el-form-item>
        </el-col>
        <!-- ESTADO -->
        <el-col :span="12">
          <el-form-item label="Estado">
            <el-select v-model="filters.state" placeholder="Selecione uma opção" clearable>
              <el-option v-for="state in ['Estado 1', 'Estado 2', 'Estado 3']" :key="state" :value="state"/>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- COMARCA -->
        <el-col :span="12">
          <el-form-item label="Comarca">
            <el-select v-model="filters.city" placeholder="Selecione uma opção" clearable>
              <el-option v-for="city in ['Comarca 1', 'Comarca 2', 'Comarca 3']" :key="city" :value="city"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'JusManagementFilters',
  props: {
    tabIndex: {
      type: Number,
      default: 0
    },
    filters: {
      type: Object,
      default: () => {}
    }
  },
  beforeMount () {
    this.$store.dispatch('showLoading')
    Promise.all([
      // this.$store.dispatch('getCampaigns'),
      this.$store.dispatch('getStrategies')
    ]).then(() => {
      this.$store.dispatch('hideLoading')
    })
  },
  computed: {
    isEngagement () {
      return this.tabIndex === 0
    },
    isInteration () {
      return this.tabIndex === 1
    },
    isNewAgreements () {
      return this.tabIndex === 2
    },
    isAll () {
      return this.tabIndex === 3
    }
  }
}
</script>

<style lang="scss">
.jus-management-filters {
  .el-form-item__content {
    max-height: 40px;
  }
  .el-select, .el-date-editor, .el-radio-group {
    width: 100%;
  }
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
