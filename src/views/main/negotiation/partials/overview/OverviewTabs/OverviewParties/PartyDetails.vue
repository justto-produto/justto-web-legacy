<template>
  <article class="party-details">
    <a
      v-if="!party.roles.includes('NEGOTIATOR')"
      class="party-details__link"
    >
      Trocar polaridade
    </a>

    <div class="party-details__infoline">
      <span class="party-details__infoline-label">Nome completo:</span>
      <TextInlineEditor
        v-model="party.name"
        filter="ownName"
        class="party-details__infoline-data"
        @change="updateName"
      />
    </div>
    <!-- <div class="party-details__infoline">
      <span class="party-details__infoline-label">Função:</span>
      <SelectInlineEditor
        v-model="party.polarity"
        :options="roleOptions"
        class="party-details__infoline-data"
        @change="updatePolarity"
      />
    </div> -->
    <div
      v-if="party.documentNumber"
      class="party-details__infoline"
    >
      <span class="party-details__infoline-label">{{ documentType }}:</span>
      <TextInlineEditor
        v-model="party.documentNumber"
        filter="cpfCnpj"
        :mask="['###.###.###-##', '##.###.###/####-##']"
        class="party-details__infoline-data"
        @change="updateDocument"
      />
    </div>
    <div
      v-if="party.phones && party.phones.length"
      class="party-details__infoline"
    >
      <span class="party-details__infoline-label">Telefones:</span>
      <span class="party-details__infoline-data"></span>
    </div>
    <div
      v-if="party.emails && party.emails.length"
      class="party-details__infoline"
    >
      <span class="party-details__infoline-label">Emails:</span>
      <span class="party-details__infoline-data"></span>
    </div>
    <div
      v-if="party.oabs && party.oabs.length"
      class="party-details__infoline"
    >
      <span class="party-details__infoline-label">Oab:</span>
      <span class="party-details__infoline-data"></span>
    </div>
  </article>
</template>

<script>
export default {
  name: 'PartyDetails',
  components: {
    // SelectInlineEditor: () => import('@/components/inputs/SelectInlineEditor'),
    TextInlineEditor: () => import('@/components/inputs/TextInlineEditor')
  },
  props: {
    party: {
      type: Object,
      required: true
    }
  },
  computed: {
    documentType() {
      return this.party.documentNumber?.length <= 14 ? 'CPF' : 'CNPJ'
    },

    roleOptions() {
      const { roles } = this.party
      const partyOptions = [
        { value: 'RESPONDENT', label: this.$t('roles.PARTY.RESPONDENT') },
        { value: 'CLAIMANT', label: this.$t('roles.PARTY.CLAIMANT') }
      ]
      const lawyerOptions = [
        { value: 'RESPONDENT', label: this.$t('roles.LAWYER.RESPONDENT') },
        { value: 'CLAIMANT', label: this.$t('roles.LAWYER.CLAIMANT') }
      ]

      if (roles.includes('PARTY')) {
        return { role: 'PARTY', list: partyOptions }
      } else if (roles.includes('LAWYER')) {
        return { role: 'LAWYER', list: lawyerOptions }
      } else if (roles.includes('NEGOTIATOR')) {
        return { role: 'NEGOTIATOR', list: [] }
      } else {
        return { role: '', list: [...partyOptions, ...lawyerOptions] }
      }
    }
  },
  methods: {
    updateName(value) {
      console.log(value)
    },
    updatePolarity(value) {
      console.log(value)
    },
    updateDocument(value) {
      console.log(value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.party-details {
  .party-details__link {
    font-size: 13px;
    display: block;
    text-align: center;
    line-height: normal;
  }

  .party-details__infoline {
    margin-top: 6px;

    .party-details__infoline-label {
      // font-weight: 500;
      line-height: normal;
      color: $--color-text-secondary;
      font-size: 13px;
    }

    .party-details__infoline-data {
      margin-left: 18px;
      // font-weight: 500;
      // padding-right: 12px;
      line-height: normal;
    }
  }

  .capitalize {
    text-transform: capitalize;
  }
}
// Trocar polaridade
// Polaridade
// dados de contato

// paginação ocorrencias
</style>
