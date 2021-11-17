<template>
  <el-collapse-item
    :name="party.disputeRoleId"
    class="party-resumed"
    :class="{'hide-arrows': hideArrows}"
  >
    <template slot="title">
      <JusIcon
        v-if="state.hasAlert && !hideArrows && state.isDead"
        class="el-icon-pulse vexatious-alert"
        icon="flat-alert"
      />

      <i
        v-else-if="state.hasAlert && !hideArrows && state.isNamesake"
        class="el-icon-warning el-icon-pulse vexatious-alert"
        :style="{ color: state.alertColor }"
      />

      <JusIcon
        v-else-if="state.hasAlert && !hideArrows && state.isVexatious"
        class="el-icon-pulse vexatious-alert"
        icon="flat-alert-yellow"
      />

      <JusIcon
        class="party-resumed__header-avatar"
        :icon="partyType"
      />

      <article>
        <JusIcon
          v-if="isOnline"
          class="party-resumed__header-online"
          icon="online"
        />
        <span class="party-resumed__header-name">
          {{ party.name | resumedName }}
        </span>
        <div
          v-if="party.polarity === 'CLAIMANT' && party.documentNumber && !(['lawyer'].includes(partyType) && party.oabs && party.oabs.length)"
          :class="{ 'party-resumed__header-document--hidden': isActiveCollapseItem }"
          class="party-resumed__header-document"
        >
          <b>{{ documentType }}: </b>{{ party.documentNumber | cpfCnpj }}
        </div>
        <div
          v-if="party.polarity === 'CLAIMANT' && ['lawyer', 'own-cause'].includes(partyType) && party.oabs && party.oabs.length"
          :class="{ 'party-resumed__header-document--hidden': isActiveCollapseItem }"
          class="party-resumed__header-document"
        >
          <b>OAB: </b>{{ party.oabs[0] }}
        </div>
        <div
          :class="{ 'party-resumed__header-document--hidden': !isActiveCollapseItem && !hideArrows }"
          class="party-resumed__header-document"
        >
          {{ translatedPartyType | capitalize }}
        </div>
      </article>
    </template>

    <PartyDetails :party="party" />
  </el-collapse-item>
</template>

<script>
import TicketTicketOverviewPartyResumed from '@/models/negotiations/overview/TicketOverviewPartyResumed'
import { mapGetters } from 'vuex'

export default {
  name: 'PartyResumed',

  components: {
    PartyDetails: () => import('./PartyDetails')
  },

  props: {
    party: {
      type: Object,
      required: true
    },
    activeCollapseItem: {
      type: [Number, String],
      default: null
    },
    hideArrows: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      online: 'onlineDocuments',
      isRecovery: 'isWorkspaceRecovery'
    }),

    isActiveCollapseItem() {
      return this.party.disputeRoleId === this.activeCollapseItem
    },

    isOnline() {
      const docs = Object.keys(this.online)
      return this.party.status === 'ONLINE' || docs.includes(this.party.documentNumber) || (this.party.oabs || []).filter(oab => docs.includes(oab)).length
    },

    documentType() {
      return this.party.documentNumber?.length <= 11 ? 'CPF' : 'CNPJ'
    },

    partyType() {
      const { roles, polarity } = this.party

      if (roles.includes('LAWYER') && !roles.includes('PARTY')) {
        return 'lawyer'
      } else if (roles.includes('PARTY') && !roles.includes('LAWYER')) {
        return polarity === 'CLAIMANT' ? 'plaintff' : 'company'
      } else if (roles.includes('PARTY') && roles.includes('LAWYER')) {
        return 'own-cause'
      } else if (roles.includes('NEGOTIATOR')) {
        return 'negotiator'
      } else {
        return ''
      }
    },

    translatedPartyType() {
      let role

      switch (this.partyType) {
        case 'lawyer':
          role = 'LAWYER'
          break
        case 'plaintff':
        case 'company':
          role = 'PARTY'
          break
        case 'negotiator':
          role = 'NEGOTIATOR'
          break
        case 'own-cause':
          role = 'OWN_CAUSE'
          break
        default:
          role = 'UNKNOWN'
          break
      }

      return this.$tc(`roles.${role}.${this.party.polarity}`, this.isRecovery)
    },

    state() {
      return this.party ? new TicketTicketOverviewPartyResumed(this.party) : {}
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.party-resumed {
  .party-resumed__header-online {
    width: 10px;
    height: 10px;
  }

  .party-resumed__header-avatar {
    margin-right: 10px;
  }

  .party-resumed__header-document {
    font-size: 13px;
    color: $--color-text-secondary;
    max-height: 16px;
    transition: .2s ease-out;
    &:first-child { margin-top: 3px; }
    & > b { font-weight: 600; }
    &--hidden { max-height: 0; opacity: 0; }
  }
}

@media (max-height: 900px) {
  .party-resumed {
    .party-resumed__header-name {
      font-size: 16px;
    }

    .party-resumed__header-document {
      font-size: 12px;
    }
  }
}
</style>

<style lang="scss">
.party-resumed {
  .el-collapse-item__header {
    padding: 10px 0;
    height: auto;
    line-height: normal;
    min-height: 60px;
    position: relative;

    .vexatious-alert {
      color: rgb(255, 201, 0);
      font-size: 30px;

      position: absolute;
      right: 0;
      margin-right: 16px;
    }
  }
}
.hide-arrows {
  .el-collapse-item__header {
    i.el-collapse-item__arrow {
      display: none;
    }
  }
}
</style>
