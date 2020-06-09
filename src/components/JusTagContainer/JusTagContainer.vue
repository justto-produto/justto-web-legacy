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

      <el-input
        v-if="inputVisible"
        ref="saveTagInput"
        v-model="inputValue"
        class="jus-tag-container__input"
        size="mini"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      />

      <i
        v-else
        class="el-icon-plus jus-tag-container__button"
        @click="showInput"
      />
    </div>
  </article>
</template>

<script>
export default {
  name: 'JusTagContainer',
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    tagList: {
      type: Array,
      default: () => [],
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
    }
  },
  computed: {
    placeholderIsVisible() {
      return !this.tags.length && this.placeholder && !this.inputVisible
    },
  },
  methods: {
    handleClose(index) {
      this.tags.splice(index, 1)
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
        this.inputValue = ''
      }
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
      width: 80px;
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
