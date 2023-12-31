<template>
  <article class="info-configurations">
    <div
      v-for="config in booleanConfigurations"
      :key="config.key"
      class="info-configurations__infoline"
    >
      <span class="info-configurations__infoline-label">
        {{ $t(`ticket-labels.${config.key}`) | capitalize }}?
      </span>
      <PopoverInlineEditor
        v-model="config.value"
        :is-editable="config.isEditable"
        :options="booleanOptions"
        :width="120"
        class="info-configurations__infoline-data"
        @change="toggleOption(config.key, $event)"
      />
    </div>

    <div class="info-configurations__infoline">
      <span class="info-configurations__infoline-label">
        {{ $t('ticket-labels.contactParty') | capitalize }}?
      </span>
      <PopoverInlineEditor
        v-model="selectableConfigurations.model"
        :options="selectableConfigurations.options"
        class="info-configurations__infoline-data"
        @change="selectContactPartyOption"
      />
    </div>
  </article>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'InfoConfigurations',
  components: {
    PopoverInlineEditor: () => import('@/components/inputs/PopoverInlineEditor')
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    booleanOptions() {
      return [
        { value: true, label: this.$tc('boolean', true), icon: 'el-icon-check' },
        { value: false, label: this.$tc('boolean', false), icon: 'el-icon-close' }
      ]
    },
    booleanConfigurations() {
      const {
        skipEnrichment,
        denySavingDeposit,
        denyPixDeposit,
        businessHoursEngagement
      } = this.value

      return [
        {
          key: 'skipEnrichment',
          value: skipEnrichment,
          isEditable: false
        },
        {
          key: 'denySavingDeposit',
          value: denySavingDeposit,
          isEditable: false
        },
        {
          key: 'denyPixDeposit',
          value: denyPixDeposit,
          isEditable: false
        },
        {
          key: 'businessHoursEngagement',
          value: businessHoursEngagement,
          isEditable: false
        }
      ]
    },
    selectableConfigurations() {
      const {
        alwaysContactParty,
        contactPartyWhenNoLawyer,
        contactPartyWhenInvalidLawyer
      } = this.value

      let model
      if (alwaysContactParty) {
        model = 'alwaysContactParty'
      } else if (contactPartyWhenNoLawyer && contactPartyWhenInvalidLawyer) {
        model = 'contactPartyWhenInvalidLawyerOrNoLawyer'
      } else if (contactPartyWhenNoLawyer && !contactPartyWhenInvalidLawyer) {
        model = 'contactPartyWhenNoLawyer'
      } else if (!contactPartyWhenNoLawyer && contactPartyWhenInvalidLawyer) {
        model = 'contactPartyWhenInvalidLawyer'
      } else {
        model = 'neverContactParty'
      }

      const options = [
        {
          value: 'alwaysContactParty',
          label: this.$t('ticket-labels.alwaysContactParty'),
          icon: 'el-icon-check'
        },
        {
          value: 'contactPartyWhenInvalidLawyerOrNoLawyer',
          label: this.$t('ticket-labels.contactPartyWhenInvalidLawyerOrNoLawyer'),
          icon: 'el-icon-check'
        },
        {
          value: 'contactPartyWhenNoLawyer',
          label: this.$t('ticket-labels.contactPartyWhenNoLawyer'),
          icon: 'el-icon-check'
        },
        {
          value: 'contactPartyWhenInvalidLawyer',
          label: this.$t('ticket-labels.contactPartyWhenInvalidLawyer'),
          icon: 'el-icon-check'
        },
        {
          value: 'neverContactParty',
          label: this.$t('ticket-labels.neverContactParty'),
          icon: 'el-icon-close'
        }
      ]

      return { model, options }
    },
    disputeId() {
      return this.$route.params.id
    }
  },
  methods: {
    ...mapActions(['setTicketOverviewInfo']),

    toggleOption(key, value) {
      const { disputeId } = this
      const data = { [key]: value }

      this.setTicketOverviewInfo({ data, disputeId })
    },

    selectContactPartyOption(value) {
      const { disputeId } = this
      let data

      switch (value) {
        case 'alwaysContactParty':
          data = {
            alwaysContactParty: true,
            contactPartyWhenNoLawyer: false,
            contactPartyWhenInvalidLawyer: false
          }
          break
        case 'contactPartyWhenInvalidLawyerOrNoLawyer':
          data = {
            alwaysContactParty: false,
            contactPartyWhenNoLawyer: true,
            contactPartyWhenInvalidLawyer: true
          }
          break
        case 'contactPartyWhenNoLawyer':
          data = {
            alwaysContactParty: false,
            contactPartyWhenNoLawyer: true,
            contactPartyWhenInvalidLawyer: false
          }
          break
        case 'contactPartyWhenInvalidLawyer':
          data = {
            alwaysContactParty: false,
            contactPartyWhenNoLawyer: false,
            contactPartyWhenInvalidLawyer: true
          }
          break
        case 'neverContactParty':
          data = {
            alwaysContactParty: false,
            contactPartyWhenNoLawyer: false,
            contactPartyWhenInvalidLawyer: false
          }
          break
      }

      this.setTicketOverviewInfo({ data, disputeId })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~projuris-acordos-theme/src/common/colors.scss';

.info-configurations {
  .info-configurations__infoline {
    margin-top: 6px;
    &:first-child { margin-top: 0px; }

    .info-configurations__infoline-data {
      display: flex;
      gap: 12px;
      margin-left: 6px;
      font-weight: 500;
    }
  }
}
</style>
