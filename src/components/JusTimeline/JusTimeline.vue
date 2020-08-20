<template>
  <section
    id="jus-timeline"
    class="el-container is-vertical jus-timeline">
    <ul class="jus-timeline__list">
      <li
        v-for="(progress, progressIndex) in disputeProgress"
        :key="`progress-${progressIndex}`"
        class="jus-timeline__list-item">
        <div class="jus-timeline__header">
          <div class="jus-timeline__header-title">
            {{ progress.descricao }} - {{ progress.codigo }}
          </div>
          <div class="jus-timeline__header-subtitle">
            Distribuído em {{ progress.distribuicao }}
          </div>
          <div class="jus-timeline__header-flags">
            <el-tag
              v-for="(flag, flagIndex) in progress.flags"
              :key="`flag-evento-${flagIndex}`"
              type="secondary"
              size="small">
              <strong>{{ flag }}</strong>
            </el-tag>
          </div>
        </div>

        <div class="jus-timeline__body">
          <el-timeline>
            <el-timeline-item
              v-for="(event, eventIndex) in progress.eventos"
              :key="`event-${eventIndex}`"
              :timestamp="event.data"
              placement="top"
            >
              <div class="jus-timeline__body-event">
                <div class="jus-timeline__body-description">
                  {{ event.descricao }}
                </div>
                <div class="jus-timeline__body-flags">
                  <el-tag
                    v-for="(flag, flagIndex) in event.flags"
                    :key="`flag-event-${flagIndex}`"
                    type="secondary"
                    size="small">
                    <strong>{{ flag }}</strong>
                  </el-tag>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </li>
    </ul>

    <!--  -->
    <!-- <div class="block"> -->
    <!-- </div> -->
  </section>
</template>

<script>
export default {
  props: {
    disputeProgress: {
      type: Array,
      required: false,
      default: () => [{
        descricao: '2ª Instância',
        codigo: '768279209.9874098-123',
        distribuicao: '10/01/2020',
        flags: ['Extinto'],
        eventos: [{
          data: '10/01/2020',
          descricao: 'Processo em Distibuição para sorteio',
          flags: ['Distribuição'],
        }, {
          data: '15/01/2020',
          descricao: 'Agendado audiência conciliação',
          flags: ['Agenda'],
        }],
      }, {
        descricao: '1ª Instância',
        codigo: '768279209.9874098-123',
        distribuicao: '10/01/2020',
        flags: ['Extinto'],
        eventos: [{
          data: '10/01/2020',
          descricao: 'Processo em Distibuição para sorteio',
          flags: ['Distribuição'],
        }],
      }],
    },
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.jus-timeline {
  background-color: white;
  .jus-timeline__list {
    padding-inline-start: 8px;

    .jus-timeline__list-item {
      list-style: none;

      .jus-timeline__header {
        .jus-timeline__header-title {
          color: #424242;
          letter-spacing: 0px;
          font: normal normal bold 23px/35px Montserrat;
        }
        .jus-timeline__header-subtitle {
          font: normal normal medium 17px/22px Montserrat;
          letter-spacing: 0px;
          color: #ADADAD;
        }
        .jus-timeline__header-flags {
          margin-top: 8px;
        }
      }

      .jus-timeline__body {
        margin-left: -24px;
        margin-top: 24px;
      }
    }
  }
}
</style>
