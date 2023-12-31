<template>
  <div class="export-ticket">
    <OverviewResume
      :ticket="ticket"
      :ticket-parties="ticketParties"
    />

    <OmnichannelResume />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  components: {
    OmnichannelResume: () => import('@/views/main/negotiation/partials/ticket/omnichannel/OmnichannelResume.vue'),
    OverviewResume: () => import('@/views/main/negotiation/partials/ticket/overview/OverviewResume.vue')
  },

  data: () => ({
    ticket: {},
    ticketParties: []
  }),

  computed: {
    ticketId() {
      return this.$route?.params?.id
    },

    activeTab() {
      return this.$route?.query?.tab || 'MESSAGES'
    }
  },

  created() {
    this.getTicket().finally(() => this.getTicketParties().finally(() => this.getTicketOccurrences()))
  },

  mounted() {
    window.onload = setTimeout(this.handlePrint, (7.5 * 1000))

    document.addEventListener('keydown', (event) => {
      const name = event.key
      const code = event.code

      if (name !== 'Control' && event.ctrlKey && code === 'KeyP') {
        event.preventDefault()
        this.handlePrint()
      }
    }, false)
  },

  methods: {
    ...mapActions([
      'getFullMessage',
      'getAllOccurrences',
      'getTicketOverview',
      'setOmnichannelActiveTab',
      'getTicketOverviewParties'
    ]),

    getTicket() {
      return this.getTicketOverview(this.ticketId).then(res => { this.ticket = { ...res } })
    },

    getTicketParties() {
      return this.getTicketOverviewParties(this.ticketId).then(res => { this.ticketParties = [...res] })
    },

    getTicketOccurrences() {
      return this.setOmnichannelActiveTab(this.activeTab).finally(() => {
        this.getAllOccurrences(this.ticketId).then(({ content }) => {
          Promise.all(
            content.filter(
              ({ id, interaction }) => id && interaction?.message?.messageId
            ).map(
              ({ interaction }) => this.getFullMessage(interaction?.message?.messageId)
            )
          )
        })
      })
    },

    handlePrint() {
      const customContent = document.querySelector('.export-ticket').innerHTML

      window.onbeforeprint = () => (document.body.innerHTML = customContent)

      window.onafterprint = () => setTimeout(window.close, 500)

      window.print()
    }
  }
}
</script>

<style lang="scss">
@media print{
  @page {
    size: landscape;
  }

  .print-button {
    visibility: hidden;
  }

  .communication-container__message {
    max-height: 200vh;
  }

  .inbound {
    display: flex;
    overflow-y: hidden;

    .interaction-container {
      padding: 0;

      .interaction-container__balloon {
        .interaction-container__balloon-content {
          .communication-container {
            .communication-container__message {
              .communication-container__message-link {
                display: none;
              }
            }

            .communication-container__about {
              display: none;
            }
          }
        }
      }
    }
  }
}

.export-ticket {
  width: 100vw;
  height: 100vh;
}

.print-button {
  position: absolute;
  bottom: 32px;
  left: 80px;

  @media print {
    display: none;
  }
}
</style>
