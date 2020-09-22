<template>
  <div class="enrichment-step">
    <h2 class="new-import-view__title">
      Enriquecimento
    </h2>
    <p>
      A inteligência artificial da nossa plataforma, junto com os dados já obtidos pelo nosso sistema, aprende
      cada vez mais sobre o perfil dos usuários e seus comportamentos, escolhendo a estratégia mais apropriada
      para encontrar as pessoas e chegar uma solução adequada.
    </p>
    <el-card
      shadow="never"
      class="el-card--dashed"
    >
      <div
        v-if="loading && !enriched"
        class="el-loading-spinner"
      >
        <svg
          viewBox="25 25 50 50"
          class="circular"
        >
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            class="path"
          />
        </svg>
      </div>
      <span v-else><i class="el-icon-loading" /> Redirecionando...</span>
      <h3 v-show="!enriched && !loading">
        Caso exista em nosso banco de dados informações adicionais, iremos enriquecer as seguintes entidades:
      </h3>
      <h3 v-show="!enriched && loading">
        Nosso sistema está coletando informações...
      </h3>
      <h3 v-show="enriched">
        Os dados foram enriquecidos
        <span v-show="enriched && revision">, mas nós detectamos algumas disputas com informações que necessitam da sua revisão</span>
      </h3>
      <p v-show="enriched && revision">
        Mas não se preocupe. As disputas que não necessitam de revisão irão iniciar as etapas de negociação,
        e você poderá revisar as disputas pendentes mais tarde.
        <br><br><br>
      </p>
      <ul>
        <li>
          <el-checkbox
            v-model="checked1"
            class="el-checkbox--status"
          >
            Dados de Contato das Partes
          </el-checkbox>
        </li>
        <li>
          <el-checkbox
            v-model="checked2"
            class="el-checkbox--status"
          >
            Dados de Contato dos Advogados
          </el-checkbox>
        </li>
        <li>
          <el-checkbox
            v-model="checked3"
            class="el-checkbox--status"
          >
            Dados dos Processos Judiciais
          </el-checkbox>
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'EnrichmentStep',
  data() {
    return {
      loading: false,
      checked1: false,
      checked2: false,
      checked3: false,
      revision: false
    }
  },
  computed: {
    enriched() {
      return this.checked1 && this.checked2 && this.checked3
    }
  },
  mounted() {
    this.startEnrichment()
  },
  methods: {
    startEnrichment() {
      this.checked1 = false
      this.checked2 = false
      this.checked3 = false
      this.loading = true
      const self = this
      setTimeout(function() {
        self.checked1 = true
      }, 2000)
      setTimeout(function() {
        self.checked2 = true
      }, 2800)
      setTimeout(function() {
        self.checked3 = true
      }, 4000)
      setTimeout(function() {
        self.$emit('import:step:next')
      }, 5500)
    }
  }
}
</script>

<style lang="scss">
.enrichment-step {
  width: 100%;
  text-align: center;
  .el-card--dashed {
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
