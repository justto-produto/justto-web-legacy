<template>
  <div class="popover-inline-editor">
    <el-popover
      ref="popoverEditor"
      placement="bottom"
      :width="width"
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
          class="popover-inline-editor__reference-icon"
          v-if="selectedOption.icon"
          :class="selectedOption.icon"
        />
        {{ selectedOption.label | capitalize }}
        <i class="el-icon-edit hidden-icon" />
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'PopoverLinkInlineEditor',
  props: {
    value: {
      type: [String, Boolean],
      default: ''
    },
    options: {
      type: Array,
      default: () => ([])
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

    .popover-inline-editor__reference-icon {
      margin-right: 6px
    }

    .el-icon-edit {
      padding-left: 3px    
    }
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
