<template>
  <article class="unknow-party-container">
    <span class="unknow-party-container__header">
      Cadastrar como:
    </span>

    <div class="unknow-party-container__body">
      <el-select
        v-model="partyRole"
        placeholder="Escolher polaridade"
        size="mini"
      >
        <el-option
          v-for="(item, index) in options"
          :key="`item#${index}`"
          :label="item.label | capitalize"
          :value="item.value"
        />
      </el-select>

      <el-button
        :disabled="!partyRole"
        type="primary"
        size="mini"
        icon="el-icon-edit"
        round
      />
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    partyRole: ''
  }),

  computed: {
    ...mapGetters({ isRecovery: 'isWorkspaceRecovery' }),

    options() {
      return [
        // {
        //   value: 'RESPONDENT',
        //   label: this.$tc('roles.LAWYER.RESPONDENT', this.isRecovery)
        // },
        {
          value: 'CLAIMANT',
          label: this.$tc('roles.LAWYER.CLAIMANT', this.isRecovery)
        }
      ]
    },

    log: {
      get() { return this.value },
      set(value) { this.$emit('input', value) }
    }
  }
}
</script>

<style lang="scss" scoped>
  .unknow-party-container {
    margin: 8px 0 0;
    display: flex;
    gap: 4px;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .unknow-party-container__body {
      display: flex;
      gap: 8px;
    }
  }
</style>

<style lang="scss">
  .unknow-party-container {
    .unknow-party-container__body {
      .el-select {
        .el-input {
          overflow: hidden;
        }
      }
    }
  }
</style>
