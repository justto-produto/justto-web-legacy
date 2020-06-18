<template>
  <jus-view-main>
    <div
      slot="main"
      class="financial-client-list"
    >
      <jus-grid
        :rows="2"
        :columns="4"
      >
        <jus-financial-card
          v-grid-item.col-1.row-1
          v-grid-item.col-1.row-2:v-if="index === 6"
          v-for="(card, index) in cards"
          :key="index"
          :actions="card.actions"
          :title="card.title"
          :value="card.value"
        />
        <jus-financial-card
          v-grid-item.col-1.row-2
          title="Total"
          value="4000,00"
        />
      </jus-grid>
    </div>
  </jus-view-main>
</template>

<script>
import { JusGrid } from '@/components/JusGrid'
import { JusFinancialCard } from '@/components/JusFinancialCard'
import { GridItem } from '@/utils/directives/JusGridItem'

export default {
  name: 'FinancialCLientDashboard',
  directives: { GridItem },
  components: {
    JusGrid,
    JusFinancialCard,
  },
  data() {
    return {
      cards: [
        {
          title: 'Importações',
          value: '4000,00',
          actions: [
            {
              icon: 'eye',
              label: 'Ver lançamentos',
              handler: () => false,
            },
            {
              icon: 'management',
              label: 'Filtrar gerenciamento',
              handler: () => false,
            },
          ],
        },
        {
          title: 'Propostas Aceitas',
          value: '4000,00',
          actions: [
            {
              icon: 'eye',
              label: 'Ver lançamentos',
              handler: () => false,
            },
            {
              icon: 'management',
              label: 'Filtrar gerenciamento',
              handler: () => false,
            },
          ],
        },
        {
          title: 'Mensalidade',
          value: '4000,00',
          actions: [
            {
              icon: 'eye',
              label: 'Ver lançamentos',
              handler: () => false,
            },
            {
              icon: 'management',
              label: 'Filtrar gerenciamento',
              handler: () => false,
            },
          ],
        },
        {
          title: 'Interações',
          value: '4000,00',
          actions: [
            {
              icon: 'eye',
              label: 'Ver lançamentos',
              handler: () => false,
            },
            {
              icon: 'management',
              label: 'Filtrar gerenciamento',
              handler: () => false,
            },
          ],
        },
        {
          title: 'Ganho',
          value: '4000,00',
          actions: [
            {
              icon: 'eye',
              label: 'Ver lançamentos',
              handler: () => false,
            },
            {
              icon: 'management',
              label: 'Filtrar gerenciamento',
              handler: () => false,
            },
          ],
        },
        {
          title: 'Outros Serviços',
          value: '4000,00',
          actions: [
            {
              icon: 'eye',
              label: 'Ver lançamentos',
              handler: () => false,
            },
            {
              icon: 'management',
              label: 'Filtrar gerenciamento',
              handler: () => false,
            },
          ],
        },
      ],
    }
  },
}
</script>

<style>

</style>
