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
          v-for="column in columns" :key="column.key" class="file-column"
          @drop="drop($event, column)" @dragover.prevent>
          <div class="file-column__label">
            <span class="file-column__title">{{ column.key }}</span>
            <span class="file-column__example">{{ column.example }}</span>
          </div>
          <el-tag
            :closable="column.tag != null" :class="{'el-tag--dropzone-active': column.tag}" class="el-tag--dropzone"
            @close="removeTag(column)">
            <span v-if="column.tag">{{ column.tag.label }}</span>
            <span v-else>Arraste a coluna aqui</span>
          </el-tag>
        </div>
      </el-col>
      <el-col :span="12">
        <h3>Colunas do sistema</h3>
        <p>
          Estas são as colunas do sistema. Para mapeá-las, você deve arrastar os campos abaixo para a coluna
          correspondente.
        </p>
        <el-collapse value="1" class="el-collapse-drag">
          <el-collapse-item title="Dados do conflito" name="1">
            <span
              v-for="tag in tags.disputeInfo" :key="tag.label" draggable="true"
              @dragstart.self="drag($event, JSON.stringify(tag))">
              <el-tag :class="{'el-tag--drag-active': !isAvailable(tag)}" class="el-tag--drag">
                {{ tag.label }}
              </el-tag>
            </span>
            <!-- <el-tag class="el-tag--drag-add">+ Adicionar tag</el-tag> -->
          </el-collapse-item>
        </el-collapse>
        <h3>
          Partes contrárias
          <a href="#" @click="addPerson()"><i class="el-icon-plus right"/></a>
        </h3>
        <div v-for="(person, index) in people" class="drag-group">
          <el-collapse class="el-collapse-drag">
            <el-collapse-item :title="'Parte Contrária ' + person.index" :name="person.index">
              <span
                v-for="tag in person.tags" :key="tag.label" draggable="true"
                @dragstart.self="drag($event, JSON.stringify(tag))">
                <el-tag :class="{'el-tag--drag-active': !isAvailable(tag)}" class="el-tag--drag">
                  {{ tag.label }}
                </el-tag>
              </span>
            </el-collapse-item>
          </el-collapse>
          <a v-if="index != 0 && (index + 1) == people.length" href="#" @click="removePerson()">
            <i class="el-icon-delete"/>
          </a>
          <span v-else style="width: 25px;"></span>
        </div>
        <h3>
          Advogados
          <a href="#" @click="addLawyer()"><i class="el-icon-plus right"/></a>
        </h3>
        <div v-for="(lawyer, index) in lawyers" class="drag-group">
          <el-collapse class="el-collapse-drag">
            <el-collapse-item :title="'Advogado ' + lawyer.index" :name="lawyer.index">
              <span
                v-for="tag in lawyer.tags" :key="tag.label" draggable="true"
                @dragstart.self="drag($event, JSON.stringify(tag))">
                <el-tag :class="{'el-tag--drag-active': !isAvailable(tag)}" class="el-tag--drag">
                  {{ tag.label }}
                </el-tag>
              </span>
            </el-collapse-item>
          </el-collapse>
          <a v-if="index != 0 && (index + 1) == lawyers.length" href="#" @click="removeLawyer()">
            <i class="el-icon-delete"/>
          </a>
          <span v-else style="width: 25px;"></span>
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
      lawyers: []
    }
  },
  beforeMount () {
    this.$store.dispatch('getImportsColumns').then((response) => {
      this.columns = response
    })
    this.$store.dispatch('getImportsTags').then((response) => {
      this.tags = response
      this.people.push({
        index: 1,
        tags: this.setTagPrefix(response.personInfo, 1, true)
      })
      this.lawyers.push({
        index: 1,
        tags: this.setTagPrefix(response.personInfo, 1, false)
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
        if (column.key === element.key) {
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
        if (element.tag && element.tag.label === tag.label) {
          isAvailable = false
        }
      })
      return isAvailable
    },
    setTagPrefix (tags, prefix, isPerson) {
      let t = JSON.parse(JSON.stringify(tags))
      for (var i = 0; i < t.length; i++) {
        if (isPerson) {
          t[i].label = 'Parte contrária ' + prefix + ' - ' + t[i].label
        } else {
          t[i].label = 'Advogado(a) ' + prefix + ' - ' + t[i].label
        }
        t[i].index = prefix
      }
      return t
    },
    addPerson () {
      let prefix = this.people.slice(-1)[0]
      prefix = prefix.index + 1
      this.people.push({
        index: prefix,
        tags: this.setTagPrefix(this.tags.personInfo, prefix, true)
      })
    },
    removePerson () {
      this.people.splice(-1,1)
    },
    addLawyer () {
      let prefix = this.lawyers.slice(-1)[0]
      prefix = prefix.index + 1
      this.lawyers.push({
        index: prefix,
        tags: this.setTagPrefix(this.tags.personInfo, prefix, false)
      })
    },
    removeLawyer () {
      this.lawyers.splice(-1,1)
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
  .file-column__label {
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
