<template>
  <section class="jus-team-menu">
    <span class="jus-team-menu__title">
      <!-- <span>TIME</span> -->
      <input
        v-model="search"
        type="text"
        placeholder="TIME"
        class="jus-team-menu__title-input"
      >

      <JusIcon
        class="jus-team-menu__title-icon"
        :icon="isTeamSectionExpanded ? 'arrow-down' : 'arrow-up'"
        @click="$emit('toggle-expand-team-section')"
      />

      <!-- <i class="el-icon-search" /> -->
    </span>

    <vue-perfect-scrollbar>
      <div class="jus-team-menu__members">
        <a
          v-for="member in workspaceMembers"
          :key="member.id"
          class="jus-team-menu__member"
          @click.prevent="setFilterPersonId(member.person.id, member.person.name)"
        >
          <el-tooltip
            :content="member.person.name"
            placement="right"
          >
            <JusAvatarUser
              :name="member.person.name"
              :active="isActivePerson(member.person.id)"
              class="el-menu__avatar"
            />
          </el-tooltip>
        </a>
      </div>
    </vue-perfect-scrollbar>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { normalizeString } from '@/utils'

export default {
  name: 'JusTeamMenu',

  components: {
    VuePerfectScrollbar: () => import('vue-perfect-scrollbar')
  },

  props: {
    isTeamSectionExpanded: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    search: ''
  }),

  computed: {
    ...mapGetters({
      disputeQuery: 'disputeQuery',
      ticketsQuery: 'getTicketsQuery',
      workspaceMembersSorted: 'workspaceMembersSorted'
    }),

    activePersonsDisputes() {
      return this.disputeQuery.persons || []
    },

    activePersonsTickets() {
      return this.ticketsQuery.persons || []
    },

    workspaceMembers() {
      if (this.search.length > 0) {
        return this.workspaceMembersSorted.filter(({ accountEmail, person: { name } }) => {
          return normalizeString(accountEmail).includes(normalizeString(this.search)) || normalizeString(name).includes(normalizeString(this.search))
        })
      }

      return this.workspaceMembersSorted
    }
  },
  methods: {
    ...mapActions([
      'setTicketsQuery',
      'getTickets'
    ]),

    isActivePerson(personId) {
      const { activePersonsTickets, activePersonsDisputes } = this
      return activePersonsTickets.includes(personId) || activePersonsDisputes.includes(personId)
    },

    setFilterPersonId(personId) {
      if (this.isActivePerson(personId)) {
        this.$store.commit('updateDisputeQuery', { key: 'persons', value: [] })
        this.setTicketsQuery({ key: 'persons', value: [] })
        this.getTickets()
      } else {
        this.$jusSegment('Filtro por negociador', { description: `Alterado filtro de negociador para ${name}` })
        this.$store.commit('updateDisputeQuery', { key: 'persons', value: [personId] })
        this.setTicketsQuery({ key: 'persons', value: [personId] })
        this.getTickets()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.jus-team-menu {
  background-color: transparent;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 32px;

  .jus-team-menu__title {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    font-size: 13px;

    .jus-team-menu__title-icon {
      margin-top: 2px;
      margin-left: 2px;
    }

    .jus-team-menu__title-input {
      min-width: 1px;
      border: none;
      width: 40px;
      text-align: center;
    }
  }

  .jus-team-menu__members {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .jus-team-menu__member {
    padding: 6px 0px;
  }
}
</style>
