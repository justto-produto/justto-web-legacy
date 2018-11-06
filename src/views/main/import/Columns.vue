<template>
  <JusViewMain class="view-import view-import--columns">
    <template slot="main">
      <JusButtonBack to="/import/upload"/>
      <el-steps :active="active" class="el-steps--wizard" finish-status="finish">
        <el-step/>
        <el-step/>
        <el-step/>
      </el-steps>
      <div class="view-import__container">
        <div class="view-import__title">
          <h2>Mapeamento de Colunas da Planilha</h2>
          <p>
            Arraste os campos do seletor do lado direito para as caixas da esquerda que correspondem aos seus dados.
            As colunas não mapeadas não serão importadas para o sistema. Você pode criar novos campos, caso não existam
            ainda no sistema.
          </p>
        </div>
        <div class="view-import__content">
          <div>
            <h3>Colunas do arquivo</h3>
            <div v-for="column in columns" :key="column.key" class="file-column" @drop="drop($event, column)" @dragover.prevent>
              <div class="file-column__label">
                <span class="file-column__title">{{ column.label }}</span>
                <span class="file-column__example">{{ column.example }}</span>
              </div>
              <el-tag :closable="column.tag !== ''" :class="{'el-tag--dropzone-active': column.tag !== ''}" class="el-tag--dropzone" @close="removeTag(column)">
                <span v-if="column.tag !== ''">{{ column.tag }}</span>
                <span v-else>Arraste a coluna aqui</span>
              </el-tag>
            </div>
          </div>
          <div>
            <h3>Dados do sistema</h3>
            <el-collapse value="1" class="el-collapse-drag">
              <el-collapse-item title="Dados do conflito" name="1">
                <span v-for="tag in tags" :key="tag.label" draggable="true" @dragstart.self="drag($event, tag.label)">
                  <el-tag :class="{'el-tag--drag-active': tag.columnKey !== ''}" class="el-tag--drag">
                    {{ tag.label }}
                  </el-tag>
                </span>
                <el-tag class="el-tag--drag-add">+ Adicionar tag</el-tag>
              </el-collapse-item>
            </el-collapse>
            <h3>
              Partes contrárias
              <i class="el-icon-plus right"/>
            </h3>
            <div class="drag-group">
              <el-collapse class="el-collapse-drag">
                <el-collapse-item title="Parte Contrária 1" name="1">
                  <el-tag class="el-tag--drag el-tag--drag-active">Data de vencimento do débito</el-tag>
                  <el-tag class="el-tag--drag">Nº máximo de parcelas</el-tag>
                  <el-tag class="el-tag--drag">Obrigações de fazer</el-tag>
                  <el-tag class="el-tag--drag">+ Adicionar tag</el-tag>
                </el-collapse-item>
              </el-collapse>
              <i class="el-icon-delete"/>
            </div>
            <div class="drag-group">
              <el-collapse class="el-collapse-drag">
                <el-collapse-item title="Parte Contrária 1" name="1">
                  <el-tag class="el-tag--drag el-tag--drag-active">Data de vencimento do débito</el-tag>
                  <el-tag class="el-tag--drag">Nº máximo de parcelas</el-tag>
                  <el-tag class="el-tag--drag">Obrigações de fazer</el-tag>
                  <el-tag class="el-tag--drag">+ Adicionar tag</el-tag>
                </el-collapse-item>
              </el-collapse>
              <i class="el-icon-delete"/>
            </div>
            <h3>
              Advogados
              <i class="el-icon-plus right"/>
            </h3>
            <div class="drag-group">
              <el-collapse class="el-collapse-drag">
                <el-collapse-item title="Advogado 1" name="1">
                  <el-tag class="el-tag--drag el-tag--drag-active">Data de vencimento do débito</el-tag>
                  <el-tag class="el-tag--drag">Nº máximo de parcelas</el-tag>
                  <el-tag class="el-tag--drag">Obrigações de fazer</el-tag>
                  <el-tag class="el-tag--drag">+ Adicionar tag</el-tag>
                </el-collapse-item>
              </el-collapse>
              <i class="el-icon-delete"/>
            </div>
          </div>

        </div>
        <div class="view-import__actions">
          <el-button type="primary" @click="$router.push('/import/enrichment')">Próximo</el-button>
        </div>
      </div>
    </template>
  </JusViewMain>
</template>

<script>

export default {
  name: 'ImportColumns',
  data () {
    return {
      active: 1,
      columns: [
        { key: 'number', label: 'Nº do processo', example: '7272739', tag: '' },
        { key: 'company', label: 'Nome da empresa', example: 'Shostners & Shostners', tag: '' },
        { key: 'max', label: 'Alçada máxima', example: 'R$ 7.000', tag: '' },
        { key: 'name', label: 'Nome das partes', example: 'Edinalva Pereira da Silva', tag: '' },
        { key: 'cpf', label: 'CPF das partes', example: '123.456.789-0', tag: '' },
        { key: 'defendant', label: 'Nome dos Advogados', example: 'Alessandra Marcondes', tag: '' }
      ],
      tags: [
        { label: 'Data de vencimento do débito', columnKey: '' },
        { label: 'Nº máximo de parcelas', columnKey: '' },
        { label: 'Obrigações de fazer', columnKey: '' }
      ]
    }
  },
  methods: {
    drag (event, tag) {
      event.dataTransfer.setData('tag', tag)
    },
    drop (event, column) {
      var tag = event.dataTransfer.getData('tag')
      this.columns.find((element) => {
        if (column.key === element.key) {
          element.tag = tag
          var columnKey = element.key
          this.tags.find((tagElement) => {
            if (tagElement.label === element.tag) {
              tagElement.columnKey = columnKey
            }
          })
        }
      })
    },
    removeTag (column) {
      this.columns.find((element) => {
        if (element === column) {
          element.tag = ''
        }
      })
      this.tags.find((element) => {
        if (element.columnKey === column.key) {
          element.columnKey = ''
        }
      })
    }
  }
}
</script>

<style lang="scss">
.view-import--columns {
  .view-import__container {
    h3 {
      font-weight: 600;
      margin-bottom: 40px;
    }
    .view-import__content {
      display: flex;
      justify-content: space-evenly;
      > div {
        width: 100%;
        max-width: 400px;
        &+div {
            margin-left: 40px;
        }
      }
    }
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
  }
}

</style>
