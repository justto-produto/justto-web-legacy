<template>
  <article
    v-if="isUnknow"
    class="unknow-party-container"
  >
    <span class="unknow-party-container__header">
      Ajude-nos a identificar a polaridade correta. Quem {{ unknownName }} está representando?
    </span>

    <div class="unknow-party-container__body">
      <el-button
        v-for="(item, index) in compactedParties"
        :key="`item#${index}`"
        size="small"
        round
        @click="saveParty(item)"
      >
        <JusIcon :icon="item.polarity === 'CLAIMANT' ? 'plaintff' : 'company'" />

        <div class="unknow-party-container__body__names-container">
          <span
            v-for="(name, indexName) in item.name.split(', ')"
            :key="`${name}#${indexName}`"
            class="unknow-party-container__body__name"
            v-text="name"
          />
        </div>
      </el-button>
    </div>
  </article>

  <article
    v-else
    class="unknow-party-container"
  >
    <div class="unknow-party-container__resolved">
      Polaridade já definida! <i class="el-icon-check" />
    </div>
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    partyRole: {}
  }),

  computed: {
    ...mapGetters({
      isRecovery: 'isWorkspaceRecovery',
      ticketParties: 'getTicketOverviewParties',
      dispute: 'dispute',
      disputeStatus: 'getDisputeStatus'
    }),

    unknownName() {
      const { resumedName } = this.$options.filters

      return resumedName(this.occurrence?.properties?.PERSON_NAME || '')
    },

    unknownFullName() {
      return this.occurrence?.properties?.PERSON_NAME || ''
    },

    parties() {
      if (this.$route.name === 'ticket') {
        return this.ticketParties.filter(({ roles }) => roles.includes('PARTY')).map(p => ({
          name: p.name,
          roles: p.roles,
          polarity: p.polarity
        }))
      } else if (this.$route.name === 'dispute') {
        return (this.dispute?.disputeRoles || []).filter(({ roles }) => roles.includes('PARTY')).map(p => ({
          name: p.name,
          roles: p.roles,
          polarity: p.party
        }))
      } else {
        return []
      }
    },

    compactedParties() {
      const { capitalize } = this.$options.filters

      const claimantsNames = this.parties.filter(({ polarity }) => polarity === 'CLAIMANT').map(({ name }) => capitalize(name.split(' ')[0])).join(', ')
      const respondentsNames = this.parties.filter(({ polarity }) => polarity === 'RESPONDENT').map(({ name }) => capitalize(name.split(' ')[0])).join(', ')

      return [{
        name: claimantsNames,
        polarity: 'CLAIMANT',
        roles: ['PARTY']
      }, {
        name: respondentsNames,
        polarity: 'RESPONDENT',
        roles: ['PARTY']
      }]
    },

    isUnknow() {
      // TODO: SAAS-5493 Validar se a polaridade da parte foi resolvida.
      return !(['CLAIMANT', 'RESPONDENT'].includes(this.parties?.find(({ name }) => name === this.unknownFullName)?.polarity))
    },

    occurrence: {
      get() { return this.value },
      set(value) { this.$emit('input', value) }
    }
  },

  methods: {
    ...mapActions([
      'setTicketOverviewParty',
      'restartDisputeRoleEngagement'
    ]),

    saveParty({ polarity }) {
      // TODO: SAAS-4312 Salvar parte.
      const disputeId = this.$route?.params?.id
      const { PERSON_NAME, ROLE_NAME, OAB_NUMBER, DOCUMENT_NUMBER } = this.occurrence?.properties || {}

      const data = {
        party: polarity,
        documentNumber: DOCUMENT_NUMBER,
        name: PERSON_NAME,
        main: true,
        roles: [ROLE_NAME],
        oabs: OAB_NUMBER ? [OAB_NUMBER] : []
      }

      const partiesName = this.compactedParties[{ CLAIMANT: 0, RESPONDENT: 1 }[polarity]].name

      const text = `Cadastrar ${this.unknownFullName} como ${this.$tc('roles.LAWYER.' + polarity, this.isRecovery)}(${partiesName}).`

      this.$confirm(text, 'Identificar polaridade', {
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        center: true
      }).then(() => {
        this.setTicketOverviewParty({ disputeId, data, isNew: true }).then(role => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Polaridade identificada com sucesso!',
            type: 'success',
            dangerouslyUseHTMLString: true
          })

          if (this.disputeStatus === 'PENDING') {
            this.restartDisputeRoleEngagement({
              disputeId,
              disputeRoleId: role.id
            })
          }
        }).catch((error) => this.$jusNotification({ error }))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .unknow-party-container {
    margin: 8px 0 0;
    display: flex;
    gap: 4px;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .unknow-party-container__header {
      text-align: center;
    }

    .unknow-party-container__body {
      display: flex;
      gap: 8px;
      min-width: 25%;

      .unknow-party-container__body__names-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 2px;
        .unknow-party-container__body__name {
          gap: 0px;

          &:not(:last-child):after {
            content: ','
          }
        }
      }
    }

    .unknow-party-container__resolved {
      margin-top: 8px;
      text-align: center;
      font-weight: 600;
      font-size: 18px;
    }
  }
</style>

<style lang="scss">
  .unknow-party-container {
    .unknow-party-container__body {
      .el-select {
        .el-input {
          overflow: hidden;
        }
      }

      .el-button {
        padding: 8px;

        span {
          display: flex;
          gap: 8px;
          align-items: center;
          margin: 0 4px;

          img {
            width: 24px;
            height: 24px;
          }
        }
      }
    }
  }
</style>
