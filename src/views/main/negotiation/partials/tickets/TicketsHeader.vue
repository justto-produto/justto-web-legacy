<template>
  <header class="tickets-header-container">
    <el-autocomplete
      v-model="searchTerm"
      :min="3"
      :trigger-on-focus="false"
      :fetch-suggestions="handleInput"
      :debounce="800"
      size="small"
      class="tickets-header-container__input"
      prefix-icon="el-icon-search"
      popper-class="tickets-header-container__popover"
      placeholder="Busque sua disputa..."
    >
      <template slot-scope="{ item }">
        <JusDisputeResume
          v-if="item.id"
          :dispute="item"
          @click="goToTicket"
        />
        <span v-else>
          Não foram encontradas disputas para esta busca.
        </span>
      </template>
    </el-autocomplete>
  </header>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'TicketsHeader',
  components: {
    JusDisputeResume: () => import('@/components/layouts/JusDisputeResume')
  },
  props: {
    targetPath: {
      type: String,
      default: 'dispute'
    }
  },
  data: () => ({
    searchTerm: '',
    debounce: setTimeout()
  }),
  methods: {
    ...mapActions([
      'searchDisputes'
    ]),

    handleInput(term, cb) {
      clearTimeout(this.debounce)

      this.debounce = setTimeout(() => {
        this.searchDisputes({ key: 'term', value: term })
          .then(response => {
            this.$jusSegment('Busca global de disputas', { description: `Termo utilizado: ${term}` })
            if (response.length) cb(response)
            else cb([{}])
          })
      }, 800)
    },

    goToTicket({ disputeId, disputeStatus }) {
      this.$router.push(`/${this.targetPath}/${disputeId}`)
      this.$emit('set-tab', disputeStatus)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.tickets-header-container {
  padding: 0;

  .tickets-header-container__input {
    padding: 12px;
    width: 100%;
  }
}
</style>

<style lang="scss">
.tickets-header-container__popover {
  .el-autocomplete-suggestion.el-popper {
    width: calc(100% - ((48px + 18px) * 2)) !important;
  }
}

.tickets-header-container {
  .tickets-header-container__input {
    .el-input__inner {
      border: none !important;
    }
  }
}
@media (max-width: 900px) {
  .tickets-header-container__popover {
    .el-autocomplete-suggestion.el-popper {
      width: calc(100% - (12px * 2)) !important;
    }
  }
}
</style>
