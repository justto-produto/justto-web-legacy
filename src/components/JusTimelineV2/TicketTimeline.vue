<template>
  <el-dialog
    :visible.sync="visible"
    append-to-body
    class="jus-timeline"
  >
    <div
      slot="title"
      class="jus-timeline__title"
    >
      <span v-if="dispute.lastUpdated">
        Pesquisado em {{ $moment(dispute.lastUpdated).format('DD/MM/YYYY [às] hh:mm') }}
      </span>
    </div>

    <section
      v-for="lawsuit in dispute.lawsuits"
      :key="lawsuit.description"
      class="jus-timeline__lawsuit"
    >
      <a
        class="jus-timeline__lawsuit-title"
        @click="openProcessInNewTab(lawsuit.url, lawsuit.code)"
      >
        {{ lawsuit.description }}ª Instância - {{ lawsuit.code }}
        <jus-icon
          icon="external-link"
          class="jus-timeline__lawsuit-title-icon"
        />
      </a>

      <article class="jus-timeline__lawsuit-resume">
        <el-row :gutter="8">
          <el-col
            :span="12"
            class="jus-timeline__lawsuit-info"
          >
            <span class="jus-timeline__lawsuit-info-title">Distribuído em</span>
            <span class="jus-timeline__lawsuit-info-text">{{ lawsuit.date || '---' }}</span>
          </el-col>
          <el-col
            :span="12"
            class="jus-timeline__lawsuit-info"
          >
            <span class="jus-timeline__lawsuit-info-title">Área</span>
            <span class="jus-timeline__lawsuit-info-text">{{ lawsuit.area || '---' }}</span>
          </el-col>
          <el-col
            :span="12"
            class="jus-timeline__lawsuit-info"
          >
            <span class="jus-timeline__lawsuit-info-title">Origem</span>
            <span class="jus-timeline__lawsuit-info-text">{{ lawsuit.source || '---' }}</span>
          </el-col>
          <el-col
            :span="12"
            class="jus-timeline__lawsuit-info"
          >
            <span class="jus-timeline__lawsuit-info-title">Documentos</span>
            <a
              :class="{ 'jus-timeline__lawsuit-info-link': !(lawsuit.urlDocuments && lawsuit.urlDocuments.length)}"
              :href="lawsuit.urlDocuments && lawsuit.urlDocuments.length ? lawsuit.urlDocuments[0] : '#'"
              :underline="false"
            >
              {{ lawsuit.urlDocuments && lawsuit.urlDocuments.length ? 'Baixar' : '---' }}
              <jus-icon
                v-if="lawsuit.urlDocuments && lawsuit.urlDocuments.length"
                class="jus-timeline__document-download"
                icon="download-sheet"
              />
            </a>
          </el-col>
        </el-row>

        <el-row :gutter="8">
          <el-col
            :span="24"
            class="jus-timeline__lawsuit-info"
          >
            <span class="jus-timeline__lawsuit-info-title">Parte(s)</span>
            <el-collapse>
              <el-collapse-item
                v-for="(party, partyIndex) in lawsuit.parties"
                :key="`party-${partyIndex}`"
              >
                <div
                  slot="title"
                  class="jus-timeline__lawsuit-info-collapse-title"
                >
                  {{ party.name || '---' }}
                </div>
                <div
                  v-if="party.type"
                  class="jus-timeline__lawsuit-info-collapse-text"
                >
                  <b>Tipo:</b> {{ party.type || '---' }}
                </div>
                <div
                  v-if="party.profile"
                  class="jus-timeline__lawsuit-info-collapse-text"
                >
                  <b>Polo:</b> {{ party.profile || '---' }}
                </div>
                <div
                  v-if="party.document"
                  class="jus-timeline__lawsuit-info-collapse-text"
                >
                  <b>Documento:</b> {{ party.document || '---' }}
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-col>
          <el-col
            :span="24"
            class="jus-timeline__lawsuit-info"
          >
            <span class="jus-timeline__lawsuit-info-title">Advogado(s)</span>
            <el-collapse>
              <el-collapse-item
                v-for="(lawyer, lawyerIndex) in lawsuit.lawyers"
                :key="`lawyer-${lawyerIndex}`"
              >
                <div
                  slot="title"
                  class="jus-timeline__lawsuit-info-collapse-title"
                >
                  {{ lawyer.name || '---' }}
                </div>
                <div
                  v-if="lawyer.oab"
                  class="jus-timeline__lawsuit-info-collapse-text"
                >
                  <b>OAB:</b> {{ lawyer.oab || '---' }}
                </div>
                <div
                  v-if="lawyer.partyName"
                  class="jus-timeline__lawsuit-info-collapse-text"
                >
                  <b>Parte:</b> {{ lawyer.partyName | capitalize }}
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </article>

      <article class="jus-timeline__lawsuit-tags">
        <el-tag
          v-for="(tag, flagIndex) in lawsuit.tags"
          :key="`tag-${flagIndex}`"
          size="small"
        >
          {{ tag }}
        </el-tag>
      </article>

      <article class="jus-timeline__lawsuit-movements">
        <el-collapse v-model="fullTimelineCollapseOpen">
          <el-collapse-item :name="lawsuit.description">
            <div slot="title">
              {{ fullTimelineCollapseOpen ? 'Ocultar' : 'Mostrar' }} andamentos
            </div>
            <el-timeline class="jus-timeline__lawsuit-movements-timeline">
              <el-timeline-item
                v-for="(movement, movementIndex) in lawsuit.movements"
                v-show="matchFilter(movement.description, queryTerm)"
                :key="`movement-${movementIndex}`"
                :timestamp="movement.date"
                placement="top"
              >
                <highlight :queries="[queryTerm]">
                  {{ movement.description }}
                </highlight>
                <br>
                <el-tag
                  v-for="(tag, tagIndex) in (movement.tags || [])"
                  :key="`movement-tag-${tagIndex}`"
                  size="small"
                >
                  {{ tag }}
                </el-tag>
              </el-timeline-item>
            </el-timeline>
          </el-collapse-item>
        </el-collapse>
      </article>
    </section>

    <!-- <li class="jus-timeline__list-search">
      <div class="jus-timeline__filter">
        <el-input
          v-model="queryTerm"
          class="jus-timeline__filter-input"
          placeholder="Filtrar"
          size="medium"
          prefix-icon="el-icon-search" />
        <el-checkbox-group
          v-if="queryTerm.length > 0"
          v-model="showOnlyFiltered"
          class="jus-timeline__filter-checkbox"
          size="small">
          <el-checkbox-button class="jus-timeline__filter-checkbox-item">
            <jus-icon
              class="jus-timeline__filter-icon"
              :icon="showOnlyFiltered ? 'filter-white' : 'filter'" />
          </el-checkbox-button>
        </el-checkbox-group>
      </div>
    </li> -->
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { normalizeString } from '@/utils'

export default {
  name: 'JusTimeline',
  components: {
    highlight: () => import('vue-text-highlight')
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
  data: () => ({
    queryTerm: '',
    showOnlyFiltered: false,
    fullTimelineCollapseOpen: ['1']
  }),
  computed: {
    ...mapGetters({
      disputesTimeline: 'getDisputesTimeline'
    }),

    dispute() {
      return this.disputesTimeline[this.code] || { lawsuits: [] }
    },

    visible: {
      get() {
        return Boolean(this.dispute && this.dispute.lawsuits.length && this.value)
      },
      set(value) {
        this.$emit('input', false)
      }
    }
  },
  beforeDestroy() {
    this.queryTerm = ''
  },
  methods: {
    resetFiltre() {
      this.queryTerm = ''
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

.jus-timeline {
  .jus-timeline__title {
    font-weight: 600;
  }

  .jus-timeline__lawsuit {
    .jus-timeline__lawsuit-title {
      font-weight: bold;
      font-size: 24px;
      cursor: pointer;

      .jus-timeline__lawsuit-title-icon {
        vertical-align: super;
        width: 16px;
      }
    }

    .jus-timeline__lawsuit-resume {
      border: 1px solid #eee;
      border-radius: 8px;
      margin-top: 8px;
      padding: 16px;

      .jus-timeline__lawsuit-info {
        margin-bottom: 8px;
        display: flex;
        flex-direction: column;
        &:last-child { margin-bottom: 0; }

        a > .jus-timeline__document-download {
          width: 12px;
        }

        .jus-timeline__lawsuit-info-title {
          font-weight: 600;
        }

        .jus-timeline__lawsuit-info-text,
        .jus-timeline__lawsuit-info-link {
          color: $--color-text-secondary;
          cursor: auto;
        }

        .jus-timeline__lawsuit-info-collapse-title {
          color: $--color-text-secondary;
          line-height: 24px;
          font-weight: normal;
        }
        .jus-timeline__lawsuit-info-collapse-text {
          color: $--color-text-secondary;
          margin-left: 16px;
        }
      }
    }

    .jus-timeline__lawsuit-tags {
      margin-top: 16px;
    }

    .jus-timeline__lawsuit-movements {
      padding: 0 4px;

      .jus-timeline__lawsuit-movements-timeline {
        padding-left: 8px
      }
    }
  }
}

.highlight {
  background-color: yellow !important;
}
</style>
