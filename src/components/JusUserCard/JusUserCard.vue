<template>
  <el-card
    shadow="hover"
    class="jus-user-card"
  >
    <div
      slot="header"
      class="jus-user-card__header"
    >
      <div>
        <i
          class="el-icon-close jus-user-card__icon jus-user-card__icon--danger"
          @click="emitCloseEvent"
        />

        <i
          class="el-icon-edit jus-user-card__icon jus-user-card__icon--info"
          @click="emitEditEvent"
        />
      </div>

      <div>
        <el-tooltip content="Contrato">
          <el-tag
            :type="contractStatus.type"
            effect="dark"
            size="small"
          >
            {{ contractStatus.label }}
          </el-tag>
        </el-tooltip>
      </div>
    </div>

    <div class="jus-user-card__wrapper">
      <jus-avatar-user
        :name="userDataBind.name"
        size="lg"
        shape="circle"
        class="jus-user-card__avatar"
      />

      <JusTextEditable
        :value="userDataBind.name"
        class="jus-user-card__title"
        @hasEdition="emitEditTitle"
      />

      <div class="jus-user-card__actions">
        <el-button
          type="primary"
          @click.native="emitSeeMore"
        >
          Ver mais
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'JusUserCard',
  components: {
    JusTextEditable: () => import('@/components/JusTextEditable/JusTextEditable'),
  },
  props: {
    userData: {
      type: Object,
      required: true,
      validator: obj => Object.keys(obj)
        .map(key => ['name', 'id', 'contractStatus'].includes(key)),
    },
  },
  data() {
    return {
      userDataBind: this.userData,
    }
  },
  computed: {
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
    },
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
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.jus-user-card {
  cursor: pointer;

  .jus-user-card__header {
    align-items: center;
    display: flex;
    justify-content: space-between;
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
    display: block;
    font-weight: 700;
    text-align: center;
    margin: 16px 0;
  }

  .jus-user-card__actions {
    align-items: center;
    display: flex;
    justify-content: center;

    .jus-user-card__button {
      margin-right: 16px;

      &:last-child {
        margin-right: 0;
      }
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
      height: 100%;
      justify-content: space-between;
      min-height: 250px;
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
