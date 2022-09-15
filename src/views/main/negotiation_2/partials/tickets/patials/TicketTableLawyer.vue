<template>
  <span
    v-if="hasLawyer"
    :class="{
      'communication-ticket-item-container__plaintiff--text-complete': isSelfCause,
      'communication-ticket-item-container__plaintiff--active': !ticket.visualized
    }"
    class="communication-ticket-item-container__plaintiff"
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
  </span>
</template>

<script>
export default {

}
</script>
