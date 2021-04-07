<template lang="html">
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
          'jus-tags-filter__tag--exclusive-is-active': tag.activeType === 'exclusive'
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
      <div>
        <el-popover
          v-for="tag in workspaceTags.slice(0, workspaceTags.length - 3).reverse()"
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
              'jus-tags-filter__tag--exclusive-is-active': tag.activeType === 'exclusive'
            }"
            class="el-tag--etiqueta el-tag--click jus-tags-filter__tag"
          >
            <div @click="filterByTag(tag, 'nextState')">
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
import { mapGetters } from 'vuex'
const _ = require('lodash')

export default {
  name: 'JusTagsFilter',
  computed: {
    ...mapGetters([
      'disputeQuery',
      'filteredTags'
    ]),

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
      this.$emit('prescriptions:getDisputes')
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

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
    border-radius: 50%;
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
  padding: 6px;
}

.jus-tags-filter__actions-popover {
  padding: 6px;
  color: $--color-text-secondary;
  // background-color: $--color-primary-light-9;

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

  // .popper__arrow {
  //   border-color: $--color-primary-light-9;
  //   &::after {
  //     border-color: $--color-primary-light-9;
  //   }
  // }
}

</style>
