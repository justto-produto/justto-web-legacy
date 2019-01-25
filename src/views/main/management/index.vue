<template>
  <JusViewMain side-card class="view-management">
    <template slot="title">
      <h1>Gerenciamento</h1>
        <el-carousel arrow="always" indicator-position="none" :autoplay="false" height="70px">
          <el-carousel-item>
              <el-card class="view-management__info-card el-card--bg-secondary" shadow="never">
              10% das suas contrapropostas foram aceitas
              <el-button type="transparent">Ver casos</el-button>
            </el-card>
            <el-card class="view-management__info-card el-card--bg-primary" shadow="never">
              Você possui casos que precisam da sua revisão
              <el-button type="transparent">Resolver</el-button>
            </el-card>
          </el-carousel-item>
          <el-carousel-item>
            <el-card class="view-management__info-card" shadow="never">
              Você possui casos que precisam da sua revisão
            </el-card>
          </el-carousel-item>
        </el-carousel>
    </template>
    <template slot="main">
      <div class="view-management__actions">
        <el-button plain>
          <jus-icon icon="filter" />
          Filtrar
        </el-button>
        <el-button plain>
          Exportar casos
        </el-button>
      </div>
      <!-- <div :class="{'active': multiActive}" class="view-management__multi-actions">
        <el-checkbox
          v-show="multiActive" :checked="true" class="el-checkbox--status"
          disabled>
          {{ checkList.length }} casos selecionados
        </el-checkbox>
        <el-button-group>
          <el-button>Atualizar</el-button>
          <el-button>Ignorar</el-button>
          <el-button>Manter <br>ambos</el-button>
        </el-button-group>
        <i class="el-icon-close" @click="checkList = []"/>
      </div> -->
      <el-tabs ref="management-tabs" value="1" class="view-management__tabs" @tab-click="handleTabClick">
        <el-tab-pane label="Engajamento" name="1">
          <h1>aaa</h1>
          <!-- <div class="view-management__header">
            <el-checkbox/>
            <div>
              Ordenar por:
              <el-select v-model="filter" size="small" placeholder="Selecione uma opção">
                <el-option
                  v-for="filter in ['Campanha', 'Empresa', 'ID do caso', 'Responsável', 'Dado incorreto']" :key="filter" :label="filter"
                  :value="filter"/>
              </el-select>
              <el-button type="primary" size="small">Exportar casos</el-button>
            </div>
          </div> -->
          <!-- <div class="view-management__container">
            <el-checkbox-group v-model="checkList">
              <el-checkbox
                v-for="item in [1,2,3]" :key="item" :label="'check'+item"
                class="view-management__item">
                <el-card class="el-card--bordered el-card--info">
                  <el-table
                    :data="tableData" class="el-table--feedback-card" size="mini"
                    max-height="100%">
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
                    <el-table-column label="Campanha" min-width="90px">
                      <template slot-scope="scope">
                        {{ scope.row.campaign }}
                      </template>
                    </el-table-column>
                    <el-table-column label="Dados incorretos" min-width="130px">
                      <template slot-scope="scope">
                        {{ scope.row.issues }}
                      </template>
                    </el-table-column>
                    <el-table-column label="Responsáveis" min-width="80">
                      <template slot-scope="scope">
                        <span class="responsibles-box">
                          <jus-avatar-user src="http://www.abc.net.au/reslib/201011/r679209_5007178.jpg" size="xs" shape="circle"/>
                          <jus-avatar-user src="https://vignette.wikia.nocookie.net/parody/images/8/8c/Kermit-2011.png/revision/latest?cb=20150530035135" size="xs" shape="circle"/>
                          <jus-avatar-user name-initials="MS" size="xs" shape="circle"/>
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column>
                      <template slot-scope="scope" style="text-align: right;">
                        • • •
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-checkbox>
            </el-checkbox-group>
          </div> -->
        </el-tab-pane>
        <el-tab-pane label="Com interação" name="2">
          <div class="view-management__container"><h1>Em construção</h1></div>
        </el-tab-pane>
        <el-tab-pane label="Novos Acordos" name="3">
          <div class="view-management__container"><h1>Em construção</h1></div>
        </el-tab-pane>
        <el-tab-pane label="Todos" name="4">
        <div class="view-management__container"><h1>Em construção</h1></div>
        </el-tab-pane>
      </el-tabs>
    </template>
  </JusViewMain>
</template>

<script>
export default {
  name: 'Management',
  data () {
    return {
      filter: '',
      checkList: [],
      tabIndex: '0',
      month: 'Setembro',
      tableData: [
        {
          id: '14567',
          company: 'Nestlé',
          campaign: 'NATAL - Nestlé',
          issues: 'CPF da parte contrária',
          status: 'Ganho',
          chance: '40%',
          limit: '20 dias'
        }
      ],
      caruoselItems: [
        { title: '25', subtitle: 'Metas cumpridas no mês' },
        { title: '999', subtitle: 'Metas cumpridas no mês' }
      ],
      data2: {
        labels: ['Set 01', '', 'Set 10', '', 'Set 20', '', 'Set 23'],
        datasets: [
          {
            label: 'Respondem',
            backgroundColor: '#eF930066',
            borderColor: '#eF9300',
            pointBackgroundColor: '#eF9300',
            pointBorderColor: '#eF9300',
            data: [8, 4, 12, 9, 14, 13, 16, 16]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            display: false,
            ticks: {
              beginAtZero: true
            }
          }]
        },
        legend: {
          display: false
        }
      }
    }
  },
  beforeMount () {
    this.tab-click()
  },
  computed: {
    multiActive () {
      return this.checkList.length > 1
    }
    // handleArrows () {
    //   return {
    //     'el-tabs--hide-prev': this.tabIndex === '0',
    //     'el-tabs--hide-next': this.tabIndex === '6'
    //   }
    // }
  },
  methods: {
    handleTabClick () {
      if (this.$refs['management-tabs']) {
        this.tabIndex = this.$refs['management-tabs'].currentName
        this.checkList = []
      }
    }
  }
}
</script>

<style lang="scss">
.view-management {
  &__tabs {
    .el-tabs__header {
      width: fit-content;
    }
  }
  &__actions {
    display: inline-flex;
    position: absolute;
    right: 318px;
    right: 20px;
    top: 20px;
    .el-button {
      line-height: 14px;
      padding: 8px 18px;
    }
    img {
      vertical-align: sub;
      width: 14px;
    }
  }
  .view-management__info-card {
    width: 100%;
    font-weight: 300;
    + .view-management__info-card {
      margin-left: 20px;
    }
    .el-card__body {
      padding: 16px;
      height: 100%;
      display: flex;
    }
    .el-button {
      margin-left: 10px;
    }
  }
  .jus-main-view__main-card .el-card__body {
    position: relative;
    height: 100%;
  }
  .el-carousel {
    width: 65%;
  }
  .el-carousel__item {
    display: flex;
  }
  > div:first-child {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .el-tabs__active-bar {
    width: 97px;
  }
}

// .view-management {
//   >.display-flex >.el-card .el-card__body {
//     position: relative;
//     padding: 20px 12px;
//   }
//   .el-tabs__header {
//     margin: 0 10px;
//   }
// }
// .view-management__header {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   margin: 40px 10px 20px 10px;
//   button {
//     max-width: 200px;
//     vertical-align: bottom;
//   }
//   .el-select {
//     padding-left: 10px;
//     margin-right: 20px;
//   }
// }
// .view-management__container {
//   margin-left: 10px;
//   .el-table {
//     td:last-child {
//       text-align: right;
//     }
//     td:last-child .cell {
//       margin-top: -20px;
//     }
//   }
//   .view-management__item {
//     display: flex;
//     align-items: center;
//     &.el-checkbox + .el-checkbox {
//       margin-left: 0px;
//     }
//     .el-checkbox__label {
//       width: 100%;
//       margin-right: 10px;
//     }
//     .el-checkbox__input {
//       margin-right: 10px;
//     }
//   }
//   hr {
//     margin: 30px 0 40px;
//   }
// }
// .view-management__multi-actions {
//   position: absolute;
//   background-color: #fff;
//   width: 100%;
//   z-index: 3;
//   margin-left: -12px;
//   padding: 0 20px;
//   transition: all 0.5s ease;
//   box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.12);
//   border-bottom: solid 1px #e4e8ea;
//   border-radius: 6px 6px 0 0;
//   display: flex;
//   justify-content:space-between;
//   align-items: center;
//   >:first-child {
//     width: 20%;
//   }
//   >:last-child {
//     width: 20%;
//   }
//   margin-top: -120px;
//   &.active {
//     margin-top: -20px;
//   }
//   i {
//     cursor: pointer;
//     text-align: right;
//   }
//   button {
//     width: 33.33%;
//     border-radius: 6px;
//     height: 68px;
//     padding: 8px 20px;
//     border: 0;
//     border-radius: 0;
//   }
// }
// .view-management__recent-chats {
//   ul {
//     list-style: none;
//     padding: 0;
//     margin: 20px 0 0;
//   }
//   li {
//     display: flex;
//     align-items: center;
//     &+li {
//       margin-top: 10px;
//     }
//   }
//   .jus-avatar-user {
//     margin-right: 10px;
//   }
//   .jus-status-dot {
//     margin-left: auto;
//   }
// }
</style>
