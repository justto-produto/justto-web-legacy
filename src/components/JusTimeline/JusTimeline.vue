<template>
  <el-dialog
    v-loading="loading"
    width="65%"
    class="dialog-timeline"
    :visible.sync="visible"
  >
    <div
      slot="title"
      class="dialog-timeline__title"
    >
      <span v-if="dispute.lastUpdated">
        Pesquisado em {{ $moment(dispute.lastUpdated).format('DD/MM/YYYY [às] hh:mm') }}
      </span>
    </div>
    <el-container
      id="jus-timeline"
      v-loading="loading"
      class="jus-timeline"
    >
      <ul
        v-if="!loading && (dispute.lawsuits || []).length"
        class="jus-timeline__list"
      >
        <li class="jus-timeline__list-search">
          <div class="jus-timeline__filter">
            <el-input
              v-model="searchQuery"
              class="jus-timeline__filter-input"
              placeholder="Filtrar"
              size="medium"
              prefix-icon="el-icon-search"
            />
            <el-checkbox-group
              v-if="searchQuery.length > 0"
              v-model="showOnlyFiltered"
              class="jus-timeline__filter-checkbox"
              size="small"
            >
              <el-checkbox-button class="jus-timeline__filter-checkbox-item">
                <jus-icon
                  class="jus-timeline__filter-icon"
                  :icon="showOnlyFiltered ? 'filter-white' : 'filter'"
                />
              </el-checkbox-button>
            </el-checkbox-group>
          </div>
        </li>
        <li
          v-for="(process, processIndex) in dispute.lawsuits"
          :key="`process-${processIndex}`"
          class="jus-timeline__list-item"
        >
          <div class="jus-timeline__header">
            <div class="jus-timeline__header-title">
              {{ process.description || 1 }}ª Instância -
              <el-link
                class="jus-timeline__header-link"
                target="_blank"
                :underline="false"
                @click="openProcessInNewTab(process.url, process.code)"
              >
                {{ process.code }}
                <sup>
                  <jus-icon
                    style="height: 0.75rem;"
                    icon="external-link"
                    class="data-table__dispute-link-icon"
                  />
                </sup>
              </el-link>
            </div>
            <description
              class="jus-timeline__header-subtitle"
              :lawsuit-dispute="process"
            />
            <div class="jus-timeline__header-tags">
              <el-tag
                v-for="(tag, flagIndex) in process.tags"
                :key="`tag-evento-${flagIndex}`"
                class="jus-timeline__tag"
                type="secondary"
                size="small"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
          <div class="jus-timeline__body">
            <el-collapse v-model="timelineOpenedItems">
              <el-collapse-item :name="processIndex">
                <div
                  slot="title"
                  class="jus-timeline__body-collapse"
                >
                  {{ timelineOpenedItems.includes(processIndex) ? 'Ocultar' : 'Mostrar' }} andamentos
                </div>
                <el-timeline>
                  <el-timeline-item
                    v-for="(movement, eventIndex) in process.movements"
                    v-show="matchFilter(movement.description, searchQuery)"
                    :key="`movement-${eventIndex}`"
                    :timestamp="movement.date"
                    placement="top"
                  >
                    <div class="jus-timeline__body-movement">
                      <highlight
                        class="jus-timeline__body-description"
                        :queries="[searchQuery]"
                      >
                        {{ movement.description }}
                      </highlight>
                      <div class="jus-timeline__body-tags">
                        <el-tag
                          v-for="(tag, tagIndex) in (movement.tags || [])"
                          :key="`tag-movement-${tagIndex}`"
                          type="secondary"
                          size="small"
                        >
                          {{ tag }}
                        </el-tag>
                      </div>
                    </div>
                  </el-timeline-item>
                </el-timeline>
              </el-collapse-item>
            </el-collapse>
          </div>
        </li>
      </ul>
      <div
        v-else
        class="jus-timeline__empty"
      >
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
import { normalizeString } from '@/utils/jusUtils'

export default {
  components: {
    highlight: () => import('vue-text-highlight'),
    description: () => import('./partials/LawsuitDescription')
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      searchQuery: '',
      showOnlyFiltered: false,
      timelineOpenedItems: []
    }
  },
  computed: {
    ...mapGetters([
      'loading',
      'disputeTimeline'
    ]),

    dispute() {
      return this.disputeTimeline[this.code]
    },

    visible: {
      get() {
        return Boolean(this.dispute.lawsuits.length && this.value)
      },
      set(value) {
        this.$emit('input', false)
      }
    }
  },
  beforeDestroy() {
    this.searchQuery = ''
  },
  methods: {
    ...mapActions(['showLoading', 'hideLoading']),

    resetFiltre() {
      this.searchQuery = ''
    },

    matchFilter(item, query) {
      return (!this.showOnlyFiltered | normalizeString(item).includes(normalizeString(query)))
    },

    openProcessInNewTab(url, processCode) {
      navigator.clipboard.writeText(processCode)
      this.$jusNotification({
        title: 'Yay!',
        message: 'Código do processo copiado!',
        type: 'success'
      })
      setTimeout(() => window.open(url), 1500)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.highlight {
  background-color: yellow !important;
}
.dialog-timeline {
  .dialog-timeline__title {
    font-weight: bold;
    text-align: center;
    padding-top: 20px;
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
          margin-top: 8px;
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
            margin: 8px 0px auto auto;
            display: flex;

            .jus-timeline__tag {
              max-width: 100%;
              overflow-x: hidden;
              text-overflow: ellipsis;
            }
          }
        }

        .jus-timeline__body {

          .jus-timeline__body-collapse {
            font-size: 14px;
            margin-top: 0px;
            color: #ADADAD;
          }

          .jus-timeline__body-tags {
            margin: 8px 8px auto auto;
            display: flex;

            .jus-timeline__tag {
              max-width: 100%;
              overflow-x: hidden;
              text-overflow: ellipsis;
            }
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
}

</style>
