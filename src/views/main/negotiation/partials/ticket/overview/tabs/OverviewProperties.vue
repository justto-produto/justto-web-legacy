<template>
  <div
    v-loading="loading"
    element-loading-background="rgba(247, 247, 247, 0.7)"
    class="dispute-properties-view"
  >
    <div
      v-for="(propriety, index) in disputePropertiesList"
      :key="lineKey + index"
      class="dispute-properties-view__line"
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
      <el-link
        v-if="!isPreNegotiation"
        :underline="false"
        type="danger"
        icon="el-icon-delete"
        @click="removePropriety(propriety.key)"
      />
    </div>
    <el-tooltip
      content="Propriedade não editável"
      :open-delay="600"
    >
      <div
        v-if="disputeProperties['ENRIQUECIDO']"
        class="dispute-properties-view__line"
      >
        <div class="key">
          <div class="label">
            ENRIQUECIDO:
          </div>
        </div>
        <div class="value">
          <div class="label">
            {{ disputeProperties['ENRIQUECIDO'] }}
          </div>
        </div>
      </div>
    </el-tooltip>
    <div
      v-if="!isPreNegotiation"
      class="dispute-properties-view__line mt20"
    >
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
      <el-tooltip
        content="Adicionar propriedade"
        :open-delay="500"
      >
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
import { mapActions, mapGetters } from 'vuex'
import preNegotiation from '@/utils/mixins/ticketPreNegotiation'

export default {
  name: 'OverviewProperties',

  mixins: [preNegotiation],

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
    ...mapGetters({
      ticketProperties: 'getTicketOverviewProperties'
    }),

    disputePropertiesList() {
      const list = []
      for (const properties of Object.entries(this.disputeProperties)) {
        if (!['ERROR_COUT', 'ENRIQUECIDO'].includes(properties[0])) {
          list.push({
            key: properties[0],
            value: properties[1]
          })
        }
      }
      return list.sort((a, b) => {
        if (a.key === b.key) return 0
        else return a.key > b.key ? 1 : -1
      })
    },
    disputeProperties: {
      get() {
        return this.ticketProperties
      },
      set(properties) {
        const { id } = this.$route.params
        this.$store.dispatch('putDisputeProperties', {
          disputeId: id,
          data: properties
        }).finally(() => {
          this.getAssociatedContacts(id)
          this.newKey = ''
          this.newValue = ''
          this.loading = false
        })
      }
    }
  },
  methods: {
    ...mapActions(['getAssociatedContacts']),

    focus(key, index) {
      if (this.isPreNegotiation) return
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
        const newDisputeProperties = JSON.parse(JSON.stringify(this.disputeProperties))
        newDisputeProperties[this.editable] = newDisputeProperties[key]
        delete newDisputeProperties[key]
        this.disputeProperties = newDisputeProperties
      }
    },

    blurValue(key, value, index) {
      this.editing[value + index] = false
      this.lineKey += 1
      if (value !== this.editable) {
        this.loading = true
        const newDisputeProperties = JSON.parse(JSON.stringify(this.disputeProperties))
        newDisputeProperties[key] = this.editable
        this.disputeProperties = newDisputeProperties
      }
    },

    removePropriety(key) {
      this.loading = true
      const newDisputeProperties = JSON.parse(JSON.stringify(this.disputeProperties))
      delete newDisputeProperties[key]
      this.disputeProperties = newDisputeProperties
    },

    newPropriety() {
      if (this.newKey && this.newValue) {
        this.loading = true
        const newDisputeProperties = JSON.parse(JSON.stringify(this.disputeProperties))
        newDisputeProperties[this.newKey] = this.newValue
        this.disputeProperties = newDisputeProperties
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
.dispute-properties-view {
  overflow-y: auto;
  height: 100%;
  padding-top: 4px;
  &__line {
    display: flex;
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
