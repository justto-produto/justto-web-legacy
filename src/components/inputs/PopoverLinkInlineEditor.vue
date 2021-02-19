<template>
  <div class="select-inline-editor">
    <el-popover
      ref="popoverEditor"
      placement="bottom"
      width="200"
      trigger="click"
      class="select-inline-editor__popover"
      popper-class="select-inline-editor__popper-class"
    >
      <ul class="select-inline-editor__list">
        <li
          v-for="option in options.list"
          :key="option.value"
          :class="{
            'select-inline-editor__option--selected': option.value === value,
            'select-inline-editor__option--disabled': option.disabled
          }"
          class="select-inline-editor__option"
          @click="handleSelect(option.value)"
        >
          {{ option.label | capitalize }}
        </li>
      </ul>
      <a
        slot="reference"
        class="select-inline-editor__link"
      >
        {{ label }}
      </a>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'PopoverLinkInlineEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => ({})
    },
    label: {
      type: String,
      default: 'Clique aqui'
    }
  },
  methods: {
    handleSelect(value) {
      if (this.value !== value) {
        this.$emit('change', value)
      }
      this.$refs.popoverEditor.doToggle()
    }
  }
}
</script>

<style lang="scss" scoped>
.select-inline-editor {
  .select-inline-editor__popover {
    text-align: center;
    display: block;
  }

  .select-inline-editor__link {
    font-size: 13px;
    line-height: normal;
  }
}
</style>

<style lang="scss">
@import '@/styles/colors.scss';

.select-inline-editor__popper-class {
  padding: 6px 0;

  .select-inline-editor__list {
    list-style: none;
    margin: 0;
    padding: 0;

    .select-inline-editor__option {
      padding: 6px 24px;
      cursor: pointer;

      &:hover {
        background-color: $--light-gray;
      }

      &--selected {
        color: $--color-primary;
        font-weight: 600;
      }

      &--disabled {
        color: $--color-text-secondary;
        cursor: not-allowed;
      }
    }
  }
}
</style>
