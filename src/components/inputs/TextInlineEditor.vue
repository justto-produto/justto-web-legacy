<template>
  <div class="text-inline-editor">
    <div
      v-if="!isEditing"
      class="text-inline-editor__value"
    >
      <span
        class="text-inline-editor__inner"
        @click="$emit('click')"
      >
        {{ filteredVModel }}
      </span>
      <span class="text-inline-editor__icons">
        <i
          v-if="isCopyble"
          class="text-inline-editor__icon el-icon-copy-document"
          @click="copyValue"
        />
        <i
          v-if="isEditable"
          class="text-inline-editor__icon el-icon-edit"
          @click="enableEdit"
        />
        <i
          v-if="isDeletable"
          class="text-inline-editor__icon el-icon-delete"
          @click="deletElement"
        />
      </span>
    </div>

    <el-input
      v-else
      ref="textInput"
      v-model="vModel"
      v-mask="{ mask, tokens }"
      class="text-inline-editor__input"
      @blur="confirmEdit"
    />
    <!-- @keyup.native.enter="confirmEdit"
    @keyup.native.esc="cancelEdit" -->
  </div>
</template>

<script>
export default {
  name: 'TextInlieEditor',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    filter: {
      type: String,
      default: ''
    },
    mask: {
      type: [Array, String],
      default: () => 'X'.repeat(255)
    },
    isCopyble: {
      type: Boolean,
      default: true
    },
    isEditable: {
      type: Boolean,
      default: true
    },
    isDeletable: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isEditingActive: false,
    model: ''
  }),
  computed: {
    vModel: {
      get() {
        return this.isEditing ? this.model : this.value
      },
      set(value) {
        this.model = value
      }
    },
    isEditing: {
      get() {
        return this.isEditingActive
      },
      set(value) {
        this.isEditingActive = value
        if (!value) this.$emit('blur')
      }
    },
    tokens() {
      return {
        '#': { pattern: /\d/ },
        D: { pattern: /[ABDENPabdenp]/, transform: v => v.toUpperCase() },
        d: { pattern: /[0-9ABDENPabdenp]/, transform: v => v.toUpperCase() },
        Z: { pattern: /[0-9a-zA-Z]/, transform: v => v.toUpperCase() },
        z: { pattern: /[0-9a-zA-Z]/, transform: v => v.toLowerCase() },
        X: { pattern: /./ },
        A: { pattern: /[a-zA-Z]/, transform: v => v.toUpperCase() },
        a: { pattern: /[a-zA-Z]/, transform: v => v.toLowerCase() },
        '!': { escape: true }
      }
    },
    // unmaskedVModel() {
    //   const gerRep = new RegExp(this.mask)
    //   console.log(gerRep)
    //   return this.vModel.replace(gerRep, '')
    // },
    filteredVModel() {
      const { filter, vModel } = this

      return filter
        ? this.$options.filters[filter](vModel)
        : vModel
    }
  },
  methods: {
    enableEdit() {
      this.model = this.value || ''
      this.isEditing = true
      this.$nextTick(() => {
        this.$refs.textInput.focus()
        this.$forceUpdate()
      })
    },
    disableEdit() {
      this.isEditing = false
    },
    confirmEdit() {
      if (this.model !== this.value) {
        this.$emit('change', this.vModel)
      }
      this.disableEdit()
    },
    cancelEdit() {
      this.model = this.value || ''
      this.disableEdit()
    },
    copyValue() {
      navigator.clipboard.writeText(this.vModel)
    },
    deletElement() {
      this.$emit('delete')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.text-inline-editor {
  .text-inline-editor__value {
    position: relative;
    border-bottom: 2px solid transparent;

    &:hover {
      .text-inline-editor__inner { opacity: .85; }
      .text-inline-editor__icons { opacity: 1; }
    }

    & > * { transition: .2s ease-out all; }

    .text-inline-editor__inner {
      cursor: default;
    }

    .text-inline-editor__icons {
      background-image: linear-gradient(to left, rgba(255, 255, 255, 145) 45%, rgba(255, 255, 255, 0) );
      position: absolute;
      opacity: 0;
      right: 0;
      top: 0;
      padding-left: 30px;

      .text-inline-editor__icon {
        cursor: pointer;
        margin-left: 3px;
        transition: .2s ease-out all;
        &:hover {
          color: $--color-primary;
          &.el-icon-delete { color: $--color-danger; }
        }
      }
    }
  }

  // .request-succes {
  //   color: $--color-primary;
  // }

  // .request-fail {
  //   color: $--color-danger;
  // }
}
</style>

<style lang="scss">
.text-inline-editor {
  .text-inline-editor__input {
    .el-input__inner {
      border: none;
      border-bottom: 2px solid #e4e7ed;
      line-height: normal;
      height: auto;
      padding: 0;
      font-size: inherit;
    }
  }
}
</style>
