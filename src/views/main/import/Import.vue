<template>
  <jus-view-main class="import-view">
    <template slot="main">
      <h2 class="import-view__action">
        Histórico de importações
        <div>
          <el-button
            plain
            data-testid="download-model"
            @click="downloadModel()"
          >
            Baixar planilha modelo
          </el-button>
          <el-button
            type="primary"
            data-testid="upload-button"
            @click="importDialogVisible = true"
          >
            <jus-icon
              icon="upload-file"
              is-white
              style="width: 17px;vertical-align: top;margin-right: 4px;"
            />
            Nova importação de disputas
          </el-button>
        </div>
      </h2>
      <el-table
        :data="importsHistoryPaged"
        height="100%"
        style="width: 100%"
      >
        <el-table-column label="Arquivo">
          <template slot-scope="scope">
            {{ scope.row.file_name }}
          </template>
        </el-table-column>
        <el-table-column label="Importado por">
          <template
            v-if="scope.row.created_name"
            slot-scope="scope"
          >
            {{ scope.row.created_name }}
            <span v-if="scope.row.created_by">({{ scope.row.created_by }})</span>
          </template>
        </el-table-column>
        <el-table-column label="Data">
          <template slot-scope="scope">
            {{ scope.row.date | moment('DD/MM/YYYY [às] HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="Status">
          <template slot-scope="scope">
            <i :class="setStatusIcon(scope.row.status)" />
            {{ $t('import.status.' + scope.row.status ) | capitalize }}
          </template>
        </el-table-column>
        <el-table-column
          width="90"
          label="Linhas"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.rows }}
          </template>
        </el-table-column>
        <el-table-column
          width="90"
          align="center"
          label="Baixar"
        >
          <template slot-scope="scope">
            <a
              :href="scope.row.file_url"
              target="_blank"
            >
              <jus-icon icon="download-sheet" />
            </a>
          </template>
        </el-table-column>
        <infinite-loading
          slot="append"
          :distance="1"
          spinner="spiral"
          force-use-infinite-wrapper=".el-table__body-wrapper"
          @infinite="infiniteHandler"
        >
          <div slot="no-more" />
          <div slot="no-results" />
        </infinite-loading>
      </el-table>
      <jus-import-dialog :dialog-visible.sync="importDialogVisible" />
    </template>
  </jus-view-main>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'Import',
  components: {
    InfiniteLoading,
    JusImportDialog: () => import('@/components/dialogs/JusImportDialog')
  },
  data() {
    return {
      importsHistory: [],
      page: 1,
      importDialogVisible: false
    }
  },
  computed: {
    importsHistoryPaged() {
      return this.importsHistory.slice(0, this.page * 20)
    }
  },
  beforeMount() {
    this.init()
  },
  methods: {
    init() {
      this.$store.dispatch('getImportsHistory').then(response => {
        if (response && response.length) {
          this.importsHistory = response.sort(function(a, b) {
            if (a.id < b.id) return 1
            if (a.id > b.id) return -1
            return 0
          })
        }
      })
    },
    setStatusIcon(status) {
      switch (status) {
        case 'FINISHED':
          return 'el-icon-folder-checked'
        case 'ERROR': case 'IN_QUEUE': case 'PROCESSED':
          return 'el-icon-folder-delete'
        case 'READY': case 'PROCESSING':
          return 'el-icon-folder-remove'
        default:
          return 'el-icon-folder-delete'
      }
    },
    infiniteHandler($state) {
      setTimeout(() => {
        this.page = this.page + 1
        if (this.importsHistory.length === this.importsHistoryPaged.length) {
          $state.complete()
        } else {
          $state.loaded()
        }
      }, 600)
    },
    downloadModel() {
      // SEGMENT TRACK
      this.$jusSegment('Baixar planilha modelo')
      window.open('Planilha-Modelo-Justto.xlsx', '_blank')
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.import-view {
  .el-table {
    img {
      width: 14px;
    }
    .cell {
      word-break: break-all;
    }
  }
  &__action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0;
  }
  .el-card__body {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .el-icon-folder-delete {
    font-size: 18px;
    color: $--color-danger-light-5;
  }
  .el-icon-folder-checked {
    font-size: 18px;
  }
}
</style>
