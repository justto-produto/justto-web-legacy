<template>
  <div class="export-ticket">
    <OverviewResume
      :ticket="ticket"
      :ticket-parties="ticketParties"
    />
    <OmnichannelResume />

    <el-button
      id="print-button"
      circle
      type="primary"
      icon="el-icon-printer"
      class="print-button"
      @click="handlePrint()"
    />
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
    }
  },

  created() {
    this.getTicket().finally(
      this.getTicketParties().finally(
        this.getTicketOccurrences()
        // .finally(() => setTimeout(this.handlePrint, (7.5 * 1000)))
      )
    )
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
      'getTicketOverviewParties'
    ]),

    getTicket() {
      return this.getTicketOverview(this.ticketId).then(res => { this.ticket = { ...res } })
    },

    getTicketParties() {
      return this.getTicketOverviewParties(this.ticketId).then(res => { this.ticketParties = [...res] })
    },

    getTicketOccurrences() {
      return this.getAllOccurrences(this.ticketId).then(({ content }) => {
        Promise.all(
          content.filter(
            ({ id, interaction }) => id && interaction?.message?.messageId
          ).map(
            ({ interaction }) => this.getFullMessage(interaction?.message?.messageId)
          )
        )
      })
    },

    async handlePrint() {
      const customContent = document.querySelector('.export-ticket').innerHTML
      const originalContent = document.body.innerHTML

      document.body.innerHTML = customContent
      await window.print()
      document.body.innerHTML = originalContent
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
