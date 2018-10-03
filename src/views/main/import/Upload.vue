<template>
  <JusViewMain>
    <template slot="main">
      <JusButtonBack to="/import"/>
      <div class="step-main">
        <h2>Insira a sua planilha</h2>
        <p>Formatos suportados: XLSX, CSV, XLS, ODT e Google Sheets</p>
        <div class="upload-box">
          <div>
            <JusIcon icon="upload-file"/>
            <span>Adicionar arquivo do computador</span>
          </div>
          <div>
            <img src="@/assets/drive.png">
            <span>Adicionar arquivo do Google Drive</span>
          </div>
        </div>
        <el-button type="primary" plain @click="$router.push('/import/columns')">Próximo</el-button>
      </div>
    </template>
    <template slot="aside">
      <JusIcon icon="best-practices"/>
      <h3>
        Melhores práticas para importar casos
      </h3>
      <br>
      <p>Ao escolher uma opção para importação, certifique-se de que os dados estão inseridos corretamente. Dessa forma, o sistema irá reconhecer mais rapidamente os dados, e além disso, enriquecer com informações complementares colhidas diretamente do TJ.<br><br> Não se esqueça de preencher os dados mínimos da planilha <br><br> • Número do processo<br> • Empresa<br> • Alçadas da negociação <br> • Nome e CPF das partes
      </p>
    </template>
  </JusViewMain>
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
    img+span {
      margin-top: 20px;
      text-align: center;
    }
  }
  div + div {
    margin-left: 20px;
  }
}
</style>
