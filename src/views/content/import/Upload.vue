<template>
  <content-view>
    <template slot="main">
      <back-button to="/import"></back-button>
      <div class="step-content">
        <h2>Insira a sua planilha</h2>
        <p>Formatos suportados: XLSX, CSV, XLS, ODT e Google Sheets</p>
        <div class="upload-box">
          <div>
            <jus-icon icon="upload-file"/>
            <span>Adicionar arquivo do computador</span>
          </div>
          <div>
            <img src="@/assets/drive.png">
            <span>Adicionar arquivo do Google Drive</span>
          </div>
        </div>
        <el-button @click="$router.push('/import/new/2')">Próximo</el-button>
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
