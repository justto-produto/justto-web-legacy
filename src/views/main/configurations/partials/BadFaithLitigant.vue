<template>
  <el-form
    label-position="top"
    class="bad-faith-litigant__form"
  >
    <el-form-item
      label="Como detectar possíveis ofensores em sua carteira?"
      class="bad-faith-litigant__form-select"
    >
      <el-select v-model="vexatiousType">
        <el-option
          v-for="type in ['QUANTITY', 'AVERAGE']"
          :key="type"
          :label="$t(`threshold.${type}`)"
          :value="type"
        />
      </el-select>
    </el-form-item>

    <el-form-item v-if="vexatiousType">
      <span slot="label">
        <span v-if="vexatiousType === 'QUANTITY'">Quantas disputas uma mesma pessoa precisa ter para ser qualificado como possível ofensor?</span>
        <span v-else>Qual percentual acima da média de disputas uma pessoa precisa ter para ser qualificado como possível ofensor?</span>
      </span>

      <div class="el-input">
        <money
          v-model="vexatiousThreshold"
          v-bind="vexatiousTypeMask"
          class="el-input__inner"
        />
      </div>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        @click.prevent="saveProperties"
      >
        Salvar
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data: () => ({
    vexatiousThreshold: '',
    vexatiousType: ''
  }),

  computed: {
    ...mapGetters({
      workspaceProperties: 'workspaceProperties'
    }),

    vexatiousTypeMask() {
      return {
        decimal: '',
        thousands: '',
        prefix: '',
        suffix: this.vexatiousType === 'AVERAGE' ? ' %' : '',
        precision: 0,
        masked: false
      }
    }
  },

  mounted() {
    this.vexatiousType = this.workspaceProperties.VEXATIOUS_TYPE
    this.vexatiousThreshold = this.workspaceProperties.VEXATIOUS_THRESHOLD
  },

  methods: {
    ...mapActions([
      'editWorkpaceProperties'
    ]),

    saveProperties() {
      const request = {}

      if (this.vexatiousThreshold && this.vexatiousType) {
        Object.assign(request, {
          VEXATIOUS_THRESHOLD: (this.vexatiousThreshold || '').toString(),
          VEXATIOUS_TYPE: (this.vexatiousType || '').toString()
        })
      }

      Promise.all([
        this.editWorkpaceProperties(request)
      ]).then(() => {
        // SEGMENT TRACK
        this.$jusSegment('Configurações da equipe alterada')
        this.$jusNotification({
          title: 'Yay!',
          message: 'Configurações da equipe alteradas com sucesso.',
          type: 'success'
        })
        this.$emit('close')
      }).catch(error => {
        this.$jusNotification({ error })
      })
    }
  }
}
</script>

<style lang="scss">
.bad-faith-litigant__form {
  .el-form-item:last-child {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
