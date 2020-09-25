<template lang="html">
  <div
    v-loading="loading"
    element-loading-background="rgba(247, 247, 247, 0.7)"
    class="dispute-proprieties-view"
  >
    <div
      v-for="(propriety, index) in disputeProprietiesList"
      :key="lineKey + index"
      class="dispute-proprieties-view__line"
    >
      <div class="edit">
        <!-- KEY -->
        <div class="key">
          <div
            v-show="!editing[propriety.key + index]"
            class="label"
            @click="focus(propriety.key, index)"
          >
            {{ propriety.key + ':' }}
          </div>
          <el-input
            v-show="editing[propriety.key + index]"
            :ref="'input' + propriety.key + index"
            v-model="editable"
            @keyup.enter.native="blurKey(propriety.key, index)"
            @blur="blurKey(propriety.key, index)"
          />
        </div>
        <!-- VALUE -->
        <div class="value">
          <div
            v-show="!editing[propriety.value + index]"
            class="label"
            @click="focus(propriety.value, index)"
          >
            <span> {{ propriety.value }} </span>
          </div>
          <el-input
            v-show="editing[propriety.value + index]"
            :ref="'input' + propriety.value + index"
            v-model="editable"
            :autosize="true"
            type="textarea"
            @keydown.enter.exact.prevent.native
            @keydown.enter.shift.exact.prevent.native
            @keyup.enter.exact.native="blurValue(propriety.key, propriety.value, index)"
            @blur="blurValue(propriety.key, propriety.value, index)"
          />
        </div>
      </div>
      <!-- ACTION -->
      <el-tooltip content="Remover propriedade">
        <el-link
          :underline="false"
          type="danger"
          icon="el-icon-delete"
          @click="removePropriety(propriety.key)"
        />
      </el-tooltip>
    </div>
    <el-tooltip content="Propriedade não editável">
      <div
        v-if="disputeProprieties['ENRIQUECIDO']"
        class="dispute-proprieties-view__line"
      >
        <div class="key">
          <div class="label">
            ENRIQUECIDO:
          </div>
        </div>
        <div class="value">
          <div class="label">
            {{ disputeProprieties['ENRIQUECIDO'] }}
          </div>
        </div>
      </div>
    </el-tooltip>
    <div class="dispute-proprieties-view__line mt20">
      <div class="key">
        <el-autocomplete
          v-model="newKey"
          :fetch-suggestions="getSuggestionsKeys"
          placeholder="Chave"
          @keyup.enter.exact.native="newPropriety"
        />
      </div>
      <div class="value">
        <el-input
          v-model="newValue"
          autosize
          placeholder="Valor"
          type="textarea"
          @keydown.enter.exact.prevent.native
          @keydown.enter.shift.exact.prevent.native
          @keyup.enter.exact.native="newPropriety"
        />
      </div>
      <el-tooltip content="Adicionar propriedade">
        <el-link
          :underline="false"
          type="primary"
          icon="el-icon-plus"
          @click="newPropriety"
        />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DisputeProprieties',
  data() {
    return {
      loading: false,
      lineKey: 0,
      keyToEdit: {},
      valueToEdit: {},
      editing: {},
      editable: '',
      newKey: '',
      newValue: ''
    }
  },
  computed: {
    disputeProprietiesList() {
      const list = []
      for (const proprieties of Object.entries(this.disputeProprieties)) {
        if (!['ERROR_COUT', 'ENRIQUECIDO'].includes(proprieties[0])) {
          list.push({
            key: proprieties[0],
            value: proprieties[1]
          })
        }
      }
      return list.sort((a, b) => {
        if (a.key === b.key) return 0
        else return a.key > b.key ? 1 : -1
      })
    },
    disputeProprieties: {
      get() {
        return this.$store.getters.disputeProprieties
      },
      set(proprieties) {
        this.$store.dispatch('putDisputeProprieties', {
          disputeId: this.$store.getters.disputeId,
          data: proprieties
        }).finally(() => {
          this.newKey = ''
          this.newValue = ''
          this.loading = false
        })
      }
    }
  },
  methods: {
    focus(key, index) {
      this.editing[key + index] = true
      this.lineKey += 1
      this.editable = key
      this.$nextTick(() => this.$refs['input' + key + index][0].$el.children[0].focus())
    },
    blurKey(key, index) {
      this.editing[key + index] = false
      this.lineKey += 1
      if (key !== this.editable) {
        this.loading = true
        const newDisputeProprieties = JSON.parse(JSON.stringify(this.disputeProprieties))
        newDisputeProprieties[this.editable] = newDisputeProprieties[key]
        delete newDisputeProprieties[key]
        this.disputeProprieties = newDisputeProprieties
      }
    },
    blurValue(key, value, index) {
      this.editing[value + index] = false
      this.lineKey += 1
      if (value !== this.editable) {
        this.loading = true
        const newDisputeProprieties = JSON.parse(JSON.stringify(this.disputeProprieties))
        newDisputeProprieties[key] = this.editable
        this.disputeProprieties = newDisputeProprieties
      }
    },
    removePropriety(key) {
      this.loading = true
      const newDisputeProprieties = JSON.parse(JSON.stringify(this.disputeProprieties))
      delete newDisputeProprieties[key]
      this.disputeProprieties = newDisputeProprieties
    },
    newPropriety() {
      if (this.newKey && this.newValue) {
        this.loading = true
        const newDisputeProprieties = JSON.parse(JSON.stringify(this.disputeProprieties))
        newDisputeProprieties[this.newKey] = this.newValue
        this.disputeProprieties = newDisputeProprieties
      }
    },
    getSuggestionsKeys(queryString, cb) {
      const keys = [
        { value: 'COMARCA' },
        { value: 'AREA' },
        { value: 'FORO' },
        { value: 'VARA' },
        { value: 'SITUACAO' },
        { value: 'TRIBUNAL' },
        { value: 'ESTADO' }
      ]
      cb(queryString ? keys.filter((key) => (key.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)) : keys)
    }
  }
}
</script>

<style lang="scss">
.dispute-proprieties-view {
  padding-top: 10px;
  overflow-y: auto;
  height: calc(100% - 24px);
  &__line {
    display: flex;
    // flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    .edit {
      display: flex;
      flex-direction: column;
      .key {
        white-space: nowrap;
        .label {
          font-weight: 600;
        }
      }
      .value {
        width: 100%;
        margin-left: 5px;
      }
    }
    .label {
      margin: 5px 0;
      word-break: break-all;
      border-bottom: 2px solid #FFFFFF00
    }
    .el-link {
      margin-top: 6px;
      margin-left: 10px;
    }
    .el-input__inner, .el-textarea__inner, .el-autocomplete {
      overflow: hidden;
      line-height: initial !important;
      border: 0;
      border-bottom: 2px solid #e4e7ed;
      padding-left: 0px;
      height: 28px;
      line-height: 28px;
      background-color: #FFFFFF00
    }
    .el-autocomplete {
      min-width: 120px;
    }
  }
}
</style>
