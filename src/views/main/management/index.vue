<template>
  <JusViewMain side-card class="view-management">
    <template slot="title">
      <h1>Gerenciamento</h1>
    </template>
    <template slot="main">
      <div :class="{'active': multiActive}" class="view-management__multi-actions">
        <el-checkbox v-show="multiActive" :checked="true" class="el-checkbox--status" disabled>
          {{ checkList.length }} casos selecionados
        </el-checkbox>
        <el-button-group>
          <el-button>Atualizar</el-button>
          <el-button>Ignorar</el-button>
          <el-button>Manter <br>ambos</el-button>
        </el-button-group>
        <i class="el-icon-close" @click="checkList = []"/>
      </div>
      <el-tabs ref="management-tabs" :class="handleArrows" @tab-click="handleTabClick">
        <el-tab-pane label="Pendentes">
          <div class="view-management__header">
            <span>
              Filtrar por:
              <el-select v-model="companyFilter" size="small" placeholder="Empresa">
                <el-option v-for="company in ['Nestlé', 'Cacau Show']" :key="company" :label="company" :value="company"/>
              </el-select>
            </span>
            <el-button type="primary">Exportar casos</el-button>
          </div>
          <div class="view-management__container">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="check1" class="view-management__item">
                <el-card class="el-card--bordered el-card--info">
                  <el-table :data="tableData" class="el-table--feedback-card" size="mini">
                    <el-table-column label="Nº do caso">
                      <template slot-scope="scope">
                        {{ scope.row.id }}
                      </template>
                    </el-table-column>
                    <el-table-column label="Empresa">
                      <template slot-scope="scope">
                        {{ scope.row.company }}
                      </template>
                    </el-table-column>
                    <el-table-column label="Dados incorretos" min-width="200px">
                      <template slot-scope="scope">
                        {{ scope.row.issues }}
                      </template>
                    </el-table-column>
                    <el-table-column min-width="175">
                      <template slot-scope="scope" style="text-align: right;">
                        • • •
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-checkbox>
              <el-checkbox label="check2" class="view-management__item">
                <el-card class="el-card--bordered el-card--info">
                  <el-table :data="tableData" class="el-table--feedback-card" size="mini">
                    <el-table-column label="Nº do caso">
                      <template slot-scope="scope">
                        {{ scope.row.id }}
                      </template>
                    </el-table-column>
                    <el-table-column label="Empresa">
                      <template slot-scope="scope">
                        {{ scope.row.company }}
                      </template>
                    </el-table-column>
                    <el-table-column label="Dados incorretos" min-width="200px">
                      <template slot-scope="scope">
                        {{ scope.row.issues }}
                      </template>
                    </el-table-column>
                    <el-table-column min-width="175">
                      <template slot-scope="scope" style="text-align: right;">
                        • • •
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-checkbox>
              <hr>
              <el-checkbox label="check3" class="view-management__item">
                <el-card class="el-card--bordered el-card--success el-card--info">
                  <el-table :data="tableData" class="el-table--feedback-card" size="mini">
                    <el-table-column label="Nº do caso">
                      <template slot-scope="scope">
                        {{ scope.row.id }}
                      </template>
                    </el-table-column>
                    <el-table-column label="Empresa">
                      <template slot-scope="scope">
                        {{ scope.row.company }}
                      </template>
                    </el-table-column>
                    <el-table-column label="Dados incorretos" min-width="200px">
                      <template slot-scope="scope">
                        {{ scope.row.issues }}
                      </template>
                    </el-table-column>
                    <el-table-column min-width="175">
                      <template slot-scope="scope" style="text-align: right;">
                        • • •
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-checkbox>
              <el-checkbox label="check4" class="view-management__item">
                <el-card class="el-card--bordered el-card--info">
                  <el-table :data="tableData" class="el-table--feedback-card" size="mini">
                    <el-table-column label="Nº do caso">
                      <template slot-scope="scope">
                        {{ scope.row.id }}
                      </template>
                    </el-table-column>
                    <el-table-column label="Empresa">
                      <template slot-scope="scope">
                        {{ scope.row.company }}
                      </template>
                    </el-table-column>
                    <el-table-column label="Dados incorretos" min-width="200px">
                      <template slot-scope="scope">
                        {{ scope.row.issues }}
                      </template>
                    </el-table-column>
                    <el-table-column min-width="175">
                      <template slot-scope="scope" style="text-align: right;">
                        • • •
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Duplicados">
          <div class="view-management__container"><h1>Teste</h1></div>
        </el-tab-pane>
        <el-tab-pane label="Engajamento">
          <div class="view-management__container"><h1>Teste</h1></div>
        </el-tab-pane>
        <el-tab-pane label="Com interação">
          <div class="view-management__container"><h1>Teste</h1></div>
        </el-tab-pane>
        <el-tab-pane label="Ganhos">
          <div class="view-management__container"><h1>Teste</h1></div>
        </el-tab-pane>
        <el-tab-pane label="Perdidos">
          <div class="view-management__container"><h1>Teste</h1></div>
        </el-tab-pane>
        <el-tab-pane label="Todos">
          <div class="view-management__container"><h1>Teste</h1></div>
        </el-tab-pane>
      </el-tabs>
    </template>
    <template slot="aside">
      <jus-carousel-info :items="caruoselItems"/>
    </template>
  </JusViewMain>
</template>

<script>
import JusCarouselInfo from '@/components/layouts/JusCarouselInfo'
export default {
  name: 'Management',
  components: {
    JusCarouselInfo
  },
  data () {
    return {
      companyFilter: '',
      checkList: [],
      tabIndex: '0',
      tableData: [
        {
          id: '14567',
          company: 'Nestlé',
          issues: 'CPF da parte contrária'
        }
      ],
      caruoselItems: [
        { title: '25', subtitle: 'Metas cumpridas no mês' },
        { title: '999', subtitle: 'Metas cumpridas no mês' }
      ]
    }
  },
  computed: {
    multiActive () {
      return this.checkList.length > 1
    },
    handleArrows () {
      return {
        'el-tabs--hide-prev': this.tabIndex === '0',
        'el-tabs--hide-next': this.tabIndex === '6'
      }
    }
  },
  methods: {
    handleTabClick () {
      if (this.$refs['management-tabs']) {
        this.tabIndex = this.$refs['management-tabs'].currentName
      }
    }
  }
}
</script>

<style lang="scss">
.view-management {
  .el-card__body {
    position: relative;
    padding: 20px 12px;
  }
  .el-tabs__header {
    margin: 0 10px;
  }
}
.view-management__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 30px 8px 20px 42px;
  button {
    max-width: 200px;
  }
  .el-input {
    margin-left: 10px;
  }
}
.view-management__container {
  margin: 30px 8px 20px;
  .el-table {
    td:last-child {
      text-align: right;
    }
    td:last-child .cell {
      margin-top: -20px;
    }
  }
  .view-management__item {
    display: flex;
    align-items: center;
    &.el-checkbox + .el-checkbox {
      margin-left: 0px;
    }
    .el-checkbox__label {
      width: 100%;
    }
    .el-checkbox__input {
      margin-right: 20px;
    }
  }
  hr {
    margin: 30px 0 40px;
  }
}
.view-management__multi-actions {
  position: absolute;
  background-color: #fff;
  width: 100%;
  z-index: 3;
  margin-left: -12px;
  padding: 0 20px;
  transition: all 0.5s ease;
  box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.12);
  border: solid 1px #e4e8ea;
  border-radius: 6px 6px 0 0;
  display: flex;
  justify-content:space-between;
  align-items: center;
  >:first-child {
    width: 20%;
  }
  >:last-child {
    width: 20%;
  }
  margin-top: -120px;
  &.active {
    margin-top: -20px;
  }
  i {
    cursor: pointer;
    text-align: right;
  }
  button {
    width: 33.33%;
    border-radius: 6px;
    height: 68px;
    padding: 8px 20px;
    border: 0;
    border-radius: 0;
  }
}
</style>
