<template lang="html">
  <ul v-loading="loading" v-chat-scroll="{always: true, smooth: true, scrollonremoved: true }" class="dispute-view-occurrences">
    <li
      v-for="(occurrence, index) in [1, 2, 3]"
      :key="occurrence"
      class="dispute-view-occurrences__occurrence">
        <div class="dispute-view-occurrences__interaction" :class="{'revert' : (index % 2 === 0)}">
          <div class="dispute-view-occurrences__avatar" :class="{'revert' : (index % 2 === 0)}">
            <jus-avatar-user shape="circle" size="sm" />
            16:20
          </div>
          <el-card class="dispute-view-occurrences__card el-card--occurrence">
            <div slot="header">
              Fulana de Tal
            </div>
            <div>
              PROPOSTA NEGADA DE: R$ 21.600 Contraproposta: x |Alçada Máxima: y
            </div>
          </el-card>
        </div>
    </li>
  </ul>
</template>

<script>
import { isBase64 } from '@/plugins/jusUtils'

export default {
  name: 'DisputeOccurrences',
  props: {
    occurrences: {
      type: Array,
      default: () => []
    },
    showScheduled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    currentTab: {
      type: String,
      default: '1'
    },
    disputeId: {
      type: Number,
      default: 0
    }
  },
}
</script>

<style lang="scss">
.dispute-view-occurrences {
  list-style: none;
  padding: 0;
  margin: 0 20px 20px;
  height: 100%;
  &__occurrence {
    margin-top: 20px;
    display: flex;
  }
  &__interaction {
    display: flex;
    width: 100%;
    &.revert {
      flex-direction: row-reverse;
    }
  }
  &__avatar {
    margin-right: 20px;
    &.revert {
      margin-left: 20px;
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    width: max-content;
  }
}
</style>
