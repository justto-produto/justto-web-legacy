<template lang="html">
  <div class="jus-team-menu">
    <div class="jus-team-menu__members">
      <a
        v-for="member in workspaceMembersSorted"
        :key="member.id + '-' + member.personId"
        class="jus-team-menu__member"
        @click.prevent="setFilterPersonId(member.person.id, member.person.name)"
      >
        <el-tooltip
          :content="member.person.name"
          placement="right"
        >
          <jus-avatar-user
            :name="member.person.name"
            :active="activePersonsIds.includes(member.person.id)"
            class="el-menu__avatar"
          />
        </el-tooltip>
      </a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'JusTeamMenu',
  computed: {
    ...mapGetters([
      'disputeQuery',
      'workspaceMembersSorted'
    ]),

    activePersonsIds() {
      return this.disputeQuery.persons || []
    }
  },
  methods: {
    setFilterPersonId(id, name) {
      if (this.activePersonsIds.includes(id)) {
        this.$store.commit('updateDisputeQuery', { key: 'persons', value: [] })
      } else {
        // SEGMENT TRACK
        this.$jusSegment('Filtro por negociador', { description: `Alterado filtro de negociador para ${name}` })
        this.$store.commit('updateDisputeQuery', { key: 'persons', value: [id] })
      }
    }
  }
}
</script>

<style lang="scss">
.jus-team-menu {
  text-align: center;
  overflow-y: auto;

  &__title {
    text-align: center;
    margin: 32px 0 12px;

    @media (max-height: 680px) {
      margin: 16px 0 10px;
    }
  }
  &__members {
    display: flex;
    flex-direction: column;
  }
  &__member {
    padding: 8px 0px;
  }
}
</style>
