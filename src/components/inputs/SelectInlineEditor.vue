<template>
  <div class="select-inline-editor">
    <div
      v-if="!isEditing"
      class="select-inline-editor__value"
    >
      <span class="select-inline-editor__inner">
        {{ handledVModel }}
      </span>
      <span class="select-inline-editor__icons">
        <i
          class="select-inline-editor__icon el-icon-copy-document"
          @click="copyValue"
        />
        <i
          id="selectIcons"
          class="select-inline-editor__icon el-icon-edit hidden-icon"
          @click="enableEdit"
        />
      </span>
    </div>

    <el-select
      v-else
      id="selectInput"
      ref="selectInput"
      v-model="vModel"
      filterable
      default-first-option
      class="select-inline-editor__input"
      @change="disableEdit"
      @keyup.native.esc="disableEdit"
    >
      <el-option
        v-for="option in options.list"
        :id="`selectInputOption-${option[options.value]}`"
        :key="option[options.value]"
        :label="option[options.label]"
        :value="option[options.value]"
        :disabled="option[options.disabled]"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'SelectInlieEditor',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    isEditing: false,
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
    handledVModel() {
      const { list, value, label } = this.options
      const selectedIndex = list.findIndex(item => item[value] === this.value)
      return list[selectedIndex][label]
    }
  },
  mounted() {
    this.$emit('enableEdit')
  },
  methods: {
    enableEdit() {
      this.model = this.value
      this.isEditing = true
      this.$nextTick(() => this.$refs.selectInput.toggleMenu())
      window.addEventListener('click', this.blurEvent)
    },
    disableEdit() {
      if (this.model !== this.value) {
        this.$emit('change', { [this.options.value]: this.vModel })
      }
      this.isEditing = false
      window.removeEventListener('click', this.blurEvent)
    },
    blurEvent(event) {
      const targetId = event.target.id
      if (!targetId.startsWith('selectInput') && targetId !== 'selectIcons') this.disableEdit()
    },
    copyValue() {
      navigator.clipboard.writeText(this.handledVModel)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.select-inline-editor {
  .select-inline-editor__value {
    position: relative;

    &:hover {
      .select-inline-editor__inner { opacity: .75; }
      .select-inline-editor__icons { opacity: 1; }
    }

    & > * { transition: .2s ease-out all; }

    .select-inline-editor__inner {
      cursor: default;
    }

    .select-inline-editor__icons {
      background-image: linear-gradient(to left, rgba(255, 255, 255, 145) 45%, rgba(255, 255, 255, 0) );
      position: absolute;
      opacity: 0;
      right: 0;
      padding-left: 10px;

      .select-inline-editor__icon {
        cursor: pointer;
        margin-left: 3px;
        transition: .2s ease-out all;
        &:hover { color: $--color-primary; }
      }
    }
  }

  .select-inline-editor__input {
    border: none;
    padding: 0;
    width: 100%;
    font-size: inherit;
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
.select-inline-editor {
  .select-inline-editor__input {
    .el-input__inner {
      border: none;
      border-bottom: 2px solid #e4e7ed;
      line-height: normal;
      height: auto;
      padding: 0;
      font-size: inherit;
      &:focus { border-bottom-color: #e4e7ed; }
    }

    .el-input__suffix {
      .el-input__suffix-inner {
        .el-select__caret {
          line-height: normal;
        }
      }
    }
  }
}
</style>
