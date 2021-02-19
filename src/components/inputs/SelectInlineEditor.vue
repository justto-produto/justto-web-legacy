<template>
  <div class="select-inline-editor">
    <div
      v-if="!isEditing"
      class="select-inline-editor__value"
    >
      <span class="select-inline-editor__inner">
        {{ $t(`roles.${options.role}.${vModel}`) | capitalize }}
      </span>
      <span class="select-inline-editor__icons">
        <i
          class="select-inline-editor__icon el-icon-edit hidden-icon"
          @click="enableEdit"
        />
      </span>
    </div>

    <el-select
      v-else
      ref="selectInput"
      v-model="vModel"
      class="select-inline-editor__input"
      @change="disableEdit"
    >
      <!-- @blur="isEditing = false" -->
      <el-option
        v-for="option in options.list"
        :key="option.value"
        :label="$options.filters.capitalize(option.label)"
        :value="option.value"
        :disabled="option.disabled"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'SelectInlieEditor',
  props: {
    value: {
      type: String,
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
    }
  },
  methods: {
    enableEdit() {
      this.model = this.value
      this.isEditing = true
      this.$nextTick(() => this.$refs.selectInput.toggleMenu())
    },
    disableEdit() {
      if (this.model !== this.value) {
        this.$emit('change', this.vModel)
      }
      this.isEditing = false
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
