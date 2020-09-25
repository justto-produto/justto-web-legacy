<template>
  <el-card
    shadow="hover"
    class="jus-user-card"
  >
    <div class="jus-user-card__wrapper">
      <JusTextEditable
        :value="userDataBind.name"
        type="title"
        class="jus-user-card__title"
        @hasEdition="emitEditTitle"
      />

      <div class="jus-user-card__actions">
        <div
          v-if="isJusttoAdmin"
          class="jus-user-card__actions-row"
        >
          <el-tooltip content="Desassociar cliente da workspace">
            <el-button
              type="danger"
              icon="el-icon-close"
              circle
              @click="emitCloseEvent"
            />
          </el-tooltip>

          <el-tooltip content="Contratos do cliente">
            <el-button
              type="info"
              icon="el-icon-edit"
              circle
              @click="emitEditEvent"
            />
          </el-tooltip>
        </div>

        <el-button
          type="primary"
          @click.native="emitSeeMore"
        >
          Ver lançamentos
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'JusUserCard',
  components: {
    JusTextEditable: () => import('@/components/JusTextEditable/JusTextEditable')
  },
  props: {
    userData: {
      type: Object,
      required: true,
      validator: obj => Object.keys(obj)
        .map(key => ['name', 'id', 'contractStatus'].includes(key))
    }
  },
  data() {
    return {
      userDataBind: this.userData
    }
  },
  computed: {
    ...mapGetters(['isJusttoAdmin']),

    contractStatus() {
      const contracts = this.userDataBind.contracts

      if (!contracts.length) return { label: 'VAZIO', type: 'info' }

      const contractStatus = contracts[contracts.length - 1].status

      switch (contractStatus) {
        case 'TRIAL':
          return { label: 'TRIAL', type: 'warning' }
        case 'ACTIVE':
          return { label: 'ATIVO', type: 'success' }
        default:
          return { label: 'VAZIO', type: 'info' }
      }
    }
  },
  watch: {
    userData(current) {
      this.userDataBind = current
    }
  },
  methods: {
    emitEditTitle(inputValue) {
      this.userDataBind.name = inputValue
      this.$emit('edit-title', this.userDataBind)
    },
    emitEditEvent() {
      this.$emit('edit', this.userDataBind)
    },
    emitCloseEvent() {
      this.$emit('close', this.userDataBind)
    },
    emitSeeMore() {
      this.$emit('see-more', this.userDataBind)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.jus-user-card {
  cursor: pointer;

  .jus-user-card__header {
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .jus-user-card__icon {
    cursor: pointer;
    font-size: 18px;
    margin-right: 8px;

    &.jus-user-card__icon--danger {
      &:hover {
        color: $--color-danger;
      }
    }

    &.jus-user-card__icon--info {
      &:hover {
        color: $--color-info;
      }
    }
  }

  .jus-user-card__title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    height: 40px;
    text-align: center;
  }

  .jus-user-card__actions {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .jus-user-card__actions-row {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
      width: 100%;
    }
  }
}
</style>

<style lang="scss">
.jus-user-card {
  height: fit-content;

  .el-card__body {
    .jus-user-card__wrapper {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 200px;
      width: 100%;

      .jus-user-card__avatar {
        & > span {
          font-size: 32px;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
