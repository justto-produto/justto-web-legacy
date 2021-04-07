<template>
  <section class="overview-obf">
    <label
      for="obf"
      class="overview-obf__label"
    >
      OBF:
    </label>

    <el-input
      v-if="isEditing || value"
      ref="obfTextarea"
      v-model="description"
      :autosize="{ minRows: 1, maxRows: 5}"
      type="textarea"
      class="overview-obf__textarea"
      @focus="showTextarea"
      @blur="hideTextarea"
      @input="updateDescription"
    />
    <span
      v-if="isEditing || value"
      :class="{ 'overview-obf__textarea--shadow-hidden': isEditing }"
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
import { mapActions } from 'vuex'
const debounce = require('lodash/debounce')

export default {
  name: 'OverviewObf',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    isEditing: false,
    model: ''
  }),
  computed: {
    description: {
      get() {
        return this.isEditing ? this.model : this.value
      },
      set(value) {
        this.model = value
      }
    },
    disputeId() {
      return Number(this.$route.params.id)
    }
  },
  methods: {
    ...mapActions(['setTicketOverview']),

    showTextarea() {
      this.model = this.value
      this.isEditing = true
      this.$nextTick(() => this.$refs.obfTextarea.focus())
    },

    hideTextarea() {
      this.isEditing = false
    },

    updateDescription: debounce(function() {
      const { description, disputeId } = this
      const data = { description }

      this.setTicketOverview({ data, disputeId })
    }, 800)
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
    height: auto;
    line-height: 20px;
    color: $--color-text-primary;
    resize: none;
    padding: 3px;
  }

  .overview-obf__link {
    color: $--color-text-secondary;
    display: block;
    transition: .2s ease-out color;
    &:hover {
      color: $--color-text-primary;
    }
  }

  .overview-obf__textarea {
    &--shadow {
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
    &--shadow-hidden {
      opacity: 0 !important;
      visibility: hidden !important;
    }
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

<style lang="scss">
.overview-obf {
  .overview-obf__textarea {
    .el-textarea__inner {
      border: none;
      padding: 0;
      font-size: inherit;
      line-height: inherit;
      resize: none;
    }
  }
}
</style>
