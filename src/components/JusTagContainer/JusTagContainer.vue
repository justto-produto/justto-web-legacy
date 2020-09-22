<template>
  <article class="jus-tag-container">
    <span
      v-if="title"
      class="jus-tag-container__title"
    >
      {{ title }}
    </span>
    <p
      v-if="placeholderIsVisible"
      class="jus-tag-container__placeholder"
    >
      <i
        v-if="canAddTag"
        class="el-icon-plus jus-tag-container__button"
        @click="showInput"
      />
      {{ placeholder }}
    </p>
    <div
      v-else
      class="jus-tag-container__wrapper"
    >
      <el-tag
        v-for="(tag, index) in tags"
        :key="`${index}-${_uid}`"
        closable
        class="jus-tag-container__tag"
        @close="handleClose(index)"
      >
        {{ tag.name }}
      </el-tag>

      <div v-if="inputVisible">
        <el-autocomplete
          ref="saveTagInput"
          v-model="inputValue"
          :fetch-suggestions="suggestions"
          :trigger-on-focus="false"
          class="jus-tag-container__input"
          size="mini"
          value-key="teamName"
          @select="handleSelect"
          @blur="closeInput"
        />
      </div>

      <i
        v-else
        class="el-icon-plus jus-tag-container__button"
        @click="showInput"
      />
    </div>
  </article>
</template>

<script>
import { filterByTerm } from '@/utils/jusUtils'

export default {
  name: 'JusTagContainer',
  props: {
    options: {
      type: Array,
      default: null
    },
    isPrivate: {
      type: Boolean,
      default: true
    },
    tagList: {
      type: Array,
      default: null
    },
    canAddTag: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tags: this.tagList,
      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {
    placeholderIsVisible() {
      return !this.tags.length && this.placeholder && !this.inputVisible
    },
    placeholder() {
      return this.isPrivate ? 'Nimgém pode ver essa estratégia. Associe um time ou torne-a pública.' : 'Todos os times possuem acesso a esta estratégia.'
    }
  },
  methods: {
    suggestions(queryString, callback) {
      callback(filterByTerm(this.inputValue, this.options, 'teamName'))
    },

    handleClose(index) {
      this.tags.splice(index, 1)
      this.changeTags()
    },

    showInput() {
      this.$emit('showInput')
      this.inputVisible = true
      this.$nextTick(() => { this.$refs.saveTagInput.focus() })
    },

    handleSelect(item) {
      this.tags.push(item)
      this.inputValue = ''
      this.closeInput()
      this.changeTags()
    },

    closeInput() {
      if (!this.inputValue) this.inputVisible = false
    },

    changeTags() {
      this.$emit('change', this.tags)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.jus-tag-container {
  border: 1px solid $--color-primary-light-9;
  transition-duration: .3s;
  padding: 8px 8px 0;

  &:hover {
    background-color: mix($--color-white, $--color-primary, 95%);
    border-color: $--color-primary-light-8;
  }

  .jus-tag-container__placeholder {
    color: $--color-text-secondary;
    margin: 0;
    padding: 0 16px 16px 0;
    user-select: none;
  }

  .jus-tag-container__button {
    cursor: pointer;
    color: $--color-primary;
    position: relative;
    font-size: 18px;
  }

  .jus-tag-container__wrapper {
    display: flex;
    flex-wrap: wrap;
    border-radius: 4px;
    align-items: center;

    .jus-tag-container__button {
      top: -4px;
    }

    .jus-tag-container__tag {
      display: block;
      margin-bottom: 8px;
      margin-right: 8px;
    }

    .jus-tag-container__input {
      width: 140px;
      position: relative;
      top: -4px;
    }
  }

  .jus-tag-container__title {
    font-size: 12px;
    display: block;
    margin-bottom: 16px;
    color: $--color-text-regular;
  }
}
</style>
