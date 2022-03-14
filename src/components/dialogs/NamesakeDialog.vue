<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="isVisible"
    append-to-body
    custom-class="namesake-dialog"
    title="Tratar homônimo"
    width="70%"
  >
    <p class="namesake-dialog__subtitle">
      Selecione um dos registros abaixo para correção de homônimo e enriquecimento da parte.
    </p>

    <div
      v-loading="isLoading"
      class="namesake-dialog__namesake"
    >
      <div class="namesake-dialog__namesake-filters">
        <div class="namesake-dialog__namesake-filters-city">
          <label for="namesakeFilterCitySelect">Cidade:</label>
          <el-select
            id="namesakeFilterCitySelect"
            v-model="cityFilter"
            size="small"
            clearable
            filterable
            default-first-option
            placeholder="Selecione uma cidade"
          >
            <el-option
              v-for="city in cityList"
              :key="city"
              :label="city"
              :value="city"
            />
          </el-select>
        </div>

        <div class="namesake-dialog__namesake-filters-uf">
          <label>UF:</label>

          <el-select
            v-model="ufFilter"
            size="small"
            clearable
            filterable
            default-first-option
            placeholder="Selecione uma UF"
          >
            <el-option
              v-for="uf in ufList"
              :key="uf"
              :label="uf"
              :value="uf"
            />
          </el-select>
        </div>
      </div>

      <el-table
        :data="filteredNamesakeList"
        class="namesake-dialog__namesake-table"
        highlight-current-row
        style="width: 100%"
        @current-change="handleCurrentChange"
      >
        <el-table-column
          label="Nome"
          prop="name"
        />
        <el-table-column
          label="Documento"
          prop="document"
          width="160px"
        >
          <div slot-scope="scope">
            {{ scope.row.document | cpfCnpj }}
          </div>
        </el-table-column>
        <el-table-column
          label="Cidade"
          prop="city"
        />
        <el-table-column
          label="UF"
          prop="uf"
          width="70px"
        />
        <el-table-column
          label="Nascimento"
          prop="dateOfBirth"
          width="140px"
        />
      </el-table>
    </div>

    <span slot="footer">
      <el-button
        :disabled="isLoading"
        plain
        @click="closeNamesakes"
      >Cancelar</el-button>
      <el-button
        :loading="isLoading"
        :disabled="!selectedNamesake"
        type="primary"
        @click="selectNamesake"
      >Tratar</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data: () => ({
    ufFilter: null,
    cityFilter: null,
    visible: false,
    currentName: '',
    isLoading: false,
    namesakeList: [],
    currentPersonId: null,
    selectedNamesake: null
  }),

  computed: {
    isVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.visible = value
      }
    },

    filteredNamesakeList() {
      if (this.ufFilter && this.cityFilter) {
        return this.namesakeList.filter(namesake => namesake.uf === this.ufFilter && namesake.city === this.cityFilter)
      } else if (this.ufFilter) {
        return this.namesakeList.filter(namesake => namesake.uf === this.ufFilter)
      } else if (this.cityFilter) {
        return this.namesakeList.filter(namesake => namesake.city === this.cityFilter)
      } else {
        return this.namesakeList || []
      }
    },

    ufList() {
      const ufList = this.filteredNamesakeList.map(namesake => namesake.uf)
      return ufList.filter((uf, i) => uf !== null && ufList.indexOf(uf) === i)
    },

    cityList() {
      const cityList = this.filteredNamesakeList.map(namesake => namesake.city)
      return cityList.filter((city, i) => city !== null && cityList.indexOf(city) === i)
    }
  },

  methods: {
    ...mapActions([
      'setNamesakeTicketOptions',
      'searchNamesakeTicketOptions'
    ]),

    show(name, personId) {
      this.currentPersonId = personId
      this.currentName = name

      this.getNamesakeNamesList()
    },

    getNamesakeNamesList() {
      this.isLoading = true
      this.isVisible = true
      this.searchNamesakeTicketOptions(this.currentName).then(response => {
        this.namesakeList = response
      }).catch(error => {
        this.isVisible = false
        this.$jusNotification({ error })
      }).finally(() => {
        this.isLoading = false
      })
    },

    closeNamesakes(_event) {
      this.isVisible = false

      this.currentPersonId = null
      this.selectedNamesake = null
      this.ufFilter = null
      this.cityFilter = null
      this.currentName = ''
      this.namesakeList = []
      this.isLoading = false
    },

    selectNamesake(_event) {
      if (this.selectedNamesake) {
        this.namesakeDialogLoading = true
        const data = {
          personId: this.currentPersonId,
          document: this.selectedNamesake.document,
          disputeId: this.$route.params.id
        }

        this.setNamesakeTicketOptions(data).then(() => {
          this.$emit('resolved', data)

          this.closeNamesakes(null)

          this.$jusNotification({
            title: 'Yay!',
            message: 'Homônimo enviado para tratamento com sucesso.',
            type: 'success'
          })
        }).catch(error => {
          this.$jusNotification({ error })
        })
      }
    },

    handleCurrentChange(namesake) {
      if (namesake) {
        this.selectedNamesake = namesake
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.namesake-dialog {
  .el-dialog__body {
    .namesake-dialog__namesake {
      .namesake-dialog__namesake-selected {
        margin: 8px 0;
      }

      .namesake-dialog__namesake-filters {
        display: flex;
        gap: 16px;

        .namesake-dialog__namesake-filters-city {
          width: 60%;

          label {
            font-weight: 600;
            color: $--color-text-secondary
          }

          .el-select {
            width: 100%;
          }
        }

        .namesake-dialog__namesake-filters-uf {
          width: 40%;

          label {
            font-weight: 600;
            color: $--color-text-secondary;
          }

          .el-select {
            width: 100%;
          }
        }
      }

      .namesake-dialog__namesake-table {
        margin-top: 8px;

        .el-table__body-wrapper {
          .el-table__body {
            tbody {
              .el-table__row {
                cursor: pointer;
              }

              .current-row {
                td {
                  .cell {
                    font-weight: bold;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
