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
          <el-row :gutter="28">
            <el-col :span="12">
              <h3>Colunas do arquivo</h3>
              <div v-for="column in columns" :key="column.key" class="file-column" @drop="drop($event, column)" @dragover.prevent>
                <span>{{ column.label }}</span>
                <el-tag :closable="column.tag !== ''" :class="{'el-tag--dropzone-active': column.tag !== ''}" class="el-tag--dropzone" @close="removeTag(column)">
                  <span v-if="column.tag !== ''">{{ column.tag }}</span>
                  <span v-else>Arraste e solte a tag aqui</span>
                </el-tag>
              </div>
            </el-col>
            <el-col :span="12">
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
            </el-col>
          </el-row>
        </div>
        <div class="view-import__actions">
          <el-button type="primary" @click="$router.push('/import/enrichment')">Próximo</el-button>
        </div>
      </div>
    </template>
    <template slot="aside">
      <jus-icon icon="conecting-columns"/>
      <h3>
        Conectando as colunas da sua planilha
      </h3>
      <br>
      <p>
        Para que o sistema entenda os dados dos casos inseridos, precisamos que você indique os campos correspondentes
        às colunas da planilha que você inseriu.
        <br><br>
        Para isso, basta arrastar os campos da da direita para às colunas correspondentes. Se o sistema não tiver previamente
        um campo e você queira adicionar, clique em “+Adicionar campo” quantas vezes for necessário
      </p>
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
        { key: 'number', label: 'Nº do processo', tag: '' },
        { key: 'company', label: 'Empresa', tag: '' },
        { key: 'max', label: 'Alçada para acordo', tag: '' },
        { key: 'min', label: 'Alçada mínima', tag: '' },
        { key: 'defendant', label: 'Réu', tag: '' },
        { key: 'value', label: 'Valor original da causa', tag: '' }
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
    }
  }
  .el-collapse-drag + h3 {
    margin-top: 40px;
  }
  .drag-group + h3 {
    margin-top: 30px;
  }
}

.file-column {
  margin-bottom: 20px;
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
</style>
