<template>
  <el-dialog
    :visible.sync="isDialogVisible"
    width="75%"
    custom-class="remove-team-member"
    destroy-on-close
    append-to-body
    center
  >
    <span slot="title">
      <jus-icon
        v-if="hasMembers"
        icon="alert"
        is-active
      />
      <span v-if="hasMembers">
        Remover {{ member.name }}?
      </span>
      <span v-else>
        Não há outro negociadore disponível
      </span>
    </span>

    <div
      v-if="countDisputesByNegotiator > 0 && hasMembers"
      class="remove-team-member__container"
    >
      <el-alert
        :closable="false"
        center
        class="remove-team-member__container-alert"
        type="info"
      >
        <span slot="title">
          <b>{{ member.name | capitalize }}</b> é responsável por <b>{{ countDisputesByNegotiator }}</b> disputa(s) nesta workspace.
        </span>
      </el-alert>

      <div class="remove-team-member__container-switch">
        <el-switch
          v-model="distributeManually"
          inactive-text="Distribuir igualmente"
          active-text="Distribuir manualmente"
          active-color="#14CC30"
          inactive-color="#14CC30"
        />
      </div>

      <span
        v-if="distributeManually"
        class="remove-team-member__container-manually-distribute-info"
      >
        <p>
          Ao escolher essa opção, você deverá escolher quais os negociadores irão receber os casos sob responsabilidade de <b>{{ member.name }}</b>. A distribuição das disputas entre os negociadores escolhidos é aleatória!
        </p>
      </span>

      <div
        v-if="distributeManually"
        class="remove-team-member__container-disputes-list"
      >
        <span
          v-for="(value, key) of disputesByNegotiator(member.id)"
          :key="key"
          :value="value"
          class="remove-team-member__container-disputes-list-item"
        >
          <span class="remove-team-member__container-disputes-list-item-text">
            {{ $tc(`dispute.status.${key}`, value > 1 ? 2 : 1) }}
          </span>
          <el-badge
            :value="value"
            class="mark remove-team-member__container-disputes-list-item-mark"
            type="primary"
          />
        </span>
      </div>

      <div
        v-if="distributeManually"
        class="remove-team-member__container-member-list"
      >
        <el-checkbox-group v-model="negotiators">
          <el-checkbox
            v-for="({ personId, person }) in members"
            :key="`member-${personId}`"
            :label="personId"
          >
            {{ person.name | capitalize }}
          </el-checkbox>
        </el-checkbox-group>
      </div>

      <div
        v-if="!distributeManually"
        class="remove-team-member__container-distribute-manually-alert"
      >
        <p>Ao escolher essa opção, os casos atribuídos a <b>{{ member.name }}</b> será distribuídos igualmente entre os demais negociadores ativos desta workspace!</p>
      </div>
    </div>
    <span
      v-else-if="hasMembers"
      class="remove-team-member__without-disputes"
    >
      <p>
        Tem certeza que dexeja excluir <b>{{ member.name }}</b> da sua workspace?<br>Esta ação é irreversível.
      </p>
    </span>
    <span
      v-else
      class="remove-team-member__without-outers-negotiators"
    >
      <p>
        Mussum Ipsum, cacilds vidis litro abertis. Não sou faixa preta cumpadi, sou preto inteiris, inteiris. Si u mundo tá muito paradis? Toma um mé que o mundo vai girarzis! Praesent malesuada urna nisi, quis volutpat erat hendrerit non. Nam vulputate dapibus. Nullam volutpat risus nec leo commodo, ut interdum diam laoreet. Sed non consequat odio.
      </p>
    </span>

    <span slot="footer">
      <el-button
        size="small"
        @click="isDialogVisible = false"
      >
        Cancelar
      </el-button>
      <el-button
        v-if="hasMembers"
        type="success"
        size="small"
        @click="handleRemoveMember()"
      >
        Confirmar
      </el-button>
      <el-button
        v-else
        type="primary"
        size="small"
        @click="addNewMember()"
      >
        Adicionar negociador
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
    negotiators: [],
    distributeManually: false,
    membersToDistribute: {}
  }),

  computed: {
    ...mapGetters({
      workspaceMembers: 'workspaceMembersSorted',
      disputesByNegotiator: 'getDisputesByNegotiatorSumary'
    }),

    currentMemberId() {
      return this.workspaceMembers.find(({ personId }) => Number(personId) === Number(this.member.id))?.id
    },

    members() {
      return (this.workspaceMembers || []).filter(({ personId }) => Number(personId) !== Number(this.member.id))
    },

    hasMembers() {
      return this.members.length > 0
    },

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

        if (!visibility) {
          this.hide()
        }
      }
    }
  },

  methods: {
    ...mapActions({
      getDisputes: 'getDisputesByMemberId',
      removeMember: 'removeWorkspaceMember',
      distributeDisputes: 'distributeMemberDisputes'
    }),

    show(member) {
      this.member = member
      this.isDialogVisible = true
      this.getDisputes(member.id)
    },

    hide() {
      this.member = { name: '' }
      this.negotiators = []

      if (this.isDialogVisible) {
        this.isDialogVisible = false
      }
    },

    addNewMember() {
      this.$emit('createMember')
      this.hide()
    },

    handleDistributeDisputes() {
      const data = {
        sourcePersonId: this.member.id,
        targetPersonIds: this.distributeManually ? this.negotiators : []
      }

      return this.countDisputesByNegotiator > 0 ? this.distributeDisputes(data) : new Promise(resolve => { resolve() })
    },

    handleRemoveMember() {
      this.handleDistributeDisputes().then(
        () => {
          this.removeMember(this.currentMemberId).then(() => {
            this.$jusNotification({
              type: 'success',
              title: 'Yay!',
              message: `${this.member.name} removido(a)!`
            })
          }).catch(
            error => this.jusNotification({ error })
          ).finally(() => this.hide())
        }
      )
    }
  }
}
</script>

<style lang="scss">
.remove-team-member {
  .el-dialog__header {
    margin-top: 16px;

    span {
      font-size: 20px;
      font-weight: bold;
    }
  }

  .el-dialog__body {
    margin: 0;
    padding: 16px;

    .remove-team-member__container {
      display: flex;
      flex-direction: column;
      gap: 24px;

      .remove-team-member__container-alert {
        background-color: #F9FAFB !important;
        box-shadow: 0px 0px 6px #00000029 !important;
        border: 1px solid #C4D9E8 !important;

        .el-alert__content {
          .el-alert__title {
            color: #707070;
          }
        }
      }

      .remove-team-member__container-switch {
        text-align: center;

        .el-switch {
          .is-active {
            color: #14CC30;
          }
        }
      }

      .remove-team-member__container-manually-distribute-info {
        display: flex;
        justify-content: center;

        p {
          font-size: 12px;
          max-width: 70%;
          text-align: center;
        }
      }

      .remove-team-member__container-distribute-manually-alert {
        display: flex;
        justify-content: center;

        p {
          font-size: 12px;
          max-width: 70%;
          text-align: center;
        }
      }

      .remove-team-member__container-disputes-list {
        display: flex;
        justify-content: space-between;
        gap: 8px;

        .remove-team-member__container-disputes-list-item {
          display: flex;
          align-items: center;
          gap: 2px;

          .remove-team-member__container-disputes-list-item-text {
            text-transform: uppercase;
            font-weight: 600;
            font-size: 12px;
          }

          .remove-team-member__container-disputes-list-item-mark {
            display: flex;

            sup {
              font-weight: 600;
            }
          }
        }
      }

      .remove-team-member__container-member-list {
        .el-checkbox-group {
          .el-checkbox {
            width: 30%;

            .el-checkbox__label {
              line-height: 14px;
              font-size: 12px;
            }
          }
        }
      }
    }

    .remove-team-member__without-disputes,
    .remove-team-member__without-outers-negotiators {
      display: flex;
      justify-content: center;

      p {
        font-size: 12px;
        text-align: center;
        max-width: 70%;
      }
    }
  }
}
</style>
