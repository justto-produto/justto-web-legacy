<template>
  <div class="jus-text-editable">
    <el-input
      v-show="isEditing"
      ref="textInput"
      v-model="inputValue"
      @keyup.enter.native="saveChanges"
      @blur="saveChanges"
    >
      <el-button
        slot="append"
        icon="el-icon-check"
        type="primary"
        @click="saveChanges"
      />
    </el-input>
    <span
      v-show="!isEditing"
      :class="{
        [`jus-text-editable__mask--${type}`]: type
      }"
      class="jus-text-editable__mask"
      @click="editionHandler"
    >
      {{ value }}
      <jus-icon
        class="edit-icon"
        icon="edit"
      />
    </span>
  </div>
</template>

<script>
export default {
  name: 'JusTextEditable',
  props: {
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'default',
      validator: (val) => ['default', 'title'].includes(val)
    }
  },
  data() {
    return {
      inputValue: this.value,
      isEditing: false
    }
  },
  watch: {
    value(current) {
      this.inputValue = current
    }
  },
  methods: {
    editionHandler(evt) {
      this.isEditing = true
      this.$nextTick(() => this.$refs.textInput.$el.children[0].focus())
    },
    saveChanges() {
      if (this.isEditing) {
        if (!this.inputValue) {
          this.$jusNotification({
            title: 'Ops',
            type: 'warning',
            message: 'Este campo não pode ficar vazio'
          })
        } else {
          this.$emit('hasEdition', this.inputValue)
          this.isEditing = false
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$text-types:
  'default' inherit 400 inherit,
  'title' 24px 700 uppercase;

.jus-text-editable__mask {
  display: block;
  min-height: 16px;
  width: 100%;
  .edit-icon {
    display: none;
    cursor: pointer;
    width: 16px;
  }
  &:hover {
    .edit-icon {
      display: inline;
    }
  }

  @each $name, $size, $weight, $style in $text-types {
    &.jus-text-editable__mask--#{$name} {
      font-size: $size;
      font-weight: $weight;
      text-transform: $style;
    }
  }
}
</style>
