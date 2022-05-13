<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    :title="$tc('configurations.CLOSING_REASONS.label')"
    width="60%"
    custom-class="closing-reason-dialog"
    destroy-on-close
    center
    :before-close="handleClose"
  >
    <el-checkbox-group
      v-model="selectedReasons"
      v-loading="loading"
      class="outcome-reasons-container"
    >
      <el-checkbox
        v-for="option in allReasons.UNSETTLED"
        :key="option.value"
        :label="option.value"
        size="mini"
        border
      >
        {{ option.label }}
      </el-checkbox>

      <el-input
        v-model="newClosingReason"
        placeholder="Adicione um novo motivo"
        size="mini"
        @keypress.enter.native="handleAddReason"
      >
        <template
          v-if="newClosingReason"
          slot="suffix"
        >
          <i
            class="el-icon-check"
            @click="handleAddReason"
          />
        </template>
      </el-input>
    </el-checkbox-group>

    <span slot="footer">
      <el-button
        size="small"
        @click="visible = false"
      >
        Cancelar
      </el-button>

      <el-button
        size="small"
        type="success"
        @click="handleSaveReasons"
      >Salvar</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { uuidv4 } from '@/utils'

export default {
  data: () => ({
    visible: false,
    loading: false,
    reasons: { UNSETTLED: [] },
    reasonsMapped: { UNSETTLED: [] },
    defaultReasons: { UNSETTLED: [] },
    defaultReasonsMapped: { UNSETTLED: [] },
    selectedReasons: [],
    newClosingReason: ''
  }),

  computed: {
    allReasons() {
      return {
        UNSETTLED: [
          ...this.reasons.UNSETTLED,
          ...this.defaultReasons.UNSETTLED.filter(({ value }) => !Object.keys(this.reasonsMapped.UNSETTLED).includes(value))
        ]
      }
    },

    allReasonsMapped() {
      return {
        UNSETTLED: this.allReasons.UNSETTLED.map(({ value }) => value)
      }
    }
  },

  methods: {
    ...mapActions([
      'getOutcomeReasonsConfig',
      'getDefaultOutcomeReasons',
      'getDisputeStatuses',
      'setOutcomeReasons'
    ]),

    openFeatureDialog() {
      this.visible = true
      this.loading = true
      this.selectedReasons = []

      Promise.allSettled([
        this.initReasons(),
        this.initDefaultReasons()
      ]).finally(() => {
        this.loading = false
      })
    },

    async initReasons() {
      return await Object.keys(this.reasons).forEach(async type => {
        this.reasons[type] = []

        this.getDisputeStatuses(type).then(res => {
          this.reasonsMapped[type] = res

          this.reasons[type] = Object.keys(res).map(key => {
            this.selectedReasons = [...this.selectedReasons, key]

            return { value: key, label: res[key] }
          })
        })
      })
    },

    async initDefaultReasons() {
      return await Object.keys(this.reasons).forEach(async type => {
        this.defaultReasons[type] = []

        this.getDefaultOutcomeReasons(type).then(res => {
          this.defaultReasonsMapped = res

          this.defaultReasons[type] = Object.keys(res).map(key => ({ value: key, label: res[key] }))
        })
      })
    },

    handleClose(done) {
      this.visible = false
      this.selectedReasons = []

      done()
    },

    handleSaveReasons() {
      const reasons = this.selectedReasons.reduce((acc, key) => {
        acc[key] = this.allReasons.UNSETTLED.find(({ label, value }) => (value === key)).label

        return acc
      }, {})

      this.setOutcomeReasons({ type: 'UNSETTLED', reasons }).then(() => {
        this.$jusNotification({
          type: 'success',
          title: 'Yay!',
          message: `${this.$tc('configurations.CLOSING_REASONS.label')} salvos com sucesso`
        })
        this.getOutcomeReasonsConfig('UNSETTLED')
        this.getDisputeStatuses('UNSETTLED')
      }).catch(error => this.$jusNotification({ error })).finally(() => {
        this.loading = false
        this.visible = false
      })
    },

    handleAddReason(_event) {
      const reason = {
        label: this.newClosingReason,
        value: uuidv4()
      }

      this.allReasons.UNSETTLED = [...this.allReasons.UNSETTLED, reason]
      this.selectedReasons = [...this.selectedReasons, reason.value]
      this.newClosingReason = ''
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.closing-reason-dialog {
  .el-dialog__body {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .outcome-reasons-container {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: flex-start;

      .el-checkbox {
        margin: 0;
        flex: 1;
      }

      .el-input {
        width: 30%;

        .el-input__suffix {
          display: flex;
          align-items: center;

          span {
            cursor: pointer;

            i {
              color: $--color-primary;

              &::before {
                font-weight: bold;
              }
            }
          }
        }
      }
    }
  }
}
</style>
