<template>
  <article class="omnichannel-resume__container">
    <ul class="omnichannel-resume__container-list">
      <li
        v-for="(occurrence, occurrenceIndex) in occurrences"
        :key="`occurrence-${occurrenceIndex}`"
        class="omnichannel-resume__container-list-item"
      >
        <div
          v-if="$options.filters.willBreak(occurrence)"
          class="html2pdf__page-break"
        />

        <Occurrence
          :id="`occurrence${occurrence.id}`"
          :value="occurrence"
          :class="occurrence | isBackgoundGray"
        />
      </li>
    </ul>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  filters: {
    isBackgoundGray(occurrece) {
      const logTypes = [
        'LOG',
        'VISUALIZATION',
        'CLICK',
        'VISUALIZATION',
        'NEGOTIATOR_ACCESS'
      ]

      const isOutbound = occurrece?.interaction?.direction === 'OUTBOUND' || ['ATTACHMENT', 'MANUAL'].includes((occurrece?.interaction?.type || '_').split('_')[0])
      const isLog = ['LOG'].includes(occurrece?.type) || logTypes.includes(occurrece?.interaction?.type)

      return isLog ? 'log' : isOutbound ? 'outbound' : 'inbound'
    },
    willBreak({ id }) {
      // Calcula o tamanho da página.
      const maxHeight = document.querySelector('.content-wrapper').offsetHeight
      // Tamanho em pixels da quebra de página.
      const breakPx = 1000

      // Pega largura e distáncia pro topo da mensagem.
      const el = document.querySelector(`#occurrence${id}`) || { offsetHeight: 0, offsetTop: 0 }
      /**
       * height: Tamanho do elemento.
       * top: Distância do início do elemento para o topo da página.
       */
      const { offsetHeight: height, offsetTop: top } = el

      // Verifica se o elemento vai ter alguma quebra de página dentro dele.
      for (let breakPoint = breakPx; (maxHeight / breakPoint) > 1.0; breakPoint += breakPoint) {
        // Valida se o elemento começa à ser renderizado antes da quebra de página
        // e se termina de renderizar depois da quebra de página.
        if (top < breakPoint && (top + height) > breakPoint) {
          // Avisa que vai quebrar o elemento.
          return true
        }
      }

      // Avisa que não vai quebrar o elemento.
      return false
    }
  },
  components: {
    Occurrence: () => import('./occurrences/occurrence/Occurrence')
  },

  computed: {
    ...mapGetters({
      allOccurrences: 'getOccurrencesList',
      height: 'getWindowHeight'
    }),

    occurrences() {
      return this.allOccurrences.filter(({ id, archived, interaction }) => (Boolean(id) && !archived && interaction.archived !== true))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors';

.omnichannel-resume__container {
  .omnichannel-resume__container-list {
    list-style: none;
    padding: 0;

    .omnichannel-resume__container-list-item {
      margin: 8px 0;

      .inbound {
        background-color: $--color-light-gray;
        border-radius: 6px;
        padding: 8px 16px;
      }

      .log {
        background: #fff4cc !important;
        border-radius: 6px;
      }
    }
  }
}
</style>
