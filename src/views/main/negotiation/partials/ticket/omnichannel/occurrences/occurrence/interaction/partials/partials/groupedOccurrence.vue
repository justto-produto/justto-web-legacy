<template>
  <article class="grouped-occurrences__inner">
    <span v-if="have">
      •
    </span>
    <el-popover
      placement="top-start"
      trigger="hover"
      :open-delay="250"
      :disabled="!have"
      popper-class="grouped-occurrences"
    >
      <div class="grouped-occurrences__container">
        <strong
          class="grouped-occurrences__container-text"
        >
          +{{ occurrences.length }} {{ plural('ocorrência', 's') }} {{ plural('similar', 'es') }} à essa {{ plural('enviada', 's') }} em:
        </strong>
        <div
          v-for="({ date }, index) in occurrences"
          :key="index"
          class="grouped-occurrences__container-date"
        >
          {{ date | moment('DD [de] MMMM [de] YYYY [às] HH:MM') }}
        </div>
      </div>
      <JusIcon
        v-if="have"
        slot="reference"
        icon="running"
        :style="{ width: '16px' }"
      />
    </el-popover>
  </article>
</template>

<script>
export default {
  props: {
    occurrences: {
      type: Array,
      default: () => []
    },
    have: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    plural() {
      return (msg, sufix) => this.occurrences.length > 1 ? `${msg}${sufix}` : msg
    }
  }
}
</script>

<style lang="scss" scoped>
.grouped-occurrences__inner {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>

<style lang="scss">
.grouped-occurrences {
  padding: 10px;

  .grouped-occurrences__container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .grouped-occurrences__container-text {
      margin-bottom: 6px;
    }
  }
}
</style>
