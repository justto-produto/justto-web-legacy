<template>
  <section
    v-loading="isLoading"
    class="overview-container"
  >
    <i
      :class="{ 'overview-container__button--active': isOverviewActive }"
      class="overview-container__button el-icon-arrow-left"
      @click="$emit('toggle-show-overview')"
    />

    <HeaderUserMenu
      class="overview-container__menu"
      :class="{'hidde-menu': showOverview}"
    />

    <div>
      <h1 class="overview-container__title show-right-icon">
        #{{ ticket.disputeId }}
        <i
          class="el-icon-copy-document hidden-icon"
          @click="copy(ticket.disputeId)"
        />
        <i
          class="el-icon-delete hidden-icon"
          @click="deleteTicket(ticket.disputeId)"
        />
      </h1>
      <h3
        v-if="ticket.internalId"
        class="overview-container__subtitle show-right-icon"
      >
        Cod.:
        <TextInlineEditor
          v-model="ticket.internalId"
          class="overview-container__subtitle-inline-editor"
          @change="setData('internalId', $event)"
        />
      </h3>
    </div>

    <OverviewTags />

    <OverviewOffers
      :defendant-offer="lastOffers.defendantOffer"
      :plaintiff-offer="lastOffers.plaintiffOffer"
      :upper-range="ticket.upperRange"
      :status="ticket.status"
    />

    <OverviewObf
      v-if="ticket.strategy && ticket.strategy.isObrigacaoFazer"
      v-model="ticket.description"
    />

    <OverviewTabs />

    <DeleteTicketDialog
      ref="deleteTicketDialog"
      :status="ticket.status"
      :dispute-id="ticket.disputeId"
    />
    <AssociateContactsModal
      :value="showAssociatedContacts"
      :current="associateContactsPropertie"
      :parties="parties"
      :metadata="metadata"
      @input="handleChangeAssociatedContracts"
    />
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Overview',

  components: {
    OverviewObf: () => import('./OverviewObf'),
    OverviewTabs: () => import('./OverviewTabs'),
    OverviewTags: () => import('./OverviewTags'),
    OverviewOffers: () => import('./OverviewOffers'),
    DeleteTicketDialog: () => import('./DeleteTicketDialog'),
    HeaderUserMenu: () => import('@/components/menus/HeaderUserMenu'),
    TextInlineEditor: () => import('@/components/inputs/TextInlineEditor'),
    AssociateContactsModal: () => import('@/components/dialogs/AssociateContactsModal')
  },

  props: {
    showOverview: {
      type: Boolean,
      required: true
    }
  },

  data: () => ({
    innerWidth: window.innerWidth
  }),

  computed: {
    ...mapGetters({
      ticket: 'getTicketOverview',
      lastOffers: 'getLastTicketOffers',
      isLoading: 'isTicketOverviewloading',
      showAssociatedContacts: 'showAssociatedContacts',
      parties: 'getTicketOverviewParties',
      metadata: 'getTicketMetadata',
      associateContactsPropertie: 'AssociatedContactsPropertie'
    }),

    isOverviewActive() {
      return this.innerWidth > 1200 ? !this.showOverview : this.showOverview
    }
  },

  beforeMount() {
    window.addEventListener('resize', event => {
      this.innerWidth = event.target.innerWidth
    })
  },

  beforeDestroy() {
    window.removeEventListener('resize')
  },

  methods: {
    ...mapActions([
      'setTicketOverview',
      'setDisputeProperty',
      'getAssociatedContacts'
    ]),

    copy(value) {
      navigator.clipboard.writeText(value)
    },

    deleteTicket() {
      this.$refs.deleteTicketDialog.openDeleteTicketDialog()
    },

    setData(key, value) {
      const { disputeId } = this.ticket
      const data = { [key]: value }

      this.setTicketOverview({ data, disputeId })
    },

    handleChangeAssociatedContracts(value) {
      const disputeId = this.$route.params.id

      this.setDisputeProperty({ key: 'CONTATOS ASSOCIADOS', disputeId, value }).then(() => {
        this.getAssociatedContacts(disputeId)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.overview-container {
  position: relative;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 20px;

  .overview-container__title {
    margin: 0;

    .el-icon-delete {
      // font-size: 20px;
      &:hover { color: $--color-danger; }
    }
  }

  .overview-container__subtitle {
    margin: 3px 0 0;
    color: $--color-text-secondary;
    font-weight: 500;

    .overview-container__subtitle-inline-editor {
      display: inline-block;
      width: calc(100% - 48px);
    }
  }

  .overview-container__button {
    position: absolute;
    top: 50%;
    left: -22px;
    font-size: 18px;
    background-color: $--color-white;
    padding: 12px 0px;
    border-style: solid;
    border-color: $--light-gray;
    border-width: 2px 0 2px 2px;
    border-radius: 6px 0 0 6px;
    &:before {
      display: block;
      transform: translateY(-50%);
      transition: .6s;
      position: relative;
      top: 9px;
    }
    &--active:before {
      transform: rotate(180deg) translateY(50%) !important;
    }
  }
}

@media (min-width: 1200px) {
  .overview-container {
    .overview-container__menu.hidde-menu {
      display: none;
    }
  }
}

@media (max-width: 900px) {
  .overview-container {
    .overview-container__menu {
      display: none;
    }
  }
}

@media (max-height: 900px) {
  .overview-container {
    gap: 10px;

    .overview-container__title {
      font-size: 20px;
    }
  }
}

@media (max-height: 780px) {
  .overview-container {
    gap: 6px;

    .overview-container__title {
      font-size: 20px;
    }
  }
}
</style>

<style lang="scss">
@import '@/styles/colors.scss';

.overview-container__button {
  transform: translateY(-50%);
  position: absolute;
  top: 50%;
  left: -18px;
  font-size: 18px;
  transition: .6s;
  background-color: $--color-white;
  padding: 12px 0px;
  border-style: solid;
  border-color: $--light-gray;
  border-width: 2px 0 2px 2px;
  border-radius: 6px 0 0 6px;
  &:before {
    transform: translateY(-50%);
  }
  &--active:before {
    transform: rotate(180deg) translateY(50%) !important;
  }
}

.overview-container {
  .overview-container__subtitle {
    .overview-container__subtitle-inline-editor {
      .text-inline-editor__value {
        display: inline-block;
        &:hover .text-inline-editor__inner { opacity: .50; }
      }
      .text-inline-editor__input {
        .el-input__inner {
          color: $--color-text-secondary !important;
          font-weight: 500 !important;
          font-size: 16px !important;
        }
      }
    }
  }
}
</style>
