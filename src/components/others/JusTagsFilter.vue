<template lang="html">
  <div class="jus-tags-filter">
    <div
      v-for="(tag, index) in workspaceTags.slice(-3).reverse()"
      :key="tag.id"
      :style="{ zIndex: workspaceTags.length - index }"
      class="jus-tags-filter__item"
    >
      <el-tooltip :content="tag.name">
        <el-tag
          :color="tag.color"
          :class="{ 'active': tag.active }"
          @click="filterByTag(tag)"
        >
          <i :class="`el-icon-${tag.icon}`" />
        </el-tag>
      </el-tooltip>
    </div>
    <el-popover
      v-if="workspaceTags.length > 3"
      placement="bottom"
      width="400"
      popper-class="jus-tags-filter__popover"
      trigger="click"
    >
      <div class="jus-tags-filter__others">
        <el-tag
          v-for="tag in workspaceTags.slice(0, workspaceTags.length - 3).reverse()"
          :key="tag.id"
          :color="tag.color"
          :class="{ 'active': tag.active }"
          class="el-tag--etiqueta el-tag--click"
        >
          <div @click="filterByTag(tag)">
            <i :class="`el-icon-${tag.icon}`" />
            {{ tag.name }}
          </div>
        </el-tag>
      </div>
      <el-button
        slot="reference"
        type="text"
      >
        + {{ workspaceTags.length - 3 }}
      </el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'JusTagsFilter',
  computed: {
    workspaceTags() {
      return this.$store.getters.filteredTags.map(t => {
        if (this.$store.getters.disputeQuery.tags.includes(t.id)) {
          t.active = true
        } else {
          t.active = false
        }
        return t
      }).sort((a, b) => a.active === b.active ? 0 : a.active > b.active ? 1 : -1)
    }
  },
  methods: {
    filterByTag(tag) {
      let currentTags = JSON.parse(JSON.stringify(this.$store.getters.disputeQuery.tags))
      if (tag.active) currentTags = currentTags.filter(t => t !== tag.id)
      else currentTags.push(tag.id)
      this.$store.commit('updateDisputeQuery', { key: 'tags', value: currentTags })
      this.$emit('prescriptions:getDisputes')
    }
  }
}
</script>

<style lang="scss">
.jus-tags-filter {
  margin-left: 20px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  &__item {
    cursor: pointer;
    margin-left: -10px;
    background-color: #fff;
    border-radius: 50%;
  }
  &__popover {
    padding: 6px;
  }
  .el-tag {
    border-radius: 50%;
    color: #424242;
    border-color: #adadad;
    &.active {
      border: 2px solid #9461f7;
      padding: 0 9px;
    }
  }
  .el-button--text {
    padding: 8px 0;
    margin-left: 4px;
    color: #adadad;
  }
}
</style>
