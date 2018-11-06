<template>
  <JusViewMain class="view-import view-import--enrichment">
    <template slot="main">
      <JusButtonBack to="/import/columns"/>
      <el-steps :active="active" class="el-steps--wizard" finish-status="finish">
        <el-step/>
        <el-step/>
        <el-step/>
      </el-steps>
      <div class="view-import__container">
        <div class="view-import__title">
          <h2>Enriquecimento</h2>
        </div>
        <div class="view-import__content">
          <el-card shadow="never" class="el-card--dashed">
            <div v-show="loading && !enriched" class="el-loading-spinner">
              <svg viewBox="25 25 50 50" class="circular">
                <circle cx="50" cy="50" r="20" fill="none" class="path"/>
              </svg>
            </div>
            <h3 v-show="!enriched && !loading">
              Caso exista em nosso banco de dados informações adicionais, iremos enriquecer as seguintes entidades:
            </h3>
            <h3 v-show="!enriched && loading">Nosso sistema está coletando informações...</h3>
            <h3 v-show="enriched">Os dados foram enriquecidos
              <span v-show="enriched && revision">, mas nós detectamos alguns casos com informações que necessitam da sua revisão</span>
            </h3>
            <p v-show="enriched && revision">
              Mas não se preocupe. Os casos que não necessitam de revisão irão iniciar as etapas de negociação,
              e você poderá revisar os casos pendentes mais tarde.
              <br><br><br>
            </p>
            <ul>
              <li>
                <el-checkbox v-model="checked1" class="el-checkbox--status">Dados de Contato das Partes</el-checkbox>
              </li>
              <li>
                <el-checkbox v-model="checked2" class="el-checkbox--status">Dados de Contato dos Advogados</el-checkbox>
              </li>
            </ul>
          </el-card>
        </div>
        <div class="view-import__actions">
          <el-button v-if="!enriched" :disabled="loading" plain @click="$router.push('/import/feedback')">Pular enriquecimento</el-button>
          <el-button v-if="!enriched" :disabled="loading" type="primary" @click="startEnrichment">Enriquecer</el-button>
          <el-button v-if="enriched" type="primary" @click="$router.push('/import/feedback')">Próximo</el-button>
        </div>
      </div>
    </template>
    <template slot="aside">
      <jus-icon icon="enrichment"/>
      <h3>
        Quanto mais informação, melhor
      </h3>
      <br>
      <p>
        Além dos dados de contato que você inseriu em sua tabela, buscamos outras informações sobre as partes
        envolvidas. Isso permite que a chance de resolver suas disputas aumentem.
        <br><br>
        A inteligência artificial da nossa plataforma, junto com os dados já obtidos pelo nosso sistema, apreende cada vez
        mais sobre o perfil dos usuários e seus comportamentos, escolhendo a estratégia mais apropriada para encontrar as
        pessoas e chegar uma solução adequada.
        <br><br>
        O maior número de dados de contato, ajudam que esta estratégia fique mais completa e assertiva
      </p>
    </template>
  </JusViewMain>
</template>

<script>

export default {
  name: 'ImportEnrichment',
  data () {
    return {
      active: 2,
      loading: false,
      checked1: false,
      checked2: false,
      revision: true
    }
  },
  computed: {
    enriched () {
      return this.checked1 && this.checked2
    }
  },
  methods: {
    startEnrichment () {
      this.checked1 = false
      this.checked2 = false
      this.loading = true
      let self = this
      setTimeout(function () {
        self.checked1 = true
      }, 2000)
      setTimeout(function () {
        self.checked2 = true
      }, 3000)
    }
  }
}
</script>

<style lang="scss">
.view-import--enrichment {
  .view-import__content {
    text-align: center;
  }
  p, .el-card--dashed {
    max-width: 400px;
    margin: auto;
  }
  .el-card--dashed {
    margin: auto;
    margin-bottom: 20px;
    padding: 20px 10px;
    h3 {
      margin-top: 0;
      margin-bottom: 40px;
    }
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      li {
        margin-bottom: 10px;
      }
    }
    .el-loading-spinner {
      position: static;
      margin: 10px 0 20px;
      .path {
        stroke-width: 4px;
      }
    }
  }
}
</style>
