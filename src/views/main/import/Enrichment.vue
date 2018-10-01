<template>
  <JusViewMain class="import-enrichment-view">
    <template slot="main">
      <el-steps class="el-steps--wizard" :active="active" finish-status="finish">
        <el-step></el-step>
        <el-step></el-step>
        <el-step></el-step>
        <el-step></el-step>
      </el-steps>
      <div class="step-main">
        <JusButtonBack to="/import/new"/>
        <h2>Enriquecimento</h2>
        <br>
        <el-card class="el-card--dashed">
          <div class="el-loading-spinner">
            <svg viewBox="25 25 50 50" class="circular">
              <circle cx="50" cy="50" r="20" fill="none" class="path">
              </circle>
            </svg>
          </div>
          <h3>Nosso sistema irá coletar informações das seguintes entidades:</h3>
          <ul>
            <li>
              <el-checkbox v-model="checked1">Tribunal de justiça</el-checkbox>
            </li>
            <li>
              <el-checkbox v-model="checked2">Cadastro de advogados</el-checkbox>
            </li>
          </ul>
        </el-card>
        <br>
        <div class="buttons-test">
          <el-button @click="$router.push('/import/new/3')">Pular enriquecimento</el-button>
          <el-button type="primary" @click="$router.push('/import/new/3')">Enriquecer</el-button>
        </div>
      </div>
    </template>
    <template slot="aside">
      <JusIcon icon="best-practices"/>
      <h3>
        Melhores práticas para importar casos
      </h3>
      <br>
      <p>Ao escolher uma opção para importação, certifique-se de que os dados estão inseridos corretamente. Dessa forma, o sistema irá reconhecer mais rapidamente os dados, e além disso, enriquecer com informações complementares colhidas diretamente do TJ.<br><br> Não se esqueça de preencher os dados mínimos da planilha <br><br> • Número do processo<br> • Empresa<br> • Alçadas da negociação <br> • Nome e CPF das partes
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
  .buttons-test {
    text-align: center;
    button{
      display: inline-block;
      max-width: 195px;
    }
  }
}
</style>
