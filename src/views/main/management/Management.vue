<template>
  <JusViewMain side-card class="view-management">
    <template slot="title">
      <h1>Gerenciamento</h1>
      <el-carousel
        :autoplay="false"
        arrow="always"
        indicator-position="none"
        height="70px">
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
      <div :class="{'active': multiActive}" class="view-management__multi-actions">
        <img src="http://ap.imagensbrasil.org/images/2017/02/24/SERGIO-MALLANDRO.jpg" class="malandro">
        <i class="el-icon-close" @click="multipleSelection = []"/>
      </div>
      <div class="view-management__actions">
        <el-button plain>
          <jus-icon icon="filter" />
          Filtrar
        </el-button>
        <el-button plain>
          Exportar casos
        </el-button>
      </div>
      <el-tabs
        ref="management-tabs"
        :fit="false"
        value="1"
        class="view-management__tabs"
        @tab-click="handleTabClick">
        <el-tab-pane label="Engajamento" name="1">
          <el-table
            ref="engagementTable"
            :data="cases"
            class="el-table--card"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" />
            <el-table-column label="Campanha">
              <template slot-scope="scope">{{ scope.row.campaign }}</template>
            </el-table-column>
            <el-table-column label="Parte contrária">
              <template slot-scope="scope">{{ scope.row.claimantParty }}</template>
            </el-table-column>
            <el-table-column label="Advogado da parte">
              <template slot-scope="scope">{{ scope.row.claimantLawyer }}</template>
            </el-table-column>
            <el-table-column label="Alçada máxima">
              <template slot-scope="scope">{{ scope.row.max }}</template>
            </el-table-column>
            <el-table-column label="Valor proposto">
              <template slot-scope="scope">{{ scope.row.proposalValue }}</template>
            </el-table-column>
            <el-table-column label="Fim da negociação">
              <template slot-scope="scope">{{ scope.row.deadline }}</template>
            </el-table-column>
            <el-table-column label="Responsáveis (3)">
              <template slot-scope="scope">{{ scope.row.responsibles }}</template>
            </el-table-column>
            <el-table-column label="" width="40">
              <template slot-scope="scope"><i class="el-icon-more" style="font-size: 18px"/></template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="Com interação" name="2">
          <el-table
            ref="engagementTable"
            :data="cases"
            class="el-table--card"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" />
            <el-table-column label="Campanha">
              <template slot-scope="scope">{{ scope.row.campaign }}</template>
            </el-table-column>
            <el-table-column label="Parte contrária">
              <template slot-scope="scope">{{ scope.row.claimantParty }}</template>
            </el-table-column>
            <el-table-column label="Advogado da parte">
              <template slot-scope="scope">{{ scope.row.claimantLawyer }}</template>
            </el-table-column>
            <el-table-column label="Alçada máxima">
              <template slot-scope="scope">{{ scope.row.max }}</template>
            </el-table-column>
            <el-table-column label="Contraproposta">
              <template slot-scope="scope">{{ scope.row.contraProposal }}</template>
            </el-table-column>
            <el-table-column label="Fim da negociação">
              <template slot-scope="scope">{{ scope.row.deadline }}</template>
            </el-table-column>
            <el-table-column label="Última Interação">
              <template slot-scope="scope">{{ scope.row.lastInteraction }}</template>
            </el-table-column>
            <el-table-column label="" width="40">
              <template slot-scope="scope"><i class="el-icon-more" style="font-size: 18px"/></template>
            </el-table-column>
          </el-table>
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
      cases: [{
        campaign: 'NATAL - Nestlé',
        claimantParty: 'Edinalva Pereira',
        claimantLawyer: 'Cleiton Pereira da Silva',
        max: 'R$10.000',
        proposalValue: 'R$3.000',
        contraProposal: 'R$3.000',
        deadline: '28/11/2020',
        lastInteraction: '28/11/2019',
        call: 'whatsapp',
        responsibles: ''
      }, {
        campaign: 'NATAL - Nestlé',
        claimantParty: 'Edinalva Pereira',
        claimantLawyer: 'Cleiton Pereira da Silva',
        max: 'R$10.000',
        proposalValue: 'R$3.000',
        contraProposal: 'R$3.000',
        deadline: '28/11/2020',
        lastInteraction: '28/11/2019',
        call: 'sms',
        responsibles: ''
      }, {
        campaign: 'NATAL - Nestlé',
        claimantParty: 'Edinalva Pereira',
        claimantLawyer: 'Cleiton Pereira da Silva',
        max: 'R$10.000',
        proposalValue: 'R$3.000',
        contraProposal: 'R$3.000',
        deadline: '28/11/2020',
        lastInteraction: '28/11/2019',
        call: 'email',
        responsibles: ''
      }],
      multipleSelection: []
    }
  },
  computed: {
    multiActive () {
      return this.multipleSelection.length > 1
    }
  },
  methods: {
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleTabClick () {
      // if (this.$refs['management-tabs']) {
      //   this.tabIndex = this.$refs['management-tabs'].currentName
      //   this.checkList = []
      // }
    }
  }
}
</script>

<style lang="scss">
.view-management {
  &__tabs {
    .el-tabs__header {
      width: fit-content;
      padding: 0 20px;
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
  .jus-main-view__main-card > .el-card__body {
    position: relative;
    height: 100%;
    padding: 20px 0;
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
.view-management__multi-actions {
  min-height: 115px;
  position: absolute;
  background-color: #fff;
  width: 100%;
  z-index: 3;
  padding: 0 40px;
  transition: all 0.5s ease;
  box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.12);
  border-bottom: solid 1px #e4e8ea;
  display: flex;
  justify-content:space-between;
  align-items: center;
  >:first-child {
    width: 20%;
  }
  >:last-child {
    width: 20%;
  }
  margin-top: -44px;
  transform: translateY(-100%);
  &.active {
    margin-top: -20px;
    transform: translateY(0%);
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
.malandro {
  transform: rotate(180deg);
  width: 148px;
}
</style>
