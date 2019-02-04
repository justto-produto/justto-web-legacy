<template>
  <div class="jus-import-feedback-card">
    <el-tag :color="color" class="el-tag--company-tag">{{ company.name }}</el-tag>
    <el-card :style="'border-left: solid 4px ' + color">
      <el-autocomplete
        v-model="campaignName"
        :fetch-suggestions="querySearchCampaign"
        :trigger-on-focus="false"
        value-key="name"
        clearable
        placeholder="Dê um nome para a sua Campanha"
        @select="handleSelectCampaign">
        <i
          slot="prefix"
          :class="campaignName === '' ? 'el-icon-circle-check-outline' : 'el-icon-circle-check el-input__icon--success'"
          class="el-input__icon"
        />
      </el-autocomplete>
      <el-select
        v-model="strategy"
        clearable class="select-strategy"
        placeholder="Escolha uma estratégia"
      >
        <i
          slot="prefix"
          :class="strategy === '' ? 'el-icon-circle-check-outline' : 'el-icon-circle-check el-input__icon--success'"
          class="el-input__icon"
        />
        <el-option
          v-for="strategy in strategies"
          :key="strategy.id"
          :label="strategy.name"
          :value="strategy.id"
        />
      </el-select>
      <div class="select-strategy__messages">
        <a v-show="strategy !== ''" @click="showStrategyMessages">Ver estratégia de engajamento das partes</a>
      </div>
      <el-date-picker
        v-model="dueDate"
        :prefix-icon="dueDate === null ? 'el-icon-circle-check-outline' : 'el-icon-circle-check el-input__icon--success'"
        :picker-options="datePickerOptions"
        type="date"
        format="dd-MM-yyyy"
        placeholder="Defina a data limite para a negociação"
      />
      <el-select
        v-model="dealers"
        :remote-method="searchDealers"
        :loading="loading"
        size="large"
        placeholder="Escolha os negociadores"
        multiple
        filterable
        remote
        class="select-dealer">
        <i
          slot="prefix"
          :class="dealers.length === 0 ? 'el-icon-circle-check-outline' : 'el-icon-circle-check el-input__icon--success'"
          class="el-input__icon"
        />
        <el-option
          v-for="item in filteredDealers"
          :key="item.value"
          :label="item.label"
          :value="item.value">
          <jus-avatar-user :src="item.value" shape="circle" size="xs"/>
          <span style="vertical-align: text-bottom;margin-left: 10px;">{{ item.label }}</span>
        </el-option>
      </el-select>
    </el-card>
    <jus-modal v-if="showStrategyModal" @close="showStrategyModal = false">
      <div slot="header">
        <h2>Estretégia de engajamento das partes</h2>
        <p>
          Abaixo você encontra as mensagens enviadas para às partes dos casos contidos nesta Campanha. Através da
          inteligência artificial da nossa plataforma, junto com os dados já obtidos pelo nosso sistema, aprende cada
          vez mais sobre o perfil dos usuários e seus comportamentos, escolhendo a estratégia mais apropriada para
          encontrar as pessoas e chegar uma solução adequada.
        </p>
      </div>
      <div slot="body">
        <el-collapse v-loading="$store.state.loading" class="jus-import-feedback-card__engagement el-collapse--bordered">
          <el-collapse-item v-for="(step, key) in strategyEngagements" :key="step + key">
            <template slot="title">
              <jus-icon icon="message"/> {{ step.name | capitalize }}
            </template>
            <!-- {{ step.template.subject }}
            {{ step.template.message }} -->
          </el-collapse-item>
          <!-- <el-collapse-item>
            <template slot="title">
              <jus-icon icon="email"/> E-MAIL - Não espere para fechar o seu acordo com a Ne…
            </template>
            <div>Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;</div>
            <div>Visual feedback: reflect current state by updating or rearranging elements of the page.</div>
          </el-collapse-item>
          <el-collapse-item>
            <template slot="title">
              <jus-icon icon="whatsapp"/> WHATSAPP
            </template>
            <div>Simplify the process: keep operating process simple and intuitive;</div>
            <div>Definite and clear: enunciate your intentions clearly so that the users can quickly understand and make decisions;</div>
            <div>Easy to identify: the interface should be straightforward, which helps the users to identify and frees them from memorizing and recalling.</div>
          </el-collapse-item>
          <el-collapse-item>
            <template slot="title">
              <jus-icon icon="cna"/> CNA - O que você ganha ao fechar acordos?
            </template>
            <div>Decision making: giving advices about operations is acceptable, but do not make decisions for the users;</div>
            <div>Controlled consequences: users should be granted the freedom to operate, including canceling, aborting or terminating current operation.</div>
          </el-collapse-item> -->
        </el-collapse>
      </div>
    </jus-modal>
  </div>
</template>

<script>
import JusModal from '@/components/layouts/JusModal'

export default {
  name: 'JusImportFeedbackCard',
  components: {
    JusModal
  },
  props: {
    company: {
      type: Object,
      default: undefined
    },
    color: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      campaignName: '',
      campaignTimeout: null,
      strategy: '',
      strategyEngagements: [],
      showStrategyModal: false,
      dueDate: null,
      datePickerOptions: {
        disabledDate (date) {
          return date < new Date()
        }
      },
      dealers: [],
      filteredDealers: [],
      loading: false
    }
  },
  computed: {
    strategies () {
      return this.$store.state.strategyModule.list
    },
    campaigns () {
      return this.$store.state.campaignModule.list
    },
    dealersList () {
      return [{
        value: 'http://www.abc.net.au/reslib/201011/r679209_5007178.jpg',
        label: 'Henrique Liberato'
      },
      {
        value: 'https://i.ytimg.com/vi/7s6YIIZjfrQ/maxresdefault.jpg',
        label: 'Mariana Rondino'
      }]
    }
  },
  methods: {
    querySearchCampaign (queryString, callback) {
      var campaigns = this.campaigns
      var results = queryString ? campaigns.filter(this.createCampaignFilter(queryString)) : campaigns
      clearTimeout(this.campaignTimeout)
      this.campaignTimeout = setTimeout(() => {
        callback(results)
      }, 1000 * Math.random())
    },
    createCampaignFilter (queryString) {
      return (campaigns) => {
        return (campaigns.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelectCampaign (item) {
      console.log(item)
    },
    searchDealers (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.filteredDealers = this.dealersList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 1000)
      } else {
        this.filteredDealers = []
      }
    },
    showStrategyMessages () {
      this.showStrategyModal = true
      this.$store.dispatch('showLoading')
      this.$store.dispatch('getStrategyEngagement', 1).then(response => {
        this.strategyEngagements = response[0].steps
      }).catch(error => {
        console.error(error)
      }).finally(() => {
        this.$store.dispatch('hideLoading')
      })
    }
  }
}
</script>

<style lang="scss">
.jus-import-feedback-card {
  width: 100%;
  &+.jus-import-feedback-card {
    margin-top: 30px;
  }
  .el-tag--company-tag {
    margin-bottom: 10px;
    text-align: center;
  }
  .el-autocomplete, .el-select, .el-input, .select-strategy__messages {
    width: 100%;
  }
  .el-input__inner {
    border-bottom: 1px solid #dcdfe6 !important;
    border-top: 0;
    border-left: 0;
    border-right: 0;
  }
  .el-card__body {
    padding: 0;
    .el-select:last-of-type {
      .el-input__inner {
        border-bottom: 0;
      }
    }
  }
  .el-select__tags {
    margin-left: 35px;
  }
  .el-icon-circle-check-outline {
    color: #d1dbe2;
  }
  .select-strategy {
    .el-input__inner {
      border: 0 !important;
    }
  }
  .select-strategy__messages {
    border-bottom: 1px solid #dcdfe6;
    a {
      display: block;
      padding: 0px 0px 10px 16px;
    }
  }
  .select-dealer {
    .el-select__input {
      margin-left: 5px;
    }
  }
}
.jus-import-feedback-card__engagement {
  min-height: 100px;
}
</style>
