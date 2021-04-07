<template>
  <div class="popover-inline-editor">
    <el-popover
      ref="popoverEditor"
      placement="bottom"
      :width="width"
      :disabled="!isEditable"
      trigger="click"
      class="popover-inline-editor__popover"
      popper-class="popover-inline-editor__popper-class"
    >
      <ul class="popover-inline-editor__list">
        <li
          v-for="option in options"
          :key="option.value"
          :class="{
            'popover-inline-editor__option--selected': option.value === value,
            'popover-inline-editor__option--disabled': option.disabled
          }"
          class="popover-inline-editor__option"
          @click="handleSelect(option.value)"
        >
          <i
            v-if="option.icon"
            :class="option.icon"
          />
          {{ option.label | capitalize }}
        </li>
      </ul>
      <div
        slot="reference"
        class="popover-inline-editor__reference show-right-icon"
      >
        <i
          v-if="selectedOption.icon"
          :class="selectedOption.icon"
          class="popover-inline-editor__reference-icon"
        />
        {{ selectedOption.label | capitalize }}
        <i
          v-if="isEditable"
          class="el-icon-edit hidden-icon"
        />
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'PopoverInlineEditor',
  props: {
    value: {
      type: [String, Boolean],
      default: ''
    },
    options: {
      type: Array,
      default: () => ([])
    },
    isEditable: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 300
    }
  },
  computed: {
    selectedOption() {
      const optionIndex = this.options.findIndex(option => option.value === this.value)
      const { label, icon } = this.options[optionIndex]
      return { label, icon }
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
.popover-inline-editor {
  .popover-inline-editor__popover {
    text-align: center;
    display: block;
  }

  .popover-inline-editor__reference {
    line-height: normal;
    cursor: default;
    display: flex;
    align-items: center;
    text-align: left;

    .popover-inline-editor__reference-icon {
      margin-right: 6px
    }

    .el-icon-edit { padding-left: 3px }
  }
}
</style>

<style lang="scss">
@import '@/styles/colors.scss';

.popover-inline-editor__popper-class {
  padding: 6px 0;

  .popover-inline-editor__list {
    list-style: none;
    margin: 0;
    padding: 0;

    .popover-inline-editor__option {
      cursor: pointer;
      padding: 6px 24px;
      word-break: break-word;
      text-align: left;

      &:hover {
        background-color: $--color-light-gray;
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
