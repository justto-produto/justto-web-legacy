<template>
  <el-table
    v-loading="loading"
    :element-loading-text="loadingText"
    :data="data"
    size="mini"
    height="100%"
    class="data-table el-table--disputes"
  >
    <el-table-column
      label="Data"
      width="75"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.occurredDate | moment('DD/MM/YY') }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="Lançamento"
    >
      <template slot-scope="scope">
        <span v-html="transactionResume(scope.row)" />
      </template>
    </el-table-column>
    <el-table-column
      label="Nota"
    >
      <template slot-scope="scope">
        <span>{{ transactionTableNote(scope.row.note, scope.row.type) }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="Tipo"
      width="110"
    >
      <template slot-scope="scope">
        <span>{{ $t(`transactions.${scope.row.type}`) | capitalize }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="respondent"
      label="Réu"
      width="160"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.respondent || '-' }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="code"
      label="Processo"
      width="130"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.code || '-' }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="#ID"
      width="90"
    >
      <template slot-scope="scope">
        <span class="data-table__dispute-link">
          <el-tooltip
            :disabled="!scope.row.disputeArchived"
            content="Esta disputa foi excluída"
          >
            <el-link
              v-if="scope.row.referenceId"
              :underline="false"
              :disabled="scope.row.disputeArchived"
              :href="disputeLink(scope.row.referenceId)"
              target="_blank"
            >
              {{ scope.row.referenceId }}
              <jus-icon
                v-if="!scope.row.disputeArchived"
                icon="external-link"
                class="data-table__dispute-link-icon"
              />
              <i
                v-else
                class="el-icon-warning-outline data-table__dispute-link-icon data-table__dispute-link-icon--alert"
              />
            </el-link>
            <span v-else>-</span>
          </el-tooltip>
        </span>
      </template>
    </el-table-column>
    <el-table-column
      label="ID Interno"
      width="100"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.externalId || '-' }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="Valor"
      width="120"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.value | currency }}</span>
      </template>
    </el-table-column>
    <el-table-column
      class-name="data-table__hidden-actions"
      width="1px"
    >
      <template slot-scope="scope">
        <JusFloatActions
          :actions="availableActions"
          :scope="scope.row"
          @floatAction="floatAction"
        />
      </template>
    </el-table-column>
    <template slot="empty">
      <transition name="el-fade-in-linear">
        <span v-show="!data.lenght">
          <jus-icon
            icon="empty-screen-filter"
            class="data-table__empty-table"
          />
          <h4 data-testid="cases-empty-text">
            Nenhum lançamento para exibir.
            <br>
            Selecione um tipo de lançamento nos cards acima para visualizar.
          </h4>
        </span>
      </transition>
    </template>
    <infinite-loading
      v-if="pagination.totalElements >= 20"
      slot="append"
      :distance="20"
      spinner="spiral"
      force-use-infinite-wrapper=".el-table__body-wrapper"
      @infinite="infiniteHandler"
    >
      <div slot="no-more">
        Fim dos lançamentos
      </div>
      <div slot="no-results">
        Fim dos lançamentos
      </div>
    </infinite-loading>
  </el-table>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'JusDataTable',
  components: {
    InfiniteLoading: () => import('vue-infinite-loading'),
    JusFloatActions: () => import('@/components/others/JusFloatActions')
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    pagination: {
      type: Object,
      required: false,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: 'Carregando...'
    }
  },
  data() {
    return { }
  },
  computed: {
    ...mapGetters([
      'isJusttoAdmin'
    ]),

    availableActions() {
      return [
        {
          icon: 'edit',
          label: 'Editar lançamento',
          trigger: 'editTransaction',
          condition: (scope) => (scope.type === 'MANUAL' && this.isJusttoAdmin)
        },
        {
          icon: 'trash',
          label: 'Cancelar lançamento',
          trigger: 'cancelTransaction',
          condition: (scope) => (!!scope.value && this.isJusttoAdmin)
        }
      ]
    }
  },
  methods: {
    floatAction(evt) {
      this.$emit('floatAction', evt)
    },

    transactionResume(transaction) {
      return this.$options.filters.capitalize(this.$t(`transactions.${transaction.type}`)) + (!['MANUAL', 'SUBSCRIPTION'].includes(transaction.type) ? ' na disputa #' + transaction.referenceId + '<br>' + transaction.code : '')
    },

    transactionTableNote(note, type) {
      return type !== 'MANUAL' ? '-' : note || '-'
    },

    disputeLink(disputeId) {
      return `https://justto.app/#/management/dispute/${disputeId}`
    },

    infiniteHandler($state) {
      this.$emit('infiniteHandler', $state)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.data-table {
  .data-table__dispute-link {
    .data-table__dispute-link-icon {
      display: none;
      width: 16px;
      margin-left: 4px;
      margin-top: 1px;

      &.data-table__dispute-link-icon--alert {
        color: $--color-danger;
        display: inline;
        font-size: 16px;
      }
    }

    &:hover .data-table__dispute-link-icon {
      display: inline;
    }
  }

  .data-table__empty-table {
    margin-top: 40px;
    width: 60px;
  }
}
</style>

<style lang="scss">
.data-table {
  .el-table__row {
    height: 46px;

    &:hover .data-table__hidden-actions .cell {
      display: contents;
    }
  }

  .data-table__hidden-actions {
    position: relative;
  }

  .data-table__hidden-actions .cell {
    display: none;
  }

  &.el-table--disputes .el-table__row {
    cursor: initial !important;
  }
}
</style>
