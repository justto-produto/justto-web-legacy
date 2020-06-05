<template>
  <article class="jus-tag-container">
    <span class="jus-tag-container__title">
      {{ title }}
    </span>
    <div class="jus-tag-container__wrapper">
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
    title: {
      type: String,
      default: null,
    },
    tagList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tags: this.tagList,
      inputVisible: false,
      inputValue: '',
    }
  },
  methods: {
    handleClose(index) {
      return this.tags.splice(index, 1)
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
        this.inputValue = ''
      }
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

  .jus-tag-container__wrapper {
    display: flex;
    flex-wrap: wrap;
    border-radius: 4px;
    align-items: center;

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

    .jus-tag-container__button {
      cursor: pointer;
      color: $--color-primary;
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
