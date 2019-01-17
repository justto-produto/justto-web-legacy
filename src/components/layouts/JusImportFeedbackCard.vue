<template>
  <div class="jus-import-feedback-card">
    <el-tag :color="color" class="el-tag--company-tag">{{ company }}</el-tag>
    <el-card :style="'border-left: solid 4px ' + color">

      <el-autocomplete
        v-model="campaignName"
        :fetch-suggestions="querySearchAsync"
        :trigger-on-focus="false"
        clearable
        placeholder="Dê um nome para a sua Campanha"
        @select="handleSelect">
        <i
          slot="prefix"
          class="el-input__icon el-icon-circle-check"
          :class="{'el-input__icon--success': campaignName !== ''}"
        />
      </el-autocomplete>
      <el-select v-model="strategy" clearable placeholder="Escolha uma estratégia">
        <i
          slot="prefix"
          class="el-input__icon el-icon-circle-check"
          :class="{'el-input__icon--success': strategy !== ''}"
        />
        <el-option
          v-for="strategy in strategyOptions"
          :key="strategy.value"
          :label="strategy.label"
          :value="strategy.value"
        />
      </el-select>

      <el-date-picker
        v-model="dueDate"
        type="date"
        :prefix-icon="dueDate === null ? 'el-icon-circle-check' : 'el-icon-circle-check el-input__icon--success'"
        placeholder="Defina a data limite para a negociação">
      </el-date-picker>

      <el-select
        v-model="value9"
        :remote-method="remoteMethod"
        :loading="loading"
        size="large"
        placeholder="Escolha os negociadores"
        multiple
        filterable
        remote>

        <i
          slot="prefix"
          class="el-input__icon el-icon-circle-check"
          :class="{'el-input__icon--success': value9.length !== 0}"
        />
        <el-option
          v-for="item in options4"
          :key="item.value"
          :label="item.label"
          :value="item.value">
          <jus-avatar-user shape="circle" size="xs" :src="item.value"/>
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
      dueDate: null,
      options4: [],
      value9: [],
      loading: false,
      list: [{
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
  // TODO: verificar se dá pra tirar
  .el-select__tags {
    margin-left: 25px;
  }
}
</style>
