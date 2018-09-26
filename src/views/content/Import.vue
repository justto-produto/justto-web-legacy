<template>
  <content-view class="view-import">
    <template slot="title">
      <h1>Importação</h1>
    </template>
    <template slot="main">
      <el-steps :active="active" finish-status="finish">
        <el-step></el-step>
        <el-step></el-step>
        <el-step></el-step>
        <el-step></el-step>
      </el-steps>
      <div class="step-content">
        <h2>Colunas da planilha</h2>
        <br>
        <el-row :gutter="28">
          <el-col :span="12">
            <h3>Colunas do arquivo</h3>
            <br><br>
            <div class="file-column" @drop="drop($event)" @dragover.prevent>
              Nº do processo
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
          <el-col :span="12">
            <h3>Tags correspondentes do sistema</h3>
            <br><br>
            <el-collapse accordion value="1">
              <el-collapse-item title="Dados do Conflito" name="1">
                <el-tag class="el-tag--drag el-tag--drag-active" draggable="true">Data de vencimento do débito</el-tag>
                <el-tag class="el-tag--drag" draggable="true">Nº máximo de parcelas</el-tag>
                <el-tag class="el-tag--drag" draggable="true">Obrigações de fazer</el-tag>
                <el-tag class="el-tag--drag" draggable="true">+ Adicionar tag</el-tag>
              </el-collapse-item>
              <el-collapse-item title="Partes Contrárias" name="2">
                <div>Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;</div>
                <div>Visual feedback: reflect current state by updating or rearranging elements of the page.</div>
              </el-collapse-item>
              <el-collapse-item title="Advogados" name="3">
                <div>Simplify the process: keep operating process simple and intuitive;</div>
                <div>Definite and clear: enunciate your intentions clearly so that the users can quickly understand and make decisions;</div>
                <div>Easy to identify: the interface should be straightforward, which helps the users to identify and frees them from memorizing and recalling.</div>
              </el-collapse-item>
            </el-collapse>

          </el-col>
        </el-row>
        <br>
        <el-button @click="confirm">Próximo</el-button>

        <!-- <el-steps :active="active" finish-status="finish">
          <el-step></el-step>
          <el-step></el-step>
          <el-step></el-step>
          <el-step></el-step>
        </el-steps>
        <div class="step-content">
          <h2>Insira a sua planilha</h2>
          <p>Formatos suportados: XLSX, CSV, XLS, ODT e Google Sheets</p>
          <div class="upload-box">
            <div class="">
              <jus-icon icon="upload-file"/>
              <span>Adicionar arquivo do computador</span>
            </div>
            <div class="">
              <img src="@/assets/drive.png">
              <span>Adicionar arquivo do Google Drive</span>
            </div>
          </div>
          <el-button @click="confirm">Próximo</el-button> -->

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
.view-import{
  h2 {
    text-align: center;
  }
  .step-content{
    margin-top: 60px;
    button{
      width: 100%;
      max-width: 400px;
      margin: auto;
      display: block;
    }
    .upload-box{
      display: flex;
      justify-content: center;
      margin: 40px;
      > div {
        border: 2px dashed #d1dbe2;
        width: 240px;
        height: 240px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 30px;
      }
      div + div {
        margin-left: 20px;
      }
    }
  }
  .el-steps {
    width: 30%;
    margin: auto;
    margin-top: 20px;
  }
  .el-step__icon.is-text {
    padding: 14px;
  }
  .el-step__line {
    display: none;
  }
  .el-step__head.is-process, .el-step__head.is-wait {
    color: #adadad !important;
    border-color: white !important;
  }
}
.file-column {
  margin-bottom: 20px;
  height: 32px;
}

</style>
