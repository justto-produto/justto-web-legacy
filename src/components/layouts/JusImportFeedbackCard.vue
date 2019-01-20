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
      <el-select v-model="strategy" clearable placeholder="Escolha uma estratégia">
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
  </div>
</template>

<script>
export default {
  name: 'JusImportFeedbackCard',
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
  .el-autocomplete, .el-select, .el-input {
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
  .select-dealer {
    .el-select__input {
      margin-left: 5px;
    }
  }
}
</style>
