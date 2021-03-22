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
          @click="openRemoveDisputeDialog()"
        >
          <i class="el-icon-delete" />
        </el-button>
      </el-tooltip>
      <span class="dispute-overview-view__subtitle">
        <dispute-code-link
          v-if="dispute.code"
          :code="dispute.code"
          :custom-style="{ fontSize: '14x', fontWeight: 'normal', color: '#adadad'}"
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
          <div>
            <div
              class="dispute-overview-view__info-line"
              data-testid="dispute-infoline"
            >
              <span class="title">Etiquetas:</span>
              <jus-tags />
            </div>
            <div
              v-if="dispute.createAt"
              class="dispute-overview-view__info-line"
              data-testid="dispute-infoline"
            >
              <span class="title">Data de importação:</span>
              <span>{{ dispute.createAt.dateTime | moment('DD/MM/YY') }}</span>
            </div>
            <div
              class="dispute-overview-view__info-line"
              data-testid="dispute-infoline"
            >
              <span class="title">Processo:</span>
              <dispute-code-link
                :code="dispute.code"
                :custom-style="{ fontSize: '14px', marginLeft: '12px'}"
                @openTimeline="openTimelineModal"
              />
            </div>
            <div
              v-if="campaign"
              class="dispute-overview-view__info-line"
              data-testid="dispute-infoline"
            >
              <span class="title">Campanha:</span>
              <span>{{ campaign.name }}</span>
            </div>
            <div
              v-if="dispute.strategyName"
              class="dispute-overview-view__info-line"
              data-testid="dispute-infoline"
            >
              <span class="title">Estratégia:</span>
              <span data-testid="overview-strategy">{{ dispute.strategyName }}</span>
            </div>
            <div
              class="dispute-overview-view__info-line"
              data-testid="dispute-infoline"
            >
              <span class="title">Status:</span>
              <el-tooltip
                :disabled="!statusTooltip()"
                popper-class="info-line__status-tooltip"
              >
                <span
                  slot="content"
                  v-html="statusTooltip()"
                />
                <span data-testid="overview-status">
                  <span>{{ $t('occurrence.type.' + dispute.status) | capitalize }}</span>
                  <span v-if="dispute.paused">(pausada)</span>
                  <span
                    v-if="statusTooltip()"
                    class="el-icon-question"
                  />
                </span>
              </el-tooltip>
            </div>
            <div
              class="dispute-overview-view__info-line"
              data-testid="dispute-infoline"
            >
              <span class="title">Alçada máxima:</span>
              <span data-testid="overview-upperrange">{{ dispute.disputeUpperRange | currency }}</span>
            </div>
            <div
              class="dispute-overview-view__info-line"
              data-testid="dispute-infoline"
            >
              <span class="title">Valor proposto<span v-if="dispute.lastOfferName"> por {{ dispute.lastOfferName | firstName }}</span>:</span>
              <span data-testid="overview-proposal">
                <el-tooltip
                  v-if="dispute.lastOfferName"
                  :content="'Proposto por: ' + dispute.lastOfferName"
                >
                  <jus-avatar-user
                    :name="dispute.lastOfferName"
                    size="mini"
                  />
                </el-tooltip>
                {{ dispute.lastOfferValue | currency }}
              </span>
            </div>
            <div
              v-if="dispute.lastCounterOfferValue > 0 && dispute.disputeUpperRange"
              class="dispute-overview-view__info-line"
              data-testid="dispute-infoline"
            >
              <span class="title">Contraproposta<span v-if="dispute.lastCounterOfferName"> por {{ dispute.lastCounterOfferName | firstName }}</span>:</span>
              <span data-testid="overview-counterproposal">
                <el-tooltip
                  v-if="dispute.lastCounterOfferName"
                  :content="'Proposto por: ' + dispute.lastCounterOfferName"
                >
                  <jus-avatar-user
                    :name="dispute.lastCounterOfferName"
                    size="mini"
                  />
                </el-tooltip>
                {{ dispute.lastCounterOfferValue | currency }}
              </span>
            </div>
            <div
              v-if="(dispute.status === 'ACCEPTED' || dispute.status === 'CHECKOUT' || dispute.status === 'SETTLED') && dispute.disputeDealValue"
              class="dispute-overview-view__info-line"
            >
              <span class="title">Valor do acordo:</span>
              <span>{{ dispute.disputeDealValue | currency }}</span>
            </div>
            <div
              class="dispute-overview-view__info-line"
              data-testid="dispute-infoline"
            >
              <span class="title">Fim da negociação:</span>
              <span
                v-if="dispute.expirationDate"
                data-testid="overview-expirationdate"
              >{{ dispute.expirationDate.dateTime | moment('DD/MM/YY') }}</span>
            </div>
            <div
              v-if="dispute.materialDamage"
              class="dispute-overview-view__info-line"
              data-testid="dispute-infoline"
            >
              <span class="title">Dano material:</span>
              <span
                v-if="dispute.materialDamage"
                data-testid="overview-materialdamage"
              >{{ dispute.materialDamage | currency }}</span>
            </div>
            <div
              v-if="dispute.moralDamage"
              class="dispute-overview-view__info-line"
              data-testid="dispute-infoline"
            >
              <span class="title">Dano moral:</span>
              <span
                v-if="dispute.moralDamage"
                data-testid="overview-moralDamage"
              >{{ dispute.moralDamage | currency }}</span>
            </div>
            <div
              v-if="dispute.provisionedValue > 0"
              class="dispute-overview-view__info-line"
              data-testid="dispute-infoline"
            >
              <span class="title">Valor provisionado:</span>
              <span data-testid="overview-provisioned-value">{{ dispute.provisionedValue | currency }}</span>
            </div>
            <div
              v-if="dispute.requestedValue"
              class="dispute-overview-view__info-line"
              data-testid="dispute-infoline"
            >
              <span class="title">Valor do processo:</span>
              <span
                v-if="dispute.requestedValue"
                data-testid="overview-requestedvalue"
              >{{ dispute.requestedValue | currency }}</span>
            </div>
            <div
              v-if="dispute.externalId"
              class="dispute-overview-view__info-line"
              data-testid="dispute-infoline"
            >
              <span class="title">Código interno:</span>
              <span
                v-if="dispute.externalId"
                data-testid="overview-externalid"
              >{{ dispute.externalId }}</span>
            </div>
            <div
              class="dispute-overview-view__info-line"
              data-testid="dispute-infoline"
            >
              <span class="title">Configurações:</span>
              <span class="configurations">
                Enriquecer automaticamente na importação?
                <div><i :class="skipEnrichment ? 'el-icon-close' : 'el-icon-check'" /> {{ skipEnrichment ? 'Não' : 'Sim' }}</div>
                Somente depósito em conta-corrente?
                <div><i :class="dispute.campaign.denySavingDeposit ? 'el-icon-check' : 'el-icon-close'" /> {{ dispute.campaign.denySavingDeposit ? 'Sim' : 'Não ' }}</div>
                Mensagens somente em horário comercial?
                <div><i :class="dispute.campaign.businessHoursEngagement ? 'el-icon-check' : 'el-icon-close'" /> {{ dispute.campaign.businessHoursEngagement ? 'Sim' : 'Não' }}</div>
                Contatar autor?
                <div>
                  <i :class="(dispute.contactPartyWhenNoLowyer || dispute.contactPartyWhenInvalidLowyer) ? 'el-icon-check' : 'el-icon-close'" />
                  <span v-if="dispute.awaysContactParty">
                    Sempre
                  </span>
                  <span v-else-if="dispute.contactPartyWhenNoLowyer && dispute.contactPartyWhenInvalidLowyer">
                    Quando não houver advogado ou não for possível contatar o advogado existente
                  </span>
                  <span v-else-if="dispute.contactPartyWhenNoLowyer && !dispute.contactPartyWhenInvalidLowyer">
                    Somente quando não houver advogado constituído
                  </span>
                  <span v-else-if="!dispute.contactPartyWhenNoLowyer && dispute.contactPartyWhenInvalidLowyer">
                    Somente quando não for possível contatar o advogado existente
                  </span>
                  <span v-else>
                    Nunca
                  </span>
                </div>
              </span>
            </div>
            <div
              v-if="computedDescription"
              class="dispute-overview-view__info-line"
            >
              <span class="title">Descrição:</span>
              <span>
                <span
                  :class="{ 'right': computedDescription.length < 25 }"
                  data-testid="overview-description"
                >
                  {{ computedDescription }}
                  <span v-if="dispute.description.length > 140">
                    <a
                      href="#"
                      class="dispute-overview-view__see-more"
                      @click.prevent="descriptionCollapse = !descriptionCollapse"
                    >
                      {{ descriptionCollapse ? 'ver mais': 'ver menos' }}
                      <i :class="descriptionCollapse ? 'el-icon-arrow-down': 'el-icon-arrow-up'" />
                    </a>
                  </span>
                </span>
              </span>
            </div>
            <div
              v-if="dispute.classification"
              class="dispute-overview-view__info-line"
            >
              <span class="title">Classificação:</span>
              <span class="classification">
                {{ dispute.classification.name }}
                <div
                  v-for="subClassification in dispute.classification.classificationDetails"
                  :key="subClassification.id"
                >
                  <i class="el-icon-right" />
                  {{ subClassification.name }}
                </div>
              </span>
            </div>
            <div
              v-if="dispute.bankAccounts && dispute.bankAccounts.length"
              class="dispute-overview-view__info-line"
            >
              <span class="title">Conta(s) bancária(s):</span>
              <el-collapse value="0">
                <el-collapse-item
                  v-for="(bankAccount, index) in dispute.bankAccounts"
                  :key="`${index}-${bankAccount.id}`"
                  :name="index"
                  class="dispute-overview-view__bank-collapse"
                >
                  <template slot="title">
                    <div>
                      {{ bankAccount.name || bankAccount.document | cpfCnpj }}
                      <span>
                        {{ bankAccount.bank }} <span v-if="bankAccount.agency">|</span>
                        {{ bankAccount.agency }} <span v-if="bankAccount.number">|</span>
                        {{ bankAccount.number }}
                      </span>
                    </div>
                  </template>
                  <span class="bank-info">
                    <span v-show="bankAccount.name">
                      <strong>Nome:</strong> {{ bankAccount.name }} <br>
                    </span>
                    <span v-show="bankAccount.email">
                      <strong>E-mail:</strong> {{ bankAccount.email }} <br>
                    </span>
                    <strong>Documento:</strong> {{ bankAccount.document | cpfCnpj }} <br>
                    <strong>Banco:</strong> {{ bankAccount.bank }} <br>
                    <strong>Agência:</strong> {{ bankAccount.agency }} <br>
                    <strong>Conta:</strong> {{ bankAccount.number }} <br>
                    <strong>Tipo:</strong> {{ bankAccount.type === 'SAVING' ? 'Poupança' : 'Corrente' }} <br>
                  </span>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
          <el-tooltip
            :disabled="dispute.status !== 'PRE_NEGOTIATION'"
            content="Disputas em pré negociação não podem ser editadas"
          >
            <div class="dispute-overview-view__actions">
              <el-button
                :disabled="dispute.status === 'PRE_NEGOTIATION'"
                type="primary"
                data-testid="edit-dispute"
                @click="openDisputeDialog()"
              >
                Editar
              </el-button>
            </div>
          </el-tooltip>
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
          <a
            v-if="contactsMetadataCount"
            @click="openAssociationModal()"
          >
            {{ $tc('dispute.overview.label.contact-found', contactsMetadataCount, { count: contactsMetadataCount }) }} {{ $t('dispute.overview.label.in-the-attachments') }}
          </a>
          <el-collapse
            ref="roleCollapse"
            v-model="selectedRole"
            accordion
            class="el-collapse--bordered"
            style="margin: 20px 0 0"
            @change="handleChange"
          >
            <el-collapse-item
              v-for="(role, index) in disputeRolesSort"
              :key="`${index}-${role.personId}`"
              :name="role.id"
              class="dispute-overview-view__role-collapse"
              data-testid="expand-party"
            >
              <div
                slot="title"
                class="dispute-overview-view__person-title"
              >
                <i
                  v-if="(showNamesake(role) || showVexatious(role.personProperties)) && !role.roles.includes('NEGOTIATOR') "
                  class="el-icon-warning-outline el-icon-pulse"
                  style="color: rgb(255, 201, 0);position: absolute;top: 0px;left: 0px;font-size: 30px;background-color: #fff0;"
                />
                <i
                  v-if="showIsDead(role)"
                  class="el-icon-warning-outline el-icon-pulse"
                  style="color: rgb(255, 75, 84);position: absolute;top: 0px;left: 0px;font-size: 30px;background-color: #fff0;"
                />
                <div class="dispute-overview-view__name">
                  <span
                    v-for="r in role.roles"
                    :key="r.id"
                    class="dispute-overview-view__role-icon"
                  >
                    <el-tooltip :content="buildRoleTitle(role.party, r)">
                      <i :class="getRoleIcon(role.party, r)" />
                    </el-tooltip>
                  </span>
                  <span
                    v-if="role.name"
                    @click="sendMessageToNegotiator(role)"
                  >
                    <el-tooltip
                      v-if="onlineList.includes(role.documentNumber)"
                      :content="`${$options.filters.capitalize(role.name.toLowerCase().split(' ')[0])} está online`"
                    >
                      <jus-icon
                        icon="online"
                        style="width: 10px; margin: 19px 0px; margin-left: 8px;"
                      />
                    </el-tooltip>
                    <el-tooltip
                      v-else-if="role.oabs.filter(oab => onlineList.includes(`${oab.number}-${oab.state}`)).length"
                      :content="`${$options.filters.capitalize(role.name.toLowerCase().split(' ')[0])} está online`"
                    >
                      <jus-icon
                        icon="online"
                        style="width: 10px; margin: 19px 0px; margin-left: 8px;"
                      />
                    </el-tooltip>
                  </span>
                  {{ role.name }}
                </div>
              </div>
              <p
                v-if="showNamesake(role)"
                style="margin-top: 0"
              >
                <span v-if="namesakeProcessing">
                  <i class="el-icon-warning" />
                  Documento correto enviado para tratamento no sistema. Isso pode levar algum tempo.
                </span>
                <span v-else>
                  Esta parte não foi enriquecida corretamente devido à existência de homônimos.
                </span>
              </p>
              <el-button
                v-if="showNamesake(role)"
                :loading="namesakeButtonLoading || namesakeProcessing"
                :type="namesakeProcessing ? 'success' : 'warning'"
                style="width: 100%; margin-bottom: 14px;"
                @click="namesakeDialog(role.name, role.personId)"
              >
                <span v-if="namesakeProcessing">Enriquecendo...</span>
                <span v-else>Tratar homônimos</span>
              </el-button>
              <el-alert
                v-if="showIsDead(role)"
                class="mb10"
                title="Possível óbito"
                type="error"
              >
                Algumas de nossas bases de informações constam que a parte possivelmente encontra-se em óbito.
              </el-alert>
              <div class="dispute-overview-view__info-line">
                <span class="title">Nome completo:</span>
                <div>
                  <el-popover
                    v-if="role.roles.includes('LAWYER')"
                    :ref="`popover-${role.name}`"
                    popper-class="dispute-overview-view__info-popover-lawyer"
                    :placement="'top-end'"
                    trigger="click"
                    @hide="deactivePopover(`popover-${role.name}`)"
                  >
                    <lawyer-detail
                      @update="updateDisputeRoleField(role, $event)"
                    />
                    <i
                      slot="reference"
                      class="el-icon-info"
                      @click="searchThisLawyer({ name: role.name, oabs: [] }, `popover-${role.name}`)"
                    />
                  </el-popover>
                  {{ role.name }}
                </div>
              </div>
              <div class="dispute-overview-view__info-line">
                <span class="title">
                  Função:
                  <span
                    v-if="!isToShowChangeParty(role) && !isNegotiator(role)"
                    class="dispute-overview-view__edit-tooltip"
                    @click="handleEditRule()"
                  >
                    <el-tooltip
                      placement="top"
                      content="Editar polaridade"
                    >
                      <jus-icon icon="edit" />
                    </el-tooltip>
                  </span>
                </span>
                <div
                  v-if="isToShowChangeParty(role) && !isNegotiator(role)"
                  class="dispute-overview-view__select-role"
                >
                  <el-select
                    v-model="role.party"
                    size="mini"
                    placeholder="Defina o polo desta parte"
                    @change="setDisputeParty(role)"
                  >
                    <el-option
                      v-for="party in getDisputePartys(role.roles)"
                      :key="party.value"
                      :label="party.label"
                      :value="party.value"
                    />
                  </el-select>
                  <span
                    class="dispute-overview-view__tooltip-cancel-edit-role"
                    @click="handleEditRule()"
                  >
                    <el-tooltip content="Cancelar edição da polaridade">
                      <i class="el-icon-error" />
                    </el-tooltip>
                  </span>
                </div>
                <span
                  v-for="(title, titleIndex) in roleTitleSort(role.roles)"
                  v-show="!isEditingRule"
                  :key="`${titleIndex}-${title.index}`"
                  class="dispute-overview-view__info-line-description"
                >
                  {{ buildRoleTitle(role.party, title) }}
                  <jus-vexatious-alert
                    v-if="showVexatious(role.personProperties) && !role.roles.includes('NEGOTIATOR')"
                    :document-number="role.documentNumber"
                    :name="role.name"
                  />
                </span>

                <div
                  v-if="role.party === 'UNKNOWN'"
                  class="dispute-overview-view__select-role"
                >
                  <el-select
                    v-model="tempRole"
                    size="mini"
                    placeholder="Defina o polo desta parte"
                    @change="handleUnknowParty(role)"
                  >
                    <el-option
                      v-for="(party, partyKey) in dispuesToUnknownParties"
                      :key="`UNKNOWN-${partyKey}`"
                      :label="party.label"
                      :value="partyKey"
                    />
                  </el-select>
                </div>
              </div>
              <div
                v-show="role.documentNumber"
                class="dispute-overview-view__info-line"
              >
                <span class="title">CPF/CNPJ:</span>
                <span>{{ role.documentNumber | cpfCnpj }}</span>
              </div>
              <div
                v-show="role.birthday"
                class="dispute-overview-view__info-line"
              >
                <span class="title">Data de nascimento:</span>
                <span>{{ role.birthday | moment('DD/MM/YYYY') }}</span>
              </div>
              <div
                v-show="role.party === 'CLAIMANT'"
                class="dispute-overview-view__info-line"
              >
                <span class="title">Portal de comunicação Justto:</span>
                <span
                  v-if="role.party === 'CLAIMANT'"
                  class="dispute-overview-view__negotiator-icon"
                  @click="sendMessageToNegotiator(role)"
                >
                  <jus-icon
                    class="icon"
                    icon="negotiation"
                  />
                  <span class="text">
                    {{ role.name.toLowerCase() }}
                  </span>
                </span>
              </div>
              <div
                v-show="role.phones.length"
                class="dispute-overview-view__info-line"
              >
                <span class="title">Telefone(s):</span>
                <span
                  v-for="(phone, phone_index) in role.phones.filter(p => !p.archived)"
                  :key="`${phone_index}-${phone.id}`"
                  :class="{'is-main': phone.isMain}"
                >
                  <el-radio
                    v-model="selectedPhone"
                    :label="phone.id"
                    :disabled="!phone.isMobile"
                    data-testid="radio-whatsapp"
                    @change="updateDisputeRole(role, 'whatsapp')"
                  >
                    <el-tooltip
                      :content="buildContactStatus(phone)"
                      :open-delay="500"
                    >
                      <span :class="phone.source === 'ENRICHMENT' ? 'dispute-overview-view__is-enriched' : ''">
                        {{ phone.number | phoneNumber }}<span v-if="phone.source === 'ENRICHMENT'">*</span>
                      </span>
                    </el-tooltip>
                  </el-radio>
                  <!-- <div class="alerts"> -->
                  <el-tooltip content="Este número não receberá mensagens automáticas">
                    <jus-icon
                      v-show="!phone.isMain"
                      icon="not-main-phone-active"
                    />
                  </el-tooltip>
                  <el-tooltip content="Telefone inválido">
                    <jus-icon
                      v-show="!phone.isValid"
                      icon="warn-dark"
                    />
                  </el-tooltip>
                  <!-- </div> -->
                </span>
              </div>
              <div
                v-show="role.emails.length"
                class="dispute-overview-view__info-line"
              >
                <span class="title">E-mail(s):</span>
                <span
                  v-for="(email, email_index) in role.emails.filter(e => !e.archived)"
                  :key="`${email_index}-${email.id}`"
                  :class="{'is-main': email.isMain}"
                >
                  <el-checkbox
                    v-model="email.selected"
                    data-testid="checkbox-email"
                    @change="updateDisputeRole(role, 'email')"
                  />
                  <el-tooltip
                    :content="buildContactStatus(email)"
                    :open-delay="500"
                  >
                    <span :class="email.source === 'ENRICHMENT' ? 'dispute-overview-view__is-enriched' : ''">
                      {{ email.address }}<span v-if="email.source === 'ENRICHMENT'">*</span>
                    </span>
                  </el-tooltip>
                  <div class="alerts">
                    <el-tooltip content="Este e-mail não receberá mensagens automáticas">
                      <jus-icon
                        v-show="!email.isMain"
                        icon="not-main-email-active"
                      />
                    </el-tooltip>
                    <el-tooltip content="E-mail inválido">
                      <jus-icon
                        v-show="!email.isValid"
                        icon="warn-dark"
                      />
                    </el-tooltip>
                  </div>
                </span>
              </div>
              <div
                v-show="role.oabs.length"
                class="dispute-overview-view__info-line"
              >
                <span class="title">OAB(s):</span>
                <span
                  v-for="(oab, oab_index) in role.oabs.filter(o => !o.archived)"
                  :key="`${oab_index}-${oab.id}`"
                  :class="{'is-main': oab.isMain}"
                >
                  <span>
                    <el-popover
                      :ref="`popover-${oab.number}-${oab.state}`"
                      popper-class="dispute-overview-view__info-popover-lawyer"
                      placement="top"
                      trigger="click"
                      @hide="deactivePopover(`popover-${oab.number}-${oab.state}`)"
                    >
                      <lawyer-detail
                        @update="updateDisputeRoleField(role, $event)"
                      />
                      <i
                        slot="reference"
                        class="el-icon-info"
                        @click="searchThisLawyer({...role, oabs: [oab]}, `popover-${oab.number}-${oab.state}`)"
                      />
                    </el-popover>
                    {{ oab.number + '-' + oab.state || '' }}
                  </span>
                  <div class="alerts">
                    <el-tooltip content="OAB inválido">
                      <jus-icon
                        v-show="!oab.isValid"
                        icon="warn-dark"
                      />
                    </el-tooltip>
                  </div>
                </span>
              </div>
              <div
                v-if="role.bankAccounts && role.bankAccounts.length"
                class="dispute-overview-view__info-line"
              >
                <span class="title">Conta(s) bancária(s):</span>
                <el-tooltip content="Selecione as contas bancárias que serão vinculadas à Disputa">
                  <i
                    class="el-icon-question right"
                    style="margin-top: 5px;"
                  />
                </el-tooltip>
                <el-tooltip
                  :disabled="dispute.status !== 'PRE_NEGOTIATION'"
                  placement="left"
                  content="Disputas em pré negociação não podem ser editadas"
                >
                  <el-checkbox-group
                    v-model="disputeBankAccountsIds"
                    :disabled="dispute.status === 'PRE_NEGOTIATION'"
                    class="dispute-overview-view__bank-checkbox"
                  >
                    <el-checkbox
                      v-for="(bankAccount, bank_account_index) in role.bankAccounts.filter(b => !b.archived)"
                      :key="`${bank_account_index}-${bankAccount.id}`"
                      :label="bankAccount.id"
                      border
                      class="bordered"
                    >
                      <div v-show="bankAccount.name">
                        <strong>Nome:</strong> {{ bankAccount.name }}
                      </div>
                      <div v-show="bankAccount.email">
                        <strong>E-mail:</strong> {{ bankAccount.email }}
                      </div>
                      <div><strong>Documento:</strong> {{ bankAccount.document | cpfCnpj }}</div>
                      <div><strong>Banco:</strong> {{ bankAccount.bank }}</div>
                      <div><strong>Agência:</strong> {{ bankAccount.agency }}</div>
                      <div><strong>Conta:</strong> {{ bankAccount.number }}</div>
                      <div><strong>Tipo:</strong> {{ bankAccount.type === 'SAVING' ? 'Poupança' : 'Corrente' }}</div>
                    </el-checkbox>
                  </el-checkbox-group>
                </el-tooltip>
              </div>
              <el-tooltip
                :disabled="dispute.status !== 'PRE_NEGOTIATION'"
                content="Disputas em pré negociação não podem ser editadas"
              >
                <div
                  v-if="!role.roles.includes('NEGOTIATOR')"
                  class="dispute-overview-view__actions"
                >
                  <el-button
                    :disabled="dispute.status === 'PRE_NEGOTIATION'"
                    plain
                    @click="removeRole(role)"
                  >
                    Excluir
                  </el-button>
                  <el-button
                    :disabled="dispute.status === 'PRE_NEGOTIATION'"
                    type="primary"
                    data-testid="edit-part"
                    @click="openRoleDialog(role)"
                  >
                    Editar
                  </el-button>
                </div>
              </el-tooltip>
            </el-collapse-item>
            <el-tooltip
              :disabled="dispute.status !== 'PRE_NEGOTIATION'"
              content="Disputas em pré negociação não podem ser editadas"
            >
              <span>
                <el-button
                  :disabled="dispute.status === 'PRE_NEGOTIATION'"
                  class="dispute-overview-view__add-role mb20"
                  plain
                  icon="el-icon-plus"
                  @click.prevent="newRoleDialogVisible = true"
                >
                  Cadastrar parte
                </el-button>
              </span>
            </el-tooltip>
          </el-collapse>
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
                  v-mask="'XXXXXXX-XX.XXXX.X.XX.XXXX'"
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
                v-model="disputeForm.awaysContactParty"
                @input="$forceUpdate()"
              />
            </el-col>
            <el-tooltip
              content="Sempre engaja autor está habilitado"
              :disabled="!disputeForm.awaysContactParty"
            >
              <el-col
                :span="24"
                :style="disputeForm.awaysContactParty ? 'cursor: not-allowed' : ''"
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
                  :disabled="disputeForm.awaysContactParty"
                />
              </el-col>
            </el-tooltip>
            <el-tooltip
              content="Sempre engaja autor está habilitado"
              :disabled="!disputeForm.awaysContactParty"
            >
              <el-col
                :span="24"
                :style="disputeForm.awaysContactParty ? 'cursor: not-allowed' : ''"
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
                  :disabled="disputeForm.awaysContactParty"
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
                  content="Alçada máxima zerada. Coloque uma alçada máxima para poder alterar o valor proposto."
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
                label="Alçada máxima"
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
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="editRoleDialogVisible"
        width="40%"
      >
        <span
          slot="title"
          class="el-dialog__title"
        >
          Alterar dados de {{ roleForm.title }}
        </span>
        <el-alert
          v-show="editRoleDialogError"
          type="error"
          @close="editRoleDialogError = false"
        >
          <ul>
            <li
              v-for="(error, index) in editRoleDialogErrorList"
              :key="`${index}-${error}`"
            >
              {{ error }}
            </li>
          </ul>
        </el-alert>
        <el-form
          ref="roleForm"
          v-loading="editRoleDialogLoading"
          :model="roleForm"
          :rules="roleRules"
          label-position="top"
          @submit.native.prevent
        >
          <el-form-item
            label="Nome"
            prop="name"
          >
            <el-input
              v-model="roleForm.name"
              autofocus=""
            />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                :rules="validateDocumentNumber"
                label="CPF/CNPJ"
                prop="documentNumber"
              >
                <el-input
                  v-model="roleForm.documentNumber"
                  v-mask="['###.###.###-##', '##.###.###/####-##']"
                  @change="documentNumberHasChanged = true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Data de nascimento"
                prop="birthday"
              >
                <el-date-picker
                  v-model="roleForm.birthday"
                  :disabled="!canEditBirthday"
                  :clearable="false"
                  format="dd/MM/yyyy"
                  type="date"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div
            v-if="roleForm.roles && roleForm.roles.includes('LAWYER')"
            class="dispute-overview-view__oab-form"
          >
            <el-form-item
              class="oab"
              label="OAB"
              prop="oab"
            >
              <el-input
                v-model="roleForm.oab"
                @keydown.enter.native="addOab(roleForm.personId, roleForm.oabs)"
                @blur="addOab(roleForm.personId, roleForm.oabs)"
              />
            </el-form-item>
            <el-form-item
              class="state"
              label="Estado"
              prop="state"
            >
              <el-select
                v-model="roleForm.state"
                :default-first-option="true"
                autocomplete="off"
                placeholder=""
                filterable
                @keydown.enter.native="addOab(roleForm.personId, roleForm.oabs)"
                @change="addOab(roleForm.personId, roleForm.oabs)"
                @blur="addOab(roleForm.personId, roleForm.oabs)"
              >
                <el-option
                  v-for="state in $store.state.brazilianStates"
                  :key="state.value"
                  :label="state.value"
                  :value="state.value"
                />
              </el-select>
            </el-form-item>
            <el-button
              class="button"
              type="primary"
              @click="addOab(roleForm.personId, roleForm.oabs)"
            >
              <jus-icon icon="add-white" />
            </el-button>
          </div>
          <el-table
            v-if="roleForm.roles && roleForm.roles.includes('LAWYER')"
            :data="roleForm.oabs"
            :show-header="false"
            fit
            class="el-table--list"
          >
            <el-table-column>
              <div slot-scope="scope">
                {{ scope.row.number + '-' + scope.row.state || '' }}
              </div>
            </el-table-column>
            <el-table-column
              fixed="right"
              align="right"
              width="48px"
              class-name="visible"
            >
              <template slot-scope="scope">
                <a
                  href="#"
                  @click.prevent="removeOab(scope.$index)"
                >
                  <jus-icon icon="trash" />
                </a>
              </template>
            </el-table-column>
          </el-table>
          <el-form-item
            label="Telefone"
            prop="phone"
          >
            <el-input
              v-model="roleForm.phone"
              v-mask="['(##) ####-####', '(##) #####-####']"
              @keydown.enter.native="addPhone()"
              @blur="addPhone()"
            >
              <el-button
                slot="append"
                @click="addPhone()"
              >
                <jus-icon icon="add-white" />
              </el-button>
            </el-input>
          </el-form-item>
          <el-table
            :data="roleForm.phones"
            :show-header="false"
            fit
            class="el-table--list"
          >
            <el-table-column>
              <div slot-scope="scope">
                {{ scope.row.number | phoneNumber }}
              </div>
            </el-table-column>
            <el-table-column
              fixed="right"
              align="right"
              width="114px"
              class-name="visible slot-scope"
            >
              <template slot-scope="scope">
                <el-tooltip
                  :open-delay="500"
                  :content="scope.row.isMain ? 'Este número receberá mensagens automáticas' : 'Este número não recberá mensagens automáticas'"
                >
                  <span class="dispute-overview-view__switch-main">
                    <jus-icon
                      v-if="scope.row.isMain"
                      icon="phone-active"
                    />
                    <jus-icon
                      v-else
                      icon="not-main-phone-active"
                    />
                    <el-switch v-model="scope.row.isMain" />
                  </span>
                </el-tooltip>
                <a
                  href="#"
                  @click.prevent="removePhone(scope.$index)"
                >
                  <jus-icon icon="trash" />
                </a>
              </template>
            </el-table-column>
          </el-table>
          <el-form-item
            label="E-mail"
            prop="email"
          >
            <el-input
              v-model="roleForm.email"
              data-testid="input-email"
              @keydown.enter.native="addEmail()"
              @blur="addEmail()"
            >
              <el-button
                slot="append"
                data-testid="add-email"
                @click="addEmail()"
              >
                <jus-icon icon="add-white" />
              </el-button>
            </el-input>
          </el-form-item>
          <el-table
            :data="roleForm.emails"
            :show-header="false"
            fit
            class="el-table--list"
          >
            <el-table-column>
              <span slot-scope="scope">
                {{ scope.row.address }}
              </span>
            </el-table-column>
            <el-table-column
              fixed="right"
              align="right"
              width="114px"
              class-name="visible slot-scope"
            >
              <template slot-scope="scope">
                <el-tooltip
                  :open-delay="500"
                  :content="scope.row.isMain ? 'Este e-mail receberá mensagens automáticas' : 'Este e-mail não recberá mensagens automáticas'"
                >
                  <span class="dispute-overview-view__switch-main">
                    <jus-icon
                      v-if="scope.row.isMain"
                      icon="email-active"
                    />
                    <jus-icon
                      v-else
                      icon="not-main-email-active"
                    />
                    <el-switch v-model="scope.row.isMain" />
                  </span>
                </el-tooltip>
                <a
                  href="#"
                  @click.prevent="removeEmail(scope.$index)"
                >
                  <jus-icon icon="trash" />
                </a>
              </template>
            </el-table-column>
          </el-table>
          <h4>
            Contas bancárias
            <a
              href="#"
              style="float: right;width: 16px;margin-top: 1px;margin-right: 23px;"
              @click.prevent="openAddBankDialog()"
            >
              <el-tooltip content="Adicionar conta bancária">
                <jus-icon icon="add-bold" />
              </el-tooltip>
            </a>
          </h4>
          <el-table
            :data="roleForm.bankAccounts"
            :show-header="false"
            fit
            class="el-table--list"
          >
            <el-table-column>
              <section slot-scope="scope">
                <span>
                  {{ scope.row.name }}
                </span>
                <div style="font-size: 12px;">
                  {{ scope.row.bank }} | {{ scope.row.agency }} | {{ scope.row.number }}
                </div>
              </section>
            </el-table-column>
            <el-table-column
              fixed="right"
              align="right"
              width="48px"
              class-name="visible"
            >
              <template slot-scope="scope">
                <a
                  href="#"
                  @click.prevent="removeBankData(scope.$index, scope.row.id)"
                >
                  <jus-icon icon="trash" />
                </a>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <span slot="footer">
          <el-button
            plain
            @click="editRoleDialogVisible = false"
          >Cancelar</el-button>
          <el-button
            :loading="editRoleDialogLoading"
            type="primary"
            data-testid="edit-data-part"
            @click="editRole"
          >
            Editar dados
          </el-button>
        </span>
      </el-dialog>
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
      />
      <associate-contacts-modal
        v-model="showAssociateContacts"
        :current="dispute.properties['CONTATOS ASSOCIADOS']"
        :parties="dispute.disputeRoles"
        :metadata="disputeMetadata"
      />
    </div>
  </div>
</template>

<script>
import { getRoles, buildRoleTitle, getRoleIcon } from '@/utils'
import { validateName, validateDocument, validatePhone, validateZero } from '@/utils/validations'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'DisputeOverview',
  components: {
    DisputeAttachments: () => import('./sections/DisputeAttachments'),
    DisputeAddRole: () => import('../DisputeAddRole'),
    DisputeCodeLink: () => import('@/components/buttons/DisputeCodeLink'),
    DisputeProperties: () => import('../DisputeProperties'),
    JusTags: () => import('@/components/others/JusTags'),
    JusTimeline: () => import('@/components/JusTimeline/JusTimeline'),
    JusVexatiousAlert: () => import('@/components/dialogs/JusVexatiousAlert'),
    LawyerDetail: () => import('./sections/LawyerDetail'),
    AssociateContactsModal: () => import('@/components/dialogs/AssociateContactsModal')
  },
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
      isEditingRule: false,
      disputeTimelineModal: false,
      overviewTab: 'general',
      namesakeList: [],
      namesakeDialogVisible: false,
      namesakeDialogLoading: false,
      namesakeButtonLoading: false,
      namesakeProcessing: false,
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
      dispuesToUnknownParties: [
        {
          value: { party: 'RESPONDENT' },
          label: 'Réu'
        },
        {
          value: { party: 'CLAIMANT' },
          label: 'Parte contrária'
        }
      ],
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
      onlineDocuments: 'onlineDocuments',
      strategies: 'getMyStrategiesLite'
    }),
    campaign() {
      return this.dispute?.campaign
    },
    skipEnrichment() {
      return this.dispute?.campaign?.skipEnrichment
    },
    onlineList() {
      return Object.keys(this.onlineDocuments) || []
    },
    contactsMetadataCount() {
      const { phones, emails } = this.disputeMetadata
      return phones.length + emails.length
    },
    canEditBirthday() {
      return this.roleForm.party === 'CLAIMANT' && this.roleForm.personType === 'NATURAL' && this.roleForm.roles && (this.roleForm.roles.includes('LAWYER') || this.roleForm.roles.includes('PARTY'))
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
    validateDocumentNumber() {
      if (this.documentNumberHasChanged) {
        return [{ validator: validateDocument, message: 'CPF/CNPJ inválido.', trigger: 'submit' }]
      }
      return []
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
    computedDescription() {
      if (this.dispute.description && this.dispute.description.length > 140) {
        if (this.descriptionCollapse) {
          return this.dispute.description.substring(0, 140) + '...'
        }
      }
      return this.dispute.description
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
        // Ocultar o advogado do reu
        // sortedArray = sortedArray.filter(({ party, roles }) => !(party === 'RESPONDENT' && roles.includes('LAWYER')))
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
            role.oabs.map(oab => oabs.push(oab.number + oab.state))
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
    'dispute.code'() {
      this.getDisputeTimeline(this.dispute.code)
    },
    showAssociateContacts() {
      this.checkTabByAssociatedContractValue(this.showAssociateContacts)
    },
    dispute(newew, old) {
      if ((!old || !old.id) && newew.properties) {
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
              break
          }
        })
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
      'hideSearchLawerLoading',
      'removeDispute',
      'searchLawyers',
      'setDisputeparty',
      'addPhoneToDisputeRole',
      'addOabToDisputeRole',
      'getDisputeMetadata',
      'setDisputeProperty'
    ]),

    init() {
      this.populateTimeline()
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

    openAssociationModal() {
      this.setDisputeProperty({
        disputeId: this.dispute.id,
        key: 'CONTATOS ASSOCIADOS',
        value: 'NAO'
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
      if (message) {
        this.$jusNotification({
          title: 'Yay!',
          message: message,
          type: 'success'
        })
      }
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

    deactivePopover(ref) {
      this.$refs[ref][0].$el.classList.remove('active-popover')
    },

    searchThisLawyer(lawyer, ref) {
      if (!this.$refs[ref][0].showPopper) {
        this.$refs[ref][0].$el.classList.add('active-popover')
        this.searchLawyers(lawyer).finally(this.hideSearchLawerLoading)
      }
    },

    disputeUpperRangeChangedHandler() {
      this.disputeUpperRangeHasChanged = true
      if (this.disputeForm.disputeUpperRange > 0) {
        this.disputeForm.lastOfferValue = this.disputeForm.disputeUpperRange
      }
    },
    isToShowChangeParty({ party, roles }) {
      return this.isEditingRule && party !== 'UNKNOWN'
    },

    isNegotiator({ roles }) {
      return roles.includes('NEGOTIATOR')
    },

    getDisputePartys(roles) {
      if (roles.includes('PARTY')) {
        return [
          { value: 'RESPONDENT', label: 'Réu' },
          { value: 'CLAIMANT', label: 'Parte contrária' }
        ]
      } else if (roles.includes('LAWYER')) {
        return [
          { value: 'RESPONDENT', label: 'Advogado do réu' },
          { value: 'CLAIMANT', label: 'Advogado da parte contrária' }
        ]
      } else {
        return []
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
      this.isEditingRule = !this.isEditingRule
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
    getRoleIcon: (...i) => getRoleIcon(...i),
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
    showNamesake(role) {
      return role.namesake && !role.documentNumber
    },
    showVexatious(personProperties) {
      if (personProperties.IS_VEXATIOUS_AUTHOR === 'true' || personProperties.IS_VEXATIOUS_LAWYER === 'true' || personProperties.IS_VEXATIOUS_PARTY === 'true') return true
      return false
    },
    showIsDead(role) {
      return role.dead
    },
    buildContactStatus(contact) {
      if (!contact.address && !contact.isMobile) {
        return 'Não é possível enviar WhatsApp para números de telefones fixo'
      } else if (contact.source === 'ENRICHMENT') {
        return 'Contato enriquecido pelo sistema Justto'
      } else {
        return 'Contato adicionado manualmente'
      }
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
    namesakeDialog(name, personId) {
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
          if (this.dispute.denySavingDeposit) {
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
    roleTitleSort(title) {
      if (title) {
        const sortedArray = title.slice(0) || []
        return sortedArray.sort((a, b) => {
          return (a[0] > b[0]) ? -1 : (a[0] < b[0]) ? 1 : 0
        })
      } return []
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
      this.disputeForm.expirationDate = dispute.expirationDate.dateTime
      this.disputeForm.description = dispute.description
      this.disputeForm.materialDamage = dispute.materialDamage || ''
      this.disputeForm.moralDamage = dispute.moralDamage || ''
      this.disputeForm.requestedValue = dispute.requestedValue || ''
      this.disputeForm.externalId = dispute.externalId || ''
      this.disputeForm.provisionedValue = dispute.provisionedValue || ''
      this.disputeForm.classification = dispute.classification && dispute.classification.name ? dispute.classification.name : ''
      this.disputeForm.contactPartyWhenNoLowyer = dispute.contactPartyWhenNoLowyer
      this.disputeForm.contactPartyWhenInvalidLowyer = dispute.contactPartyWhenInvalidLowyer
      this.disputeForm.awaysContactParty = dispute.awaysContactParty
      this.disputeForm.denySavingDeposit = dispute.denySavingDeposit
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
          this.$msgbox({
            title: 'Atenção!',
            message: h('p', null, [
              h('div', null, '- As novas informações vão sobrescrever as antigas.'),
              this.disputeForm.lastOfferValue > this.disputeForm.disputeUpperRange
                ? h('div', null, '- Alçada máxima está abaixo do valor proposto.') : null,
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
            disputeToEdit.awaysContactParty = this.disputeForm.awaysContactParty
            disputeToEdit.denySavingDeposit = this.disputeForm.denySavingDeposit
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
            const awaysContactParty = this.dispute.awaysContactParty
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
              const awaysContactPartyChanged = this.disputeForm.awaysContactParty !== awaysContactParty
              const contactPartyHasChanged = contactPartyWhenInvalidLowyerHasChanged || contactPartyWhenNoLowyerHasChanged || awaysContactPartyChanged
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
      this.isEditingRule = false
    },
    openRoleDialog(role) {
      this.bankAccountIdstoUnlink = []
      this.editRoleDialogError = false
      this.editRoleDialogVisible = true
      this.roleForm = JSON.parse(JSON.stringify(role))
      this.originalRole = JSON.parse(JSON.stringify(role))
      this.roleForm.title = this.buildRoleTitle(role.party, role.roles[0])
      this.roleForm.documentNumber = this.$options.filters.cpfCnpj(this.roleForm.documentNumber)
      if (role.birthday) this.roleForm.birthday = this.$moment(role.birthday).format('YYYY-MM-DD')
      this.roleForm.emails = this.roleForm.emails.filter(f => !f.archived)
      this.roleForm.oabs = this.roleForm.oabs.filter(f => !f.archived)
      this.roleForm.phones = this.roleForm.phones.filter(f => !f.archived)
      if (this.roleForm.emails.length) this.roleForm.emails = this.roleForm.emails.sort(e => e.isMain ? -1 : 1)
      if (this.roleForm.phones.length) this.roleForm.phones = this.roleForm.phones.sort(p => p.isMain ? -1 : 1)
      if (this.$refs.roleForm) this.$refs.roleForm.clearValidate()
    },
    editRole() {
      let isValid = true
      this.$refs.roleForm.validateField(['name', 'documentNumber'], errorMessage => {
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
            // this.updateDisputeBankAccounts(newBankAccount.id)
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
    addPhone() {
      let isValid = true
      this.roleForm.phone = this.roleForm.phone.trim()
      this.$refs.roleForm.validateField('phone', errorMessage => {
        if (errorMessage || !this.roleForm.phone) isValid = false
      })
      if (isValid) {
        const self = this
        this.roleForm.phone = this.roleForm.phone.replace(/ /g, '').replace(/\D/g, '')
        const isDuplicated = this.roleForm.phones.findIndex(p => {
          const number = p.number.startsWith('55') ? p.number.replace('55', '') : p.number
          return number === self.roleForm.phone
        })
        if (isDuplicated < 0) this.roleForm.phones.push({ number: this.roleForm.phone, isMain: true })
        this.roleForm.phone = ''
      }
    },
    removePhone(index) {
      this.roleForm.phones.splice(index, 1)
    },
    addEmail() {
      let isValid = true
      this.roleForm.email = this.roleForm.email.trim()
      this.$refs.roleForm.validateField('email', errorMessage => {
        if (errorMessage || !this.roleForm.email) isValid = false
      })
      if (isValid) {
        const self = this
        const isDuplicated = this.roleForm.emails.findIndex(e => e.address === self.roleForm.email)
        if (isDuplicated < 0) this.roleForm.emails.push({ address: this.roleForm.email, isMain: true })
        this.roleForm.email = ''
      }
    },
    removeEmail(index) {
      this.roleForm.emails.splice(index, 1)
    },
    addOab() {
      let isValid = true
      this.$refs.roleForm.validateField(['oab', 'state'], errorMessage => {
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
    removeOab(index) {
      this.roleForm.oabs.splice(index, 1)
    },
    removeRole(role) {
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
    setDisputeParty(role) {
      this.$jusSegment('Definindo função em participante da disputa', {
        page: this.$route.name
      })
      this.setDisputeparty({
        disputeId: this.dispute.id,
        disputeRoleId: role.id,
        disputeParty: role.party
      })
        .then(() => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Função definida com sucesso!',
            type: 'success',
            dangerouslyUseHTMLString: true
          })
        }).finally(() => {
          this.isEditingRule = false
          this.getDisputeProperties(this.dispute.id)
        })
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
        color: #adadad;
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
    color: #9461f7;
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
      color: #9461f7;
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
        border: 2px solid #9461f7;
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
    border-top: 1px solid #9461f7;
    border-bottom: 1px solid #9461f7;
    &:first-child {
      border-left: 1px solid #9461f7
    }
    &:last-child {
      border-right: 1px solid #9461f7
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
