<template>
  <el-dialog
    title="Remover Participante"
    :visible.sync="isDialogVisible"
    width="50%"
    custom-class="remove-team-member"
    destroy-on-close
    append-to-body
  >
    <div class="remove-team-member__container">
      <el-alert
        :closable="false"
        center
        class="remove-team-member__container-alert"
        type="info"
      >
        <span slot="title">
          <b>{{ member.name }}</b> está vinculado(a) <b>{{ countDisputesByNegotiator }}</b> disputa(s) nesta.
        </span>
      </el-alert>

      <div>
        <el-switch
          v-model="distributeManually"
          inactive-text="Distribuir igualmente"
          active-text="Distribuir manualmente"
        />
      </div>

      <div
        v-if="distributeManually"
        class="remove-team-member__container-disputes-list"
      >
        <div
          v-for="(value, key) of disputesByNegotiator(member.id)"
          :key="key"
          class="remove-team-member__container-disputes-list-item"
        >
          <label
            for=""
            class="remove-team-member__container-disputes-list-item-label"
          >
            <el-badge
              :value="value"
              type="primary"
            >
              <span>
                {{ $tc(`dispute.status.${key}`, value > 1 ? 2 : 1) }}
              </span>
            </el-badge>
          </label>
          <el-select
            v-model="membersToDistribute[key]"
            size="mini"
            class="remove-team-member__container-disputes-list-item-select"
          >
            <el-option
              :value="undefined"
              label="Escolha um negociador"
              disabled
            />

            <el-option
              value="1"
              label="Thamiris"
            />
          </el-select>
        </div>
      </div>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        @click="isDialogVisible = false"
      >Cancel</el-button>
      <el-button
        type="primary"
        @click="isDialogVisible = false"
      >
        Confirm
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data: () => ({
    visible: false,
    member: {
      name: ''
    },
    distributeManually: false,
    membersToDistribute: {}
  }),
  computed: {
    ...mapGetters({
      disputesByNegotiator: 'getDisputesByNegotiatorSumary'
    }),

    countDisputesByNegotiator() {
      return Object.values(this.disputesByNegotiator(this.member.id)).reduce((acc, cur) => ((acc || 0) + cur))
    },

    isDialogVisible: {
      get() {
        return this.visible
      },
      set(visibility) {
        this.visible = visibility
        this.$emit(visibility ? 'show' : 'hide', {})
      }
    }
  },

  methods: {
    ...mapActions({
      getDisputes: 'getDisputesByMemberId'
    }),

    show(member) {
      this.member = member
      this.isDialogVisible = true
      this.getDisputes(member.id)
    },

    hide() {
      this.isDialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.remove-team-member {
  .el-dialog__body {
    .remove-team-member__container {
      display: flex;
      flex-direction: column;
      gap: 24px;

      .remove-team-member__container-disputes-list {
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        gap: 16px;

        .remove-team-member__container-disputes-list-item {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .remove-team-member__container-disputes-list-item-label {
            .el-badge {
              span {
                font-weight: bold;
                text-transform: uppercase;
                margin-right: 8px;
              }
            }
          }
        }

      }
    }
  }
}
</style>
