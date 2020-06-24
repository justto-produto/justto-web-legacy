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
        <el-input
          v-if="!searchItems"
          ref="saveTagInput"
          v-model="inputValue"
          class="jus-tag-container__input"
          size="mini"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        />

        <el-autocomplete
          v-else
          ref="saveTagInput"
          v-model="inputValue"
          :fetch-suggestions="suggestions"
          class="jus-tag-container__input"
          size="mini"
          value-key="name"
          @select="handleSelect"
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
import { querySearch } from '@/utils/AutoComplete.util'
import _ from 'lodash'

export default {
  name: 'JusTagContainer',
  props: {
    options: {
      type: Array,
      default: null,
    },
    placeholder: {
      type: String,
      default: '',
    },
    tagList: {
      type: Array,
      default: null,
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      tags: this.tagList,
      inputVisible: false,
      inputValue: '',
      searchItems: [],
    }
  },
  computed: {
    placeholderIsVisible() {
      return !this.tags.length && this.placeholder && !this.inputVisible
    },
  },
  mounted() {
    this.searchItems = this.options
  },
  methods: {
    resetTags() {
      const diff = []

      for (let i = 0; i < this.tags.length; i++) {
        for (let j = 0; j < this.options.length; j++) {
          if (_.isEqual(this.tags[i], this.options[j])) {
            diff.push(this.options[j])
          }
        }
      }

      this.searchItems = _.pullAll(this.options, diff)
    },
    suggestions(queryString, callback) {
      querySearch(
        this.searchItems,
        queryString,
        this.filter(queryString),
        callback,
      )
    },

    filter: (queryString) =>
      searchItem =>
        searchItem.name
          .toLowerCase()
          .indexOf(queryString.toLowerCase()) === 0,

    handleClose(index) {
      this.tags.splice(index, 1)
      this.resetTags()
      this.changeTags()
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      this.inputVisible = false

      if (this.inputValue) {
        this.tags.push({ name: this.inputValue })
        this.changeTags()
      }

      this.clearInput()
    },
    handleSelect(item) {
      this.tags.push(item)
      this.resetTags()

      this.inputVisible = false
      this.clearInput()
      this.changeTags()
    },
    clearInput() {
      this.inputValue = ''
    },
    changeTags() {
      this.$emit('change', this.tags)
    },
  },
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
