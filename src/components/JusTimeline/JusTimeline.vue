<template>
  <el-container
    id="jus-timeline"
    v-loading="loading"
    class="jus-timeline">
    <ul
      v-if="!loading && (disputeTimeline.lawsuits || []).length"
      class="jus-timeline__list">
      <li
        v-for="(progress, progressIndex) in (disputeTimeline.lawsuits)"
        :key="`progress-${progressIndex}`"
        class="jus-timeline__list-item">
        <div class="jus-timeline__header">
          <div class="jus-timeline__header-title">
            {{ progress.description || 1 }}ª Instância -
            <el-link
              class="jus-timeline__header-link"
              target="_blank"
              :underline="false"
              :href="progress.url">
              {{ progress.code }}
              <sup><i class="el-icon-link el-icon--right" /></sup>
            </el-link>
          </div>
          <div class="jus-timeline__header-subtitle">
            Distribuído em {{ progress.date }}
          </div>
          <div class="jus-timeline__header-tags">
            <el-tag
              v-for="(tag, flagIndex) in progress.tags"
              :key="`tag-evento-${flagIndex}`"
              type="secondary"
              size="small">
              <strong>{{ tag }}</strong>
            </el-tag>
          </div>
        </div>

        <div class="jus-timeline__body">
          <el-timeline>
            <el-timeline-item
              v-for="(movement, eventIndex) in progress.movements"
              :key="`movement-${eventIndex}`"
              :timestamp="movement.date"
              placement="top"
            >
              <div class="jus-timeline__body-movement">
                <div class="jus-timeline__body-description">
                  {{ movement.description }}
                </div>
                <div class="jus-timeline__body-tags">
                  <el-tag
                    v-for="(tag, tagIndex) in (movement.tags || [])"
                    :key="`tag-movement-${tagIndex}`"
                    type="secondary"
                    size="small">
                    <strong>{{ tag }}</strong>
                  </el-tag>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </li>
    </ul>
    <div
      v-else
      class="jus-timeline__empty" >
      <jusIcon icon="empty-screen-filter" />
      <span class="jus-timeline__empty-label">
        Dados do processo indisponíveis.
      </span>
    </div>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'loading',
      'disputeTimeline',
    ]),
  },
  methods: {
    ...mapActions(['showLoading', 'hideLoading']),
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.jus-timeline {
  background-color: transparent;

  .jus-timeline__list {
    padding-inline-start: 8px;

    .jus-timeline__list-item {
      list-style: none;

      .jus-timeline__header {
        .jus-timeline__header-title {
          color: #424242;
          letter-spacing: 0px;
          font: normal normal bold 23px/35px Montserrat;

          word-break: break-all;

          .jus-timeline__header-link {
            color: #424242;
            letter-spacing: 0px;
            font: normal normal bold 23px/35px Montserrat;
            word-break: break-all;
            margin-bottom: 8px;
            &:hover {
              color: $--color-primary;
            }
          }
        }
        .jus-timeline__header-subtitle {
          font: normal normal medium 17px/22px Montserrat;
          letter-spacing: 0px;
          color: #ADADAD;
        }
        .jus-timeline__header-tags {
          margin-top: 8px;
          display: flex;
          gap: 8px;
        }
      }

      .jus-timeline__body {
        margin-left: -24px;
        margin-top: 24px;

        .jus-timeline__body-tags {
          margin-top: 8px;
          display: flex;
          gap: 8px;
        }
      }
    }
  }

  .jus-timeline__empty {
    margin: 32px auto;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .jus-timeline__empty-label {
      margin-top: 24px;
      color: $--color-text-secondary;
    }
  }
}
</style>
