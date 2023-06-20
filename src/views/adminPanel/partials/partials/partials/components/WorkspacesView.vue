<template>
  <article class="workspaces-view__container">
    <p class="workspace-view__title">
      Workspaces:
    </p>

    <el-select
      v-if="active"
      :value="workspaces.map(w => w.id)"
      multiple
      filterable
      @change="handleEditStrategies"
    >
      <el-option
        v-for="(item, key) in allWorkspaces"
        :key="`$${key}#{item.id}#${item.teamName}`"
        :label="item.teamName"
        :value="item.id"
      />
    </el-select>

    <div
      v-else
      class="workspaces-view__items"
    >
      <el-tag
        v-for="item in workspaces"
        :key="`workspace#${item.id}`"
        size="small"
        class="workspaces-view__item"
      >
        {{ item.teamName }}
      </el-tag>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    workspaces: {
      type: Array,
      required: true
    },

    active: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      availableWorkspaces: 'getAvailableWorkspaces'
    }),

    allWorkspaces() {
      const ids = this.availableWorkspaces.map(({ id }) => id)

      return [
        ...this.availableWorkspaces,
        ...this.workspaces.filter(w => !ids.includes(w.id))
      ]
    }
  },

  methods: {
    handleEditStrategies(strategiesIds) {
      const strategies = this.availableWorkspaces.filter(({ id }) => strategiesIds.includes(id))

      this.$emit('edit', strategies)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~projuris-acordos-theme/src/common/colors.scss';

.workspaces-view__container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 4px;
  padding: 4px 4px 8px;
  font-weight: 500;

  .workspace-view__title {
    margin: 0;
    text-align: center;
  }

  .workspaces-view__items {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;

    .workspaces-view__item {
      flex: 1;
      text-align: center;
    }
  }
}
</style>
