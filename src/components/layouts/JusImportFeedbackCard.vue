<template lang="html">
  <div class="jus-import-feedback-card">
    <el-tag :color="color" class="el-tag--company-tag">{{ company }}</el-tag>
    <el-card :style="'border-left: solid 4px ' + color">
      <el-form ref="form" :inline="true" :model="form" label-position="top">
        <el-form-item label="Nº de casos" prop="number">
          <el-input v-model="form.number" readonly/>
        </el-form-item>
        <el-form-item label="Enriquecimento" prop="number">
          <el-input v-model="form.enrichment" readonly/>
        </el-form-item>
        <el-form-item label="Nome da campanha" prop="number">
          <el-input v-model="form.name" placeholder="Digite o nome da sua campanha"/>
        </el-form-item>
        <el-form-item label="Tipo" prop="number">
          <el-select v-model="form.value" placeholder="Select">
            <el-option
              v-for="item in ['Indenizatório', 'Cobrança']" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Data limite da negociação" prop="number">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="Selecione uma data">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Responsáveis pela campanha" prop="number">
          <span v-if="responsibles.length !== 0" class="responsibles-box">
            <jus-avatar-user src="http://www.abc.net.au/reslib/201011/r679209_5007178.jpg" size="xs" shape="circle"/>
            <jus-avatar-user src="https://vignette.wikia.nocookie.net/parody/images/8/8c/Kermit-2011.png/revision/latest?cb=20150530035135" size="xs" shape="circle"/>
            <jus-avatar-user name-initials="MS" size="xs" shape="circle"/>
          </span>
          <jus-icon icon="add-purple"/>
        </el-form-item>
      </el-form>
      <!-- <el-table :data="tableData" class="el-table--feedback-card" size="mini">
        <el-table-column label="Nº de casos" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.cases }}
          </template>
        </el-table-column>
        <el-table-column label="Enriquecimento" min-width="160px">
          <template slot-scope="scope">
            {{ scope.row.enrichment }}
          </template>
        </el-table-column>
        <el-table-column label="Tipo" min-width="140px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" placeholder="Select">
              <el-option v-for="type in types" :key="type" :label="type" :value="type"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Nome da campanha" min-width="150px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.campaign"/>
          </template>
        </el-table-column>
        <el-table-column label="Data limite para proposta" min-width="175px">
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.limit" :clearable="false" type="date" format="dd-MM-yyyy" prefix-icon="none"/>
          </template>
        </el-table-column>
        <el-table-column label="Responsáveis" min-width="175">
          <template slot-scope="scope">
            <span v-if="responsibles.length !== 0" class="responsibles-box">
              <jus-avatar-user src="http://www.abc.net.au/reslib/201011/r679209_5007178.jpg" size="xs" shape="circle"/>
              <jus-avatar-user src="https://vignette.wikia.nocookie.net/parody/images/8/8c/Kermit-2011.png/revision/latest?cb=20150530035135" size="xs" shape="circle"/>
              <jus-avatar-user name-initials="MS" size="xs" shape="circle"/>
            </span>
            <jus-icon icon="add-purple"/>
          </template>
        </el-table-column>
      </el-table> -->
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'JusImportFeedbackCard',
  props: {
    company: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    responsibles: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      form: {
        number: '500',
        value: 'Indenizatório',
        date: '',
        name: '',
        enrichment: '93 dados enriquecidos'
      }
    }
  }
}
</script>

<style lang="scss">
.jus-import-feedback-card {
  width: 100%;
  max-width: 400px;
  &+.jus-import-feedback-card {
    margin-left: 40px;
  }
  .el-tag {
    margin-bottom: 10px;
    text-align: center;
  }
  .el-date-editor {
    max-width: 100%;
  }
  .responsibles-box {
    margin-right: 10px;
    > div:not(:first-child) {
      margin-left: -5px;
    }
    img {
      box-shadow: 0px 1px 1px 0px rgba(37, 38, 94, 0.25);
    }
  }
}
</style>
