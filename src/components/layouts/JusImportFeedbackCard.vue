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
          v-for="strategy in strategyOptions"
          :key="strategy.value"
          :label="strategy.label"
          :value="strategy.value"
        />
      </el-select>

      <el-date-picker
        v-model="dueDate"
        :prefix-icon="dueDate === null ? 'el-icon-circle-check-outline' : 'el-icon-circle-check el-input__icon--success'"
        type="date"
        placeholder="Defina a data limite para a negociação"
      />

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
          :class="value9.length === 0 ? 'el-icon-circle-check-outline' : 'el-icon-circle-check el-input__icon--success'"
          class="el-input__icon"
        />
        <el-option
          v-for="item in options4"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          class="select-dealer">
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
