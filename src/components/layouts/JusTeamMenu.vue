<template lang="html">
  <div class="jus-team-menu">
    <div class="jus-team-menu__members">
      <a
        v-for="member in members"
        :key="member.id + '-' + member.personId"
        class="jus-team-menu__member"
        @click.prevent="setFilterPersonId(member.person.id, member.person.name)"
      >
        <el-tooltip :content="member.person.name">
          <jus-avatar-user
            :name="member.person.name"
            :active="activePersonsIds.includes(member.person.id)"
            size="sm"
            shape="circle"
            class="el-menu__avatar"
          />
        </el-tooltip>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JusTeamMenu',
  computed: {
    members() {
      return this.$store.state.workspaceModule.members
    },
    activePersonsIds() {
      return this.$store.getters.disputeQuery.persons || []
    },
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
    },
  },
}
</script>

<style lang="scss">
.jus-team-menu {
  text-align: center;
  &__title {
    text-align: center;
    margin: 80px 0 20px;
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
