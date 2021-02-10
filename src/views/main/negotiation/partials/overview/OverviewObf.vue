<template>
  <section class="overview-obf">
    <label
      for="obf"
      class="overview-obf__label"
    >
      OBF:
    </label>

    <textarea
      v-if="isEditing || value"
      id="obf"
      ref="oabTextarea"
      v-model="descriptionModel"
      class="overview-obf__textarea"
      @blur="hideTextarea"
    />
    <span
      v-if="isEditing || value"
      class="overview-obf__textarea--shadow"
    />

    <a
      v-if="!isEditing && !value"
      class="overview-obf__link"
      @click="showTextarea"
    >
      Clique para adicionar
    </a>
  </section>
</template>

<script>
export default {
  name: 'OverviewObf',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    isEditing: false
  }),
  computed: {
    descriptionModel: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    showTextarea() {
      this.isEditing = true
      this.$nextTick(() => this.$refs.oabTextarea.focus())
    },
    hideTextarea() {
      this.isEditing = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.overview-obf {
  position: relative;
  border: 1px solid $--color-secondary;
  border-radius: 6px;
  padding: 6px;
  height: auto;
  margin-top: 6px;

  .overview-obf__label {
    top: -10px;
    left: 20px;
    position: absolute;
    color: $--color-secondary;
    background-color: $--color-white;
    padding: 0 3px;
    font-size: 13px;
  }

  .overview-obf__textarea {
    border: none;
    width: 100%;
    height: 100px;
    line-height: 20px;
    color: $--color-text-regular;
    resize: none;
    padding: 3px;

    &:focus ~ .overview-obf__textarea--shadow {
      opacity: 0;
      visibility: hidden;
    }
  }

  .overview-obf__link {
    color: $--color-text-secondary;
    display: block;
    transition: .2s ease-out color;
    &:hover {
      color: $--color-text-regular;
    }
  }

  .overview-obf__textarea--shadow {
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    border-radius: 6px;
    background-image: linear-gradient(to top, rgba(255, 255, 255, 85), rgba(255, 255, 255, 0) 60%);
    transition: .2s ease-out;
    opacity: 1;
  }

  &:hover {
    .overview-obf__textarea--shadow {
      opacity: 0;
      visibility: hidden;
    }
  }
}

@media (max-width: 900px) {
  .overview-obf {
    .overview-obf__textarea--shadow {
      display: none;
    }
  }
}
</style>
