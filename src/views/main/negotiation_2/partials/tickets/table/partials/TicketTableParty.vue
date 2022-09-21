<template>
  <tr class="ticket-table-party">
    <!-- LAWYER -->
    <td
      v-if="hasLawyer"
      class="ticket-table-party__lawyer"
      :class="{
        'ticket-table-party__lawyer--text-complete': isSelfCause,
        'ticket-table-party__lawyer--active': !ticket.visualized
      }"
    >
      <JusIcon
        v-if="isLawyerOnline || (isOnline && isSelfCause)"
        class="communication-ticket-item-container__online"
        icon="online"
      />

      <el-tooltip
        placement="top"
        :open-delay="500"
      >
        <span slot="content">
          {{ isSelfCause ? 'Advogado e Parte' : 'Advogado' }}
        </span>

        <JusIcon
          :icon="isSelfCause ? 'party-lawyer-icon' : 'lawyer-icon'"
          :is-active="!ticket.visualized"
        />
      </el-tooltip>

      <el-tooltip
        placement="top"
        :open-delay="500"
      >
        <span slot="content">
          {{ lawyerName }}
        </span>

        <div>
          {{ lawyerName | resumedName }}
        </div>
      </el-tooltip>
    </td>

    <!-- PARTY -->
    <td
      v-if="!isSelfCause"
      :class="{
        'ticket-table-party__plaintiff--text-complete': !hasLawyer,
        'ticket-table-party__plaintiff--active': !ticket.visualized
      }"
      class="ticket-table-party__plaintiff"
    >
      <JusIcon
        v-if="isOnline"
        class="communication-ticket-item-container__online"
        icon="online"
      />

      <el-tooltip
        placement="top"
        :open-delay="500"
      >
        <span slot="content">
          {{ 'Parte' }}
        </span>

        <JusIcon
          icon="party-icon"
          :is-active="!ticket.visualized"
        />
      </el-tooltip>

      <el-tooltip
        placement="top"
        :open-delay="500"
      >
        <span slot="content">
          {{ plaintiffName }}
        </span>

        <div>
          {{ plaintiffName | resumedName }}
        </div>
      </el-tooltip>
    </td>
  </tr>
</template>

<script>
import sharedTicketdMethods from '../../patials/sharedTicketdMethods'

export default {
  mixins: [sharedTicketdMethods],

  props: {
    ticket: {
      type: Object,
      required: true
    }
  },

  computed: {
    plaintiffName() {
      return this.ticket?.plaintiff?.name || 'Sem parte'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.ticket-table-party {
  display: flex;

  .ticket-table-party__lawyer {
    flex: 1;
    display: flex;
    align-items: baseline;
    gap: 8px;
    color: $--color-gray;
    font-size: 14px;
    width: calc(50% - 12px);

    div.el-tooltip {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow-x: hidden;
    }

    &--text-complete { width: 100%; }

    &--danger { color: $--color-danger; }

    &--active {
      color: $--color-primary-dark;
      font-weight: 700;
    }
  }

  .ticket-table-party__plaintiff {
    flex: 1;
    display: flex;
    align-items: baseline;
    gap: 8px;
    color: $--color-gray;
    font-size: 14px;
    width: calc(50% - 12px);

    div.el-tooltip {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow-x: hidden;
    }

    &--text-complete { width: 100%; }

    &--danger { color: $--color-danger; }

    &--active {
      color: $--color-primary-dark;
      font-weight: 700;
    }
  }
}
</style>
