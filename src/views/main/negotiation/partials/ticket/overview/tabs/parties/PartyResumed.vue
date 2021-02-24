<template>
  <el-collapse-item
    :name="party.disputeRoleId"
    class="party-resumed"
  >
    <template slot="title">
      <JusIcon
        class="party-resumed__header-avatar"
        :icon="partyType"
      />
      <article>
        {{ party.name | resumedName }}
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
          :class="{ 'party-resumed__header-document--hidden': !isActiveCollapseItem }"
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
    }
  },
  computed: {
    isActiveCollapseItem() {
      return this.party.disputeRoleId === this.activeCollapseItem
    },
    documentType() {
      return this.party.documentNumber?.length <= 14 ? 'CPF' : 'CNPJ'
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

      return this.$t(`roles.${role}.${this.party.polarity}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.party-resumed {
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
</style>

<style lang="scss">
.party-resumed {
  .el-collapse-item__header {
    padding: 12px 0;
    height: auto;
    line-height: normal;
  }
}
</style>