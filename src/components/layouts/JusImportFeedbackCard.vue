<template>
  <div class="jus-import-feedback-card">
    <el-tag :color="color" class="el-tag--company-tag">{{ company }}</el-tag>
    <el-card :style="'border-left: solid 4px ' + color">

      <el-autocomplete
        v-model="campaignName"
        :fetch-suggestions="querySearchAsync"
        :trigger-on-focus="false"
        placeholder="Dê um nome para a sua Campanha"
        @select="handleSelect"/>

      <el-select v-model="strategy" placeholder="Escolha uma estratégia">
        <el-option
          v-for="strategy in strategyOptions"
          :key="strategy.value"
          :label="strategy.label"
          :value="strategy.value"/>
      </el-select>

      <el-date-picker
        v-model="dueDate"
        type="date"
        placeholder="Defina a data limite para a negociação"/>

      <el-select
        v-model="value9"
        :remote-method="remoteMethod"
        :loading="loading"
        multiple
        filterable
        remote
        placeholder="Escolha os negociadores">
        <el-option
          v-for="item in options4"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>

    </el-card>
  </div>
</template>

<script>
export default {
  name: 'JusImportFeedbackCard',
  props: {
    company: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    responsibles: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      links: [
        { 'value': 'NESTLE-Natal2017', 'link': 'https://github.com/vuejs/vue' },
        { 'value': 'NESTLE-Natal2018', 'link': 'https://github.com/ElemeFE/element' }
      ],
      campaignName: '',
      timeout: null,
      strategyOptions: [{
        value: 'Option1',
        label: 'Option1'
      }, {
        value: 'Option2',
        label: 'Option2'
      }, {
        value: 'Option3',
        label: 'Option3'
      }, {
        value: 'Option4',
        label: 'Option4'
      }, {
        value: 'Option5',
        label: 'Option5'
      }],
      strategy: '',
      dueDate: '',
      options4: [],
      value9: [],
      loading: false,
      states: [
        'Henrique Liberato',
        'Mariana Rondino'
      ]
    }
  },
  computed: {
    list () {
      return this.states.map(item => {
        return { value: item, label: item }
      })
    }
  },
  methods: {
    querySearchAsync (queryString, cb) {
      var links = this.links
      var results = queryString ? links.filter(this.createFilter(queryString)) : links
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 3000 * Math.random())
    },
    querySearchAsync2 (queryString, cb) {
      var dealers = this.dealers
      var results = queryString ? dealers.filter(this.createFilter2(queryString)) : dealers
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 300 * Math.random())
    },
    createFilter (queryString) {
      return (link) => {
        return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    createFilter2 (queryString) {
      return (dealers) => {
        return (dealers.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
      console.log(item)
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options4 = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 500)
      } else {
        this.options4 = []
      }
    }
  }
}
</script>

<style lang="scss">
.jus-import-feedback-card {
  width: 100%;
  max-width: 400px;
  &+.jus-import-feedback-card {
    margin-left: 40px;
  }
  .el-tag {
    margin-bottom: 10px;
    text-align: center;
  }
  .el-autocomplete, .el-select, .el-input {
    width: 100%;
  }
  .el-input__inner {
    border: none;
  }
}
</style>
