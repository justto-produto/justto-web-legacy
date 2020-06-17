<template>
  <article class="transactions-table">
    <el-table
      :data="transactions"
      size="mini"
      class="transactions-table__table el-table--disputes"
      style="width: 100%">
      <el-table-column
        label="Data"
        width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.occurredDate | moment('DD/MM/YY') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Lançamento">
        <template slot-scope="scope">
          <span> {{ $t(`transactions.${scope.row.type}`) | capitalize }} na disputa #{{ scope.row.referenceId }}
            <br>{{ scope.row.code }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="Tipo">
        <template slot-scope="scope">
          <span>{{ $t(`transactions.${scope.row.type}`) | capitalize }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="respondent"
        label="Réu"/>
      <el-table-column
        prop="code"
        label="Processo"/>
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
        label="ID Interno">
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
      <template slot="empty">
        <transition name="el-fade-in-linear">
          <span v-show="!transactions.lenght">
            <jus-icon icon="empty-screen-filter"/>
            <h4 data-testid="cases-empty-text">
              Nenhum lançamento para exibir.
            </h4>
          </span>
        </transition>
      </template>
    </el-table>
  </article>
</template>

<script>
export default {
  name: 'JusTransactionsTable',
  components: {

  },
  props: {
    transactions: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.transactions-table {
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
</style>
