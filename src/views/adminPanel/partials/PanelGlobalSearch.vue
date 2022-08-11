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
            <el-form-item>
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
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: right; color: #8492a6; font-size: 12px">{{ item.teamName }}</span>
                  </el-option>
                </el-select>
              </div>
            </el-form-item>

            <el-form-item>
              <div class="form-item__container">
                <label for="disputeIds">IDs de disputa:</label>

                <el-select
                  id="disputeIds"
                  v-model="form.dispute.ids"
                  name="disputeIds"
                  multiple
                  placeholder="IDs:"
                  filterable
                  allow-create
                  default-first-option
                  size="mini"
                >
                  <el-option
                    v-for="id in form.dispute.ids"
                    :key="id"
                    :label="id"
                    :value="id"
                  >
                    <span style="float: left">{{ id }}</span>
                    <span style="float: right; color: #8492a6; font-size: 12px">{{ `#${id}` }}</span>
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
                <label for="personDocument">CPF/CNPJ:</label>

                <el-select
                  id="personDocument"
                  v-model="form.person.documents"
                  name="personDocument"
                  multiple
                  placeholder="CPF/CNPJ:"
                  filterable
                  allow-create
                  default-first-option
                  size="mini"
                >
                  <el-option
                    v-for="doc in form.person.documents"
                    :key="doc"
                    :label="doc"
                    :value="doc"
                  />
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
                <label for="personPhones">Telefones:</label>

                <el-select
                  id="personPhones"
                  v-model="form.person.phones"
                  name="personPhones"
                  multiple
                  placeholder="Telefones:"
                  filterable
                  allow-create
                  default-first-option
                  size="mini"
                >
                  <el-option
                    v-for="phone in form.person.phones"
                    :key="phone"
                    :label="phone"
                    :value="phone"
                  />
                </el-select>
              </div>

              <div class="form-item__container">
                <label for="personOabs">OABs:</label>

                <el-select
                  id="personOabs"
                  v-model="form.person.oabs"
                  name="personOabs"
                  multiple
                  placeholder="OABs:"
                  filterable
                  allow-create
                  default-first-option
                  size="mini"
                >
                  <el-option
                    v-for="oab in form.person.oabs"
                    :key="oab"
                    :label="oab"
                    :value="oab"
                  />
                </el-select>
              </div>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="global-search__table">
      Disputas:
      {{ disputes }}
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
      this.getGlobalDisputes(this.form).then(({ content }) => {
        this.$set(this, 'disputes', content)
      }).catch(error => this.$jusNotify({ error }))
    },

    handleSearch() {
      clearTimeout(this.timeoutRef)

      this.timeoutRef = setTimeout(this.search, 250)
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

.global-search {
  .global-search__form {
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
}
</style>
