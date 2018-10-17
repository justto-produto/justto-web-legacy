<template>
  <JusViewMain side-card class="view-management">
    <template slot="title">
      <h1>Gerenciamento</h1>
    </template>
    <template slot="main">
      <div class="">
        teste
      </div>
      <el-tabs>
        <el-tab-pane label="Pendentes">
          <div class="view-management__header">
            <span>
              Filtrar por:
              <el-select v-model="companyFilter" size="small" placeholder="Empresa">
                <el-option v-for="company in ['Nestlé', 'Cacau Show']" :key="company" :label="company" :value="company"/>
              </el-select>
            </span>
            <el-button type="primary" @click="$router.push('/import/upload')">Exportar casos</el-button>
          </div>
          <div class="view-management__container">
            <div class="view-management__item">
              <el-checkbox/>
              <el-card class="el-card--bordered el-card--info">
                <el-table :data="tableData" class="el-table--feedback-card" size="mini">
                  <el-table-column label="Nº do caso">
                    <template slot-scope="scope">
                      {{ scope.row.id }}
                    </template>
                  </el-table-column>
                  <el-table-column label="Empresa">
                    <template slot-scope="scope">
                      {{ scope.row.company }}
                    </template>
                  </el-table-column>
                  <el-table-column label="Dados incorretos" min-width="200px">
                    <template slot-scope="scope">
                      {{ scope.row.issues }}
                    </template>
                  </el-table-column>
                  <el-table-column min-width="175">
                    <template slot-scope="scope" style="text-align: right;">
                      • • •
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </div>
            <div class="view-management__item">
              <el-checkbox/>
              <el-card class="el-card--bordered el-card--info">
                <el-table :data="tableData" class="el-table--feedback-card" size="mini">
                  <el-table-column label="Nº do caso">
                    <template slot-scope="scope">
                      {{ scope.row.id }}
                    </template>
                  </el-table-column>
                  <el-table-column label="Empresa">
                    <template slot-scope="scope">
                      {{ scope.row.company }}
                    </template>
                  </el-table-column>
                  <el-table-column label="Dados incorretos" min-width="200px">
                    <template slot-scope="scope">
                      {{ scope.row.issues }}
                    </template>
                  </el-table-column>
                  <el-table-column min-width="175">
                    <template slot-scope="scope" style="text-align: right;">
                      • • •
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </div>
            <div class="view-management__item">
              <el-checkbox/>
              <el-card class="el-card--bordered el-card--info">
                <el-table :data="tableData" class="el-table--feedback-card" size="mini">
                  <el-table-column label="Nº do caso">
                    <template slot-scope="scope">
                      {{ scope.row.id }}
                    </template>
                  </el-table-column>
                  <el-table-column label="Empresa">
                    <template slot-scope="scope">
                      {{ scope.row.company }}
                    </template>
                  </el-table-column>
                  <el-table-column label="Dados incorretos" min-width="200px">
                    <template slot-scope="scope">
                      {{ scope.row.issues }}
                    </template>
                  </el-table-column>
                  <el-table-column min-width="175">
                    <template slot-scope="scope" style="text-align: right;">
                      • • •
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Duplicados">
          Teste
        </el-tab-pane>
        <el-tab-pane label="Engajamento">
          Teste
        </el-tab-pane>
        <el-tab-pane label="Com interação">
          Teste
        </el-tab-pane>
        <el-tab-pane label="Ganhos">
          Teste
        </el-tab-pane>
        <el-tab-pane label="Perdidos">
          Teste
        </el-tab-pane>
        <el-tab-pane label="Todos">
          Teste
        </el-tab-pane>
      </el-tabs>
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
  </JusViewMain>
</template>

<script>
export default {
  name: 'Management',
  data () {
    return {
      companyFilter: '',
      tableData: [
        {
          id: '14567',
          company: 'Nestlé',
          issues: 'CPF da parte contrária'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.view-management {
  .el-card__body {
    padding: 20px 12px;
  }
}
.view-management__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 30px 8px 20px 42px;
  button {
    max-width: 200px;
  }
  .el-input {
    margin-left: 10px;
  }
}
.view-management__container {
  margin: 20px 8px 20px;
  .el-table {
    td:last-child {
      text-align: right;
    }
    td:last-child .cell {
      margin-top: -20px;
    }
  }
  .view-management__item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .el-card {
      margin-bottom: 0;
      width: 100%;
    }
    .el-checkbox {
        margin-right: 20px;
    }
  }
}
</style>
