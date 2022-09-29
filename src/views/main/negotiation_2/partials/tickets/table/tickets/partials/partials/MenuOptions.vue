<template>
  <article class="ticket-table-menu__options">
    <label class="ticket-table-menu__options-label">
      Listar como:
    </label>

    <el-radio-group
      v-model="mode"
      size="small"
      class="ticket-table-menu__options-group"
    >
      <el-radio label="TICKET">
        <jus-icon
          icon="negotiation-window"
          :is-active="mode === 'TICKET'"
        /> Negociação
      </el-radio>

      <el-radio label="MANAGEMENT">
        <jus-icon
          icon="list-app"
          :is-active="mode === 'MANAGEMENT'"
        /> Gerênciamento
      </el-radio>
    </el-radio-group>
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      ticketListMode: 'getTicketListMode'
    }),

    mode: {
      get() {
        return this.ticketListMode
      },
      set(value) {
        this.setAccountProperty({ TICKET_LIST_MODE: value })
      }
    }
  },

  methods: {
    ...mapActions(['setAccountProperty'])
  }
}
</script>

<style lang="scss">
.ticket-table-menu__options {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .ticket-table-menu__options-label {
    text-align: center;
    font-weight: 600;
  }

  .ticket-table-menu__options-group {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .el-radio__input {
      display: none;
    }

    .el-radio__label {
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;

      img {
        width: 23px;
        height: 23px;
      }
    }
  }
}
</style>
