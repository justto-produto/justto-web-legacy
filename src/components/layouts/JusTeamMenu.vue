<template lang="html">
  <div class="jus-team-menu">
    <div class="jus-team-menu__members">
      <a
        v-for="member in members"
        :key="member.id"
        class="jus-team-menu__member"
        @click.prevent="setFilterPersonId(member.person.id)">
        <el-tooltip :content="member.person.name" placement="right">
          <jus-avatar-user
            :name="member.person.name"
            :active="activePersonsIds.includes(member.person.id)"
            size="sm"
            shape="circle"
            class="el-menu__avatar" />
        </el-tooltip>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JusTeamMenu',
  computed: {
    members () {
      return this.$store.state.workspaceModule.members
    },
    activePersonsIds () {
      return this.$store.getters.disputeQuery.persons
    }
  },
  methods: {
    setFilterPersonId (id) {
      if (this.activePersonsIds.includes(id)) {
        this.$store.commit('setDisputeQuery', { key: 'persons', value: [] })
      } else {
        this.$store.commit('setDisputeQuery', { key: 'persons', value: [id] })
      }
    }
  }
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
