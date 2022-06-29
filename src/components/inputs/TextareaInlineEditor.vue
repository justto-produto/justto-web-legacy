<template>
  <div class="textarea-inline-editor">
    <div
      v-if="!isEditing"
      class="textarea-inline-editor__value"
    >
      <span
        class="textarea-inline-editor__inner"
        @click="enableEdit"
      >
        {{ vModel }}
      </span>
      <span class="textarea-inline-editor__icons">
        <i
          class="textarea-inline-editor__icon el-icon-copy-document"
          @click="copyValue"
        />
        <i
          class="textarea-inline-editor__icon el-icon-edit"
          @click="enableEdit"
        />
      </span>
    </div>

    <el-input
      v-else
      ref="textareaInput"
      v-model="vModel"
      :autosize="{ minRows: 1, maxRows: 4}"
      type="textarea"
      class="textarea-inline-editor__input"
      @blur="handleBlur"
      @keyup.native.esc="$refs.textareaInput.$emit('blur', 'cancel')"
    />
    <!-- @keyup.native.enter="$refs.textareaInput.$emit('blur', 'confirm')" -->
  </div>
</template>

<script>
export default {
  name: 'TextareaInlieEditor',
  props: {
    value: {
      type: String,
      default: ''
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
    }
  },
  mounted() {
    this.$emit('enableEdit')
  },
  methods: {
    handleBlur(event) {
      if (event !== 'cancel') {
        this.confirmEdit()
      } else {
        this.cancelEdit()
      }
    },
    enableEdit() {
      this.model = this.value || ''
      this.isEditing = true
      this.$nextTick(() => {
        this.$refs.textareaInput.focus()
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.textarea-inline-editor {
  .textarea-inline-editor__value {
    position: relative;
    border-bottom: 2px solid transparent;

    &:hover {
      .textarea-inline-editor__inner { opacity: .85; }
      .textarea-inline-editor__icons { opacity: 1; }
    }

    & > * { transition: .2s ease-out all; }

    .textarea-inline-editor__inner {
      cursor: default;
    }

    .textarea-inline-editor__icons {
      background-image: linear-gradient(to left, rgba(255, 255, 255, 145) 45%, rgba(255, 255, 255, 0) );
      position: absolute;
      opacity: 0;
      right: 0;
      top: 0;
      padding-left: 30px;

      .textarea-inline-editor__icon {
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
.textarea-inline-editor {
  .textarea-inline-editor__input {
    .el-textarea__inner {
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
