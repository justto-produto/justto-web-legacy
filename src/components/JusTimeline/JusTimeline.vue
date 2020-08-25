<template>
  <el-dialog
    v-loading="loading"
    width="65%"
    class="dialog-timeline"
    :visible.sync="visible">
    <div
      slot="title"
      class="dialog-timeline__title">
      <span v-if="disputeTimeline.lastUpdated">
        Pesquisado em {{ $moment(disputeTimeline.lastUpdated).format('DD/MM/YYYY [às] hh:mm') }}
      </span>
    </div>
    <el-container
      id="jus-timeline"
      v-loading="loading"
      class="jus-timeline">
      <ul
        v-if="!loading && (disputeTimeline.lawsuits || []).length"
        class="jus-timeline__list">
        <li class="jus-timeline__list-search">
          <div class="jus-timeline__filter">
            <el-input
              v-model="searchQuery"
              class="jus-timeline__filter-input"
              placeholder="Filtrar"
              size="medium"
              prefix-icon="el-icon-search" />
            <el-checkbox-group
              v-if="searchQuery.length > 0"
              v-model="showOnlyFiltered"
              class="jus-timeline__filter-checkbox"
              size="small">
              <el-checkbox-button class="jus-timeline__filter-checkbox-item" >
                <jus-icon
                  class="jus-timeline__filter-icon"
                  :icon="showOnlyFiltered ? 'filter-white' : 'filter'"
                />
              </el-checkbox-button>
            </el-checkbox-group>
          </div>
        </li>
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
              <span v-if="progress.date">
                Distribuído em {{ progress.date }}
              </span>
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
                v-show="matchFilter(movement.description, searchQuery)"
                :key="`movement-${eventIndex}`"
                :timestamp="movement.date"
                placement="top"
              >
                <div class="jus-timeline__body-movement">
                  <div
                    class="jus-timeline__body-description"
                    v-html="highlight(movement.description, searchQuery)"
                  />
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
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchQuery: '',
      showOnlyFiltered: false,
    }
  },
  computed: {
    ...mapGetters([
      'loading',
      'disputeTimeline',
    ]),

    visible: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', false)
      },
    },
  },
  beforeDestroy() {
    this.searchQuery = ''
  },
  methods: {
    ...mapActions(['showLoading', 'hideLoading']),

    matchFilter(item, query) {
      return (!this.showOnlyFiltered | item.toLowerCase().includes(query.toLowerCase()))
    },

    highlight(description, query) {
      if (query.length) {
        return description.toString().replace(query, `<span style="background: yellow;">${query}</span>`)
      } else {
        return description.toString()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.highlight {
  background-color: yellow !important;
}

.jus-timeline {
  background-color: transparent;
  width: 100%;

  .jus-timeline__list {
    padding-inline-start: 8px;
    width: 100%;

    .jus-timeline__list-search {
      list-style: none;
      width: 100%;

      .jus-timeline__filter {
        float: right;
        display: flex;
        margin: 8px 8px auto auto;
        width: 25%;

        .jus-timeline__filter-input {
          flex: 1;
        }

        .jus-timeline__filter-checkbox {
          margin-left: 10px;

          .jus-timeline__filter-checkbox-item {
            .el-checkbox-button__inner {
              .jus-timeline__filter-icon {
                height: 1rem;
              }
            }
          }
        }

        .jus-timeline__filter-button {
          span > img {
            height: 1rem;
          }
          &.active {
            background-color: #9461f7;
          }
        }
      }
    }

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
          margin: 8px 8px auto auto;
          display: flex;
        }
      }

      .jus-timeline__body {
        margin-left: -24px;
        margin-top: 24px;

        .jus-timeline__body-tags {
          margin: 8px 8px auto auto;
          display: flex;
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
