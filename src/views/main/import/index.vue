<template>
  <JusViewMain>
    <template slot="main">
      <div>
        <div>
          <h2>Insira a sua planilha</h2>
          <p>Formatos suportados: XLSX, CSV, XLS, ODT e Google Sheets.</p>
        </div>
        <div>
          <el-button type="primary" @click="$router.push('/import/upload')">Importar planilha</el-button>
        </div>
      </div>
      <hr>
      <br>
      <h3>Histórico de importação</h3>
      <el-card class="el-card--bordered el-card--success">
        <JusIcon icon="spreadsheet-xlsx"/>
        <div>
          <h4>
            Nome do arquivo 1
            <span>21/08/2018</span>
          </h4>
          <p>
            Importação realizada com sucesso
          </p>
          <p>Total de casos: 1002</p>
        </div>
      </el-card>
      <el-card class="el-card--bordered el-card--danger">
        <JusIcon icon="spreadsheet-xlsx"/>
        <div>
          <h4>
            Nome do arquivo 2
            <span>21/08/2018</span>
          </h4>
          <p>
            Erro durante a importação
          </p>
          <p>Total de casos: 1002</p>
        </div>
      </el-card>
      <el-card class="el-card--bordered">
        <JusIcon icon="spreadsheet-xlsx"/>
        <div>
          <h4>
            Nome do arquivo 3
            <span>21/08/2018</span>
          </h4>
          <p>
            Importação cancelada
          </p>
          <p>Total de casos: 1002</p>
        </div>
      </el-card>
      <el-card class="el-card--bordered">
        <JusIcon icon="spreadsheet-xlsx"/>
        <div>
          <h4>
            Nome do arquivo 4
            <span>21/08/2018</span>
          </h4>
          <p>
            Importação cancelada
          </p>
          <p>Total de casos: 1002</p>
        </div>
      </el-card>
      <el-card class="el-card--bordered">
        <JusIcon icon="spreadsheet-xlsx"/>
        <div>
          <h4>
            Nome do arquivo 5
            <span>21/08/2018</span>
          </h4>
          <p>
            Importação cancelada
          </p>
          <p>Total de casos: 1002</p>
        </div>
      </el-card>
      <div style="text-align: center;">
        <br>
        <el-pagination :total="50" layout="prev, pager, next"/>
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
  name: 'Import'
}
</script>
