<template>
  <div class="jus-tags-filter">
    <el-popover
      v-for="(tag, index) in workspaceTags.slice(-3).reverse()"
      :key="tag.id"
      :open-delay="400"
      :style="{ zIndex: workspaceTags.length - index }"
      popper-class="jus-tags-filter__actions-popover"
      class="jus-tags-filter__item"
      trigger="hover"
      placement="top"
    >
      <div>
        <div class="jus-tags-filter__item-name">
          {{ tag.name }}
        </div>
        <el-button
          :class="{ 'jus-tags-filter__state-button--active': tag.activeType === 'inclusive' }"
          class="jus-tags-filter__state-button"
          type="text"
          @click="filterByTag(tag, 'changeInclusive')"
        >
          <jus-icon
            class="jus-tags-filter__state-icon"
            icon="checked"
          />
          Possui esta etiqueta
        </el-button>
        <span> | </span>
        <el-button
          :class="{ 'jus-tags-filter__state-button--active': tag.activeType === 'exclusive' }"
          class="jus-tags-filter__state-button"
          type="text"
          @click="filterByTag(tag, 'changeExclusive')"
        >
          Não possui esta etiqueta
          <jus-icon
            class="jus-tags-filter__state-icon"
            icon="blocked"
          />
        </el-button>
      </div>

      <el-tag
        slot="reference"
        :color="tag.color"
        :class="{
          'jus-tags-filter__tag--inclusive-is-active': tag.activeType === 'inclusive',
          'jus-tags-filter__tag--exclusive-is-active': tag.activeType === 'exclusive',
          'jus-tags-filter__tag--text-light': isDarkColor(tag.color)
        }"
        class="jus-tags-filter__tag jus-tags-filter__tag--round"
        @click="filterByTag(tag, 'nextState')"
      >
        <i :class="`el-icon-${tag.icon}`" />
      </el-tag>
    </el-popover>
    <el-popover
      v-if="workspaceTags.length > 3"
      placement="bottom"
      width="400"
      popper-class="jus-tags-filter__tags-popover"
      trigger="click"
    >
      <div class="jus-tags-filter__tags-popover-container">
        <el-input
          v-model="tagsFilterText"
          prefix-icon="el-icon-search"
          placeholder="Filtrar tags"
          size="small"
          clearable
        />

        <el-popover
          v-for="tag in filteredWorkspaceTags.reverse()"
          :key="tag.id"
          :open-delay="400"
          popper-class="jus-tags-filter__actions-popover"
          trigger="hover"
          placement="top"
        >
          <div>
            <el-button
              :class="{ 'jus-tags-filter__state-button--active': tag.activeType === 'inclusive' }"
              class="jus-tags-filter__state-button"
              type="text"
              @click="filterByTag(tag, 'changeInclusive')"
            >
              <jus-icon
                class="jus-tags-filter__state-icon"
                icon="checked"
              />
              Possui esta etiqueta
            </el-button>
            <span> | </span>
            <el-button
              :class="{ 'jus-tags-filter__state-button--active': tag.activeType === 'exclusive' }"
              class="jus-tags-filter__state-button"
              type="text"
              @click="filterByTag(tag, 'changeExclusive')"
            >
              Não possui esta etiqueta
              <jus-icon
                class="jus-tags-filter__state-icon"
                icon="blocked"
              />
            </el-button>
          </div>
          <el-tag
            slot="reference"
            :color="tag.color"
            :class="{
              'jus-tags-filter__tag--inclusive-is-active': tag.activeType === 'inclusive',
              'jus-tags-filter__tag--exclusive-is-active': tag.activeType === 'exclusive',
              'jus-tags-filter__tag--text-light': isDarkColor(tag.color)
            }"
            class="el-tag--etiqueta el-tag--click jus-tags-filter__tag"
          >
            <div
              class="jus-tags-filter__tag-container"
              @click="filterByTag(tag, 'nextState')"
            >
              <i :class="`el-icon-${tag.icon}`" />
              {{ tag.name }}
            </div>
          </el-tag>
        </el-popover>
      </div>
      <el-button
        slot="reference"
        class="jus-tags-filter__plus-counter-button"
        type="text"
      >
        + {{ workspaceTags.length - 3 }}
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { calcBrightness } from '@/utils'
const _ = require('lodash')

export default {
  name: 'JusTagsFilter',

  data: () => ({
    tagsFilterText: ''
  }),

  computed: {
    ...mapGetters([
      'disputeQuery',
      'filteredTags'
    ]),

    filteredWorkspaceTags() {
      return (this.workspaceTags || []).filter(({ name }) => name.toLowerCase().includes(this.tagsFilterText.toLowerCase()))
    },

    workspaceTags() {
      return this.filteredTags.map(t => {
        if (this.disputeQuery.tags && this.disputeQuery.tags.includes(t.id)) {
          t.activeType = 'inclusive'
        } else if (this.disputeQuery.noTags && this.disputeQuery.noTags.includes(t.id)) {
          t.activeType = 'exclusive'
        } else {
          t.activeType = ''
        }
        return t
      }).sort((a, b) => {
        if (!!a.activeType === !!b.activeType) {
          return 0
        } else if (!!a.activeType > !!b.activeType) {
          return 1
        } else {
          return -1
        }
      })
    }
  },

  methods: {
    ...mapActions(['setTicketsQuery']),

    isDarkColor(color) {
      return calcBrightness(color) <= 175
    },

    filterByTag(tag, command) {
      const currentTags = _.cloneDeep(this.disputeQuery.tags || [])
      const currentNoTags = _.cloneDeep(this.disputeQuery.noTags || [])
      switch (command) {
        case 'nextState':
          this.nextState(tag, currentTags, currentNoTags)
          break
        case 'changeInclusive':
          if (tag.activeType === 'inclusive') {
            this.unsetTagFilters(tag, currentTags, currentNoTags)
          } else {
            this.setTagFilters(tag, command, currentTags, currentNoTags)
          }
          break
        case 'changeExclusive':
          if (tag.activeType === 'exclusive') {
            this.unsetTagFilters(tag, currentTags, currentNoTags)
          } else {
            this.setTagFilters(tag, command, currentTags, currentNoTags)
          }
          break
      }
    },

    nextState(tag, currentTags, currentNoTags) {
      if (!currentTags.includes(tag.id) && !currentNoTags.includes(tag.id)) {
        this.setTagFilters(tag, 'changeInclusive', currentTags, currentNoTags)
      } else if (currentTags.includes(tag.id)) {
        this.setTagFilters(tag, 'changeExclusive', currentTags, currentNoTags)
      } else if (currentNoTags.includes(tag.id)) {
        this.unsetTagFilters(tag, currentTags, currentNoTags)
      }
    },

    setTagFilters(tag, command, currentTags, currentNoTags) {
      if (command === 'changeInclusive') {
        currentNoTags = currentNoTags.filter(t => t !== tag.id)
        currentTags.push(tag.id)
      }
      if (command === 'changeExclusive') {
        currentTags = currentTags.filter(t => t !== tag.id)
        currentNoTags.push(tag.id)
      }
      this.updateTagFilters(currentTags, currentNoTags)
    },

    unsetTagFilters(tag, currentTags, currentNoTags) {
      currentNoTags = currentNoTags.filter(t => t !== tag.id)
      currentTags = currentTags.filter(t => t !== tag.id)
      this.updateTagFilters(currentTags, currentNoTags)
    },

    updateTagFilters(currentTags, currentNoTags) {
      this.$store.commit('updateDisputeQuery', { key: 'tags', value: currentTags })
      this.$store.commit('updateDisputeQuery', { key: 'noTags', value: currentNoTags })

      this.setTicketsQuery({ key: 'tags', value: currentTags })
      this.setTicketsQuery({ key: 'noTags', value: currentNoTags })
      this.$emit('prescriptions:getDisputes')
    }
  }
}
</script>

<style lang="scss">
@import '~projuris-acordos-theme/src/common/colors.scss';

@mixin selected-tag($--border-color, $--icon-url) {
  border: 2px solid $--border-color;
  position: relative;
  padding: 0 9px;

  &::after {
    content: url($--icon-url);
    position: absolute;
    bottom: 3px;
    right: -3px;
    width: 12px;
    height: 12px;
  }
}

.jus-tags-filter {
  margin-left: 20px;
  margin-right: 16px;
  display: flex;
  align-items: center;

  .jus-tags-filter__item {
    cursor: pointer;
    margin-left: -10px;
    border-radius: 50% !important;
  }

  .jus-tags-filter__plus-counter-button {
    padding: 8px 0;
    margin-left: 4px;
    color: $--color-text-secondary;
  }
}

.jus-tags-filter__tag {
  color: $--color-text-primary;
  border-color: $--color-text-secondary;

  &.jus-tags-filter__tag--inclusive-is-active {
    @include selected-tag($--color-success, '../../assets/icons/ic-checked.svg');
  }

  &.jus-tags-filter__tag--exclusive-is-active {
    @include selected-tag($--color-danger, '../../assets/icons/ic-blocked.svg');
  }

  &--round {border-radius: 50%;}
}

.jus-tags-filter__tags-popover {
  padding: 8px 0 8px 8px;
  width: auto !important;
  max-height: 50vh;
  overflow-y: scroll;

  .jus-tags-filter__tags-popover-container {
    display: flex;
    flex-direction: column;
    gap: 4px;

    span {
      .el-popover__reference-wrapper {
        width: 100%;

        .jus-tags-filter__tag {
          display: flex;

          &:not(.jus-tags-filter__tag--inclusive-is-active):not(.jus-tags-filter__tag--exclusive-is-active) {
            border: none;
          }

          &.jus-tags-filter__tag--text-light {
            .jus-tags-filter__tag-container {
              color: white !important;
            }
          }

          .jus-tags-filter__tag-container {
            display: flex;
            width: 100%;
            justify-content: flex-start;
            align-items: center;
            gap: 8px;

            color: $--color-text-primary;
          }
        }
      }
    }
  }
}

.jus-tags-filter__actions-popover {
  padding: 6px;
  color: $--color-text-secondary;

  .jus-tags-filter__state-button {
    color: $--color-text-secondary;
    padding: 0px 3px;
    &--active {font-weight: bold;}

    .jus-tags-filter__state-icon {
      width: 16px;
      margin-bottom: -2px;
    }
  }

  .jus-tags-filter__item-name {
    margin-bottom: 2px;
    text-align: center;
    font-weight: bold;
    color: $--color-text-primary;
  }
}

</style>
