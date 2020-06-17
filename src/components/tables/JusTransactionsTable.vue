<template>
  <article class="transactions-table">
    <div class="transactions-table__header">
      <el-input
        v-model="filterTerm"
        class="transactions-table__filter-input"
        clearable
        size="small"
        prefix-icon="el-icon-search"
        placeholder="Buscar"
      />
      <span class="transactions-table__filter-counter">
        Exibindo {{ filteredTransactions.length }} de {{ transactions.length }} resultados
      </span>
    </div>

    <el-card
      class="transactions-table__card-table"
      shadow="never">
      <el-table
        :data="filteredTransactions"
        size="mini"
        class="transactions-table__table el-table--disputes">
        <el-table-column
          label="Data"
          width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.occurredDate | moment('DD/MM/YY') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Lançamento">
          <template slot-scope="scope">
            <span v-html="transactionResume(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          label="Tipo"
          width="150">
          <template slot-scope="scope">
            <span>{{ $t(`transactions.${scope.row.type}`) | capitalize }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="respondent"
          label="Réu"
        />
        <el-table-column
          prop="code"
          label="Processo"
          width="130"
        />
        <el-table-column
          label="#ID"
          width="90">
          <template slot-scope="scope">
            <span class="transactions-table__dispute-link">
              <el-link
                :underline="false"
                :href="`https://justto.app/#/management/dispute/${scope.row.referenceId}`"
                target="_blank">
                {{ scope.row.referenceId }}
                <jus-icon
                  icon="external-link"
                  class="transactions-table__dispute-link-icon"/>
              </el-link>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="ID Interno"
          width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.externalId || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Valor"
          width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.value | currency }}</span>
          </template>
        </el-table-column>
        <el-table-column
          class-name="transactions-table__hidden-actions"
          width="1px">
          <template slot-scope="scope">
            <JusInlineActions
              :actions="actionsList"
              :scope="scope.row"
            />
          </template>
        </el-table-column>
        <template slot="empty">
          <transition name="el-fade-in-linear">
            <span v-show="!filteredTransactions.lenght">
              <jus-icon
                icon="empty-screen-filter"
                class="transactions-table__empty-table"/>
              <h4 data-testid="cases-empty-text">
                Nenhum lançamento para exibir.
              </h4>
            </span>
          </transition>
        </template>

      </el-table>
    </el-card>
  </article>
</template>

<script>
import { normalizeString } from '@/utils/jusUtils'

export default {
  name: 'JusTransactionsTable',
  components: {
    JusInlineActions: () => import('@/components/others/JusInlineActions'),
  },
  props: {
    transactions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      filterTerm: '',
      actionsList: [
        {
          name: 'deleteTransaction',
          label: 'Apagar lançamento',
          icon: 'trash'
        },
      ],
    }
  },
  computed: {
    filteredTransactions() {
      const normalizedFilterTerm = normalizeString(this.filterTerm)

      return this.transactions.filter(t => {
        return normalizeString(t.respondent).includes(normalizedFilterTerm) ||
          normalizeString(t.code).includes(normalizedFilterTerm) ||
          normalizeString(t.referenceId).includes(normalizedFilterTerm) ||
          normalizeString(t.externalId).includes(normalizedFilterTerm) ||
          normalizeString(this.$t(`transactions.${t.type}`)).includes(normalizedFilterTerm) ||
          normalizeString(this.$options.filters.currency(t.value)).includes(normalizedFilterTerm)
      })
    },
  },
  methods: {
    transactionResume(transaction) {
      return this.$options.filters.capitalize(this.$t(`transactions.${transaction.type}`)) + ' na disputa #' + transaction.referenceId + '<br>' + transaction.code
    },
  },
}
</script>

<style lang="scss" scoped>
.transactions-table {
  .transactions-table__card-table {

    .transactions-table__table {
      .transactions-table__empty-table {
        margin-top: 40px;
        width: 60px;
      }

      .transactions-table__dispute-link {
        .transactions-table__dispute-link-icon {
          display: none;
          width: 16px;
          margin-left: 4px;
          margin-top: 1px;
        }

        &:hover .transactions-table__dispute-link-icon {
          display: inline;
        }
      }
    }
  }

  .transactions-table__header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;

    .transactions-table__filter-input  {
      width: 300px;
      margin-right: 8px;
    }
  }
}
</style>

<style lang="scss">
.transactions-table {
  .transactions-table__card-table {
    .el-card__body {
      padding: 16px;
    }

    .el-table--disputes {
      .el-table__row {
        cursor: default;
      }
    }

    th.transactions-table__hidden-actions {
      position: relative;
    }
    td.transactions-table__hidden-actions .cell {
      display: none;
    }
    tr:hover {
      td.transactions-table__hidden-actions .cell{
        display: contents;
      }
    }
    th.gutter { 
      display: table-cell !important;
    }
    td {
      height: 46px;
    }
  }
}
</style>
