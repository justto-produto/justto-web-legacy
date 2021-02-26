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
      <!-- <div class="info-configurations__infoline-data">
        <span
          :class="{ 'info-configurations__infoline-data--disabled': !config.value }"
          @click="toggleOption(config.key, true)"
        >
          <i class="el-icon-check" />
          {{ $tc('boolean', true) | capitalize }}
        </span>
        <span
          :class="{ 'info-configurations__infoline-data--disabled': config.value }"
          @click="toggleOption(config.key, false)"
        >
          <i class="el-icon-close" />
          {{ $tc('boolean', false) | capitalize }}
        </span>
      </div> -->
      <PopoverInlineEditor
        v-model="config.value"
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
        businessHoursEngagement
      } = this.value

      return [
        {
          key: 'skipEnrichment',
          value: skipEnrichment
        },
        {
          key: 'denySavingDeposit',
          value: denySavingDeposit
        },
        {
          key: 'businessHoursEngagement',
          value: businessHoursEngagement
        }
      ]
    },
    selectableConfigurations() {
      const {
        awaysContactParty,
        contactPartyWhenNoLawyer,
        contactPartyWhenInvalidLawyer
      } = this.value

      let model
      if (awaysContactParty) {
        model = 'awaysContactParty'
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
          value: 'awaysContactParty',
          label: this.$t('ticket-labels.awaysContactParty'),
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
        case 'awaysContactParty':
          data = {
            awaysContactParty: true,
            contactPartyWhenNoLawyer: false,
            contactPartyWhenInvalidLawyer: false
          }
          break
        case 'contactPartyWhenInvalidLawyerOrNoLawyer':
          data = {
            awaysContactParty: false,
            contactPartyWhenNoLawyer: true,
            contactPartyWhenInvalidLawyer: true
          }
          break
        case 'contactPartyWhenNoLawyer':
          data = {
            awaysContactParty: false,
            contactPartyWhenNoLawyer: true,
            contactPartyWhenInvalidLawyer: false
          }
          break
        case 'contactPartyWhenInvalidLawyer':
          data = {
            awaysContactParty: false,
            contactPartyWhenNoLawyer: false,
            contactPartyWhenInvalidLawyer: true
          }
          break
        case 'neverContactParty':
          data = {
            awaysContactParty: false,
            contactPartyWhenNoLawyer: false,
            contactPartyWhenInvalidLawyer: false
          }
          break
      }

      this.setTicketOverview({ data, disputeId })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.info-configurations {
  .info-configurations__infoline {
    margin-top: 6px;
    &:first-child { margin-top: 0px; }

    .info-configurations__infoline-data {
      display: flex;
      gap: 12px;
      margin-left: 6px;
      font-weight: 500;

      &--disabled {
        cursor: pointer;
        font-weight: 400;
        font-size: 13px;
        color: $--color-text-secondary;
      }
    }
  }
}
</style>
