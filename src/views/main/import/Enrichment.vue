<template>
  <JusViewMain class="import-enrichment-view">
    <template slot="main">
      <el-steps :active="active" class="el-steps--wizard" finish-status="finish">
        <el-step/>
        <el-step/>
        <el-step/>
      </el-steps>
      <div class="step-main">
        <JusButtonBack to="/import/columns"/>
        <h2>Enriquecimento</h2>
        <br>
        <el-card shadow="never" class="el-card--dashed">
          <div class="el-loading-spinner">
            <svg viewBox="25 25 50 50" class="circular">
              <circle cx="50" cy="50" r="20" fill="none" class="path"/>
            </svg>
          </div>
          <h3>Nosso sistema está coletando informações das seguintes entidades:</h3>
          <ul>
            <li>
              <el-checkbox v-model="checked1">Tribunal de justiça</el-checkbox>
            </li>
            <li>
              <el-checkbox v-model="checked2">Cadastro de advogados</el-checkbox>
            </li>
          </ul>
          <br>
          <p>Ao término desta operação você será redirecionado automaticamente.</p>
        </el-card>
        <div class="display-flex">
          <el-button plain>Pular enriquecimento</el-button>
          <el-button type="primary">Enriquecer</el-button>
        </div>
      </div>
    </template>
    <template slot="aside">
      <JusIcon icon="enrichment"/>
      <h3>
        Quanto mais informação, melhor
      </h3>
      <br>
      <p>
        Além dos dados inseridos, buscamos outras informações sobre as partes envolvidas através do TJ e outras entidades.
        <br><br>
        Isso permite que o robô entenda mais sobre os usuários e seus comportamentos, além de entregar mensalmente um relatório completo sobre o perfil das pessoas com quem você está lidando.
        <br><br>
        Dessa forma, a negociação poderá ser mais acertiva.
      </p>
    </template>
  </JusViewMain>
</template>

<script>

export default {
  name: 'Import',
  data () {
    return {
      active: 2,
      checked1: true,
      checked2: false
    }
  },
  methods: {
    drop (event) {
      console.log(event)
    },
    next () {
      if (this.active++ > 3) this.active = 1
    },
    notify () {
      this.$notify({
        title: 'Ops!',
        message: 'Para prosseguir você deve adicionar um arquivo',
        position: 'bottom-right',
        duration: 0,
        customClass: 'success'
      })
    },
    confirm () {
      this.$confirm(`Um arquivo ainda está carregando. Ao sair da tela, este arquivo não será importado.
        Você tem certeza de que quer abandonar o carregamento?`, 'Atenção!', {
        confirmButtonText: 'Parar importação',
        cancelButtonText: 'Cancelar'
      }).then(() => {
        this.$message({
          type: 'success',
          message: 'Delete completed'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        })
      })
    }
  }
}
</script>

<style lang="scss">
.import-enrichment-view {
  .el-card--dashed {
    margin: auto;
    margin-bottom: 20px;
    max-width: 400px;
    padding: 40px 15px 20px;
    h3 {
      margin-bottom: 40px;
    }
    ul {
      list-style: none;
      text-align: center;
      li {
        margin-bottom: 10px;
      }
    }
    .el-loading-spinner {
      text-align: center;
      position: static;
      .path {
        stroke-width: 4px;
      }
    }
  }
  .el-button {
    width: 190px !important;
  }
}
</style>
