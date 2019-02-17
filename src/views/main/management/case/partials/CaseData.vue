<template lang="html">
  <div>
    <el-collapse value="1">
      <el-collapse-item v-loading="loading" title="Informações gerais" name="1">
        <div class="ticket-view__info-line">
          <span>Nº do Processo:</span>
          <span>{{ dispute.code }}</span>
        </div>
        <div class="ticket-view__info-line">
          <span>Campanha:</span>
          <span>NESTLÉ - NATAL2018</span>
        </div>
        <div class="ticket-view__info-line">
          <span>Estratégia:</span>
          <span>Indenizatório</span>
        </div>
        <div class="ticket-view__info-line">
          <span>Alçada máxima:</span>
          <span>R$ {{ disputeSummary.boundary }}</span>
        </div>
        <div class="ticket-view__info-line">
          <span>Contraproposta:</span>
          <span>R$ {{ disputeSummary.lastProposal }}</span>
        </div>
        <div class="ticket-view__info-line">
          <span>Valor do acordo:</span>
          <span>R$ {{ disputeSummary.dealValue }}</span>
        </div>
        <div class="ticket-view__info-line">
          <span>Fim da negociação:</span>
          <span>28/10/2020</span>
        </div>
      </el-collapse-item>
    </el-collapse>
    <hr>
    <el-collapse v-loading="loadingRoles" accordion class="el-collapse--bordered">
      <el-collapse-item
        v-for="person in people"
        :key="person.id"
        :name="person.id"
        title="Contraparte 1">
        <div class="ticket-view__info-line">
          <span>Status:</span>
          <span>Online</span>
        </div>
        <div class="ticket-view__info-line">
          <span>Nome:</span>
          <span>{{ person.name }}</span>
        </div>
        <div class="ticket-view__info-line">
          <span>E-mail:</span>
          <span>edineide.htinha@aol.com</span>
        </div>
        <div class="ticket-view__info-line">
          <span>Telefone:</span>
          <span>(12) 91234-5678</span>
        </div>
        <div class="ticket-view__info-line">
          <span>CPF:</span>
          <span>{{ person.documentNumber }}</span>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: 'CaseSummary',
  props: {
    loading: {
      default: false,
      type: Boolean
    },
    dispute: {
      default: () => {},
      type: Object
    },
    disputeSummary: {
      default: () => {},
      type: Object
    },
    disputeRoles: {
      default: () => {},
      type: Object
    }
  },
  data () {
    return {
      people: [],
      loadingRoles: false
    }
  },
  watch: {
    disputeRoles () {
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      if (this.disputeRoles.content) {
        for (let role of this.disputeRoles.content) {
          this.$store.dispatch('getPerson', role.personId).then(response => {
            this.people.push(response)
          }).catch(error => {
            console.error(error)
            this.$jusNotification({
              title: 'Ops!',
              message: 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.',
              type: 'error'
            })
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
</style>
