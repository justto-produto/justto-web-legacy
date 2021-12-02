<template>
  <div class="dispute-overview-view">
    <h2
      class="dispute-overview-view__title"
      data-testid="dispute-id"
    >
      Disputa #{{ dispute.id }}
      <el-tooltip content="Excluir disputa">
        <el-button
          type="danger"
          plain
          data-testid="remove"
          class="right"
          size="mini"
          icon="el-icon-delete"
          @click="openRemoveDisputeDialog()"
        />
      </el-tooltip>

      <span class="dispute-overview-view__subtitle">
        <dispute-code-link
          v-if="dispute && !!dispute.code"
          :code="dispute.code"
          :custom-style="{ fontSize: '14x', fontWeight: 'normal', color: '#979797d'}"
          :custom-icon-style="{ paddingRight: '8px' }"
          @openTimeline="openTimelineModal"
        />
      </span>
    </h2>

    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="chooseDeleteDialogVisible"
      title="Excluir disputa"
      width="460px"
    >
      <div class="el-message-box__content">
        <div class="el-message-box__container">
          <div class="el-message-box__status el-icon-warning" />
          <div class="el-message-box__message">
            <p>Tem certeza que deseja excluir esta disputa? Esta ação é irreversível.</p>
          </div>
        </div>
      </div>
      <el-select
        v-model="deleteType"
        style="margin: 10px 0px;"
        placeholder="Escolha o motivo da exclusão"
      >
        <el-option
          v-for="(type, index) in deleteTypes"
          :key="index"
          :label="type"
          :value="index"
        />
      </el-select>
      <span slot="footer">
        <el-button
          :disabled="modalLoading"
          plain
          @click="chooseDeleteDialogVisible = false"
        >
          Cancelar
        </el-button>
        <el-button
          :loading="modalLoading"
          :disabled="!deleteType"
          type="primary"
          @click.prevent="deleteDispute()"
        >
          Excluir
        </el-button>
      </span>
    </el-dialog>

    <div
      v-loading="loading || linkBankAccountLoading"
      class="dispute-overview-view__loading"
    >
      <el-tabs
        v-model="overviewTab"
        class="dispute-overview-view__tabs"
        stretch
      >
        <!-- INFORMAÇÕES GERAIS -->
        <el-tab-pane
          name="general"
          class="dispute-overview-view__tabs-content"
        >
          <span slot="label">
            <el-tooltip content="Informações gerais">
              <i class="el-icon-info" />
            </el-tooltip>
          </span>

          <general-info-tab
            :dispute="dispute"
            @openDispute="openDisputeDialog"
            @openTimeline="openTimelineModal"
          />
        </el-tab-pane>

        <!-- PARTES DA DISPUTA -->
        <el-tab-pane
          name="roles"
          class="dispute-overview-view__tabs-content"
        >
          <span slot="label">
            <el-tooltip content="Partes da disputa">
              <i class="el-icon-user-solid" />
            </el-tooltip>
          </span>

          <roles-tab
            :dispute="dispute"
            :role.sync="selectedRole"
            :phone-selected.sync="selectedPhone"
            :show-remove-lawyer.sync="chooseRemoveLawyerDialogVisible"
            :editing-role.sync="isEditingRole"
            :deleting-lawyer="deletingLawyer"
            :dispute-roles-sort="disputeRolesSort"
            :namesake-processing="namesakeProcessing"
            :namesake-button-loading="namesakeButtonLoading"
            @newRole="newRoleDialogVisible = $event"
            @removeRole="removeRole"
            @removeLawyer="removeLawyer"
            @handleChange="handleChange"
            @openRoleDialog="openRoleDialog"
            @handleEditRule="handleEditRule"
            @messageToNegotiator="sendMessageToNegotiator"
            @updateDisputeRole="updateDisputeRole($event.activeRole, $event.messageType)"
            @handleNamesake="namesakeDialog"
            @update:bankAccounts="updateDisputeBankAccounts"
          />
        </el-tab-pane>

        <el-tab-pane
          name="properties"
          class="dispute-overview-view__tabs-content"
        >
          <span slot="label">
            <el-tooltip content="Propriedades adicionais">
              <i class="el-icon-s-tools" />
            </el-tooltip>
          </span>

          <DisputeProperties />
        </el-tab-pane>

        <el-tab-pane
          name="attachments"
          class="dispute-overview-view__attachment-tab"
        >
          <span slot="label">
            <el-tooltip content="Anexos">
              <i class="el-icon-paperclip" />
            </el-tooltip>
          </span>

          <DisputeAttachments
            :is-accepted="isAccepted"
            :dispute-id="dispute.id"
          />
        </el-tab-pane>
      </el-tabs>

      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="namesakeDialogVisible"
        title="Tratar homônimo"
        width="70%"
      >
        <p>Selecione um dos registros abaixo para correção de homônimo e enriquecimento da parte.</p>
        <div v-loading="namesakeDialogLoading">
          <div v-show="selectedNamesake">
            <p>Pessoa selecionada:</p>
            <div v-show="selectedNamesake.name">
              Nome: <b>{{ selectedNamesake.name }}</b>
            </div>
            <div v-show="selectedNamesake.document">
              Documento: <b>{{ selectedNamesake.document | cpfCnpj }}</b>
            </div>
            <div v-show="selectedNamesake.city">
              Cidade: <b>{{ selectedNamesake.city }}</b>
            </div>
            <div v-show="selectedNamesake.uf">
              UF: <b>{{ selectedNamesake.uf }}</b>
            </div>
            <div v-show="selectedNamesake.dateOfBirth">
              Nascimento: <b>{{ selectedNamesake.dateOfBirth | moment('DD/MM/YYYY') }}</b>
            </div>
          </div>
          <div class="dispute-overview-view__namesake-filters">
            <div class="dispute-overview-view__namesake-filter">
              <span>Cidade: </span>
              <el-select
                v-model="cityFilter"
                clearable
                filterable
                default-first-option
              >
                <el-option
                  v-for="city in cityList"
                  :key="city"
                  :label="city"
                  :value="city"
                />
              </el-select>
            </div>
            <div class="dispute-overview-view__namesake-filter">
              <span>UF: </span>
              <el-select
                v-model="ufFilter"
                clearable
                filterable
                default-first-option
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
            class="dispute-overview-view__namesake-table"
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
            :disabled="namesakeDialogLoading"
            plain
            @click="closeNamesakes"
          >Cancelar</el-button>
          <el-button
            :loading="namesakeDialogLoading"
            :disabled="!selectedNamesake"
            type="primary"
            @click="selectNamesake()"
          >Tratar</el-button>
        </span>
      </el-dialog>

      <!-- Edição de disputa -->
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="editDisputeDialogVisible"
        title="Editar disputa"
        width="70%"
      >
        <el-form
          ref="disputeForm"
          v-loading="editDisputeDialogLoading"
          :model="disputeForm"
          :rules="disputeFormRules"
          label-position="top"
          @submit.native.prevent="editDispute"
        >
          <h3>Detalhes da Disputa</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="Número do Processo"
                prop="disputeCode"
              >
                <el-input
                  v-model="disputeForm.disputeCode"
                  v-mask="['XXXXXXX-XX.XXXX.X.XX.XXXX', 'XXXXXXX-XX.XXXX.X.XX.XXXXX']"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Código interno"
                prop="externalId"
              >
                <el-input v-model="disputeForm.externalId" />
              </el-form-item>
            </el-col>
          </el-row>
          <h3>Engajamento</h3>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item
                label="Estratégia"
                prop="disputeStrategy"
              >
                <el-select
                  v-model="selectedStrategyId"
                  placeholder="Escolha a nova estratégia"
                  filterable
                  data-testid="strategy-input"
                >
                  <el-option
                    v-for="(strategy, index) in strategies"
                    :key="`${strategy.id}-${index}`"
                    :label="strategy.name"
                    :value="strategy.id"
                    :disabled="strategy.disabled || false"
                  />
                  <el-option
                    v-if="!isValidStrategie"
                    :value="dispute.strategyId"
                    label="A estratégia utilizada não está mais disponível para uso"
                    selected
                    disabled
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col
              :span="24"
              class="dispute-overview-view__select-switch"
            >
              <div class="content">
                <div>Sempre engajar o autor</div>
                <p>Deixando <b>selecionada</b> esta opção, <b>sempre</b> iremos enviar mensagens automáticas para o autor.</p>
              </div>
              <el-switch
                v-model="disputeForm.alwaysContactParty"
                @input="$forceUpdate()"
              />
            </el-col>
            <el-tooltip
              content="Sempre engaja autor está habilitado"
              :disabled="!disputeForm.alwaysContactParty"
            >
              <el-col
                :span="24"
                :style="disputeForm.alwaysContactParty ? 'cursor: not-allowed' : ''"
                class="dispute-overview-view__select-switch"
              >
                <div class="content">
                  <div>Engajar autor se não tiver advogado</div>
                  <p>
                    Deixando <b>selecionada</b> esta opção, iremos enviar mensagens para o autor quando não houver advogado constituído.
                  </p>
                </div>
                <el-switch
                  v-model="disputeForm.contactPartyWhenNoLowyer"
                  :disabled="disputeForm.alwaysContactParty"
                />
              </el-col>
            </el-tooltip>
            <el-tooltip
              content="Sempre engaja autor está habilitado"
              :disabled="!disputeForm.alwaysContactParty"
            >
              <el-col
                :span="24"
                :style="disputeForm.alwaysContactParty ? 'cursor: not-allowed' : ''"
                class="dispute-overview-view__select-switch"
              >
                <div class="content">
                  <div>Engajar autor se advogado não possuir contatos válidos para ser engajado</div>
                  <p>
                    Deixando <b>selecionada</b> esta opção, iremos enviar mensagens para o autor se o <b>advogado não possuir dados válidos</b> para ser contatado.
                  </p>
                </div>
                <el-switch
                  v-model="disputeForm.contactPartyWhenInvalidLowyer"
                  :disabled="disputeForm.alwaysContactParty"
                />
              </el-col>
            </el-tooltip>
          </el-row>
          <h3>Valor proposto</h3>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item
                :rules="validateLastOfferValue"
                label="Valor"
                prop="lastOfferValue"
              >
                <el-tooltip
                  :content="`${$tc('UPPER_RANGE', isRecoveryStrategy)} zerad${isRecoveryStrategy ? 'o' : 'a'}. Coloque um${isRecoveryStrategy ? '' : 'a'} ${$tc('UPPER_RANGE', isRecoveryStrategy)} para poder alterar o valor proposto.`"
                  :disabled="!!disputeForm.disputeUpperRange"
                >
                  <div
                    class="el-input"
                    :class="{ 'is-disabled': !disputeForm.disputeUpperRange }"
                  >
                    <money
                      v-model="disputeForm.lastOfferValue"
                      :disabled="!disputeForm.disputeUpperRange"
                      class="el-input__inner"
                      data-testid="proposal-value-input"
                      @change.native="lastOfferValueHasChanged = true"
                    />
                  </div>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item
                label="Proposto por"
                prop="lastOfferValueName"
              >
                <el-select
                  v-model="selectedNegotiatorId"
                  :disabled="!disputeForm.disputeUpperRange"
                  filterable
                  placeholder="Autor da contraproposta"
                  data-testid="proposal-negotiator-input"
                >
                  <el-option
                    v-for="(negotiator, index) in disputeNegotiations"
                    :key="`${index}-${negotiator.id}`"
                    :label="negotiator.name"
                    :value="negotiator.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <h3>Outras configurações</h3>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item
                :rules="validateDisputeUpperRange"
                :label="$tc('UPPER_RANGE', isRecoveryStrategy)"
                prop="disputeUpperRange"
              >
                <money
                  v-model="disputeForm.disputeUpperRange"
                  class="el-input__inner"
                  data-testid="bondary-input"
                  @blur.native="checkZeroUpperRange"
                  @change.native="disputeUpperRangeChangedHandler"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="Fim da negociação"
                prop="expirationDate"
              >
                <el-date-picker
                  v-model="disputeForm.expirationDate"
                  :clearable="false"
                  data-testid="expiration-date-input"
                  format="dd/MM/yyyy"
                  type="date"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Classificação"
                prop="classification"
              >
                <el-input v-model="disputeForm.classification" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="Dano material"
                prop="materialDamage"
              >
                <money
                  v-model="disputeForm.materialDamage"
                  class="el-input__inner"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="Dano moral"
                prop="moralDamage"
              >
                <money
                  v-model="disputeForm.moralDamage"
                  class="el-input__inner"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="Valor do processo"
                prop="requestedValue"
              >
                <money
                  v-model="disputeForm.requestedValue"
                  class="el-input__inner"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="Valor provisionado"
                prop="provisionedValue"
              >
                <money
                  v-model="disputeForm.provisionedValue"
                  class="el-input__inner"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="Descrição"
                prop="description"
              >
                <el-input
                  v-model="disputeForm.description"
                  type="textarea"
                  rows="3"
                  data-testid="description-input"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer">
          <el-button
            plain
            @click="editDisputeDialogVisible = false"
          >Cancelar</el-button>
          <el-button
            :loading="editDisputeDialogLoading"
            type="primary"
            data-testid="confirm-edit-data"
            @click="editDispute()"
          >Editar dados</el-button>
        </span>
      </el-dialog>

      <!-- Edição de parte -->
      <edit-role-dialog
        ref="editRoleForm"
        :form.sync="roleForm"
        :visible.sync="editRoleDialogVisible"
        :has-error.sync="editRoleDialogError"
        :erros.sync="editRoleDialogErrorList"
        :loading.sync="editRoleDialogLoading"
        :rules.sync="roleRules"
        :has-changed.sync="documentNumberHasChanged"
        @edit="editRole"
        @addBankAccount="openAddBankDialog"
        @addOab="addOab"
        @removeBankData="removeBankData(...$event)"
      />

      <!-- Adição de conta bancária -->
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="addBankDialogVisible"
        title="Adicionar conta bancária"
        width="40%"
      >
        <el-form
          ref="addBankForm"
          :model="addBankForm"
          :rules="addBankRules"
          label-position="top"
          @submit.native.prevent
        >
          <el-form-item
            label="Nome"
            prop="name"
          >
            <el-input v-model="addBankForm.name" />
          </el-form-item>
          <el-form-item
            label="Email"
            prop="email"
          >
            <el-input v-model="addBankForm.email" />
          </el-form-item>
          <el-form-item
            label="CPF ou CNPJ"
            prop="document"
          >
            <el-input
              v-model="addBankForm.document"
              v-mask="['###.###.###-##', '##.###.###/####-##']"
            />
          </el-form-item>
          <el-form-item
            label="Banco"
            prop="bank"
          >
            <el-select
              v-model="addBankForm.bank"
              filterable
              placeholder=""
            >
              <el-option
                v-for="bank in banks"
                :key="bank.code"
                :label="bank.code + ' - ' + bank.name"
                :value="bank.code + ' - ' + bank.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="Agência"
            prop="agency"
          >
            <el-input v-model="addBankForm.agency" />
          </el-form-item>
          <el-form-item
            label="Número do Conta"
            prop="number"
          >
            <el-input v-model="addBankForm.number" />
          </el-form-item>
          <el-form-item
            label="Tipo de Conta"
            prop="type"
          >
            <el-select
              v-model="addBankForm.type"
              placeholder=""
              class="select"
            >
              <el-option
                v-for="type in [{ label: 'Poupança', type: 'SAVING' },{ label: 'Corrente', type: 'CHECKING' }]"
                :key="type.type"
                :label="type.label"
                :value="type.type"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button
            plain
            @click="addBankDialogVisible = false"
          >Cancelar</el-button>
          <el-button
            type="primary"
            @click="addBankData()"
          >Adicionar</el-button>
        </span>
      </el-dialog>

      <dispute-add-role
        :visible.sync="newRoleDialogVisible"
        :dispute-id="dispute.id"
        :document-numbers="documentNumbers"
        :oabs="oabs"
      />

      <jus-timeline
        v-if="disputeTimelineModal"
        v-model="disputeTimelineModal"
        :code="dispute.code"
        @update:contact="restartEngagementFromTimeline"
      />

      <associate-contacts-modal
        v-model="showAssociateContacts"
        :current="dispute && dispute.properties && dispute.properties['CONTATOS ASSOCIADOS'] ? dispute.properties['CONTATOS ASSOCIADOS'] : false"
        :parties="dispute.disputeRoles"
        :metadata="disputeMetadata"
        @update:contacts="tryRestartEngagementAssociateContact"
      />
    </div>
  </div>
</template>

<script>
import { getRoles, buildRoleTitle } from '@/utils'
import { validateName, validateDocument, validatePhone, validateZero } from '@/utils/validations'
import { mapGetters, mapActions } from 'vuex'

import restartEngagement from '@/utils/mixins/restartEngagement'
import _ from 'lodash'

export default {
  name: 'DisputeOverview',

  components: {
    DisputeAttachments: () => import('./sections/DisputeAttachments'),
    DisputeAddRole: () => import('../DisputeAddRole'),
    DisputeCodeLink: () => import('@/components/buttons/DisputeCodeLink'),
    DisputeProperties: () => import('../DisputeProperties'),
    JusTimeline: () => import('@/components/JusTimeline/JusTimeline'),
    AssociateContactsModal: () => import('@/components/dialogs/AssociateContactsModal'),
    GeneralInfoTab: () => import('./sections/GeneralInfoTab'),
    RolesTab: () => import('./sections/RolesTab'),
    EditRoleDialog: () => import('./dialogs/EditRoleDialog')
  },

  mixins: [restartEngagement],

  props: {
    loading: {
      default: false,
      type: Boolean
    },
    activeRoleId: {
      default: 0,
      type: Number
    }
  },

  data() {
    return {
      isEditingRole: false,
      disputeTimelineModal: false,
      overviewTab: 'general',
      namesakeList: [],
      namesakeDialogVisible: false,
      namesakeDialogLoading: false,
      namesakeButtonLoading: false,
      namesakeProcessing: false,
      deletingLawyer: { name: '' },
      deleteType: '',
      deleteTypes: [],
      modalLoading: false,
      selectedNamesake: '',
      selectedNamesakePersonId: '',
      selectedClaimantId: '',
      selectedNegotiatorId: '',
      selectedStrategyId: '',
      selectedPhone: 0,
      attachmentFilterTerm: '',
      disputeForm: {
        description: '',
        expirationDate: '',
        disputeUpperRange: '',
        lastOfferValue: '',
        classification: '',
        contactPartyWhenNoLowyer: false,
        contactPartyWhenInvalidLowyer: false,
        denySavingDeposit: false,
        disputeCode: '',
        zeroUpperRange: false,
        materialDamage: '',
        moralDamage: '',
        requestedValue: '',
        externalId: '',
        provisionedValue: ''
      },
      disputeFormRules: {
        disputeUpperRange: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        lastOfferValue: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      },
      roleForm: {
        personProperties: {}
      },
      originalRole: {},
      roleRules: {
        name: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validateName, message: 'Nome precisa conter mais de 3 caracteres', trigger: 'blur' }
        ],
        phone: [
          { required: false, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validatePhone, message: 'Telefone inválido', trigger: 'submit' }
        ],
        email: [
          { required: false, message: 'Campo obrigatório', trigger: 'submit' },
          { type: 'email', message: 'E-mail inválido', trigger: 'submit' }
        ],
        oab: [{ required: false, message: 'Campo obrigatório', trigger: 'submit' }],
        state: [{ required: false, message: 'Campo obrigatório', trigger: 'submit' }]
      },
      newRoleDialogVisible: false,
      linkBankAccountLoading: false,
      editDisputeDialogVisible: false,
      editDisputeDialogLoading: false,
      editRoleDialogVisible: false,
      editRoleDialogLoading: false,
      editRoleDialogError: false,
      editRoleDialogErrorList: [],
      chooseRemoveLawyerDialogVisible: false,
      chooseDeleteDialogVisible: false,
      descriptionCollapse: true,
      addBankDialogVisible: false,
      addBankForm: {
        name: '',
        email: '',
        document: '',
        bank: '',
        agency: '',
        number: '',
        type: ''
      },
      addBankRules: {
        name: [
          { required: false, message: 'Campo obrigatório', trigger: 'submit' }
        ],
        email: [
          { type: 'email', required: false, message: 'Insira um e-mail válido', trigger: 'submit' }
        ],
        document: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validateDocument, message: 'CPF/CNPJ inválido.', trigger: 'submit' }
        ],
        bank: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        agency: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        number: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        type: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      },
      bankAccountIdstoUnlink: [],
      documentNumberHasChanged: false,
      disputeUpperRangeHasChanged: false,
      lastOfferValueHasChanged: false,
      cityFilter: null,
      ufFilter: null,
      tempRole: {}
    }
  },

  computed: {
    ...mapGetters({
      disputeStatuses: 'disputeStatuses',
      searchedLawyers: 'searchedLawyers',
      searchLawyersLoading: 'searchLawyersLoading',
      disputeMetadata: 'disputeMetadata',
      dispute: 'dispute',
      strategies: 'getMyStrategiesLite',
      isRecoveryStrategy: 'isWorkspaceRecovery'
    }),

    dispuesToUnknownParties() {
      return [
        {
          value: { party: 'RESPONDENT' },
          label: this.$tc('PARTY_RESPONDENT', this.isRecoveryStrategy)
        },
        {
          value: { party: 'CLAIMANT' },
          label: this.$tc('fields.claimantParty', this.isRecoveryStrategy)
        }
      ]
    },

    ufList() {
      const ufList = this.namesakeList.map(namesake => namesake.uf)
      return ufList.filter((uf, i) => uf !== null && ufList.indexOf(uf) === i)
    },

    cityList() {
      const cityList = this.namesakeList.map(namesake => namesake.city)
      return cityList.filter((city, i) => city !== null && cityList.indexOf(city) === i)
    },

    filteredNamesakeList() {
      if (this.ufFilter && this.cityFilter) {
        return this.namesakeList.filter(namesake => namesake.uf === this.ufFilter && namesake.city === this.cityFilter)
      } else if (this.ufFilter) {
        return this.namesakeList.filter(namesake => namesake.uf === this.ufFilter)
      } else if (this.cityFilter) {
        return this.namesakeList.filter(namesake => namesake.city === this.cityFilter)
      } else {
        return this.namesakeList
      }
    },

    validateDisputeUpperRange() {
      if (this.disputeUpperRangeHasChanged) {
        return [{ validator: validateZero, message: 'Valor precisa ser acima de 0', trigger: 'submit' }]
      }
      return []
    },

    validateLastOfferValue() {
      if (this.lastOfferValueHasChanged && this.disputeForm.disputeUpperRange) {
        return [{ validator: validateZero, message: 'Valor precisa ser acima de 0', trigger: 'submit' }]
      }
      return []
    },

    disputeBankAccountsIds: {
      get() {
        if (this.dispute.bankAccounts || Array.isArray(this.dispute.bankAccounts)) {
          return this.dispute.bankAccounts.map(dba => dba.id)
        }
        return []
      },
      set(bankAccountIds) {
        this.updateDisputeBankAccounts(bankAccountIds)
      }
    },

    selectedRole: {
      get() { return this.activeRoleId },
      set(newSelectedRole) { this.$emit('update:activeRoleId', newSelectedRole || 0) }
    },

    isValidStrategie() {
      return (this.strategies || []).map(s => s.id).includes(this.dispute.strategyId)
    },

    disputeRolesSort() {
      if (this.dispute.disputeRoles) {
        let sortedArray = this.dispute.disputeRoles.slice(0) || []
        sortedArray = sortedArray.filter(a => a.party !== 'IMPARTIAL')
        sortedArray = sortedArray.filter(dr => {
          if (!dr.main && dr.party === 'RESPONDENT') return false
          if (dr.archived) return false
          return true
        })
        return sortedArray.sort((a, b) => {
          if (a.party === b.party) {
            return (a.roles[0] > b.roles[0]) ? -1 : (a.roles[0] < b.roles[0]) ? 1 : 0
          } else {
            return (a.party < b.party) ? -1 : 1
          }
        })
      } return []
    },

    documentNumbers() {
      if (this.disputeRolesSort && this.disputeRolesSort.length) {
        return this.disputeRolesSort.map(role => {
          if (role.documentNumber) return role.documentNumber
        }).filter(role => !!role)
      }
      return []
    },

    oabs() {
      if (this.disputeRolesSort && this.disputeRolesSort.length) {
        const oabs = []
        this.disputeRolesSort.map(role => {
          if (role.oabs && role.oabs.length) {
            role.oabs.filter(({ archived }) => !archived).map(oab => oabs.push(oab.number + oab.state))
          }
        })
        return oabs
      }
      return []
    },

    disputeClaimants() {
      if (this.dispute && this.dispute.disputeRoles) {
        return getRoles(this.dispute.disputeRoles, 'CLAIMANT')
      }
      return []
    },

    disputeNegotiations() {
      if (this.dispute && this.dispute.disputeRoles) {
        return getRoles(this.dispute.disputeRoles, 'RESPONDENT', 'NEGOTIATOR')
      }
      return []
    },

    banks() {
      return this.$store.getters.banksList
    },

    isAccepted() {
      return this.dispute ? ['CHECKOUT', 'ACCEPTED', 'SETTLED', 'UNSETTLED'].includes(this.dispute.status) : false
    },

    showAssociateContacts: {
      get() {
        const condition = (
          this.dispute &&
          ['IMPORTED', 'ENGAGEMENT', 'PENDING'].includes(this.dispute.status) &&
          this.dispute.properties &&
          (
            !Object.keys(this.dispute.properties).includes('CONTATOS ASSOCIADOS') ||
            ['NAO'].includes(this.dispute.properties['CONTATOS ASSOCIADOS'])
          )
        ) || false
        return condition
      },
      set(value) {
        const promisses = []
        if (value) {
          promisses.push(this.setDisputeProperty({ disputeId: this.dispute.id, key: 'CONTATOS ASSOCIADOS', value }))
        }
        Promise.all(promisses).then(() => {
          this.checkTabByAssociatedContractValue()
          this.getDisputeMetadata(this.dispute.id)
        })
      }
    }
  },

  watch: {
    activeRoleId: function(newActiveRole) {
      if (newActiveRole === 0) this.handleChange('')
    },
    filteredNamesakeList: function(newFilteredNamesakes) {
      if (!newFilteredNamesakes.includes(this.selectedNamesake)) {
        this.selectedNamesake = ''
      }
    },
    showAssociateContacts() {
      this.checkTabByAssociatedContractValue(this.showAssociateContacts)
    },
    dispute(newew, old) {
      if ((!old || !old.id) && newew.properties) {
        this.checkMetadata()
      }
    }
  },

  created() {
    if (this.disputeStatuses.ARCHIVED) {
      this.deleteTypes = this.disputeStatuses.ARCHIVED
    } else {
      this.getDisputeStatuses('ARCHIVED').then(response => {
        this.deleteTypes = response
      })
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    ...mapActions([
      'getDispute',
      'getDisputeProperties',
      'getDisputeStatuses',
      'getDisputeTimeline',
      'removeDispute',
      'addPhoneToDisputeRole',
      'addOabToDisputeRole',
      'getDisputeMetadata',
      'setDisputeProperty',
      'deleteTicketOverviewParty'
    ]),

    init() {
      this.populateTimeline()
      this.checkMetadata()
      this.checkTabByAssociatedContractValue()
    },

    sendMessageToNegotiator(role) {
      const roleId = role.id
      const email = role.emails.find(email => !email.archived && email.isValid && email.isMain) || ''
      this.$emit('activeNegotiator', {
        roleId,
        email: email ? email.address : email
      })
    },

    updateDisputeRoleField(disputeRole, { field, value }) {
      let message = ''

      if (field === 'oab') {
        const { number, state } = value

        const alreadyExists = disputeRole.oabs.filter(oab => {
          return number === oab.number && state === oab.state && !oab.archived
        }).length > 0

        if (!alreadyExists) {
          this.addOabToDisputeRole({
            disputeId: this.dispute.id,
            disputeRoleId: disputeRole.id,
            number,
            state
          }).then(() => {
            this.$jusNotification({
              title: 'Yay!',
              message: 'Nº de OAB adicionada.',
              type: 'success'
            })
          }).catch(error => {
            this.$jusNotification({ error })
          }).finally(this.$forceUpdate)
        } else {
          message = 'Este nº de OAB já esta em uso.'
        }
      } else if (field === 'documentNumber') {
        if (disputeRole.documentNumber !== value) {
          this.addNewDocumentNumber(disputeRole, value)
        } else {
          message = 'Este documento já esta em uso.'
        }
      } else if (field === 'phone') {
        const alreadyExists = disputeRole.phones.filter(phone => {
          return phone.number === `55 ${value}`.split(' ').join('')
        }).length > 0
        if (!alreadyExists) {
          this.addPhoneToDisputeRole({
            disputeId: this.dispute.id,
            disputeRoleId: disputeRole.id,
            value
          }).then(() => {
            this.$jusNotification({
              title: 'Yay!',
              message: 'Nº de Telefone adicionada.',
              type: 'success'
            })
          }).catch(error => {
            this.$jusNotification({ error })
          }).finally(this.$forceUpdate)
        } else {
          message = 'Este telefone já esta em uso.'
        }
      }

      const { name, id: roleId } = disputeRole
      const { status, id } = this.dispute

      this.verifyRestartEngagement({ name, status, disputeId: id, disputeRoleId: roleId })

      if (message) {
        this.$jusNotification({
          title: 'Yay!',
          message: message,
          type: 'success'
        })
      }
    },

    checkMetadata() {
      const { id } = this.$route.params

      this.getDisputeMetadata(id).then(() => {
        switch (this.dispute.properties['CONTATOS ASSOCIADOS']) {
          case 'MAIS TARDE':
            this.showAssociateContacts = 'NAO'
            break
          case 'NAO':
            this.showAssociateContacts = 'NAO'
            break
          case 'SIM':
            this.showAssociateContacts = 'SIM'
            break
          default:
            this.showAssociateContacts = 'NAO'
            break
        }
      })
    },

    checkTabByAssociatedContractValue(flag = false) {
      if (this.showAssociateContacts || flag) {
        this.overviewTab = 'roles'
      }
    },

    addNewDocumentNumber(disputeRole, documentNumber) {
      const newRole = {
        ...disputeRole,
        documentNumber
      }
      this.$store.dispatch('editRole', {
        disputeId: this.dispute.id,
        disputeRole: newRole
      }).then(() => {
        this.getDispute(this.dispute.id)
        this.$jusNotification({
          title: 'Yay!',
          message: 'Documento Adicionado.',
          type: 'success'
        })
      }).catch(error => {
        this.$jusNotification({ error })
      })
    },

    statusTooltip() {
      const { dispute } = this
      if (dispute.status === 'PRE_NEGOTIATION') {
        return dispute.properties['MOTIVO PRE NEGOCIACAO']
      } else if (dispute.status === 'PENDING') {
        return 'Faltam dados de contato da parte ou do advogado da parte'
      } else {
        return ''
      }
    },

    disputeUpperRangeChangedHandler() {
      this.disputeUpperRangeHasChanged = true
      if (this.disputeForm.disputeUpperRange > 0) {
        this.disputeForm.lastOfferValue = this.disputeForm.disputeUpperRange
      }
    },

    handleUnknowParty(role) {
      const { value } = this.dispuesToUnknownParties[this.tempRole]
      const newRole = {
        ...role,
        party: value.party
      }
      this.$store.dispatch('editRole', {
        disputeId: this.dispute.id,
        disputeRole: newRole
      }).then(() => {
        this.getDispute(this.dispute.id)
        this.$jusNotification({
          title: 'Yay!',
          message: 'Os dados foram alterados com sucesso.',
          type: 'success'
        })
        this.$forceUpdate()
      }).catch(error => {
        this.$jusNotification({ error })
      })
    },

    handleEditRule() {
      this.isEditingRole = !this.isEditingRole
      this.$forceUpdate()
    },

    async populateTimeline() {
      let getting = true
      for (const round in [0, 1, 2, 3, 4]) {
        if (getting) {
          await new Promise(resolve => { setTimeout(resolve, round * 2000) })
          this.getDisputeTimeline(this.dispute.code).then(() => {
            getting = false
          }).catch()
        } else {
          break
        }
      }
    },

    openTimelineModal() {
      this.disputeTimelineModal = true
      this.$jusSegment('Linha do tempo visualizada por dentro da disputa', { disputeId: this.dispute.id })
    },

    buildRoleTitle: (...i) => buildRoleTitle(...i),

    openRemoveDisputeDialog() {
      if (this.dispute.status === 'PRE_NEGOTIATION') {
        this.deleteType = 'DISPUTE_DROPPED'
        this.$confirm('Tem certeza que deseja excluir esta disputa? Esta ação é irreversível', 'Atenção', {
          confirmButtonText: 'Excluir',
          cancelButtonText: 'Cancelar',
          type: 'warning',
          cancelButtonClass: 'is-plain'
        }).then(() => {
          this.deleteDispute()
        })
      } else {
        this.chooseDeleteDialogVisible = true
      }
    },

    deleteDispute() {
      this.modalLoading = true
      this.removeDispute({
        disputeId: this.dispute.id,
        reason: this.deleteType
      }).then(() => {
        if (this.$store.state.disputeModule.tab === '9') this.$router.push('/management/all')
        else this.$router.push('/management')
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.chooseDeleteDialogVisible = false
        this.modalLoading = false
      })
    },

    openAddBankDialog() {
      this.addBankForm.name = this.roleForm.name
      this.addBankForm.document = this.roleForm.documentNumber
      if (this.roleForm.emails.filter(f => f.isValid && !f.archived && f.isMain).length) {
        this.addBankForm.email = this.roleForm.emails.filter(f => !f.archived && f.isMain)[0].address
      } else if (this.roleForm.emails.filter(f => f.isValid && !f.archived).length) {
        this.addBankForm.email = this.roleForm.emails.filter(f => !f.archived)[0].address
      } else {
        this.addBankForm.email = ''
      }
      this.addBankDialogVisible = true
    },

    closeNamesakes() {
      this.namesakeDialogVisible = false
      this.selectedNamesake = ''
      this.selectedNamesakePersonId = ''
      this.cityFilter = null
      this.ufFilter = null
    },

    selectNamesake() {
      if (this.selectedNamesake) {
        this.namesakeDialogLoading = true
        // eslint-disable-next-line
        axios.patch(`api/fusion-runner/set-document/person/${this.selectedNamesakePersonId}/${this.selectedNamesake.document}/${this.dispute.id}`)
          .then(() => {
            this.namesakeDialogVisible = false
            this.namesakeDialogLoading = false
            this.namesakeProcessing = true
            this.$jusNotification({
              title: 'Yay!',
              message: 'Homônimo enviado para tratamento com sucesso.',
              type: 'success'
            })
          })
          .catch(error => {
            this.$jusNotification({ error })
          })
      }
    },

    handleCurrentChange(val) {
      if (val) {
        this.selectedNamesake = val
      }
    },

    namesakeDialog({ name, personId }) {
      if (['CHECKOUT', 'ACCEPTED', 'SETTLED', 'UNSETTLED'].includes(this.dispute.status)) {
        this.$confirm(`Você está solicitando o tratamento de homônimo de uma disputa que já
        foi finalizada. Este processo irá agendar novamente as mensagens
        para a parte quando finalizado. Você deseja continuar mesmo assim?`,
        'Atenção!', {
          confirmButtonClass: 'confirm-action-btn',
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
          dangerouslyUseHTMLString: true,
          cancelButtonClass: 'is-plain'
        }).then(() => { this.opeNnamesakeDialog(name, personId) })
      } else {
        this.opeNnamesakeDialog(name, personId)
      }
    },

    opeNnamesakeDialog(name, personId) {
      this.selectedNamesakePersonId = personId
      this.namesakeButtonLoading = true
      // eslint-disable-next-line
      axios.get('api/spider/search/name/' + name)
        .then(response => {
          this.namesakeDialogVisible = true
          this.namesakeList = response.data
        })
        .catch(error => {
          this.$jusNotification({ error })
        })
        .finally(() => {
          this.namesakeButtonLoading = false
        })
    },

    updateDisputeRole(activeRole, messageType) {
      const disputeRoles = this.dispute.disputeRoles.map(dr => {
        if (dr.id === activeRole.id) {
          dr = activeRole
        }
        return dr
      })
      switch (messageType) {
        case 'email':
          activeRole.oabs.forEach(o => { o.selected = false })
          activeRole.phones.forEach(o => { o.selected = false })
          this.selectedPhone = 0
          break
        case 'whatsapp':
          activeRole.phones.forEach(o => { o.selected = false })
          activeRole.emails.forEach(e => { e.selected = false })
          activeRole.oabs.forEach(o => { o.selected = false })
          activeRole.phones = activeRole.phones.map(p => {
            if (p.id === this.selectedPhone) {
              p.selected = true
            }
            return p
          })
          break
        case 'cna':
          activeRole.emails.forEach(e => { e.selected = false })
          activeRole.phones.forEach(o => { o.selected = false })
          this.selectedPhone = 0
          break
      }
      this.$store.commit('setDisputeRoles', disputeRoles)
      this.$emit('updateActiveRole', { activeRole, messageType })
    },

    updateDisputeBankAccounts(roleBankAccountIds) {
      let action, bankAccountId
      for (const roleAccount of roleBankAccountIds) {
        if (!this.disputeBankAccountsIds.includes(roleAccount)) {
          if (this.dispute?.denySavingDeposit) {
            const ba = this.dispute.disputeRoles.find(dr => dr.id === this.activeRoleId).bankAccounts.find(ba => ba.id === roleAccount)
            if (ba && ba.type === 'SAVING') {
              this.$jusNotification({
                dangerouslyUseHTMLString: true,
                message: 'Esta disputa não permite a vinculação de contas do tipo <b>POUPANÇA</b>.',
                type: 'warning',
                duration: 0
              })
              return false
            }
          }
          action = 'linkDisputeBankAccounts'
          bankAccountId = roleAccount
        }
      }
      for (const disputeAccount of this.disputeBankAccountsIds) {
        if (!roleBankAccountIds.includes(disputeAccount)) {
          action = 'unlinkDisputeBankAccounts'
          bankAccountId = disputeAccount
        }
      }
      this.linkBankAccountLoading = true
      this.$store.dispatch(action, {
        disputeId: this.dispute.id,
        bankAccountId
      }).then(() => {
        this.$jusNotification({
          title: 'Yay!',
          dangerouslyUseHTMLString: true,
          message: 'Conta bancária <strong>' + this.$t('bank-account.' + action).toUpperCase() + '</strong> à disputa com sucesso.',
          type: 'success'
        })
        setTimeout(function() {
          this.$emit('fetch-data')
        }.bind(this), 200)
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.linkBankAccountLoading = false
      })
    },

    openDisputeDialog() {
      this.disputeUpperRangeHasChanged = false
      this.lastOfferValueHasChanged = false
      this.documentNumberHasChanged = false
      this.$store.dispatch('getMyStrategiesLite').finally(() => {
        this.$nextTick(() => {
          this.selectedStrategyId = this.dispute.strategyId
          if (!this.strategies.map(s => s.id).includes(this.dispute.strategyId)) {
            this.strategies.push({ id: this.dispute.strategyId, name: 'A estratégia utilizada não está mais disponível para uso', disabled: true })
          }
        })
      })
      const dispute = JSON.parse(JSON.stringify(this.dispute))
      this.editDisputeDialogLoading = false
      this.selectedClaimantId = this.disputeClaimants && this.disputeClaimants.length ? this.disputeClaimants[0].id : ''
      this.selectedNegotiatorId = this.disputeNegotiations && this.disputeNegotiations.length > 0 ? this.disputeNegotiations[0].id : ''
      this.disputeForm.id = dispute.id
      this.disputeForm.disputeCode = dispute.code
      this.disputeForm.disputeUpperRange = parseFloat(dispute.disputeUpperRange)
      this.disputeForm.lastOfferValue = parseFloat(dispute.lastOfferValue)
      this.disputeForm.expirationDate = dispute.expirationDate?.dateTime
      this.disputeForm.description = dispute.description
      this.disputeForm.materialDamage = dispute.materialDamage || ''
      this.disputeForm.moralDamage = dispute.moralDamage || ''
      this.disputeForm.requestedValue = dispute.requestedValue || ''
      this.disputeForm.externalId = dispute.externalId || ''
      this.disputeForm.provisionedValue = dispute.provisionedValue || ''
      this.disputeForm.classification = dispute.classification && dispute.classification.name ? dispute.classification.name : ''
      this.disputeForm.contactPartyWhenNoLowyer = dispute.contactPartyWhenNoLowyer
      this.disputeForm.contactPartyWhenInvalidLowyer = dispute.contactPartyWhenInvalidLowyer
      this.disputeForm.alwaysContactParty = dispute.alwaysContactParty
      this.disputeForm.denySavingDeposit = dispute?.denySavingDeposit
      this.disputeForm.zeroUpperRange = !parseFloat(dispute.disputeUpperRange)
      this.editDisputeDialogVisible = true
      this.$nextTick(() => { this.$refs.disputeForm.clearValidate() })
    },

    checkZeroUpperRange() {
      if (this.disputeForm.zeroUpperRange) {
        this.$nextTick(() => { this.$refs.disputeForm.validate() })
      }
    },

    editDispute() {
      this.$refs.disputeForm.validate(valid => {
        if (valid) {
          this.editDisputeDialogLoading = true
          const h = this.$createElement

          const hasUpperRangeProblem = this.isRecoveryStrategy ? this.disputeForm.lastOfferValue < this.disputeForm.disputeUpperRange : this.disputeForm.lastOfferValue > this.disputeForm.disputeUpperRange

          const hasUpperRangeProblemText = `- ${this.$tc('UPPER_RANGE', this.isRecoveryStrategy)} está ${this.isRecoveryStrategy ? 'acima' : 'abaixo'} do valor proposto.`

          this.$msgbox({
            title: 'Atenção!',
            message: h('p', null, [
              h('div', null, '- As novas informações vão sobrescrever as antigas.'),
              hasUpperRangeProblem
                ? h('div', null, hasUpperRangeProblemText) : null,
              h('br', null, null),
              h('div', null, 'Deseja continuar?')
            ]),
            type: 'warning',
            confirmButtonText: 'Continuar',
            confirmButtonClass: 'edit-case-confirm-button',
            cancelButtonClass: 'is-plain',
            showCancelButton: true,
            customClass: 'edit-case-confitm-dialog'
          }).then(() => {
            const disputeToEdit = JSON.parse(JSON.stringify(this.dispute))
            disputeToEdit.strategyId = this.selectedStrategyId
            disputeToEdit.disputeUpperRange = this.disputeForm.disputeUpperRange
            disputeToEdit.expirationDate.dateTime = this.$moment(this.disputeForm.expirationDate).endOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]')
            disputeToEdit.description = this.disputeForm.description
            disputeToEdit.code = this.disputeForm.disputeCode
            disputeToEdit.provisionedValue = this.disputeForm.provisionedValue
            disputeToEdit.classification = { name: this.disputeForm.classification }
            disputeToEdit.contactPartyWhenNoLowyer = this.disputeForm.contactPartyWhenNoLowyer
            disputeToEdit.contactPartyWhenInvalidLowyer = this.disputeForm.contactPartyWhenInvalidLowyer
            disputeToEdit.alwaysContactParty = this.disputeForm.alwaysContactParty
            disputeToEdit.denySavingDeposit = this.disputeForm?.denySavingDeposit
            disputeToEdit.lastOfferRoleId = this.selectedNegotiatorId
            disputeToEdit.lastOfferValue = this.disputeForm.lastOfferValue
            if (this.disputeForm.materialDamage) disputeToEdit.materialDamage = this.disputeForm.materialDamage
            else disputeToEdit.materialDamage = null
            if (this.disputeForm.moralDamage) disputeToEdit.moralDamage = this.disputeForm.moralDamage
            else disputeToEdit.moralDamage = null
            if (this.disputeForm.requestedValue) disputeToEdit.requestedValue = this.disputeForm.requestedValue
            else disputeToEdit.requestedValue = null
            if (this.disputeForm.externalId) disputeToEdit.externalId = this.disputeForm.externalId
            else disputeToEdit.externalId = null
            const currentDate = this.dispute.expirationDate.dateTime
            const newDate = disputeToEdit.expirationDate.dateTime
            const contactPartyWhenNoLowyer = this.dispute.contactPartyWhenNoLowyer
            const contactPartyWhenInvalidLowyer = this.dispute.contactPartyWhenInvalidLowyer
            const alwaysContactParty = this.dispute.alwaysContactParty

            this.$store.dispatch('editDispute', disputeToEdit).then(() => {
              // SEGMENT TRACK
              this.$jusSegment('Editar disputa', { disputeId: disputeToEdit.id })
              this.$jusNotification({
                title: 'Yay!',
                message: 'Os dados foram alterados com sucesso.',
                type: 'success'
              })
              setTimeout(function() {
                this.$emit('fetch-data')
              }.bind(this), 200)
              this.editDisputeDialogVisible = false
              const isExpirationDateChanged = this.$moment(currentDate).isBefore(this.$moment()) && this.$moment(newDate).isSameOrAfter(this.$moment())
              const contactPartyWhenNoLowyerHasChanged = this.disputeForm.contactPartyWhenNoLowyer !== contactPartyWhenNoLowyer
              const contactPartyWhenInvalidLowyerHasChanged = this.disputeForm.contactPartyWhenInvalidLowyer !== contactPartyWhenInvalidLowyer
              const alwaysContactPartyChanged = this.disputeForm.alwaysContactParty !== alwaysContactParty
              const contactPartyHasChanged = contactPartyWhenInvalidLowyerHasChanged || contactPartyWhenNoLowyerHasChanged || alwaysContactPartyChanged
              const onlyResendMessaged = this.dispute.status === 'RUNNING'
              if (contactPartyHasChanged || isExpirationDateChanged) {
                const action = onlyResendMessaged ? 'reenviar mensagens automáticas' : 'reiniciar esta disputa'
                const message = contactPartyHasChanged ? 'As configurações de engajamento foram alteradas. Deseja ' + action + '?' : 'A data de expiração foi alterada. Deseja ' + action + '?'
                this.$confirm(message, 'Atenção!', {
                  confirmButtonText: onlyResendMessaged ? 'Reenviar' : 'Reiniciar',
                  cancelButtonText: 'Cancelar',
                  cancelButtonClass: 'is-plain',
                  type: 'warning'
                }).then(() => {
                  this.$store.dispatch('sendDisputeAction', {
                    action: onlyResendMessaged ? 'resend-messages' : 'restart-engagement',
                    disputeId: this.dispute.id
                  }).then(() => {
                    const actionDone = onlyResendMessaged ? 'Reenvio de mensagens' : 'Reengajamento'
                    this.$jusNotification({
                      title: 'Yay!',
                      message: actionDone + ' realizado com sucesso.',
                      type: 'success'
                    })
                  })
                })
              }
            }).catch(error => {
              if (error.response && error.response.data && error.response.status === 412 && error.response.data.code === 'DUPLICATED_VALIDATION') {
                let message
                if (error.response.data.fields.CAN_ACCESS_OTHER) {
                  message = 'Este número de processo ja está sendo usado na disputa <a target="_blank" href="https://justto.app/#/management/dispute/' + error.response.data.fields.OTHER_DISPUTE_ID + '">#' + error.response.data.fields.OTHER_DISPUTE_ID + '</a>.'
                } else {
                  message = 'Este número de processo ja está sendo usado na disputa <b>#' + error.response.data.fields.OTHER_DISPUTE_ID + '</b>. Você não possui acesso a essa disputa. Verifique com um negociador responsável: <b>' + error.response.data.fields.OTHER_NEGOTIATORS + '</b>'
                }
                this.$jusNotification({
                  title: 'Ops!',
                  message: message,
                  type: 'warning',
                  dangerouslyUseHTMLString: true
                })
              } else {
                this.$jusNotification({ error })
              }
            }).finally(() => {
              this.editDisputeDialogLoading = false
            })
          }).catch(() => {
            this.editDisputeDialogLoading = false
          })
        }
      })
    },

    handleChange(val) {
      if (!val) {
        this.selectedPhone = 0
        this.dispute.disputeRoles.forEach(dr => {
          dr.phones.forEach(p => { p.selected = false })
          dr.emails.forEach(e => { e.selected = false })
          dr.oabs.forEach(o => { o.selected = false })
          return dr
        })
      }
      this.isEditingRole = false
    },

    openRoleDialog(role) {
      this.bankAccountIdstoUnlink = []
      this.editRoleDialogError = false
      this.editRoleDialogVisible = true
      this.roleForm = JSON.parse(JSON.stringify(role))
      this.originalRole = JSON.parse(JSON.stringify(role))
      this.roleForm.title = this.buildRoleTitle(role.party, role.roles[0])
      this.roleForm.documentNumber = this.$options.filters.cpfCnpj(this.roleForm.documentNumber)
      if (role.birthday) this.roleForm.birthday = this.$moment(new Date(role.birthday)).format('YYYY-MM-DD')
      this.roleForm.emails = this.roleForm.emails.filter(f => !f.archived)
      this.roleForm.oabs = this.roleForm.oabs.filter(f => !f.archived)
      this.roleForm.phones = this.roleForm.phones.filter(f => !f.archived)
      if (this.roleForm.emails.length) this.roleForm.emails = this.roleForm.emails.sort(e => e.isMain ? -1 : 1)
      if (this.roleForm.phones.length) this.roleForm.phones = this.roleForm.phones.sort(p => p.isMain ? -1 : 1)
      if (this.$refs.editRoleForm) this.$refs.editRoleForm.clearValidate()
    },

    editRole(roleFormRef) {
      let isValid = true

      roleFormRef.validateField(['name', 'documentNumber'], errorMessage => {
        if (errorMessage) isValid = false
      })

      if (isValid) {
        if (this.bankAccountIdstoUnlink.length) {
          this.linkBankAccountLoading = true
          const promise = []
          for (const id of this.bankAccountIdstoUnlink) {
            promise.push(
              this.$store.dispatch('unlinkDisputeBankAccounts', {
                disputeId: this.dispute.id,
                bankAccountId: id
              })
            )
          }
          Promise.all(promise).then(() => {
            this.editRoleAction()
          }).catch(error => {
            this.$jusNotification({ error })
          }).finally(() => {
            this.linkBankAccountLoading = false
          })
        } else {
          this.editRoleAction()
        }
      }
    },

    editRoleAction() {
      const hasNewBankAccount = this.roleForm.bankAccounts.filter(account => !account.id).length
      delete this.roleForm.personProperties.BIRTHDAY
      const roleToEdit = JSON.parse(JSON.stringify(this.roleForm))
      delete roleToEdit.title

      this.editRoleDialogLoading = true

      this.$store.dispatch('editRole', {
        disputeId: this.dispute.id,
        disputeRole: roleToEdit
      }).then(response => {
        // SEGMENT TRACK
        this.$jusSegment('Editar partes da disputa', { description: `Usuário ${roleToEdit.name} alterado` })
        this.$jusNotification({
          title: 'Yay!',
          message: 'Os dados foram alterados com sucesso.',
          type: 'success'
        })

        const roleDataDifference = this.verifyChangedRoleData(this.roleForm, this.originalRole)

        if (roleDataDifference.length) {
          this.$confirm(this.$t('dispute.overview.confirm.restart.engagement.question'), 'Atenção!', {
            confirmButtonText: this.$t('dispute.overview.confirm.restart.engagement.confirm'),
            cancelButtonText: this.$t('dispute.overview.confirm.restart.engagement.cancel'),
            type: 'warning',
            cancelButtonClass: 'is-plain'
          }).then(() => this.$jusNotification({
            title: 'Cuidado!',
            message: this.$t('dispute.notification.will-not-restart'),
            type: 'warning',
            dangerouslyUseHTMLString: true
          })).catch(() => {
            const contacts = []
            for (const contact of roleDataDifference) {
              contacts.push(
                this.$store.dispatch('restartEngagementByContact', {
                  disputeId: this.dispute.id,
                  contact: contact.address || contact.number
                })
              )
            }
            Promise.all(contacts).then(() => {
              this.$jusNotification({
                title: 'Yay!',
                message: this.$t('dispute.notification.restarted'),
                type: 'success'
              })
            })
          })
        }

        if (hasNewBankAccount) {
          this.$confirm('Você adicionou contas bancárias a esta parte. Deseja vincular estas contas a disputa?', 'Atenção', {
            confirmButtonText: 'Vincular',
            cancelButtonText: 'Cancelar',
            type: 'warning',
            cancelButtonClass: 'is-plain'
          }).then(() => {
            const bankAccounts = response.bankAccounts
            const newBankAccounts = bankAccounts.sort((accountA, accountB) => {
              if (accountA.createdAt > accountB.createdAt) {
                return 1
              } else if (accountA.createdAt < accountB.createdAt) {
                return -1
              } else {
                return 0
              }
            }).slice(-hasNewBankAccount).map(ba => ba.id)
            this.disputeBankAccountsIds = ([...this.disputeBankAccountsIds, ...newBankAccounts])
          }).finally(() => {
            this.linkBankAccountLoading = false
          })
        }

        this.editRoleDialogVisible = false

        setTimeout(function() {
          this.$emit('fetch-data')
        }.bind(this), 200)
      }).catch(error => {
        console.error(error)

        if (error.status === 400) {
          this.editRoleDialogError = true
          this.editRoleDialogErrorList.push(error.data.message)
        } else this.$jusNotification({ error })
      }).finally(() => {
        const { name, party, id: roleId } = roleToEdit
        const { status, id } = this.dispute

        const needRestartEngagement = _.difference(this.roleForm.phones, this.originalRole.phones).length || _.difference(this.roleForm.emails, this.originalRole.emails).length

        if (needRestartEngagement) {
          this.verifyRestartEngagement({ name, party, status, disputeId: id, disputeRoleId: roleId })
        }

        this.editRoleDialogLoading = false
      })
    },
    verifyChangedRoleData(editedRole, originalRole) {
      const changed = {
        newPhones: [],
        newEmails: []
      }
      if (editedRole.phones.length) {
        const mappedPhones = originalRole.phones.map(phone => phone.number)
        changed.newPhones = editedRole.phones.filter(phone => {
          if (!mappedPhones.includes(phone.number)) return phone.number
        })
      }
      if (editedRole.emails.length) {
        const mappedEmails = originalRole.emails.map(email => email.address)
        changed.newEmails = editedRole.emails.filter(email => {
          if (!mappedEmails.includes(email.address)) return email.address
        })
      }
      return [...changed.newPhones, ...changed.newEmails]
    },
    addOab() {
      let isValid = true
      this.$refs.editRoleForm.validateField(['oab', 'state'], errorMessage => {
        if (errorMessage || !this.roleForm.oab || !this.roleForm.state) isValid = false
      })
      if (isValid) {
        const self = this
        this.roleForm.oab = this.roleForm.oab.replace(/ /g, '')
        const isDuplicated = this.roleForm.oabs.findIndex(o => o.number === self.roleForm.oab && o.state === self.roleForm.state)
        if (isDuplicated < 0) {
          this.roleForm.oabs.push({
            number: this.roleForm.oab,
            state: this.roleForm.state
          })
        }
        this.roleForm.oab = ''
        this.roleForm.state = ''
      }
    },
    removeRole(role) {
      if (this.isLawyer(role)) {
        this.deletingLawyer = role
        this.chooseRemoveLawyerDialogVisible = true
      } else {
        this.$confirm('Tem certeza que deseja excluir esta parte?', 'Atenção!', {
          confirmButtonText: 'Excluir',
          cancelButtonText: 'Cancelar',
          type: 'warning',
          cancelButtonClass: 'is-plain'
        }).then(() => {
          this.$emit('removeRole')
          setTimeout(() => {
            this.$store.dispatch('removeRole', {
              disputeId: this.dispute.id,
              roleId: role.id
            }).then(response => {
              this.$jusNotification({
                title: 'Yay!',
                message: 'Pessoa removida com sucesso.',
                type: 'success'
              })
            }).catch(error => {
              this.$jusNotification({ error })
            })
          }, 4600)
        })
      }
    },
    addBankData() {
      this.$refs.addBankForm.validate(valid => {
        if (valid) {
          if (!this.roleForm.bankAccounts) {
            this.roleForm.bankAccounts = []
          }
          const bankForm = JSON.parse(JSON.stringify(this.addBankForm))
          this.roleForm.bankAccounts.push(bankForm)
          this.addBankForm.name = ''
          this.addBankForm.email = ''
          this.addBankForm.document = ''
          this.addBankForm.bank = ''
          this.addBankForm.agency = ''
          this.addBankForm.number = ''
          this.addBankForm.type = ''
          this.addBankDialogVisible = false
        }
      })
    },
    removeBankData(index, id) {
      this.bankAccountIdstoUnlink.push(id)
      this.roleForm.bankAccounts.splice(index, 1)
    },
    enrichDispute() {
      const content = this.isAccepted ? 'Isso irá <b>ENRIQUECER</b> uma disputa que já foi finalizada. Este processo irá agendar novamente as mensagens para as partes quando finalizado. Você deseja enriquecer mesmo assim?' : 'Tem certeza que deseja realizar esta ação?'
      this.$confirm(content, 'ATUALIZAR ANEXOS', {
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        dangerouslyUseHTMLString: true,
        showClose: false
      }).then(() => {
        this.$store.dispatch('sendDisputeAction', {
          disputeId: this.dispute.id,
          action: 'enrich'
        }).then(() => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Ação <b>ENRIQUECER</b> realizada com sucesso.',
            type: 'success',
            dangerouslyUseHTMLString: true
          })
        })
      })
    },

    isLawyer(role) {
      return role.roles?.includes('LAWYER')
    },

    removeLawyer(forAllDisputes) {
      const payload = {
        roleId: this.deletingLawyer.id,
        disputeId: this.dispute.id
      }
      if (!forAllDisputes) {
        payload.cancelPropagation = true
      }
      this.deleteTicketOverviewParty(payload).then(() => {
        this.$jusNotification({
          title: 'Yay!',
          message: 'Parte removida com sucesso!',
          type: 'success'
        })
      }).catch(error => {
        this.$jusNotification({ error })
      })
      this.chooseRemoveLawyerDialogVisible = false
    },

    tryRestartEngagementAssociateContact(disputeRole) {
      console.log('tryRestartEngagement', disputeRole)
    },

    restartEngagementFromTimeline(disputeRole) {
      const { name, party, id: roleId } = disputeRole
      const { status, id } = this.dispute

      this.verifyRestartEngagement({ name, party, status, disputeId: id, disputeRoleId: roleId })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.dispute-overview-view {
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction:column;

  .dispute-overview-view__loading {
    flex: 1;
    overflow-y: hidden;

    .dispute-overview-view__timeline {
      .dispute-overview-view__timeline-title {
        text-align: center;
        letter-spacing: 0px;
        color: #424242;
        font-weight: bold;
      }
    }
  }

  &__title {
    font-weight: 500;
    margin: 0;
    .el-button {
      border-radius: 4px;
      padding: 5px 8px;
    }
  }
  &__tabs {
    height: 100%;
    padding-top: 15px;
    .el-tabs__item i {
      font-size: 18px;
    }
    .el-tabs__content {
      height: calc(100% - 58px);
      position: initial;
    }
  }
  &__tabs-content {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    padding-right: 4px;
  }
  &__info-line {
    line-height: 24px;

    .dispute-overview-view__negotiator-icon {
      font-weight: 500;
      text-transform: capitalize;
      word-break: break-word;
      cursor: pointer;
      display: flex;
      gap: 8px;

      .icon {
        margin-top: 4px;
        height: 16px;
      }

      .text {
        margin: 4px 0px 0px !important;
        word-break: break-word !important;
      }
    }

    div .active-popover .el-icon-info.el-popover__reference,
    span span .active-popover .el-icon-info.el-popover__reference {
      color: $--color-primary;
    }

    div span .el-icon-info.el-popover__reference:hover,
    span span span .el-icon-info.el-popover__reference:hover {
      color: $--color-primary;
    }

    > span:not(.title) {
      margin-left: 12px;
      width: 100%;
      display: flex;
      align-items: flex-start;

      > span:not(.jus-vexatious-alert) {
        width: 100%;
        margin: 5px;
        word-break: break-all;
        line-height: 1.2;
      }

      .jus-avatar-user {
        margin-right: 4px;
      }
    }
    > .dispute-overview-view__select-role {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      > .dispute-overview-view__tooltip-cancel-edit-role {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 8px;
        font-size: 16px;
        color: $--color-danger;
      }
    }
    > span .dispute-overview-view__edit-icon {
      width: 10px !important;
      margin: 0 !important;
      margin: auto 8px !important;
      display: flex;
      align-items: center;
      visibility: hidden;
      cursor: pointer;
      img { width: 10px; }
    }
    .code {
      margin-left: 12px;
      .icon {
        height: 0.9rem;
        visibility: hidden;
      }
      &:hover {
        .icon {
          visibility: visible;
        }
      }
    }
    .configurations {
      margin-top: 4px;
      line-height: 18px;
      flex-direction: column;
      div {
        margin-left: 8px;
        margin-bottom: 8px;
        font-weight: 500;
      }
    }

    .classification {
      margin-top: 4px;
      line-height: 18px;
      flex-direction: column;

      div {
        margin: 8px;
        font-weight: 500;
      }
    }

    .title {
      font-weight: 600;
      .dispute-overview-view__edit-tooltip {
        cursor: pointer;
        visibility: hidden;
        img {
          height: 12px;
        }
      }
      &:hover > .dispute-overview-view__edit-tooltip {
        visibility: visible;
      }
    }
    .bank-info {
      display: block !important
    }
    .el-radio {
      width: 100%;
      margin: 4px 0;
      display: flex;
      align-items: flex-start;
    }
    .el-radio__label {
      padding-left: 5px;
      font-size: 13px;
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
    .bordered {
      width: 100%;
      height: auto;
      display: flex;
      align-items: center;
      padding: 8px;
      margin-top: 10px;
      margin-left: 0 !important;
      .el-checkbox__input {
        vertical-align: super;
      }
      .el-checkbox__label {
        padding-left: 6px;
        font-size: 13px;
        display: flex;
        justify-content: space-between;
      }
    }
    .el-collapse {
      margin-left: 12px;
    }
    .el-collapse-item__header {
      font-size: 12px;
      height: 38px;
      div, span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: normal;
      }
      div > span {
        font-size: 11px;
        display: block;
        color: $--color-text-secondary;
      }
    }
    .el-collapse-item__content {
      font-size: 12px;
    }
    .alerts {
      margin-top: 5px;
      display: inline-flex;
      img + img {
        margin-left: 3px;
      }
    }
  }
  &__info-textarea {
    text-align: justify;
    margin-top: 10px;
    strong {
      font-weight: 500;
      word-break: break-all;
    }
  }
  &__actions {
    margin: 20px 0;
    display: flex;
    button {
      width: 100%;
    }
  }
  &__list-actions {
    img {
      margin-right: 8px;
      vertical-align: middle;
      width: 16px;
    }
  }
  &__location {
    span {
      font-weight: 600;
      display: block;
      margin-bottom: 10px;
    }
    span:not(:first-child) {
      margin-top: 20px;
    }
  }
  &__person-title { width: calc(100% - 16px); }
  &__name {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    text-overflow: ellipsis;
  }
  &__see-more {
    white-space: nowrap;
  }
  &__oab-form {
    display: flex;
    width: 100%;
    .oab {
      flex: 1;
    }
    .state {
      margin-left: 16px;
      flex: 1;
    }
    .button {
      margin-top: 30px;
      margin-bottom: 22px;
      margin-left: 16px;
      padding: 8px 20px;
      width: 62px;
    }
  }
  &__add-role {
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    font-size: 16px;
    margin-top: 20px;
    padding: 17px 16px 17px 15px;
    color: $--color-primary;
  }
  &__role-collapse {
    background-color: #fff;
    font-size: 13px;
  }
  &__bank-collapse {
    .el-collapse-item__wrap {
      padding: 0 8px;
      border-radius: 0;
      border-left: 1px solid #9461f763;
    }
    .el-collapse-item__content {
      padding-bottom: 0;
    }
  }
  &__bank-checkbox {
    .el-checkbox__label {
      flex-direction: column;
      white-space: initial;
      word-break: break-all;
    }
  }
  &__namesake-table {
    margin-bottom: 20px;
  }
  &__namesake-filters {
    display: flex;
    margin-top: 40px;
    margin-bottom: 20px;
  }
  &__namesake-filter {
    display: flex;
    align-items: center;
    span {
      margin-right: 8px;
    }
    .el-select {
      display: flex;
      flex: 1;
    }
    &:first-child {
      width: 65%;
    }
    &:last-child {
      width: 35%;
      margin-left: 20px;
    }
  }
  &__is-enriched {
    font-style: italic;
    span {
      color: $--color-primary;
      margin-left: 2px;
      font-weight: 500;
    }
  }
  &__switch-main {
    display: flex;
    margin-top: 1px;
    margin-right: 16px;
    img {
      width: 18px;
      margin-top: -2px;
      margin-right: 2px;
    }
  }
  &__select-switch {
    display: flex;
    padding-left: 14px !important;
    margin: 4px 0 20px;
    .content  {
      width: 100%;
      div {
        font-weight: 600;
        padding-top: 2px;
      }
      p {
        font-style: italic;
        font-size: 12px;
        margin: 6px 20px 0 0;
      }
    }
  }
  &__attachment-buttons {
    .el-input {
      width: calc(100% - 50px);
    }
    .el-button {
      padding: 12px;
      margin-left: 8px;
      img {
        margin: -3px 0px;
        width: 14px;
      }
    }
  }
  .el-input-group__append {
    border-color: #9462f7;
    background-color: #9462f7;
    img {
      margin-top: 1px;
    }
  }
  .el-collapse--bordered {
    .el-collapse-item {
      box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.06);
      position: relative;
      &.is-active {
        border: 2px solid $--color-primary;
      }
      &:last-child {
        margin-bottom: 20px;
      }
    }
  }
  .el-dialog {
    min-width: 500px;
    h3 {
      margin-bottom: 10px;
    }
  }
  .el-table__body tr.current-row > td {
    border-top: 1px solid $--color-primary;
    border-bottom: 1px solid $--color-primary;
    &:first-child {
      border-left: 1px solid $--color-primary
    }
    &:last-child {
      border-right: 1px solid $--color-primary
    }
  }
  .slot-scope .cell {
    display: flex;
    justify-content: flex-end;
  }
  .el-icon-warning {
    color: $--color-warning
  }
  &__attachment-tab {
    height: 100%;
  }

  .el-input.is-disabled .el-input__inner {
    cursor: not-allowed;
  }
}

.dispute-overview-view__info-popover-lawyer {
  width: 500px;
  min-height: 20vh;
  max-height: 50vh;
}

.info-line__status-tooltip {
  max-width: 400px;
}
</style>
