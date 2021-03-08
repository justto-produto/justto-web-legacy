<template>
  <div class="popover-link-inline-editor">
    <el-popover
      ref="popoverEditor"
      placement="bottom"
      :width="width"
      trigger="click"
      class="popover-link-inline-editor__popover"
      popper-class="popover-link-inline-editor__popper-class"
    >
      <ul class="popover-link-inline-editor__list">
        <li
          v-for="option in options"
          :key="option.value"
          :class="{
            'popover-link-inline-editor__option--selected': option.value === value,
            'popover-link-inline-editor__option--disabled': option.disabled
          }"
          class="popover-link-inline-editor__option"
          @click="handleSelect(option.value)"
        >
          <i
            v-if="option.icon"
            :class="option.icon"
          />
          {{ option.label | capitalize }}
        </li>
      </ul>
      <a
        slot="reference"
        class="popover-link-inline-editor__link"
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
      type: Array,
      default: () => ([])
    },
    label: {
      type: String,
      default: 'Clique aqui'
    },
    width: {
      type: Number,
      default: 300
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
.popover-link-inline-editor {
  .popover-link-inline-editor__popover {
    // text-align: center;
    // display: block;
  }

  .popover-link-inline-editor__link {
    font-size: 13px;
    line-height: normal;
  }
}
</style>

<style lang="scss">
@import '@/styles/colors.scss';

.popover-link-inline-editor__popper-class {
  padding: 6px 0;

  .popover-link-inline-editor__list {
    list-style: none;
    margin: 0;
    padding: 0;

    .popover-link-inline-editor__option {
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
