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
          <h2>Colunas da planilha</h2>
        </div>
        <div class="view-import__content">
          <el-row :gutter="28">
            <el-col :span="13">
              <h3>Colunas do arquivo</h3>
              <div class="file-column" @drop="drop($event)" @dragover.prevent>
                <span>Nº do processo</span>
                <el-tag :closable="true" :disable-transitions="false" class="el-tag--dropzone el-tag--dropzone-active">
                  Data de vencimento do débito
                </el-tag>
              </div>
              <div class="file-column">
                Empresa
                <el-tag :closable="false" :disable-transitions="false" class="el-tag--dropzone">
                  Arraste e solte a tag aqui
                </el-tag>
              </div>
              <div class="file-column">
                Alçada para acordo
                <el-tag :closable="false" :disable-transitions="false" class="el-tag--dropzone">
                  Arraste e solte a tag aqui
                </el-tag>
              </div>
              <div class="file-column">
                Alçada mínima
                <el-tag :closable="false" :disable-transitions="false" class="el-tag--dropzone">
                  Arraste e solte a tag aqui
                </el-tag>
              </div>
              <div class="file-column">
                Réu
                <el-tag :closable="false" :disable-transitions="false" class="el-tag--dropzone">
                  Arraste e solte a tag aqui
                </el-tag>
              </div>
              <div class="file-column">
                Valor original da causa
                <el-tag :closable="false" :disable-transitions="false" class="el-tag--dropzone">
                  Arraste e solte a tag aqui
                </el-tag>
              </div>
            </el-col>
            <el-col :span="11">
              <h3>Dados do sistema</h3>
              <el-collapse value="1" class="el-collapse-drag">
                <el-collapse-item title="Dados do conflito" name="1">
                  <el-tag class="el-tag--drag el-tag--drag-active" draggable="true">Data de vencimento do débito</el-tag>
                  <el-tag class="el-tag--drag" draggable="true">Nº máximo de parcelas</el-tag>
                  <el-tag class="el-tag--drag" draggable="true">Obrigações de fazer</el-tag>
                  <el-tag class="el-tag--drag" draggable="true">+ Adicionar tag</el-tag>
                </el-collapse-item>
              </el-collapse>
              <h3>
                Partes contrárias
                <i class="el-icon-plus right"/>
              </h3>
              <div class="drag-group">
                <el-collapse class="el-collapse-drag">
                  <el-collapse-item title="Parte Contrária 1" name="1">
                    <el-tag class="el-tag--drag el-tag--drag-active" draggable="true">Data de vencimento do débito</el-tag>
                    <el-tag class="el-tag--drag" draggable="true">Nº máximo de parcelas</el-tag>
                    <el-tag class="el-tag--drag" draggable="true">Obrigações de fazer</el-tag>
                    <el-tag class="el-tag--drag" draggable="true">+ Adicionar tag</el-tag>
                  </el-collapse-item>
                </el-collapse>
                <i class="el-icon-delete"/>
              </div>
              <div class="drag-group">
                <el-collapse class="el-collapse-drag">
                  <el-collapse-item title="Parte Contrária 1" name="1">
                    <el-tag class="el-tag--drag el-tag--drag-active" draggable="true">Data de vencimento do débito</el-tag>
                    <el-tag class="el-tag--drag" draggable="true">Nº máximo de parcelas</el-tag>
                    <el-tag class="el-tag--drag" draggable="true">Obrigações de fazer</el-tag>
                    <el-tag class="el-tag--drag" draggable="true">+ Adicionar tag</el-tag>
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
                    <el-tag class="el-tag--drag el-tag--drag-active" draggable="true">Data de vencimento do débito</el-tag>
                    <el-tag class="el-tag--drag" draggable="true">Nº máximo de parcelas</el-tag>
                    <el-tag class="el-tag--drag" draggable="true">Obrigações de fazer</el-tag>
                    <el-tag class="el-tag--drag" draggable="true">+ Adicionar tag</el-tag>
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
      <JusIcon icon="conecting-columns"/>
      <h3>
        Conectando as colunas da sua planilha
      </h3>
      <br>
      <p>
        Para que o sistema entenda melhor os dados dos casos inseridos, precisamos que você indique ao lado as tags correspondentes às colunas da planilha que você inseriu.
        <br><br>
        Para isso, basta arrastar as tags às colunas correspondentes.
      </p>
    </template>
  </JusViewMain>
</template>

<script>

export default {
  name: 'ImportColumns',
  data () {
    return {
      active: 1
    }
  },
  methods: {
    drop (event) {
      console.log(event)
    },
    notify () {
      this.$notify({
        title: 'Ops!',
        message: 'Para prosseguir você deve adicionar um arquivo',
        position: 'bottom-right',
        duration: 0,
        customClass: 'success'
      })
    },
    confirm () {
      this.$confirm(`Um arquivo ainda está carregando. Ao sair da tela, este arquivo não será importado.
        Você tem certeza de que quer abandonar o carregamento?`, 'Atenção!', {
        confirmButtonText: 'Parar importação',
        cancelButtonText: 'Cancelar'
      }).then(() => {
        this.$message({
          type: 'success',
          message: 'Delete completed'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        })
      })
    }
  }
}
</script>

<style lang="scss">
.view-import--columns {
  .el-card__body {
    width: 100%;
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
