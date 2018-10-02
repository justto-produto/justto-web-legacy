<template>
  <JusViewMain class="view-import">
    <template slot="main">
      <div class="view-import__header">
        <div>
          <h2>Insira a sua planilha</h2>
          <p>Formatos suportados: XLSX, CSV, XLS, ODT e Google Sheets.</p>
        </div>
        <div>
          <el-button @click="$router.push('/import/new')">Importar planilha</el-button>
        </div>
      </div>
      <hr>
      <br>
      <h3>Histórico de importação</h3>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="el-card--bordered el-card--success">
            <JusIcon icon="spreadsheet-xlsx"/>
            <div>
              <h4>
                Nome do arquivo 1
                <span>21/08/2018</span>
              </h4>
              <p>
                Importação realizada com sucesso
                <span class="el-card__status el-card__status--success"/>
              </p>
              <p>Total de casos: 1002</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="el-card--bordered el-card--danger">
            <JusIcon icon="spreadsheet-xlsx"/>
            <div>
              <h4>
                Nome do arquivo 2
                <span>21/08/2018</span>
              </h4>
              <p>
                Erro durante a importação
                <span class="el-card__status el-card__status--danger"/>
              </p>
              <p>Total de casos: 1002</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="el-card--bordered">
            <JusIcon icon="spreadsheet-xlsx"/>
            <div>
              <h4>
                Nome do arquivo 3
                <span>21/08/2018</span>
              </h4>
              <p>
                Importação cancelada
                <span class="el-card__status"/>
              </p>
              <p>Total de casos: 1002</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="el-card--bordered">
            <JusIcon icon="spreadsheet-xlsx"/>
            <div>
              <h4>
                Nome do arquivo 4
                <span>21/08/2018</span>
              </h4>
              <p>
                Importação cancelada
                <span class="el-card__status"/>
              </p>
              <p>Total de casos: 1002</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="el-card--bordered">
            <JusIcon icon="spreadsheet-xlsx"/>
            <div>
              <h4>
                Nome do arquivo 5
                <span>21/08/2018</span>
              </h4>
              <p>
                Importação cancelada
                <span class="el-card__status"/>
              </p>
              <p>Total de casos: 1002</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
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
  name: 'Import'
}
</script>

<style lang="scss">
.view-import {
  .el-card--bordered .el-card__body {
    display: flex;
    align-items: flex-start;
    div {
      width: 100%;
    }
    img {
      margin-right: 20px;
    }
    h4 {
      margin-top: 0;
      margin-bottom: 10px;
      font-weight: bold;
    }
    p, span {
      font-size: 12px;
      margin-top: 0px;
      margin-bottom: 10px;
      font-weight: normal;
    }
    h4 > span {
      float: right;
    }
    p+p {
      margin-bottom: 0;
    }
  }

  .el-card__status {
    width: 6px;
    height: 6px;
    background-color: #d7e0e6;
    float: right;
    border-radius: 50%;
    margin-top: 5px;
    &.el-card__status--danger {
      background-color: #FF4B54;
    }
    &.el-card__status--success {
      background-color: #46E986;
    }
  }

  .view-import__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .step-main {
    margin-top: 60px;
    h2, p {
      text-align: center;
    }
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
}
</style>
