<template>
  <article class="grouped-occurrences__inner">
    <span v-if="have">
      •
    </span>

    <el-popover
      placement="top-start"
      trigger="hover"
      :open-delay="250"
      :disabled="!have || isOmnichannelGrouping"
      popper-class="grouped-occurrences"
      class="grouped-occurrences__poppover"
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

      <span
        v-if="have"
        slot="reference"
        @click="openGrouped"
      >
        <!-- <JusIcon
          v-if="!isOmnichannelGrouping"
          icon="running"
          :style="{ width: '16px' }"
        /> -->

        <span>
          (+{{ occurrences.length }})
        </span>

        <i
          v-if="isOmnichannelGrouping"
          :class="{'el-icon-caret-bottom': !isOpenGroupedOccurrences, 'el-icon-caret-top': isOpenGroupedOccurrences}"
        />
      </span>
    </el-popover>
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    occurrences: {
      type: Array,
      default: () => []
    },

    parentId: {
      type: Number,
      required: true
    },

    have: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters([
      'getGroupedOccurrencesById',
      'isOmnichannelGrouping',
      'userPreferences'
    ]),

    plural() {
      return (msg, sufix) => this.occurrences.length > 1 ? `${msg}${sufix}` : msg
    },

    isOpenGroupedOccurrences() {
      return this.getGroupedOccurrencesById(this.parentId).length > 0
    }
  },

  methods: {
    ...mapActions([
      'getGroupedOccurrences',
      'getGroupedOccurrencesByOccurrenceId',
      'resetGroupedOccurrencesByOccurrenceId'
    ]),

    openGrouped() {
      if (this.isOpenGroupedOccurrences) {
        this.resetGroupedOccurrencesByOccurrenceId(this.parentId)
      } else {
        this.getGroupedOccurrences({
          parentId: this.parentId,
          disputeId: this.$route?.params?.id,
          occurrences: this.occurrences.map(({ id }) => id)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.grouped-occurrences__inner {
  display: flex;
  align-items: center;
  gap: 6px;

  .grouped-occurrences__poppover {
    .el-popover__reference-wrapper {
      .el-popover__reference {
        display: flex;
        gap: 2px;
        align-items: center;
        cursor: pointer;
      }
    }
  }
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
