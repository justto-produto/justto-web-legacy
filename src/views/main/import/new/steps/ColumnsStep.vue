<template>
  <div class="columns-step">
    <h2 class="new-import-view__title">Mapeamento de colunas</h2>
    <el-row :gutter="60">
      <el-col :span="12">
        <h3>Colunas do arquivo</h3>
        <p>
          Estas são as colunas do seu arquivo. Os dados em roxo, acima do campo, são os dados da primeira linha de cada
          coluna correspondente.
        </p>
        <div
          v-for="column in columns"
          v-show="!$store.state.loading"
          :key="`${column.id}-${column.name}`"
          class="file-column"
          @drop="dropTag($event, column)" @dragover.prevent>
          <div class="file-column__name">
            <span class="file-column__title">{{ column.name }}</span>
            <span class="file-column__example">{{ column.example }}</span>
          </div>
          <el-tag
            :closable="column.tag != null" :class="{'el-tag--dropzone-active': column.tag}" class="el-tag--dropzone"
            @close="removeTag(column)">
            <span v-if="column.tag">{{ $t(column.tag.key) }}</span>
            <span v-else>Arraste a coluna aqui</span>
          </el-tag>
        </div>
        <div v-loading="true" v-show="$store.state.loading">
          <div v-for="item in [1,2,3,4,5]" :key="item" class="file-column">
            <div :item="item" class="file-column__name">
              <span class="file-column__title">coluna</span>
              <span class="file-column__example">exemplo</span>
            </div>
            <el-tag class="el-tag--dropzone">
              <span>Arraste a coluna aqui</span>
            </el-tag>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <h3>Colunas do sistema</h3>
        <p>
          Estas são as colunas do sistema. Para mapeá-las, você deve arrastar os campos abaixo para a coluna
          correspondente.
        </p>
        <h3>Dados do conflito</h3>
        <el-collapse v-loading="loadingTags" value="1" class="el-collapse--drag">
          <el-collapse-item title="Dados do conflito" name="1">
            <span
              v-for="(tag, index) in disputeTags"
              :key="`${tag.id}-${tag.name}`"
              draggable="true"
              @dragstart.self="dragTag($event, JSON.stringify({tag, index}))">
              <el-tag :class="{'el-tag--drag-active': !isAvailable(tag)}" class="el-tag--drag">
                {{ $t(tag.key) }}
              </el-tag>
            </span>
          </el-collapse-item>
        </el-collapse>
        <h3 v-show="!loadingTags">
          Partes contrárias
          <a href="#" @click="addTagList(claimantParties)"><i class="el-icon-plus right"/></a>
        </h3>
        <div v-for="(claimantPartyIndex, index) in claimantParties" :key="'claimantParty' + claimantPartyIndex" class="drag-group">
          <el-collapse class="el-collapse--drag">
            <el-collapse-item :title="'Parte Contrária ' + claimantPartyIndex">
              <span
                v-for="tag in tags.claimantParty.tags" :key="`${tag.id}-${tag.name}`" draggable="true"
                @dragstart.self="dragTag($event, JSON.stringify({tag, index}))">
                <el-tag :class="{'el-tag--drag-active': !isMultipleAvailable(tag, index)}" class="el-tag--drag">
                  Parte contrária {{ claimantPartyIndex + ' - ' + $t(tag.key) }}
                </el-tag>
              </span>
            </el-collapse-item>
          </el-collapse>
          <a v-if="claimantPartyIndex !== 1 && claimantParties.length === claimantPartyIndex" href="#" @click="removeTagList(claimantParties, tags.claimantParty.tags)">
            <i class="el-icon-delete"/>
          </a>
          <span v-else style="margin-left: 24px;"/>
        </div>
        <h3 v-show="!loadingTags">
          Advogados
          <a href="#" @click="addTagList(claimantLawyers)"><i class="el-icon-plus right"/></a>
        </h3>
        <div v-for="(claimantLawyerIndex, index) in claimantLawyers" :key="'claimantLawyer' + claimantLawyerIndex" class="drag-group">
          <el-collapse class="el-collapse--drag">
            <el-collapse-item :title="'Advogado ' + claimantLawyerIndex">
              <span
                v-for="tag in tags.claimantLawyer.tags" :key="`${tag.id}-${tag.name}`" draggable="true"
                @dragstart.self="dragTag($event, JSON.stringify({tag, index}))">
                <el-tag :class="{'el-tag--drag-active': !isMultipleAvailable(tag, index)}" class="el-tag--drag">
                  Advogado {{ claimantLawyerIndex + ' - ' + $t(tag.key) }}
                </el-tag>
              </span>
            </el-collapse-item>
          </el-collapse>
          <a v-if="claimantLawyerIndex !== 1 && claimantLawyers.length === claimantLawyerIndex" href="#" @click="removeTagList(claimantLawyers)">
            <i class="el-icon-delete"/>
          </a>
          <span v-else style="margin-left: 24px;"/>
        </div>
        <h3 v-show="!loadingTags">
          Réus
          <a href="#" @click="addTagList(respondentParties)"><i class="el-icon-plus right"/></a>
        </h3>
        <div v-for="(respondentPartyIndex, index) in respondentParties" :key="respondentPartyIndex" class="drag-group">
          <el-collapse class="el-collapse--drag">
            <el-collapse-item :title="'Réu ' + respondentPartyIndex">
              <span
                v-for="tag in tags.respondentParty.tags" :key="`${tag.id}-${tag.name}`" draggable="true"
                @dragstart.self="dragTag($event, JSON.stringify({tag, index}))">
                <el-tag :class="{'el-tag--drag-active': !isMultipleAvailable(tag, index)}" class="el-tag--drag">
                  Réu {{ respondentPartyIndex + ' - ' + $t(tag.key) }}
                </el-tag>
              </span>
            </el-collapse-item>
          </el-collapse>
          <a v-if="respondentPartyIndex !== 1 && respondentParties.length === respondentPartyIndex" href="#" @click="removeTagList(respondentParties)">
            <i class="el-icon-delete"/>
          </a>
          <span v-else style="margin-left: 24px;"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ColumnsStep',
  data () {
    return {
      tags: {},
      disputeTags: [],
      claimantParties: [],
      claimantLawyers: [],
      respondentParties: [],
      loadingTags: true,
      errorColumns: false,
      errorTags: false
    }
  },
  computed: {
    columns: {
      get () {
        return this.$store.state.importModule.map
      },
      set (value) {
        this.$store.commit('setImportsMap', value)
      }
    }
  },
  beforeMount () {
    if (!this.$store.state.importModule.map.length) {
      this.$store.dispatch('showLoading')
      this.$store.dispatch('getImportsColumns').then(() => {
        this.$store.dispatch('hideLoading')
      }).catch(error => {
        this.$notify.closeAll()
        console.error(error)
        this.$notify(this.$notificationMessage('connectionError'))
      })
    }
    this.$store.dispatch('getImportsTags').then(tags => {
      this.loadingTags = false
      this.tags = tags
      this.disputeTags = tags.dispute.tags
      this.claimantParties = Array.from({ length: tags.claimantParty.rows }, (v, k) => k + 1)
      this.claimantLawyers = Array.from({ length: tags.claimantLawyer.rows }, (v, k) => k + 1)
      this.respondentParties = Array.from({ length: tags.respondentParty.rows }, (v, k) => k + 1)
    }).catch(error => {
      this.$notify.closeAll()
      console.error(error)
      this.$notify(this.$notificationMessage('connectionError'))
    })
  },
  methods: {
    dragTag (event, data) {
      event.dataTransfer.setData('data', data)
    },
    dropTag (event, column, index) {
      var data = JSON.parse(event.dataTransfer.getData('data'))
      this.columns.find(element => {
        if (column.id === element.id) {
          element.tag = data.tag
          element.index = data.index
        }
      })
      this.columns = this.columns
    },
    removeTag (column) {
      this.columns.find(element => {
        if (element === column) {
          element.tag = null
          element.index = 0
        }
      })
    },
    isAvailable (tag) {
      var isAvailable = true
      this.columns.find(element => {
        if (element.tag) {
          let elKey = element.tag.id
          let tagKey = tag.id
          if (elKey === tagKey) {
            isAvailable = false
          }
        }
      })
      return isAvailable
    },
    isMultipleAvailable (tag, index) {
      var isAvailable = true
      this.columns.find(element => {
        if (element.tag) {
          let elIndex = element.index ? element.index : 0
          let elKey = element.tag.id
          let tagKey = tag.id
          if (elKey === tagKey && elIndex === index) {
            isAvailable = false
          }
        }
      })
      return isAvailable
    },
    addTagList (list) {
      let lastIndex = list.slice(-1)[0]
      list.push(lastIndex + 1)
    },
    removeTagList (list, tags) {
      this.removeLink(list, tags)
      list.splice(-1, 1)
    },
    removeLink (array, tags) {
      let indexToRemove = array.length - 1
      this.columns.find(column => {
        if (column.index && column.index === indexToRemove) {
          if (this.matchTagId(column.tag.id, tags)) {
            column.tag = null
          }
        }
      })
      this.columns = this.columns
    },
    matchTagId (id, tags) {
      var match = false
      tags.find(tag => {
        if (id === tag.id) {
          match = true
        }
      })
      return match
    }
  }
}
</script>

<style lang="scss">
.columns-step {
  margin: 0 40px;
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
    color: #adadad;
  }
  .file-column__example {
    color: #9461f7;
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
}
</style>
