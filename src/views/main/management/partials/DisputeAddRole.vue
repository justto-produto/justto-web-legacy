<template lang="html">
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    title="Adicionar ator"
    width="50%">
    <el-form>
      <el-form-item label="Parte">
        <el-select v-model="newRole.party">
          <el-option
            v-for="(party, index) in roleParty"
            :key="`${index}-${party}`"
            :label="$t('fields.' + party)"
            :value="party" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="['claimantParty', 'respondentParty'].includes(newRole.party)" label="CPF/CNPJ">
        <el-input v-mask="['###.###.###-##', '##.###.###/####-##']" v-model="newRole.documentNumber" />
      </el-form-item>
      <el-row v-else :gutter="20">
        <el-col :span="18">
          <el-form-item class="oab" label="OAB" prop="oab">
            <el-input v-model="newRole.oab" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="state" label="Estado" prop="state">
            <el-select v-model="newRole.state" placeholder="">
              <el-option
              v-for="(state, index) in $store.state.statesList"
              :key="`${index}-${state}`"
              :label="state"
              :value="state" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <span slot="footer">
      <el-button plain @click="dialogVisible = false">Cancelar</el-button>
      <el-button type="primary" data-testid="confirm-edit-data" @click="">Editar dados</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'DisputeAddRole',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      newRole: {}
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    },
    roleParty: () => ['claimantParty', 'claimantLawyer', 'respondentParty', 'respondentLawyer']
  }
}
</script>

<style lang="scss">
</style>
