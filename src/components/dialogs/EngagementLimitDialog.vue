<template>
  <el-dialog
    v-loading="isLoading"
    title="Entre em contato por telefone"
    :visible.sync="dialogVisible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="engagement-limit-dialog"
    width="auto"
    center
    append-to-body
    destroy-on-close
  >
    <div class="engagement-limit__content">
      <el-alert
        title="Recomendação"
        class="engagement-limit__alert"
        type="info"
        :closable="false"
        center
      >
        <p>
          Já executamos várias tentativas automáticas de contato,
          <br>
          continuaremos tentando via e-mail.
          <br>
          <br>
          Porém, recomendamos que tente realizar ligações telefonicas!
        </p>
      </el-alert>

      <h3 class="engagement-limit__label">
        Contatos disponíveis:
      </h3>

      <div
        v-for="contact of summarizedPartyContacts"
        v-show="(contact.phones || []).length > 0"
        :key="`party#${contact.id}`"
        class="engagement-limit__content-item"
      >
        <el-checkbox
          :value="isAllCheck(contact.id)"
          :indeterminate="isIndeterminate(contact.id) && !isAllCheck(contact.id)"
          class="engagement-limit__content-item__checkbox"
          @change="handleCheckAllChange(contact.id)"
        >
          <div>
            {{ contact.name }} ({{ translatedPartyType(contact) | capitalize }})
          </div>
        </el-checkbox>

        <el-checkbox-group v-model="toCall">
          <el-checkbox
            v-for="phone of (contact.phones || [])"
            :key="`phone#${phone.id}`"
            :label="phone.id"
          >
            {{ phone.number | phoneNumber }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="mini"
        @click="dialogVisible = false"
      >
        Ignorar
      </el-button>

      <el-button
        type="primary"
        size="mini"
        :disabled="!toCall.length"
        @click="handlemMakeCall"
      >
        Ligar {{ toCall.length ? `para ${toCall.length} contato(s)` : '' }}
      </el-button>

      <br><br>

      <sub v-if="toCall.length > 1">
        *Os contatos seráo adicionados à fila de ligações,
        <br>
        que ira executar chamadas para todos
        <br>
        os contatos selecionados em sequência.
      </sub>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    disputeId: {
      type: Number,
      required: true
    }
  },

  data: () => ({
    isLoading: false,
    toCall: []
  }),

  computed: {
    ...mapGetters({
      engagementLimit: 'getEngagementLimit',
      isRecovery: 'isWorkspaceRecovery',
      appInstance: 'getAppInstance',
      dispute: 'dispute'
    }),

    dialogVisible: {
      get() {
        return this.engagementLimit
      },

      set(value) {
        this.setEngageLimit({ value: String(value) })
      }
    },

    summarizedPartyContacts() {
      return (this.dispute.disputeRoles || []).filter(({ party }) => party === 'CLAIMANT').map(({ id, name, phones, party, roles }) => {
        return {
          id,
          name,
          party,
          roles,
          phones: phones.filter(({ archived, blocked, isMain, isValid }) => (!archived && !blocked && isMain && isValid))
        }
      })
    },

    countContactsSelected() {
      return (contactId) => {
        return (this.summarizedPartyContacts.find(({ id }) => {
          return id === contactId
        })?.phones || []).filter(({ id }) => {
          return this.toCall.includes(id)
        }).length
      }
    },

    isIndeterminate() {
      return (contactId) => this.countContactsSelected(contactId) > 0
    },

    isAllCheck: {
      get() {
        return (contactId) => {
          const length = (this.summarizedPartyContacts.find(({ id }) => id === contactId)?.phones || []).length

          return length > 0 && length === this.countContactsSelected(contactId)
        }
      }
    },

    translatedPartyType() {
      return (contact) => {
        let role = 'UNKNOWN'

        if (contact.roles.includes('PARTY')) {
          if (contact.roles.includes('LAWYER')) {
            role = 'OWN_CAUSE'
          } else {
            role = 'PARTY'
          }
        } else if (contact.roles.includes('LAWYER')) {
          role = 'LAWYER'
        }

        return this.$tc(`roles.${role}.CLAIMANT`, this.isRecovery)
      }
    }
  },

  watch: {
    engagementLimit: {
      handler: 'fetchData',
      deep: true
    }
  },

  methods: {
    ...mapActions({
      getDispute: 'getDispute',
      addCall: 'addCall'
    }),

    ...mapMutations({ setEngageLimit: 'handleEngageLimit' }),

    fetchData(visible) {
      if (visible) {
        this.isLoading = true

        this.getDispute(this.disputeId).finally(() => {
          this.isLoading = false
        })
      }
    },

    handleCheckAllChange(contactId) {
      const contactPhones = (this.summarizedPartyContacts.find(({ id }) => id === contactId)?.phones || []).map(({ id }) => id)

      const haveInclude = contactPhones.filter(id => this.toCall.includes(id)).length > 0
      const haveAllInclude = contactPhones.filter(id => this.toCall.includes(id)).length === contactPhones.length

      if (!haveAllInclude && !haveInclude) {
        this.toCall = [
          ...this.toCall,
          ...contactPhones
        ]
      } else if (!haveAllInclude && haveInclude) {
        this.toCall = [
          ...this.toCall,
          ...(contactPhones.filter(id => !this.toCall.includes(id)))
        ]
      } else {
        this.toCall = [...this.toCall.filter(id => !contactPhones.includes(id))]
      }
    },

    handlemMakeCall() {
      this.toCall.forEach(phoneId => {
        const role = (this.dispute?.disputeRoles || []).find(role => {
          const phoneIds = (role?.phones || []).map(({ id }) => id)
          return phoneIds.includes(phoneId)
        })

        const toRoleId = role.id
        const toRoleName = role.name
        const number = role?.phones.find(({ id }) => id === phoneId)?.number

        const callVM = {
          disputeId: Number(this.disputeId),
          disputeStatus: this.dispute.status,
          toRoleId,
          toRoleName,
          number,
          appInstance: this.appInstance,
          contacts: {
            emails: role?.emails,
            phones: role?.phones
          }
        }

        this.addCall(callVM)
      })

      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.engagement-limit-dialog {
  .el-dialog__body {
    .engagement-limit__content {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .engagement-limit__label {
        margin: 0;
        font-weight: 600;
      }

      .engagement-limit__content-item {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .el-checkbox-group {
          display: flex;
          flex-direction: column;
          padding-left: 16px;
        }
      }
    }
  }
}
</style>
