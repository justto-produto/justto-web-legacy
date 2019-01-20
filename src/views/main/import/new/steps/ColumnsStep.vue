<template>
  <div class="columns-step">
    <h2>Mapeamento de colunas</h2>
    <el-row :gutter="60">
      <el-col :span="12">
        <h3>Colunas do arquivo</h3>
        <p>
          Estas são as colunas do seu arquivo. Os dados em roxo, acima do campo, são os dados da primeira linha de cada
          coluna correspondente.
        </p>
        <div
          v-for="column in columns"
          v-show="!loadingColumns"
          :key="column.id"
          class="file-column"
          @drop="drop($event, column)" @dragover.prevent>
          <div class="file-column__name">
            <span class="file-column__title">{{ column.name }}</span>
            <span class="file-column__example">{{ column.example }}</span>
          </div>
          <el-tag
            :closable="column.tag != null" :class="{'el-tag--dropzone-active': column.tag}" class="el-tag--dropzone"
            @close="removeTag(column)">
            <span v-if="column.tag">{{ column.tag.name }}</span>
            <span v-else>Arraste a coluna aqui</span>
          </el-tag>
        </div>
        <div v-loading="true" v-show="loadingColumns">
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
        <el-collapse v-loading="loadingTags" value="1" class="el-collapse-drag">
          <el-collapse-item title="Dados do conflito" name="1">
            <span
              v-for="tag in tags.Dispute" :key="tag.id" draggable="true"
              @dragstart.self="drag($event, JSON.stringify(tag))">
              <el-tag :class="{'el-tag--drag-active': !isAvailable(tag)}" class="el-tag--drag">
                {{ tag.name }}
              </el-tag>
            </span>
          </el-collapse-item>
        </el-collapse>
        <h3 v-show="!loadingTags">
          Partes contrárias
          <a href="#" @click="addPerson()"><i class="el-icon-plus right"/></a>
        </h3>
        <div
          v-for="(person, index) in people"
          :key="`${index}-${person.index}`"
          class="drag-group">
          <el-collapse class="el-collapse-drag">
            <el-collapse-item :title="'Parte Contrária ' + person.index" :name="person.index">
              <span
                v-for="(tag, index) in person.tags" :key="`${index}-${tag.index}`" draggable="true"
                @dragstart.self="drag($event, JSON.stringify(tag))">
                <el-tag :class="{'el-tag--drag-active': !isAvailable(tag)}" class="el-tag--drag">
                  {{ tag.name }}
                </el-tag>
              </span>
            </el-collapse-item>
          </el-collapse>
          <a v-if="index != 0 && (index + 1) == people.length" href="#" @click="removePerson()">
            <i class="el-icon-delete"/>
          </a>
          <span v-else style="margin-left: 20px;"/>
        </div>
        <h3 v-show="!loadingTags">
          Advogados
          <a href="#" @click="addLawyer()"><i class="el-icon-plus right"/></a>
        </h3>
        <div v-for="(lawyer, index) in lawyers" :key="lawyer.index" class="drag-group">
          <el-collapse class="el-collapse-drag">
            <el-collapse-item :title="'Advogado ' + lawyer.index" :name="lawyer.index">
              <span
                v-for="tag in lawyer.tags" :key="tag.name" draggable="true"
                @dragstart.self="drag($event, JSON.stringify(tag))">
                <el-tag :class="{'el-tag--drag-active': !isAvailable(tag)}" class="el-tag--drag">
                  {{ tag.name }}
                </el-tag>
              </span>
            </el-collapse-item>
          </el-collapse>
          <a v-if="index != 0 && (index + 1) == lawyers.length" href="#" @click="removeLawyer()">
            <i class="el-icon-delete"/>
          </a>
          <span v-else style="margin-left: 20px;"/>
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
      columns: [],
      tags: [],
      people: [],
      lawyers: [],
      loadingColumns: true,
      loadingTags: true,
      errorColumns: false,
      errorTags: false
    }
  },
  beforeMount () {
    this.$store.dispatch('getImportsColumns').then(columns => {
      this.columns = columns
      this.loadingColumns = false
    }).catch(() => {
      this.$notify.closeAll()
      this.$notify({
        title: 'Ops!',
        message: 'Houve uma falha de conexão com o servidor.',
        position: 'bottom-right',
        customClass: 'danger',
        type: 'error',
        duration: 5000
      })
    })
    this.$store.dispatch('getImportsTags').then(tags => {
      this.tags = tags
      this.loadingTags = false
      this.people.push({
        index: 1,
        tags: this.setTagPrefix(tags.Person, 1, true)
      })
      this.lawyers.push({
        index: 1,
        tags: this.setTagPrefix(tags.Person, 1, false)
      })
    }).catch(() => {
      this.$notify.closeAll()
      this.$notify({
        title: 'Ops!',
        message: 'Houve uma falha de conexão com o servidor.',
        position: 'bottom-right',
        customClass: 'danger',
        type: 'error',
        duration: 5000
      })
    })
  },
  methods: {
    drag (event, tag) {
      event.dataTransfer.setData('tag', tag)
    },
    drop (event, column) {
      var tag = JSON.parse(event.dataTransfer.getData('tag'))
      this.columns.find((element) => {
        if (column.id === element.id) {
          element.tag = tag
        }
      })
    },
    removeTag (column) {
      this.columns.find((element) => {
        if (element === column) {
          element.tag = null
        }
      })
    },
    isAvailable (tag) {
      var isAvailable = true
      this.columns.find((element) => {
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
    addPerson () {
      let lastPerson = this.people.slice(-1)[0]
      let prefix = lastPerson.index + 1
      this.people.push({
        index: prefix,
        tags: this.setTagPrefix(this.tags.Person, prefix, true)
      })
    },
    addLawyer () {
      let lastLawyer = this.lawyers.slice(-1)[0]
      let prefix = lastLawyer.index + 1
      this.lawyers.push({
        index: prefix,
        tags: this.setTagPrefix(this.tags.Person, prefix, false)
      })
    },
    removePerson () {
      this.removeLink(this.people)
      this.people.splice(-1, 1)
    },
    removeLawyer () {
      this.removeLink(this.lawyers)
      this.lawyers.splice(-1, 1)
    },
    setTagPrefix (tags, prefix, isPerson) {
      let t = JSON.parse(JSON.stringify(tags))
      for (var i = 0; i < t.length; i++) {
        if (isPerson) {
          t[i].name = 'Parte contrária ' + prefix + ' - ' + t[i].name
        } else {
          t[i].name = 'Advogado(a) ' + prefix + ' - ' + t[i].name
        }
        t[i].index = prefix
      }
      return t
    },
    removeLink (array) {
      let toRemove = array.slice(-1)[0]
      var tags = toRemove.tags
      for (var i = 0; i < tags.length; i++) {
        for (var x = 0; x < this.columns.length; x++) {
          if (this.columns[x].tag) {
            if (tags[i].name === this.columns[x].tag.name) {
              this.columns[x].tag = null
            }
          }
        }
      }
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
  .el-collapse-drag + h3 {
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
