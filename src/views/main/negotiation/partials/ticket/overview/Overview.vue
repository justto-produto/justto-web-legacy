<template>
  <section
    v-loading="isLoading"
    class="overview-container"
    :class="{'dispute': disputeMode}"
  >
    <el-button
      v-if="!disputeMode"
      :icon="`el-icon-arrow-${isOverviewActive ? 'right' : 'left'}`"
      class="overview-container__button"
      type="text"
      @click="$emit('toggle-show-overview')"
    />

    <HeaderUserMenu
      v-if="!showNegotiationTypeMenu && !disputeMode && isOverviewActive"
      class="overview-container__menu"
      :class="{
        'hidde-menu': (showOverview || disputeMode),
        'in-call': isInCall
      }"
    />

    <div>
      <h1 class="overview-container__title show-right-icon">
        #{{ ticket.disputeId }}
        <i
          class="el-icon-copy-document hidden-icon"
          @click="copy(ticket.disputeId)"
        />
        <i
          v-if="!isPreNegotiation"
          class="el-icon-delete hidden-icon"
          @click="deleteTicket(ticket.disputeId)"
        />
      </h1>

      <dispute-code-link
        v-if="ticket && !!ticket.code && disputeMode"
        :code="ticket.code"
        :custom-style="{ fontSize: '14x', fontWeight: 'normal', color: '#979797d'}"
        :custom-icon-style="{ paddingRight: '8px' }"
        @openTimeline="openTimelineModal"
      />

      <h3
        v-if="ticket.internalId"
        class="overview-container__subtitle show-right-icon"
      >
        Cod.:
        <TextInlineEditor
          v-model="ticket.internalId"
          :is-editable="!isPreNegotiation"
          class="overview-container__subtitle-inline-editor"
          @change="setData('internalId', $event)"
        />
      </h3>
    </div>

    <OverviewTags />

    <OverviewOffers
      v-if="isOverviewActive"
      :defendant-offer="lastOffers.defendantOffer"
      :plaintiff-offer="lastOffers.plaintiffOffer"
      :accepted-value="lastOffers.acceptedValue"
      :upper-range="ticket.upperRange"
      :status="ticket.status"
    />

    <OverviewObf
      v-if="ticket.strategy && ticket.strategy.isObrigacaoFazer"
      v-model="ticket.description"
    />

    <OverviewTabs
      :dispute-mode="disputeMode"
      @addRecipient="addRecipient"
      @edit:dispute="editDispute"
    />

    <DeleteTicketDialog
      ref="deleteTicketDialog"
      :status="ticket.status"
      :dispute-id="ticket.disputeId || routeId"
    />

    <AssociateContactsModal
      :value="showAssociatedContacts"
      :current="associateContactsPropertie"
      :parties="parties"
      :metadata="metadata"
      @input="handleChangeAssociatedContracts"
    />

    <JusTimeline
      v-if="showTimelineModal"
      v-model="showTimelineModal"
      :code="ticket.code"
      @update:contact="restartEngagementFromTimeline"
    />

    <EngagementLimitDialog :dispute-id="routeId" />

    <!-- Edição de disputa -->
    <EditDisputeDialog ref="editDisputeDialog" />
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import preNegotiation from '@/utils/mixins/ticketPreNegotiation'
import restartEngagement from '@/utils/mixins/restartEngagement'

export default {
  name: 'Overview',

  components: {
    OverviewObf: () => import('./OverviewObf'),
    OverviewTabs: () => import('./OverviewTabs'),
    OverviewTags: () => import('./OverviewTags'),
    OverviewOffers: () => import('./OverviewOffers'),
    DeleteTicketDialog: () => import('./DeleteTicketDialog'),
    HeaderUserMenu: () => import('@/components/menus/HeaderUserMenu'),
    JusTimeline: () => import('@/components/JusTimeline/JusTimeline'),
    DisputeCodeLink: () => import('@/components/buttons/DisputeCodeLink'),
    TextInlineEditor: () => import('@/components/inputs/TextInlineEditor'),
    EngagementLimitDialog: () => import('@/components/dialogs/EngagementLimitDialog'),
    AssociateContactsModal: () => import('@/components/dialogs/AssociateContactsModal'),
    EditDisputeDialog: () => import('@/components/dialogs/EditDisputeDialog')
  },

  mixins: [preNegotiation, restartEngagement],

  props: {
    showOverview: {
      type: Boolean,
      required: true
    },

    disputeMode: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    innerWidth: window.innerWidth,
    showTimelineModal: false
  }),

  computed: {
    ...mapGetters({
      isInCall: 'isInCall',
      ticket: 'getTicketOverview',
      lastOffers: 'getLastTicketOffers',
      isLoading: 'isTicketOverviewloading',
      showAssociatedContacts: 'showAssociatedContacts',
      parties: 'getTicketOverviewParties',
      metadata: 'getTicketMetadata',
      associateContactsPropertie: 'AssociatedContactsPropertie',
      showNegotiationTypeMenu: 'showNegotiationTypeMenu'
    }),

    isOverviewActive() {
      return this.innerWidth > 1200 ? !this.showOverview : this.showOverview
    },

    routeId() {
      return Number(this.$route.params.id)
    }
  },

  beforeMount() {
    const id = this.$route.params.id

    window.addEventListener('resize', this.handleUpdateInnerWidth)

    if (this.disputeMode) {
      const { getTicketMetadata, getAssociatedContacts, setDisputeProperty } = this
      this.getTicketOverview(id).catch(error => this.$jusNotification({ error }))
      this.getTicketOverviewInfo(id)
      this.getTicketOverviewParties(id).then(() => {
        getTicketMetadata(id).then(() => {
          getAssociatedContacts(id).then(res => {
            if (res['CONTATOS ASSOCIADOS'] === 'MAIS TARDE') {
              setDisputeProperty({ key: 'CONTATOS ASSOCIADOS', disputeId: id, value: 'NAO' }).then(() => {
                getAssociatedContacts(id)
              })
            }
          })
        })
      })
      this.getDisputeTags(id)
      this.getLastTicketOffers(id)
      this.populateTimeline()
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleUpdateInnerWidth)
  },

  methods: {
    ...mapActions([
      'setTicketOverview',
      'setDisputeProperty',
      'getAssociatedContacts',
      'getDisputeTags',
      'getTicketOverview',
      'getTicketMetadata',
      'getLastTicketOffers',
      'getTicketOverviewInfo',
      'getTicketOverviewParties',
      'getDisputeTimeline'
    ]),

    handleUpdateInnerWidth(event) {
      this.innerWidth = event.target.innerWidth
    },

    openTimelineModal() {
      this.showTimelineModal = true
      this.$jusSegment('Linha do tempo visualizada por dentro da disputa', { disputeId: this.routeId })
    },

    addRecipient({ _ }) {
      if (this.disputeMode) {
        this.$emit('addRecipient')
      }
    },

    restartEngagementFromTimeline(disputeRole) {
      const { name, party, id: roleId } = disputeRole
      const { status, id } = this.dispute

      this.verifyRestartEngagement({ name, party, status, disputeId: id, disputeRoleId: roleId })
    },

    async populateTimeline() {
      let getting = true
      for (const round in [0, 1, 2, 3, 4]) {
        if (getting) {
          await new Promise(resolve => { setTimeout(resolve, round * 2000) })
          this.getDisputeTimeline(this.ticket.code).then(() => {
            getting = false
          })
        } else {
          break
        }
      }
    },

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
    },

    editDispute() {
      this.$refs.editDisputeDialog.show()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~projuris-acordos-theme/src/common/colors.scss';

.overview-container {
  position: relative;
  padding: 4px 8px 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 20px;

  .overview-container__title {
    margin: 0;
    font-size: 20px;

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
    top: calc(50vh - 40px);
    left: -20px;
    padding: 12px 0;
    border-radius: 6px 0 0 6px;
    border-color: $--color-light-gray;
    border-width: 2px 0 2px 2px;
    z-index: 99;
  }

  &.dispute {
    padding: 0;
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
@import '~projuris-acordos-theme/src/common/colors.scss';

.overview-container__button {
  i {
    color: $--color-black;
    font-size: 18px;
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

  div {
    .dispute-code {
      margin: 8px 0;
    }
  }

  .overview-container__menu {
    justify-content: flex-end;

    &.in-call {
      flex-wrap: wrap-reverse;

      .dialer, .usermenu-container__keep-itens {
        flex: 1;
        justify-content: space-between;
      }
    }
  }
}

@media (max-height: 600px) {
  .overview-container {
    gap: 0px !important;

    div {
      .overview-container__title {
        font-size: 16px !important;
      }

      .overview-container__subtitle {
        font-size: 12px !important;
      }
    }

    .overview-offers {
      .overview-offers__proposal--defendant {
        margin-top: -12px !important;
      }
    }

    .overview-tabs {
      .el-tabs__header {
        margin-bottom: 0px !important;
      }

      .el-tabs__content {
        .el-tab-pane {
          margin-top: 0px !important;
          padding-top: 0px !important;

          .overview-parties {
            margin-top: -6px !important;
            height: calc(100% + 12px);

            .overview-parties__list {
              margin-top: 6px !important;
            }
          }
        }
      }
    }
  }
}
</style>
