<template>
  <div class="columns-step">
    <h2 class="new-import-view__title">
      Mapeamento de colunas
    </h2>

    <el-row
      :gutter="60"
      class="columns-step__container"
    >
      <el-col
        :span="12"
        data-testid="import-columns"
        class="columns-step__container-column"
      >
        <h3>Colunas do arquivo</h3>
        <p>
          Estas são as colunas do seu arquivo. Os dados em roxo, acima do campo, são os dados da primeira linha de cada
          coluna correspondente.
        </p>
        <div
          v-for="column in columns"
          v-show="!loading"
          :key="`${column.id}-${column.name}`"
          class="file-column"
          @drop="dropTag($event, column)"
          @dragover.prevent
        >
          <div class="file-column__name">
            <span class="file-column__title">{{ column.name }}</span>
            <span class="file-column__example">{{ column.example }}</span>
          </div>
          <el-tag
            :closable="column.tag !== null"
            :class="{'el-tag--dropzone-active': column.tag}"
            class="el-tag--dropzone"
            @close="removeTag(column)"
          >
            <span v-if="column.tag">
              <span v-if="column.index !== undefined && column.index !== null">
                {{ $tc(`fields.${getColumnTitle(column.tag.id)}`, isRecovery) | capitalize }} {{ column.tag.index + 1 }} -
              </span>
              {{ $tc(column.tag.key, isRecovery) | capitalize }}
            </span>
            <span v-else>Arraste a coluna aqui</span>
          </el-tag>
        </div>
        <div
          v-show="loading"
          v-loading="true"
        >
          <div
            v-for="item in [1,2,3,4,5]"
            :key="item"
            class="file-column"
          >
            <div
              :item="item"
              class="file-column__name"
            >
              <span class="file-column__title">coluna</span>
              <span class="file-column__example">exemplo</span>
            </div>
            <el-tag class="el-tag--dropzone">
              <span>Arraste a coluna aqui</span>
            </el-tag>
          </div>
        </div>
      </el-col>

      <el-col
        :span="12"
        data-testid="import-tags"
        class="columns-step__container-column"
      >
        <h3>Campos do Sistema</h3>
        <p>
          Estes são os campos do sistema. Para mapeá-los, você deve arrastar os campos abaixo para a coluna
          correspondente.
        </p>
        <h3>Dados do conflito</h3>
        <el-collapse
          v-loading="loadingTags"
          value="1"
          class="el-collapse--drag"
        >
          <el-collapse-item
            title="Dados do conflito"
            name="1"
          >
            <span
              v-for="(tag, index) in disputeTags"
              :key="`${tag.id}-${tag.name}`"
              :class="{'el-tag--drag-active': !isAvailable(tag)}"
              class="el-tag--drag-container"
              draggable="true"
              @dragstart.self="dragTag($event, JSON.stringify({ tag, index }))"
            >
              <el-tag class="el-tag--drag">
                {{ $tc(tag.key, isRecovery) | capitalize }}
              </el-tag>
            </span>
          </el-collapse-item>
        </el-collapse>

        <h3 v-show="!loadingTags">
          {{ $tc('fields.' + pluralizesTerm('claimantParty', claimantParties.length > 1), isRecovery) }}
          <a
            href="#"
            @click="addTagList(claimantParties)"
          ><i class="el-icon-plus right" /></a>
        </h3>

        <div
          v-for="claimantPartyIndex in claimantParties"
          :key="'claimantParty' + claimantPartyIndex"
          class="drag-group"
        >
          <el-collapse class="el-collapse--drag">
            <el-collapse-item :title="`${$tc('fields.claimantParty', isRecovery)} ${claimantPartyIndex}`">
              <span
                v-for="tag in tags.claimantParty.tags"
                :key="`${tag.id}-${tag.name}`"
                :class="{'el-tag--drag-active': !isMultipleAvailable(tag, claimantPartyIndex)}"
                class="el-tag--drag-container"
                draggable="true"
                @dragstart.self="dragTag($event, JSON.stringify({tag, index: claimantPartyIndex}))"
              >
                <el-tag class="el-tag--drag">
                  {{ $tc('fields.claimantParty', isRecovery) }} {{ claimantPartyIndex }} - {{ $t(tag.key) | capitalize }}
                </el-tag>
              </span>
            </el-collapse-item>
          </el-collapse>
          <a
            v-if="claimantPartyIndex !== 1 && claimantParties.length === claimantPartyIndex"
            href="#"
            @click="removeTagList(claimantParties, tags.claimantParty.tags)"
          >
            <i class="el-icon-delete" />
          </a>
          <span
            v-else
            style="margin-left: 24px;"
          />
        </div>

        <h3 v-show="!loadingTags">
          {{ $tc('fields.' + pluralizesTerm('claimantLawyer', claimantLawyers.length > 1), isRecovery) }}
          <a
            href="#"
            @click="addTagList(claimantLawyers)"
          ><i class="el-icon-plus right" /></a>
        </h3>

        <div
          v-for="claimantLawyerIndex in claimantLawyers"
          :key="'claimantLawyer' + claimantLawyerIndex"
          class="drag-group"
        >
          <el-collapse class="el-collapse--drag">
            <el-collapse-item :title="`${$tc('fields.claimantLawyer', isRecovery)} ${claimantLawyerIndex}`">
              <span
                v-for="tag in tags.claimantLawyer.tags"
                :key="`${tag.id}-${tag.name}`"
                :class="{'el-tag--drag-active': !isMultipleAvailable(tag, claimantLawyerIndex)}"
                class="el-tag--drag-container"
                draggable="true"
                @dragstart.self="dragTag($event, JSON.stringify({tag, index: claimantLawyerIndex}))"
              >
                <el-tag class="el-tag--drag">
                  {{ $tc('fields.claimantLawyer', isRecovery) }} {{ claimantLawyerIndex + ' - ' }}{{ $t(tag.key) | capitalize }}
                </el-tag>
              </span>
            </el-collapse-item>
          </el-collapse>
          <a
            v-if="claimantLawyerIndex !== 1 && claimantLawyers.length === claimantLawyerIndex"
            href="#"
            @click="removeTagList(claimantLawyers)"
          >
            <i class="el-icon-delete" />
          </a>
          <span
            v-else
            style="margin-left: 24px;"
          />
        </div>

        <h3 v-show="!loadingTags">
          {{ $tc('fields.' + pluralizesTerm('respondentParty', respondentParties.length > 1), isRecovery) }}
          <a
            href="#"
            @click="addTagList(respondentParties)"
          ><i class="el-icon-plus right" /></a>
        </h3>
        <div
          v-for="respondentPartyIndex in respondentParties"
          :key="respondentPartyIndex"
          class="drag-group"
        >
          <el-collapse class="el-collapse--drag">
            <el-collapse-item :title="`${$tc('fields.respondentParty', isRecovery)} ${respondentPartyIndex}`">
              <span
                v-for="tag in tags.respondentParty.tags"
                :key="`${tag.id}-${tag.name}`"
                :class="{'el-tag--drag-active': !isMultipleAvailable(tag, respondentPartyIndex)}"
                class="el-tag--drag-container"
                draggable="true"
                @dragstart.self="dragTag($event, JSON.stringify({tag, index: respondentPartyIndex }))"
              >
                <el-tag class="el-tag--drag">
                  {{ $tc('fields.respondentParty', isRecovery) }} {{ respondentPartyIndex + ' - ' }}{{ $t(tag.key) | capitalize }}
                </el-tag>
              </span>
            </el-collapse-item>
          </el-collapse>
          <a
            v-if="respondentPartyIndex !== 1 && respondentParties.length === respondentPartyIndex"
            href="#"
            @click="removeTagList(respondentParties)"
          >
            <i class="el-icon-delete" />
          </a>
          <span
            v-else
            style="margin-left: 24px;"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ColumnsStep',

  data() {
    return {
      tags: {},
      disputeTags: [],
      claimantParties: [],
      claimantLawyers: [],
      respondentParties: [],
      loadingTags: false,
      errorColumns: false,
      errorTags: false,
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      isRecovery: 'isWorkspaceRecovery'
    }),

    columns: {
      get() {
        return this.$store.state.importModule.map
      },
      set(value) {
        this.$store.commit('setImportsMap', value)
      }
    },

    pluralizesTerm: () => (therm, isPlural) => {
      return {
        claimantParty: {
          0: 'claimantParty',
          1: 'claimantParties'
        },
        claimantLawyer: {
          0: 'claimantLawyer',
          1: 'claimantLawyers'
        },
        respondentParty: {
          0: 'respondentParty',
          1: 'respondentParties'
        },
        respondentLawyer: {
          0: 'respondentLawyer',
          1: 'respondentLawyers'
        }
      }[therm][Number(isPlural)]
    }
  },

  watch: {
    loading(loading) {
      if (!loading && !this.loadingTags) this.$store.dispatch('hideLoading')
    },
    loadingTags(loadingTags) {
      if (!loadingTags && !this.loading) this.$store.dispatch('hideLoading')
    }
  },

  beforeMount() {
    this.$store.dispatch('showLoading')
    if (!this.$store.state.importModule.map.length) {
      this.loading = true
      this.$store.dispatch('getImportsColumns').catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.loading = false
      })
    }
    this.loadingTags = true
    this.$store.dispatch('getImportsTags').then(tags => {
      this.loadingTags = false
      this.tags = tags
      this.disputeTags = tags.dispute.tags
      this.claimantParties = Array.from({ length: tags.claimantParty.rows }, (v, k) => k + 1)
      this.claimantLawyers = Array.from({ length: tags.claimantLawyer.rows }, (v, k) => k + 1)
      this.respondentParties = Array.from({ length: tags.respondentParty.rows }, (v, k) => k + 1)
    }).catch(error => {
      this.$jusNotification({ error })
    })
  },

  mounted() {
    document.querySelector('.jus-main-view__container').setAttribute('class', 'jus-main-view__container jus-main-view--full-height')
  },

  destroyed() {
    document.querySelector('.jus-main-view__container').setAttribute('class', 'jus-main-view__container')
  },

  methods: {
    dragTag(event, strData) {
      const data = JSON.parse(strData)

      event.dataTransfer.setData('data', JSON.stringify({
        ...data,
        tag: {
          ...(data?.tag || {}),
          index: data?.index - 1
        }
      }))
    },

    dropTag(event, column, index) {
      const data = JSON.parse(event.dataTransfer.getData('data'))

      this.columns.find(element => {
        if (column.id === element.id) {
          element.tag = data.tag
          element.index = data.index
        }
      })
      // eslint-disable-next-line no-self-assign
      this.columns = this.columns
    },
    removeTag(column) {
      this.columns.find(element => {
        if (element === column) {
          element.tag = null
          element.index = 0
        }
      })
    },

    isAvailable(tag) {
      let isAvailable = true
      this.columns.find(element => {
        if (element.tag) {
          const elKey = element.tag.id
          const tagKey = tag.id
          if (elKey === tagKey) {
            isAvailable = false
          }
        }
      })
      return isAvailable
    },

    isMultipleAvailable(tag, index) {
      let isAvailable = true
      this.columns.find(column => {
        if (column.tag) {
          const elIndex = column.index ? column.index : 0
          const elKey = column.tag.id
          const tagKey = tag.id
          if (elKey === tagKey && elIndex === index) {
            isAvailable = false
          }
        }
      })
      return isAvailable
    },

    addTagList(list) {
      const lastIndex = list.slice(-1)[0]
      list.push(lastIndex + 1)
    },

    removeTagList(list, tags) {
      this.removeLink(list, tags)
      list.splice(-1, 1)
    },

    removeLink(array, tags) {
      const indexToRemove = array.length - 1
      this.columns.find(column => {
        if (column.index && column.index === indexToRemove) {
          if (this.matchTagId(column.tag.id, tags)) {
            column.tag = null
          }
        }
      })
      // eslint-disable-next-line no-self-assign
      this.columns = this.columns
    },

    matchTagId(id, tags) {
      let match = false
      tags.find(tag => {
        if (id === tag.id) {
          match = true
        }
      })
      return match
    },

    getColumnTitle(id) {
      let title = ''
      for (const tagList in this.tags) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.tags.hasOwnProperty(tagList)) {
          if (this.tags[tagList] && this.tags[tagList].tags) {
            this.tags[tagList].tags.map(tag => {
              if (tag.id === id) {
                title = tagList
              }
            })
          }
        }
      }
      return title
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.columns-step {
  margin: 0 40px;

  .new-import-view__title {
    margin: 0 0 16px;
  }

  .columns-step__container {
    .columns-step__container-column {
      max-height: 60vh;
      overflow-y: scroll;
    }
  }

  p {
    height: 80px;
  }

  .file-column {
    margin-bottom: 20px;
    .el-tag {
      width: 100%;
      display: block;
    }
  }
  .file-column__name {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .file-column__title {
    font-size: 12px;
    font-weight: 500;
    color: $--color-text-secondary;
  }
  .file-column__example {
    color: $--color-primary;
  }
  .el-collapse--drag + h3 {
    margin-top: 40px;
  }
  .drag-group + h3 {
    margin-top: 30px;
  }
  .drag-group {
    display: flex;
    align-items: center;
    i {
      margin-left: 10px;
    }
    .el-collapse-item.is-active {
      margin-bottom: 10px;
    }
    &+.drag-group {
      margin-top: 20px;
    }
  }
  .el-collapse-item__header {
    height: 100%;
    line-height: inherit;
    padding: 10px 0;
    font-size: 14px;
    margin: 1px;
  }
  .el-collapse-item__arrow {
    line-height: 20px;
    margin: 0;
  }
}
</style>
