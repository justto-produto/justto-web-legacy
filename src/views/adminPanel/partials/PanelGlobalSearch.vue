<template>
  <article
    v-loading="isLoading"
    class="global-search"
  >
    <div class="global-search__form">
      <el-collapse v-model="collapseModel">
        <el-collapse-item name="filters">
          <template slot="title">
            Filtros personalizados:
          </template>

          <el-form
            ref="globalSearchForm"
            label-position="top"
            :model="form"
          >
            <!-- <el-form-item>
              <div class="form-item__container">
                <label for="disputeIds">Workspaces:</label>

                <el-select
                  v-model="form.workspaceIds"
                  multiple
                  placeholder="Workspaces"
                  size="mini"
                  filterable
                  default-first-option
                >
                  <el-option
                    v-for="item in workspaces"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                    <span>{{ item.name }}</span>
                    <span>{{ item.teamName }}</span>
                  </el-option>
                </el-select>
              </div>
            </el-form-item> -->

            <el-form-item>
              <div class="form-item__container">
                <label for="disputeIds">
                  <span>IDs de disputa:</span>

                  <el-tooltip
                    content="Use somente números"
                    placement="top-start"
                  >
                    <i class="el-icon-info" />
                  </el-tooltip>
                </label>

                <el-select
                  id="disputeIds"
                  :value="form.dispute.ids"
                  name="disputeIds"
                  multiple
                  placeholder="IDs:"
                  filterable
                  allow-create
                  default-first-option
                  size="mini"
                  @input="handleIDInput"
                >
                  <el-option
                    v-for="id in form.dispute.ids"
                    :key="id"
                    :label="id"
                    :value="id"
                  >
                    <span>{{ id }}</span>
                    <span>{{ `#${id}` }}</span>
                  </el-option>
                </el-select>
              </div>

              <div class="form-item__container">
                <label for="disputeCodes">Processos:</label>

                <el-select
                  id="disputeCodes"
                  v-model="form.dispute.codes"
                  name="disputeCodes"
                  multiple
                  placeholder="Processos:"
                  filterable
                  allow-create
                  default-first-option
                  size="mini"
                >
                  <el-option
                    v-for="id in form.dispute.codes"
                    :key="id"
                    :label="id"
                    :value="id"
                  />
                </el-select>
              </div>

              <div class="form-item__container">
                <label for="disputeExternalCodes">Códigos Internos:</label>

                <el-select
                  id="disputeExternalCodes"
                  v-model="form.dispute.externalCodes"
                  name="disputeExternalCodes"
                  multiple
                  placeholder="Códigos Internos:"
                  filterable
                  allow-create
                  default-first-option
                  size="mini"
                >
                  <el-option
                    v-for="id in form.dispute.externalCodes"
                    :key="id"
                    :label="id"
                    :value="id"
                  />
                </el-select>
              </div>
            </el-form-item>

            <el-form-item>
              <div class="form-item__container">
                <label for="personNames">Nome:</label>

                <el-select
                  id="personNames"
                  v-model="form.person.names"
                  name="personNames"
                  multiple
                  placeholder="Nome:"
                  filterable
                  allow-create
                  default-first-option
                  size="mini"
                >
                  <el-option
                    v-for="name in form.person.names"
                    :key="name"
                    :label="name"
                    :value="name"
                  />
                </el-select>
              </div>

              <div class="form-item__container">
                <label for="personDocument">
                  <span>CPF/CNPJ:</span>

                  <el-tooltip
                    content="Use somente números"
                    placement="top-start"
                  >
                    <i class="el-icon-info" />
                  </el-tooltip>
                </label>

                <el-select
                  id="personDocument"
                  :value="form.person.documents"
                  name="personDocument"
                  multiple
                  placeholder="CPF/CNPJ:"
                  filterable
                  allow-create
                  default-first-option
                  size="mini"
                  @input="handleDocumentNumberInput"
                >
                  <el-option
                    v-for="doc in form.person.documents"
                    :key="doc"
                    :label="doc"
                    :value="doc"
                  >
                    <span>{{ doc }}</span>
                    <span>{{ doc | cpfCnpj }}</span>
                  </el-option>
                </el-select>
              </div>
            </el-form-item>

            <el-form-item>
              <div class="form-item__container">
                <label for="personEmails">Emails:</label>

                <el-select
                  id="personEmails"
                  v-model="form.person.emails"
                  name="personEmails"
                  multiple
                  placeholder="Emails:"
                  filterable
                  allow-create
                  default-first-option
                  size="mini"
                >
                  <el-option
                    v-for="email in form.person.emails"
                    :key="email"
                    :label="email"
                    :value="email"
                  />
                </el-select>
              </div>

              <div class="form-item__container">
                <label for="personPhones">
                  <span>Telefones:</span>

                  <el-tooltip
                    content="Use somente números"
                    placement="top-start"
                  >
                    <i class="el-icon-info" />
                  </el-tooltip>
                </label>

                <el-select
                  id="personPhones"
                  :value="form.person.phones"
                  name="personPhones"
                  multiple
                  placeholder="Telefones:"
                  filterable
                  allow-create
                  default-first-option
                  size="mini"
                  @input="handlePhoneNumberInput"
                >
                  <el-option
                    v-for="phone in form.person.phones"
                    :key="phone"
                    :label="phone"
                    :value="phone"
                  >
                    <span>{{ phone }}</span>
                    <span>{{ phone | phoneNumber }}</span>
                  </el-option>
                </el-select>
              </div>

              <!-- <div class="form-item__container">
                <label for="personOabs">
                  <span>OABs:</span>

                  <el-tooltip
                    content="Use somente números e letras"
                    placement="top-start"
                  >
                    <i class="el-icon-info" />
                  </el-tooltip>
                </label>

                <el-select
                  id="personOabs"
                  :value="form.person.oabs"
                  name="personOabs"
                  multiple
                  placeholder="OABs:"
                  filterable
                  allow-create
                  default-first-option
                  size="mini"
                  @input="handleOabInput"
                >
                  <el-option
                    v-for="oab in form.person.oabs"
                    :key="oab"
                    :label="oab"
                    :value="oab"
                  >
                    <span>{{ oab }}</span>
                    <span>{{ oab | oab }}</span>
                  </el-option>
                </el-select>
              </div> -->
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="global-search__table">
      <table>
        <thead>
          <tr>
            <th>ID</th>

            <th>Processo</th>

            <th>Cód. Interno</th>

            <th>Workapace</th>

            <th>Ir para</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(dispute, index) in disputes"
            :key="`dispute-${index}`"
            class="has-dispute"
          >
            <td>{{ `#${dispute.id}` }}</td>

            <td>{{ dispute.code || '' }}</td>

            <td>{{ dispute.externalCode || '' }}</td>

            <td>{{ dispute.workspaceName || '' }}</td>

            <td class="href">
              <router-link
                :to="`/redirect?wid=${dispute.workspaceId}&did=${dispute.id}`"
              >
                <el-tooltip content="Ir para disputa">
                  <el-button
                    type="primary"
                    icon="el-icon-link"
                    size="mini"
                    circle
                  />
                </el-tooltip>
              </router-link>
            </td>
          </tr>

          <tr v-if="disputes.length === 0">
            <td
              class="empty"
              colspan="6"
            >
              Sem dados
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data: () => ({
    form: {
      workspaceIds: [],
      dispute: {
        ids: [],
        codes: [],
        externalCodes: []
      },
      person: {
        names: [],
        documents: [],
        emails: [],
        phones: [],
        oabs: []
      }
    },
    timeoutRef: null,
    isLoading: false,
    workspaces: [],
    disputes: [],
    collapseModel: ['filters']
  }),

  watch: {
    form: {
      deep: true,
      handler: 'handleSearch'
    }
  },

  beforeMount() {
    this.init()
  },

  methods: {
    ...mapActions([
      'getGlobalDisputes',
      'myWorkspace'
    ]),

    init() {
      this.isLoading = true

      this.myWorkspace().then(res => {
        this.$set(this, 'workspaces', [])
        this.$set(this, 'workspaces', (res || []).filter(({ archived }) => !archived).map(({ workspace: { id, teamName, name } }) => ({ id, teamName, name })))
      }).finally(() => { this.isLoading = false })
    },

    search() {
      this.isLoading = true

      this.getGlobalDisputes(this.form).then(({ content }) => {
        this.$set(this, 'disputes', content)
      }).catch(error => this.$jusNotify({ error })).finally(_ => {
        this.isLoading = false
      })
    },

    handleSearch() {
      clearTimeout(this.timeoutRef)

      this.timeoutRef = setTimeout(this.search, 250)
    },

    handleDocumentNumberInput(value) {
      if (value !== this.form.person.documents) {
        this.$set(this.form.person, 'documents', value.map(doc => doc.replace(/\D/g, '')))
      }
    },

    handleIDInput(value) {
      if (value !== this.form.dispute.ids) {
        this.$set(this.form.dispute, 'ids', value.map(id => id.replace(/\D/g, '')))
      }
    },

    handlePhoneNumberInput(value) {
      if (value !== this.form.person.phones) {
        this.$set(this.form.person, 'phones', value.map(phone => {
          const fPhone = phone.replace(/\D/g, '')

          return fPhone.startsWith('55') ? fPhone : `55${fPhone}`
        }))
      }
    },

    handleOabInput(value) {
      if (value !== this.form.person.oabs) {
        this.$set(this.form.person, 'oabs', value.map(oab => oab.replace(/[-/. ]/g, '')))
      }
    },

    handleCopyLink({ id, workspaceId }) {
      navigator.clipboard.writeText(`${location.origin}/#/redirect?wid=${workspaceId}&did=${id}`)

      this.$message({
        message: 'Copiado para a área de transferência.',
        type: 'info',
        center: true,
        showClose: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.global-search {
  width: 100%;
  max-width: 100;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
}
</style>

<style lang="scss">
@import '@/styles/colors.scss';
@import '@/styles/variables.scss';

.global-search {
  padding-bottom: 16px;
  overflow-y: scroll;

  .global-search__form {
    .el-collapse {
      .el-collapse-item {
        .el-collapse-item__wrap {
          border-bottom: none;

          .el-collapse-item__content {
            padding: 0;
          }
        }
      }
    }

    .el-form {
      .el-form-item {
        margin-bottom: 8px;

        .el-form-item__label {
          color: $--color-black !important;
          font-size: 14px !important;
          line-height: 14px !important;
          margin-bottom: 4px;

          display: flex;
          justify-content: center;
        }

        .el-form-item__content {
          display: flex;
          gap: 8px;

          .form-item__container {
            flex: 1;
            display: flex;
            flex-direction: column;

            label {
              color: $--color-gray !important;
              font-size: 12px !important;
              line-height: 12px !important;
            }

            .el-select {
              .el-input {
                padding-bottom: 0 !important;
              }
            }
          }
        }
      }
    }
  }

  .global-search__table {
    overflow-y: scroll;

    table {
      margin-top: 16px;
      width: 100%;
      border-collapse: collapse;

      thead {
        tr {
          th {
            text-align: left;
          }
        }
      }

      tbody {
        border-top: $--border-base !important;

        tr {
          border-bottom: $--border-base !important;

          td.empty {
            text-align: center;
            padding: 16px;
          }

          td.href {
            display: flex;
            justify-content: space-evenly;
          }

          &.has-dispute {
            td {
              padding: 12px 0;
            }
          }
        }
      }
    }
  }
}
</style>
