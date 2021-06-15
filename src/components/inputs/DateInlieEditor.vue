<template>
  <div class="date-inline-editor">
    <div
      v-if="!isEditing"
      class="date-inline-editor__value"
    >
      <span class="date-inline-editor__inner">
        {{ newDateValue | moment('DD/MM/YYYY') }}
        <span v-if="processedDate && value">({{ processedDate }})</span>
      </span>
      <span class="date-inline-editor__icons">
        <i
          class="date-inline-editor__icon el-icon-copy-document"
          @click="copyValue"
        />
        <i
          v-if="isEditable"
          id="datepickerIcons"
          class="date-inline-editor__icon el-icon-edit"
          @click="enableEdit"
        />
      </span>
    </div>

    <el-date-picker
      v-else
      id="datepickerInput"
      ref="dateInput"
      v-model="vModel"
      :clearable="false"
      type="date"
      prefix-icon=""
      format="dd/MM/yyyy"
      :value-format="isDateTimeFormat ? 'yyyy-MM-dd[T]hh:mm:ss[Z]' : 'yyyy-MM-dd'"
      class="date-inline-editor__input"
      @change="disableEdit"
      @keyup.esc="disableEdit"
    />
  </div>
</template>

<script>
export default {
  name: 'DateInlieEditor',
  props: {
    value: {
      type: [String, Number, Array],
      default: ''
    },
    processedDate: {
      type: String,
      default: ''
    },
    isDateTimeFormat: {
      type: Boolean,
      default: true
    },
    isEditable: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    isEditingActive: false,
    model: ''
  }),
  computed: {
    newDateValue() {
      const timestamp = Date.parse(this.value)
      if (!isNaN(timestamp)) {
        return new Date(this.value)
      } else return new Date()
    },
    vModel: {
      get() {
        return this.isEditing ? this.model : this.newDateValue
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
    enableEdit() {
      this.model = this.newDateValue
      this.isEditing = true
      this.$nextTick(() => {
        this.$forceUpdate()
        this.$nextTick(() => {
          this.$refs.dateInput.focus()
          this.$forceUpdate()
        })
      })
      window.addEventListener('click', this.blurEvent)
    },
    disableEdit() {
      if (this.model !== this.value) {
        this.$emit('change', this.isDateTimeFormat ? { dateTime: this.model } : this.model)
      }
      this.isEditing = false
      window.removeEventListener('click', this.blurEvent)
    },
    blurEvent(event) {
      const targetId = event.target.id.length === 0
        ? event.target.lastChild.ownerDocument.activeElement.id
        : event.target.id
      if (!targetId.startsWith('datepickerIcons') && !targetId.startsWith('datepickerInput')) this.disableEdit()
    },
    copyValue() {
      navigator.clipboard.writeText(this.vModel)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.date-inline-editor {
  .date-inline-editor__value {
    position: relative;
    border-bottom: 2px solid transparent;

    &:hover {
      .date-inline-editor__inner { opacity: .85; }
      .date-inline-editor__icons { opacity: 1; }
    }

    & > * { transition: .2s ease-out all; }

    .date-inline-editor__inner {
      cursor: default;
    }

    .date-inline-editor__icons {
      background-image: linear-gradient(to left, rgba(255, 255, 255, 145) 45%, rgba(255, 255, 255, 0) );
      position: absolute;
      opacity: 0;
      right: 0;
      top: 0;
      padding-left: 30px;

      .date-inline-editor__icon {
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
}
</style>

<style lang="scss">
.date-inline-editor {
  .date-inline-editor__input {
    .el-input__inner {
      border: none;
      border-bottom: 2px solid #e4e7ed;
      line-height: normal;
      height: auto;
      padding: 0;
      font-size: inherit;

    }

    .el-input__prefix {
      display: none !important;
    }
  }
}
</style>
