<template>
  <content-view>
    <template slot="main">
      <el-steps class="el-steps--wizard" :active="active" finish-status="finish">
        <el-step></el-step>
        <el-step></el-step>
        <el-step></el-step>
        <el-step></el-step>
      </el-steps>
      <div class="step-content">
        <back-button to="/import/new"></back-button>
        <h2>Colunas da planilha</h2>
        <br>
        <el-row :gutter="28">
          <el-col :span="13">
            <h3>Colunas do arquivo</h3>
            <br>
            <div class="file-column" @drop="drop($event)" @dragover.prevent>
              <span>Nº do processo</span>
              <el-tag :closable="true" :disable-transitions="false" class="el-tag--dropzone el-tag--dropzone-active">
                Data de vencimento do débito
              </el-tag>
            </div>
            <div class="file-column">
              Empresa
              <el-tag :closable="false" :disable-transitions="false" class="el-tag--dropzone">
                {{'Arraste e solte a tag aqui'}}
              </el-tag>
            </div>
            <div class="file-column">
              Alçada para acordo
              <el-tag :closable="false" :disable-transitions="false" class="el-tag--dropzone">
                {{'Arraste e solte a tag aqui'}}
              </el-tag>
            </div>
            <div class="file-column">
              Alçada mínima
              <el-tag :closable="false" :disable-transitions="false" class="el-tag--dropzone">
                {{'Arraste e solte a tag aqui'}}
              </el-tag>
            </div>
            <div class="file-column">
              Réu
              <el-tag :closable="false" :disable-transitions="false" class="el-tag--dropzone">
                {{'Arraste e solte a tag aqui'}}
              </el-tag>
            </div>
            <div class="file-column">
              Valor original da causa
              <el-tag :closable="false" :disable-transitions="false" class="el-tag--dropzone">
                {{'Arraste e solte a tag aqui'}}
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
            <br>
            <h3>
              Partes contrárias
              <i class="el-icon-plus right"></i>
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
              <i class="el-icon-delete"></i>
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
              <i class="el-icon-delete"></i>
            </div>
            <br>
            <h3>
              Advogados
              <i class="el-icon-plus right"></i>
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
              <i class="el-icon-delete"></i>
            </div>

          </el-col>
        </el-row>

        <br>
        <el-button @click="$router.push('/import/new/3')">Próximo</el-button>
      </div>
    </template>
    <template slot="aside">
      <jus-icon icon="best-practices"/>
      <h3>
        Melhores práticas para importar casos
      </h3>
      <br>
      <p>Ao escolher uma opção para importação, certifique-se de que os dados estão inseridos corretamente. Dessa forma, o sistema irá reconhecer mais rapidamente os dados, e além disso, enriquecer com informações complementares colhidas diretamente do TJ.<br><br> Não se esqueça de preencher os dados mínimos da planilha <br><br> • Número do processo<br> • Empresa<br> • Alçadas da negociação <br> • Nome e CPF das partes
      </p>
    </template>
  </content-view>
</template>

<script>

export default {
  name: 'Import',
  data () {
    return {
      active: 1
    }
  },
  methods: {
    drop (event) {
      console.log(event)
    },
    next () {
      if (this.active++ > 3) this.active = 1
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
