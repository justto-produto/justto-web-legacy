<template lang="html">
  <div v-loading="loading || linkBankAccountLoading" class="dispute-overview-view">
    <el-collapse value="1">
      <el-collapse-item title="Informações gerais" name="1">
        <div v-if="dispute.createAt" class="dispute-overview-view__info-line" data-testid="dispute-infoline" style="margin: 0">
          <span class="title">Data de importação:</span>
          <span>{{ dispute.createAt.dateTime | moment('DD/MM/YY') }}</span>
        </div>
        <div class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span class="title">Processo:</span>
          <span>{{ dispute.code }}</span>
        </div>
        <div v-if="dispute.campaign" class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span class="title">Campanha:</span>
          <span>{{ dispute.campaign.name }}</span>
        </div>
        <div v-if="dispute.strategyName" class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span class="title">Estratégia:</span>
          <span data-testid="overview-strategy">{{ dispute.strategyName }}</span>
        </div>
        <div class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span class="title">Status:</span>
          <el-tooltip v-if="dispute.status === 'PENDING'" content="Faltam dados de contato da parte ou do advogado da parte">
            <span data-testid="overview-status">
              {{ $t('occurrence.type.' + dispute.status) | capitalize }}
              <el-tooltip content="Selecione">
                <span class="el-icon-question" />
              </el-tooltip>
            </span>
          </el-tooltip>
          <span v-else>
            <span data-testid="overview-status">
              {{ $t('occurrence.type.' + dispute.status) | capitalize }}
              <span v-if="dispute.paused">(pausada)</span>
            </span>
          </span>
        </div>
        <div v-if="dispute.classification" class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span class="title">Classificação:</span>
          <span>{{ dispute.classification.name | capitalize }}</span>
        </div>
        <div class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span class="title">Alçada máxima:</span>
          <span data-testid="overview-upperrange">{{ dispute.disputeUpperRange | currency }}</span>
        </div>
        <div class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span class="title">Valor proposto:</span>
          <span data-testid="overview-proposal">
            <el-tooltip v-if="dispute.lastOfferName" :content="'Proposto por: ' + dispute.lastOfferName">
              <jus-avatar-user :name="dispute.lastOfferName" size="mini" />
            </el-tooltip>
            {{ dispute.lastOfferValue | currency }}
          </span>
        </div>
        <div class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span class="title">Contraproposta:</span>
          <span data-testid="overview-counterproposal">
            <el-tooltip v-if="dispute.lastCounterOfferName" :content="'Proposto por: ' + dispute.lastCounterOfferName">
              <jus-avatar-user :name="dispute.lastCounterOfferName" size="mini" />
            </el-tooltip>
            {{ dispute.lastCounterOfferValue | currency }}
          </span>
        </div>
        <div
          v-if="(dispute.status === 'ACCEPTED' || dispute.status === 'CHECKOUT' || dispute.status === 'SETTLED') && dispute.disputeDealValue"
          class="dispute-overview-view__info-line">
          <span class="title">Valor do acordo:</span>
          <span>{{ dispute.disputeDealValue | currency }}</span>
        </div>
        <div class="dispute-overview-view__info-line" data-testid="dispute-infoline">
          <span class="title">Fim da negociação:</span>
          <span v-if="dispute.expirationDate" data-testid="overview-expirationdate">{{ dispute.expirationDate.dateTime | moment('DD/MM/YY') }}</span>
        </div>
        <div v-if="computedDescription" class="dispute-overview-view__info-line">
          <span class="title">Descrição:</span>
          <span>
            <span :class="{ 'right': computedDescription.length < 25 }" data-testid="overview-description">
              {{ computedDescription }}
              <span v-if="dispute.description.length > 140">
                <a href="#" class="dispute-overview-view__see-more" @click.prevent="descriptionCollapse = !descriptionCollapse">
                  {{ descriptionCollapse ? 'ver mais': 'ver menos' }}
                  <i :class="descriptionCollapse ? 'el-icon-arrow-down': 'el-icon-arrow-up'" />
                </a>
              </span>
            </span>
          </span>
        </div>
        <div v-if="dispute.bankAccounts && dispute.bankAccounts.length" class="dispute-overview-view__info-line">
          <span class="title">Conta(s) bancária(s):</span>
          <el-collapse value="0">
            <el-collapse-item
              v-for="(bankAccount, index) in dispute.bankAccounts"
              :key="`${index}-${bankAccount.id}`"
              :name="index"
              class="dispute-overview-view__bank-collapse">
              <template slot="title">
                <div>
                  {{ bankAccount.name || bankAccount.document | cpfCnpjMask }}
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
                <strong>Documento:</strong> {{ bankAccount.document | cpfCnpjMask }} <br>
                <strong>Banco:</strong> {{ bankAccount.bank }} <br>
                <strong>Agência:</strong> {{ bankAccount.agency }} <br>
                <strong>Conta:</strong> {{ bankAccount.number }} <br>
                <strong>Tipo:</strong> {{ bankAccount.type === 'SAVING' ? 'Poupança' : 'Corrente' }} <br>
              </span>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="dispute-overview-view__actions">
          <el-button type="primary" data-testid="edit-dispute" @click="openDisputeDialog()">Editar</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-collapse value="1">
      <el-collapse-item title="Partes" name="1">
        <el-collapse
          ref="roleCollapse"
          v-model="selectedRole"
          accordion
          class="el-collapse--bordered"
          style="margin: 20px 0 0"
          @change="handleChange">
          <el-collapse-item
            v-for="(role, index) in disputeRolesSort"
            :key="`${index}-${role.personId}`"
            :name="role.id"
            class="dispute-overview-view__role-collapse"
            data-testid="expand-party">
            <template slot="title">
              <i v-if="showNamesake(role)" class="el-icon-warning-outline el-icon-pulse" style="color: rgb(255, 201, 0);position: absolute;top: 0px;left: 4px;font-size: 30px;background-color: #fff0;" />
              <div class="dispute-overview-view__name">
                {{ role.name }}
              </div>
            </template>
            <p v-if="showNamesake(role)" style="margin-top: 0">
              Esta parte não foi enriquecida corretamente devido à existência de homônimos.
            </p>
            <el-button
              v-if="showNamesake(role)"
              :loading="namesakeButtonLoading"
              type="warning"
              style="width: 100%; margin-bottom: 14px;"
              @click="namesakeDialog(role.name, role.personId)">
              Tratar homônimos
            </el-button>
            <div class="dispute-overview-view__info-line" style="margin: 0">
              <span class="title">Função:</span>
              <span v-for="(title, index) in roleTitleSort(role.roles)" :key="`${index}-${title.index}`">
                {{ buildTitle(role.party, title) }}
              </span>
            </div>
            <div v-show="role.documentNumber" class="dispute-overview-view__info-line">
              <span class="title">CPF/CNPJ:</span>
              <span>{{ role.documentNumber | cpfCnpjMask }}</span>
            </div>
            <div v-show="role.phones.length" class="dispute-overview-view__info-line">
              <span class="title">Telefone(s):</span>
              <span v-for="(phone, index) in role.phones.filter(p => !p.archived)" :key="`${index}-${phone.id}`" :class="{'is-main': phone.isMain}">
                <el-radio v-model="selectedPhone" :label="phone.id" data-testid="radio-whatsapp" @change="updateDisputeRole(role, 'whatsapp')">
                  <span class="ellipsis">
                    <span>{{ phone.number | phoneMask }}</span>
                    <el-tooltip content="Telefone inválido">
                      <jus-icon v-show="!phone.isValid" icon="warn-dark" />
                    </el-tooltip>
                  </span>
                </el-radio>
              </span>
            </div>
            <div v-show="role.emails.length" class="dispute-overview-view__info-line">
              <span class="title">E-mail(s):</span>
              <span v-for="(email, index) in role.emails.filter(p => !p.archived)" :key="`${index}-${email.id}`" :class="{'is-main': email.isMain}">
                <el-checkbox v-model="email.selected" data-testid="checkbox-email" @change="updateDisputeRole(role, 'email')" />
                <span class="ellipsis">
                  <span>{{ email.address }}</span>
                  <el-tooltip content="E-mail inválido">
                    <jus-icon v-show="!email.isValid" icon="warn-dark" />
                  </el-tooltip>
                </span>
              </span>
            </div>
            <div v-show="role.oabs.length" class="dispute-overview-view__info-line">
              <span class="title">OAB(s):</span>
              <span v-for="(oab, index) in role.oabs.filter(o => !o.archived)" :key="`${index}-${oab.id}`" :class="{'is-main': oab.isMain}">
                <el-checkbox v-model="oab.selected" @change="updateDisputeRole(role, 'cna')" />
                <span class="ellipsis">
                  <span>{{ oab.number + '-' + oab.state || '' }}</span>
                  <el-tooltip content="OAB inválido">
                    <jus-icon v-show="!oab.isValid" icon="warn-dark" />
                  </el-tooltip>
                </span>
              </span>
            </div>
            <div v-if="role.bankAccounts && role.bankAccounts.length" class="dispute-overview-view__info-line">
              <span class="title">Conta(s) bancária(s):</span>
              <el-tooltip content="Selecione as contas bancárias que serão vinculadas à Disputa">
                <i class="el-icon-question right" style="margin-top: 5px;" />
              </el-tooltip>
              <el-checkbox-group v-model="disputeBankAccountsIds">
                <el-checkbox
                  v-for="(bankAccount, index) in role.bankAccounts.filter(b => !b.archived)"
                  :label="bankAccount.id"
                  :key="`${index}-${bankAccount.id}`"
                  border
                  class="bordered">
                  <span v-show="bankAccount.name">
                    <strong>Nome:</strong> {{ bankAccount.name }} <br>
                  </span>
                  <span v-show="bankAccount.email">
                    <strong>E-mail:</strong> {{ bankAccount.email }} <br>
                  </span>
                  <strong>Documento:</strong> {{ bankAccount.document | cpfCnpjMask }} <br>
                  <strong>Banco:</strong> {{ bankAccount.bank }} <br>
                  <strong>Agência:</strong> {{ bankAccount.agency }} <br>
                  <strong>Conta:</strong> {{ bankAccount.number }} <br>
                  <strong>Tipo:</strong> {{ bankAccount.type === 'SAVING' ? 'Poupança' : 'Corrente' }} <br>
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-if="!role.roles.includes('NEGOTIATOR')" class="dispute-overview-view__actions">
              <el-button plain @click="removeRole(role)">Excluir</el-button>
              <el-button type="primary" data-testid="edit-part" @click="openRoleDialog(role)">Editar</el-button>
            </div>
          </el-collapse-item>
          <el-button
            class="dispute-overview-view__add-role"
            plain
            icon="el-icon-plus"
            @click.prevent="newRoleDialogVisible = true">
            Cadastrar parte
          </el-button>
        </el-collapse>
      </el-collapse-item>
    </el-collapse>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="namesakeDialogVisible"
      title="Corrigir homônimo"
      width="70%">
      <p>Selecione um dos registros abaixo para correção de homônimo e enriquecimento da parte.</p>
      <div v-loading="namesakeDialogLoading">
        <div v-show="selectedNamesake">
          <p>Pessoa selecionada:</p>
          <div v-show="selectedNamesake.name">Nome: <b>{{ selectedNamesake.name }}</b></div>
          <div v-show="selectedNamesake.document">Documento: <b>{{ selectedNamesake.document | cpfCnpjMask }}</b></div>
          <div v-show="selectedNamesake.city">Cidade: <b>{{ selectedNamesake.city }}</b></div>
          <div v-show="selectedNamesake.uf">UF: <b>{{ selectedNamesake.uf }}</b></div>
          <div v-show="selectedNamesake.dateOfBirth">Nascimento: <b>{{ selectedNamesake.dateOfBirth }}</b></div>
        </div>
        <div class="dispute-overview-view__namesake-filters">
          <div class="dispute-overview-view__namesake-filter">
            <span>Cidade: </span>
            <el-select v-model="cityFilter" clearable filterable default-first-option>
              <el-option
                v-for="city in cityList"
                :key="city"
                :label="city"
                :value="city" />
            </el-select>
          </div>
          <div class="dispute-overview-view__namesake-filter">
            <span>UF: </span>
            <el-select v-model="ufFilter" clearable filterable default-first-option>
              <el-option
                v-for="uf in ufList"
                :key="uf"
                :label="uf"
                :value="uf" />
            </el-select>
          </div>
        </div>
        <el-table
          :data="filteredNamesakeList"
          class="dispute-overview-view__namesake-table"
          highlight-current-row
          style="width: 100%"
          @current-change="handleCurrentChange">
          <el-table-column label="Nome" prop="name" />
          <el-table-column label="Documento" prop="document" width="160px">
            <template slot-scope="scope">{{ scope.row.document | cpfCnpjMask }}</template>
          </el-table-column>
          <el-table-column label="Cidade" prop="city" />
          <el-table-column label="UF" prop="uf" width="70px" />
          <el-table-column label="Nascimento" prop="dateOfBirth" width="140px" />
        </el-table>
      </div>
      <span slot="footer">
        <el-button :disabled="namesakeDialogLoading" plain @click="closeNamesakes">Cancelar</el-button>
        <el-button :loading="namesakeDialogLoading" :disabled="!selectedNamesake" type="primary" @click="selectNamesake()">Corrigir</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editDisputeDialogVisible"
      title="Editar disputa"
      width="70%">
      <el-form
        v-loading="editDisputeDialogLoading"
        ref="disputeForm"
        :model="disputeForm"
        :rules="disputeFormRules"
        label-position="top"
        @submit.native.prevent="editDispute">
        <h3>Engajamento</h3>
        <el-row :gutter="20">
          <el-col :span="19">
            <el-form-item label="Estratégia" prop="disputeStrategy">
              <el-select
                v-model="selectedStrategyId"
                placeholder="Escolha a nova estratégia"
                data-testid="strategy-input">
                <el-option
                  v-for="(strategy, index) in strategies"
                  :key="`${strategy.id}-${index}`"
                  :label="strategy.name"
                  :value="strategy.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="sendMessageToParty" style="text-align: center">
              <span slot="label">
                Engajar autor
                <i class="el-icon-question" @click="showHelpBox('sendMessageToParty')" />
              </span>
              <el-switch v-model="disputeForm.sendMessageToParty" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-divider /> -->
        <h3>Valor proposto</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :rules="validateLastOfferValue" label="Valor" prop="lastOfferValue">
              <money v-model="disputeForm.lastOfferValue" class="el-input__inner" data-testid="proposal-value-input" @change.native="lastOfferValueHasChanged = true"/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="Proposto por" prop="lastOfferValueName">
              <el-select v-model="selectedNegotiatorId" placeholder="Autor da contraproposta" data-testid="proposal-negotiator-input">
                <el-option
                  v-for="(negotiator, index) in disputeNegotiations"
                  :key="`${index}-${negotiator.id}`"
                  :label="negotiator.name"
                  :value="negotiator.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-divider /> -->
        <h3>Outras configurações</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :rules="validateDisputeUpperRange" label="Alçada máxima" prop="disputeUpperRange">
              <money v-model="disputeForm.disputeUpperRange" class="el-input__inner" data-testid="bondary-input" @change.native="disputeUpperRangeHasChanged = true"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Fim da negociação" prop="expirationDate">
              <el-date-picker
                v-model="disputeForm.expirationDate"
                :clearable="false"
                data-testid="expiration-date-input"
                format="dd/MM/yyyy"
                type="date"
                value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Classificação" prop="classification">
              <el-input v-model="disputeForm.classification" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Descrição" prop="description"  style="margin: 0">
              <el-input v-model="disputeForm.description" type="textarea" rows="3" data-testid="description-input"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button plain @click="editDisputeDialogVisible = false">Cancelar</el-button>
        <el-button :loading="editDisputeDialogLoading" type="primary" data-testid="confirm-edit-data" @click="editDispute()">Editar dados</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editRoleDialogVisible"
      width="40%">
      <span slot="title" class="el-dialog__title">
        Alterar dados de {{ roleForm.title }}
      </span>
      <el-alert
        v-show="editRoleDialogError"
        type="error"
        @close="editRoleDialogError = false">
        <ul><li v-for="(error, index) in editRoleDialogErrorList" :key="`${index}-${error}`">
          {{ error }}
        </li></ul>
      </el-alert>
      <el-form
        v-loading="editRoleDialogLoading"
        ref="roleForm"
        :model="roleForm"
        :rules="roleRules"
        label-position="top"
        @submit.native.prevent>
        <el-form-item label="Nome" prop="name">
          <el-input v-model="roleForm.name" autofocus="" />
        </el-form-item>
        <el-form-item :rules="validateDocumentNumber" label="CPF/CNPJ" prop="documentNumber">
          <el-input v-mask="['###.###.###-##', '##.###.###/####-##']" v-model="roleForm.documentNumber" @change="documentNumberHasChanged = true" />
        </el-form-item>
        <div v-if="roleForm.roles && roleForm.roles.includes('LAWYER')" class="dispute-overview-view__oab-form">
          <el-form-item class="oab" label="OAB" prop="oab">
            <el-input
              v-model="roleForm.oab"
              @keydown.enter.native="addOab(roleForm.personId, roleForm.oabs)"
              @blur="addOab(roleForm.personId, roleForm.oabs)"/>
          </el-form-item>
          <el-form-item class="state" label="Estado" prop="state">
            <el-select
              v-model="roleForm.state"
              :default-first-option="true"
              autocomplete="off"
              placeholder=""
              filterable
              @keydown.enter.native="addOab(roleForm.personId, roleForm.oabs)"
              @change="addOab(roleForm.personId, roleForm.oabs)"
              @blur="addOab(roleForm.personId, roleForm.oabs)">
              <el-option
                v-for="(state, index) in $store.state.statesList"
                :key="`${index}-${state}`"
                :label="state"
                :value="state"/>
            </el-select>
          </el-form-item>
          <el-button class="button" type="primary" @click="addOab(roleForm.personId, roleForm.oabs)">
            <jus-icon icon="add-white" />
          </el-button>
        </div>
        <el-table
          v-if="roleForm.roles && roleForm.roles.includes('LAWYER')"
          :data="roleForm.oabs"
          :show-header="false"
          fit
          class="el-table--list">
          <el-table-column>
            <template slot-scope="scope">
              {{ scope.row.number + '-' + scope.row.state || '' }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="right"
            width="48px"
            class-name="visible">
            <template slot-scope="scope">
              <a href="#" @click.prevent="removeOab(scope.$index)">
                <jus-icon icon="trash" />
              </a>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item label="Telefone" prop="phone">
          <el-input
            v-mask="['(##) ####-####', '(##) #####-####']"
            v-model="roleForm.phone"
            @keydown.enter.native="addPhone()"
            @blur="addPhone()">
            <el-button slot="append" @click="addPhone()">
              <jus-icon icon="add-white" />
            </el-button>
          </el-input>
        </el-form-item>
        <el-table
          :data="roleForm.phones"
          :show-header="false"
          fit
          class="el-table--list">
          <el-table-column>
            <template slot-scope="scope">
              {{ scope.row.number | phoneMask }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="right"
            width="48px"
            class-name="visible">
            <template slot-scope="scope">
              <a href="#" @click.prevent="removePhone(scope.$index)">
                <jus-icon icon="trash" />
              </a>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item label="E-mail" prop="email">
          <el-input
            v-model="roleForm.email"
            data-testid="input-email"
            @keydown.enter.native="addEmail()"
            @blur="addEmail()">
            <el-button slot="append" data-testid="add-email" @click="addEmail()">
              <jus-icon icon="add-white" />
            </el-button>
          </el-input>
        </el-form-item>
        <el-table
          :data="roleForm.emails"
          :show-header="false"
          fit
          class="el-table--list">
          <el-table-column>
            <template slot-scope="scope">
              {{ scope.row.address }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="right"
            width="48px"
            class-name="visible">
            <template slot-scope="scope">
              <a href="#" @click.prevent="removeEmail(scope.$index)">
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
            @click.prevent="openAddBankDialog()">
            <el-tooltip content="Adicionar conta bancária">
              <jus-icon icon="add-bold"/>
            </el-tooltip>
          </a>
        </h4>
        <el-table
          :data="roleForm.bankAccounts"
          :show-header="false"
          fit
          class="el-table--list">
          <el-table-column>
            <template slot-scope="scope">
              {{ scope.row.name }}
              <div style="font-size: 12px;">
                {{ scope.row.bank }} | {{ scope.row.agency }} | {{ scope.row.number }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="right"
            width="48px"
            class-name="visible">
            <template slot-scope="scope">
              <a href="#" @click.prevent="removeBankData(scope.$index, scope.row.id)">
                <jus-icon icon="trash" />
              </a>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer">
        <el-button plain @click="editRoleDialogVisible = false">Cancelar</el-button>
        <el-button :loading="editRoleDialogLoading" type="primary" data-testid="edit-data-part" @click="editRole">
          Editar dados
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addBankDialogVisible"
      title="Adicionar conta bancária"
      width="40%">
      <el-form
        ref="addBankForm"
        :model="addBankForm"
        :rules="addBankRules"
        label-position="top"
        @submit.native.prevent>
        <el-form-item label="Nome" prop="name">
          <el-input v-model="addBankForm.name" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="addBankForm.email" />
        </el-form-item>
        <el-form-item label="CPF ou CNPJ" prop="document">
          <el-input v-mask="['###.###.###-##', '##.###.###/####-##']" v-model="addBankForm.document" />
        </el-form-item>
        <el-form-item label="Banco" prop="bank">
          <el-select v-model="addBankForm.bank" filterable placeholder="">
            <el-option
              v-for="bank in banks"
              :key="bank.code"
              :label="bank.code + ' - ' + bank.name"
              :value="bank.code + ' - ' + bank.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="Agência" prop="agency">
          <el-input v-model="addBankForm.agency" />
        </el-form-item>
        <el-form-item label="Número do Conta" prop="number">
          <el-input v-model="addBankForm.number" />
        </el-form-item>
        <el-form-item label="Tipo de Conta" prop="type">
          <el-select v-model="addBankForm.type" placeholder="" class="select">
            <el-option
              v-for="type in [{ label: 'Poupança', type: 'SAVING' },{ label: 'Corrente', type: 'CHECKING' }]"
              :key="type.type"
              :label="type.label"
              :value="type.type" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button plain @click="addBankDialogVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="addBankData()">Adicionar</el-button>
      </span>
    </el-dialog>
    <dispute-add-role
      :visible.sync="newRoleDialogVisible"
      :dispute-id="dispute.id"
      :document-numbers="documentNumbers"
      :oabs= "oabs" />
  </div>
</template>

<script>
import { getRoles, helpBox } from '@/utils/jusUtils'
import { validateName, validateCpf, validatePhone, validateZero } from '@/utils/validations'

export default {
  name: 'DisputeOverview',
  components: {
    DisputeAddRole: () => import('./DisputeAddRole')
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
  data () {
    return {
      namesakeList: [],
      namesakeDialogVisible: false,
      namesakeDialogLoading: false,
      namesakeButtonLoading: false,
      selectedNamesake: '',
      selectedNamesakePersonId: '',
      selectedClaimantId: '',
      selectedNegotiatorId: '',
      selectedStrategyId: '',
      selectedPhone: 0,
      disputeForm: {
        description: '',
        expirationDate: '',
        disputeUpperRange: '',
        lastOfferValue: '',
        classification: '',
        sendMessageToParty: ''
      },
      disputeFormRules: {
        disputeUpperRange: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        lastOfferValue: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      },
      roleForm: {},
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
          { required: false, message: 'Campo obrigatório', trigger: 'submit' },
        ],
        email: [
          { type: 'email', required: false, message: 'Insira um e-mail válido', trigger: 'submit' }
        ],
        document: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { validator: validateCpf, message: 'CPF/CNPJ inválido.', trigger: 'submit' }
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
      ufFilter: null
    }
  },
  computed: {
    ufList () {
      let ufList = this.namesakeList.map(namesake => namesake.uf)
      return ufList.filter((uf, i) => uf !== null && ufList.indexOf(uf) === i)
    },
    cityList () {
      let cityList = this.namesakeList.map(namesake => namesake.city)
      return cityList.filter((city, i) => city !== null && cityList.indexOf(city) === i)
    },
    filteredNamesakeList () {
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
    validateDocumentNumber () {
      if (this.documentNumberHasChanged) {
        return [{ validator: validateCpf, message: 'CPF/CNPJ inválido.', trigger: 'submit' }]
      }
      return []
    },
    validateDisputeUpperRange () {
      if (this.disputeUpperRangeHasChanged) {
        return [{ validator: validateZero, message: 'Valor precisa ser acima de 0', trigger: 'submit' }]
      }
      return []
    },
    validateLastOfferValue () {
      if (this.lastOfferValueHasChanged) {
        return [{ validator: validateZero, message: 'Valor precisa ser acima de 0', trigger: 'submit' }]
      }
      return []
    },
    dispute () {
      return this.$store.getters.dispute
    },
    disputeBankAccounts () {
      return this.$store.getters.disputeBankAccounts
    },
    disputeBankAccountsIds: {
      get () {
        if (this.dispute.bankAccounts || Array.isArray(this.dispute.bankAccounts)) {
          return this.dispute.bankAccounts.map(dba => dba.id)
        }
        return []
      },
      set (bankAccountId) {
        this.updateDisputeBankAccounts(bankAccountId)
      }
    },
    selectedRole: {
      get () { return this.activeRoleId },
      set (newSelectedRole) { this.$emit('update:activeRoleId', newSelectedRole || 0) }
    },
    strategies () {
      return this.$store.getters.strategyList
    },
    computedDescription () {
      if (this.dispute.description && this.dispute.description.length > 140) {
        if (this.descriptionCollapse) {
          return this.dispute.description.substring(0, 140) + '...'
        }
      }
      return this.dispute.description
    },
    disputeRolesSort () {
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
    documentNumbers () {
      if (this.disputeRolesSort && this.disputeRolesSort.length) {
        return this.disputeRolesSort.map(role => {
          if (role.documentNumber) return role.documentNumber
        }).filter(role => !!role)
      }
      return []
    },
    oabs () {
      if (this.disputeRolesSort && this.disputeRolesSort.length) {
        let oabs = []
        this.disputeRolesSort.map(role => {
          if (role.oabs && role.oabs.length) {
            role.oabs.map(oab => oabs.push(oab.number + oab.state))
          }
        })
        return oabs
      }
      return []
    },
    disputeClaimants () {
      if (this.dispute && this.dispute.disputeRoles) {
        return getRoles(this.dispute.disputeRoles, 'CLAIMANT')
      }
      return []
    },
    disputeNegotiations () {
      if (this.dispute && this.dispute.disputeRoles) {
        return getRoles(this.dispute.disputeRoles, 'RESPONDENT', 'NEGOTIATOR')
      }
      return []
    },
    banks () {
      return this.$store.getters.banksList
    }
  },
  watch: {
    activeRoleId: function (newActiveRole) {
      if (newActiveRole === 0) this.handleChange('')
    },
    filteredNamesakeList: function (newFilteredNamesakes) {
      if (!newFilteredNamesakes.includes(this.selectedNamesake)) {
        this.selectedNamesake = ''
      }
    }
  },
  methods: {
    showHelpBox: (i) => helpBox(i),
    showNamesake (role) {
      return role.namesake && !role.documentNumber && role.party === 'CLAIMANT'
    },
    openAddBankDialog () {
      this.addBankForm.name = this.roleForm.name
      if (this.roleForm.emails.filter(f => f.isValid && !f.archived && f.isMain).length) {
        this.addBankForm.email =  this.roleForm.emails.filter(f => !f.archived && f.isMain)[0].address
      } else if (this.roleForm.emails.filter(f => f.isValid && !f.archived).length) {
        this.addBankForm.email = this.roleForm.emails.filter(f => !f.archived)[0].address
      } else {
        this.addBankForm.email = ''
      }
      this.addBankForm.document = this.roleForm.document
      this.addBankDialogVisible = true
    },
    closeNamesakes () {
      this.namesakeDialogVisible = false
      this.selectedNamesake = ''
      this.selectedNamesakePersonId = ''
      this.cityFilter = null
      this.ufFilter = null
    },
    selectNamesake () {
      if (this.selectedNamesake) {
        this.namesakeDialogLoading = true
        // eslint-disable-next-line
        axios.patch(`api/fusion-runner/set-document/person/${this.selectedNamesakePersonId}/${this.selectedNamesake.document}/${this.dispute.id}`)
          .then(() => {
            this.namesakeDialogVisible = false
            this.namesakeDialogLoading = false
            this.$jusNotification({
              title: 'Yay!',
              message: 'Homônimo tratado com sucesso.',
              type: 'success'
            })
          })
          .catch(error => {
            console.error(error)
            this.$jusNotification({ type: 'error' })
          })
      }
    },
    handleCurrentChange (val) {
      if (val) {
        this.selectedNamesake = val
      }
    },
    namesakeDialog (name, personId) {
      this.selectedNamesakePersonId = personId
      this.namesakeButtonLoading = true
      // eslint-disable-next-line
      axios.get('api/spider/search/name/' + name)
        .then(response => {
          this.namesakeDialogVisible = true
          this.namesakeList = response.data
        })
        .catch(error => {
          console.error(error)
          this.$jusNotification({ type: 'error' })
        })
        .finally(() => {
          this.namesakeButtonLoading = false
        })
    },
    updateDisputeRole (activeRole, messageType) {
      let disputeRoles = this.dispute.disputeRoles.map(dr => {
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
    updateDisputeBankAccounts (roleBankAccountIds) {
      let action, bankAccountId
      for (let roleAccount of roleBankAccountIds) {
        if (!this.disputeBankAccountsIds.includes(roleAccount)) {
          action = 'linkDisputeBankAccounts'
          bankAccountId = roleAccount
        }
      }
      for (let disputeAccount of this.disputeBankAccountsIds) {
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
          message: 'Conta bancária <strong>' + this.$t('bankAccount.' + action).toUpperCase() + '</strong> à disputa com sucesso.',
          type: 'success'
        })
        setTimeout(function () {
          this.$emit('fetch-data')
        }.bind(this), 200)
      }).catch(e => {
        console.error(e)
        this.$jusNotification({ type: 'error' })
      }).finally(() => {
        this.linkBankAccountLoading = false
      })
    },
    roleTitleSort (title) {
      if (title) {
        let sortedArray = title.slice(0) || []
        return sortedArray.sort((a, b) => {
          return (a[0] > b[0]) ? -1 : (a[0] < b[0]) ? 1 : 0
        })
      } return []
    },
    openDisputeDialog () {
      this.disputeUpperRangeHasChanged = false
      this.lastOfferValueHasChanged = false
      this.documentNumberHasChanged = false
      this.$store.dispatch('getMyStrategies')
      let dispute = JSON.parse(JSON.stringify(this.dispute))
      this.editDisputeDialogLoading = false
      this.selectedClaimantId = this.disputeClaimants[0].id || ''
      this.selectedStrategyId = dispute.strategyId
      this.selectedNegotiatorId = this.disputeNegotiations && this.disputeNegotiations.length > 0 ? this.disputeNegotiations[0].id : ''
      this.disputeForm.id = dispute.id
      this.disputeForm.disputeUpperRange = parseFloat(dispute.disputeUpperRange)
      this.disputeForm.lastOfferValue = parseFloat(dispute.lastOfferValue)
      this.disputeForm.expirationDate = dispute.expirationDate.dateTime
      this.disputeForm.description = dispute.description
      this.disputeForm.classification = dispute.classification && dispute.classification.name ? dispute.classification.name : ''
      this.disputeForm.sendMessageToParty = dispute.sendMessageToParty
      this.editDisputeDialogVisible = true
    },
    editDispute () {
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
            let disputeToEdit = JSON.parse(JSON.stringify(this.dispute))
            disputeToEdit.strategyId = this.selectedStrategyId
            disputeToEdit.disputeUpperRange = this.disputeForm.disputeUpperRange
            disputeToEdit.expirationDate.dateTime = this.$moment(this.disputeForm.expirationDate).endOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]')
            disputeToEdit.description = this.disputeForm.description
            disputeToEdit.classification = { name: this.disputeForm.classification }
            disputeToEdit.lastOfferValue = this.disputeForm.lastOfferValue
            disputeToEdit.lastOfferRoleId = this.selectedNegotiatorId
            disputeToEdit.sendMessageToParty = this.disputeForm.sendMessageToParty
            let currentDate = this.dispute.expirationDate.dateTime
            let newDate = disputeToEdit.expirationDate.dateTime
            let today = this.$moment()
            this.$store.dispatch('editDispute', disputeToEdit).then(() => {
              // SEGMENT TRACK
              this.$jusSegment('Editar disputa', { disputeId: disputeToEdit.id })
              this.$jusNotification({
                title: 'Yay!',
                message: 'Os dados foram alterados com sucesso.',
                type: 'success'
              })
              setTimeout(function () {
                this.$emit('fetch-data')
              }.bind(this), 200)
              this.editDisputeDialogVisible = false
              if (this.$moment(currentDate).isBefore(today) && this.$moment(newDate).isSameOrAfter(today)) {
                this.$confirm('A data de expiração foi alterada. Deseja reiniciar o engajamento para esta disputa?', 'Atenção!', {
                  confirmButtonText: 'Reengajar',
                  cancelButtonText: 'Cancelar',
                  cancelButtonClass: 'is-plain',
                  type: 'warning'
                }).then(() => {
                  this.$store.dispatch('sendDisputeAction', {
                    action: 'restart-engagement',
                    disputeId: this.dispute.id
                  }).then(() => {
                    this.$jusNotification({
                      title: 'Yay!',
                      message: 'Reengajamento realizado com sucesso.',
                      type: 'success'
                    })
                  })
                })
              }
            }).catch(() => {
              this.$jusNotification({ type: 'error' })
            }).finally(() => {
              this.editDisputeDialogLoading = false
            })
          }).catch(() => {
            this.editDisputeDialogLoading = false
          })
        }
      })
    },
    buildTitle (party, title) {
      if (party === 'RESPONDENT') {
        switch (title) {
          case 'NEGOTIATOR':
            return 'Negociador'
          case 'PARTY':
            return 'Réu'
          case 'LAWYER':
            return 'Advogado do réu'
        }
      } else {
        if (title === 'PARTY') {
          return 'Parte contrária'
        } else if (title === 'LAWYER') {
          return 'Advogado da parte'
        } else {
          return ''
        }
      }
    },
    handleChange (val) {
      if (!val) {
        this.selectedPhone = 0
        this.dispute.disputeRoles.forEach(dr => {
          dr.phones.forEach(p => { p.selected = false })
          dr.emails.forEach(e => { e.selected = false })
          dr.oabs.forEach(o => { o.selected = false })
          return dr
        })
      }
    },
    openRoleDialog (role) {
      this.bankAccountIdstoUnlink = []
      this.editRoleDialogError = false
      this.editRoleDialogVisible = true
      this.roleForm = JSON.parse(JSON.stringify(role))
      this.originalRole = JSON.parse(JSON.stringify(role))
      this.roleForm.title = this.buildTitle(role.party, role.roles[0])
      this.roleForm.documentNumber = this.$options.filters.cpfCnpjMask(this.roleForm.documentNumber)
      this.roleForm.emails = this.roleForm.emails.filter(f => !f.archived)
      this.roleForm.oabs = this.roleForm.oabs.filter(f => !f.archived)
      this.roleForm.phones = this.roleForm.phones.filter(f => !f.archived)
      if (this.$refs.roleForm) this.$refs.roleForm.clearValidate()
    },
    editRole () {
      let isValid = true
      this.$refs.roleForm.validateField(['name', 'documentNumber'], errorMessage => {
        if (errorMessage) isValid = false
      })
      if (isValid) {
        if (this.bankAccountIdstoUnlink.length) {
          this.linkBankAccountLoading = true
          let promise = []
          for (let id of this.bankAccountIdstoUnlink) {
            promise.push(
              this.$store.dispatch('unlinkDisputeBankAccounts', {
                disputeId: this.dispute.id,
                bankAccountId: id
              })
            )
          }
          Promise.all(promise).then(() => {
            this.editRoleAction()
          }).catch(e => {
            this.$jusNotification({ type: 'error' })
          }).finally(() => {
            this.linkBankAccountLoading = false
          })
        } else {
          this.editRoleAction()
        }
      }
    },
    editRoleAction () {
      let roleToEdit = JSON.parse(JSON.stringify(this.roleForm))
      delete roleToEdit.title
      this.editRoleDialogLoading = true
      this.$store.dispatch('editRole', {
        disputeId: this.dispute.id,
        disputeRole: roleToEdit
      }).then(() => {
        // SEGMENT TRACK
        this.$jusSegment('Editar partes da disputa', { description: `Usuário ${roleToEdit.name} alterado` })
        this.$jusNotification({
          title: 'Yay!',
          message: 'Os dados foram alterados com sucesso.',
          type: 'success'
        })
        let roleDataDifference = this.verifyChangedRoleData(this.roleForm, this.originalRole)
        if (roleDataDifference.length) {
          this.$confirm('Novos dados de contato foram adicionados. Deseja reiniciar o engajamento para esta parte?', 'Atenção!', {
            confirmButtonText: 'Reengajar',
            cancelButtonText: 'Cancelar',
            type: 'warning',
            cancelButtonClass: 'is-plain'
          }).then(() => {
            let contacts = []
            for (let contact of roleDataDifference) {
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
                message: 'Reengajamento realizado com sucesso.',
                type: 'success'
              })
            }).catch(() => {
              this.$jusNotification({
                title: 'Ops!',
                message: 'Parece que nem todos os contatos foram reengajados corretamente.',
                type: 'warning',
                dangerouslyUseHTMLString: true
              })
            })
          })
        }
        this.editRoleDialogVisible = false
        setTimeout(function () {
          this.$emit('fetch-data')
        }.bind(this), 200)
      }).catch(error => {
        console.log(error)
        if (error.status === 400) {
          this.editRoleDialogError = true
          this.editRoleDialogErrorList.push(error.data.message)
        } else this.$jusNotification({ type: 'error' })
      }).finally(() => {
        this.editRoleDialogLoading = false
      })
    },
    verifyChangedRoleData (editedRole, originalRole) {
      let changed = {
        newPhones: [],
        newEmails: []
      }
      if (editedRole.phones.length) {
        let mappedPhones = originalRole.phones.map(phone => phone.number)
        changed.newPhones = editedRole.phones.filter(phone => {
          if (!mappedPhones.includes(phone.number)) return phone.number
        })
      }
      if (editedRole.emails.length) {
        let mappedEmails = originalRole.emails.map(email => email.address)
        changed.newEmails = editedRole.emails.filter(email => {
          if (!mappedEmails.includes(email.address)) return email.address
        })
      }
      return [ ...changed.newPhones, ...changed.newEmails ]
    },
    addPhone () {
      let isValid = true
      this.roleForm.phone = this.roleForm.phone.trim()
      this.$refs.roleForm.validateField('phone', errorMessage => {
        if (errorMessage || !this.roleForm.phone) isValid = false
      })
      if (isValid) {
        let self = this
        this.roleForm.phone = this.roleForm.phone.replace(/ /g, '').replace(/\D/g, '')
        let isDuplicated = this.roleForm.phones.findIndex(p => {
          const number = p.number.startsWith('55') ? p.number.replace('55', '') : p.number
          return number === self.roleForm.phone
        })
        if (isDuplicated < 0) this.roleForm.phones.push({ number: this.roleForm.phone, isMain: true })
        this.roleForm.phone = ''
      }
    },
    removePhone (index) {
      this.roleForm.phones.splice(index, 1)
    },
    addEmail () {
      let isValid = true
      this.roleForm.email = this.roleForm.email.trim()
      this.$refs.roleForm.validateField('email', errorMessage => {
        if (errorMessage || !this.roleForm.email) isValid = false
      })
      if (isValid) {
        let self = this
        let isDuplicated = this.roleForm.emails.findIndex(e => e.address === self.roleForm.email)
        if (isDuplicated < 0) this.roleForm.emails.push({ address: this.roleForm.email })
        this.roleForm.email = ''
      }
    },
    removeEmail (index) {
      this.roleForm.emails.splice(index, 1)
    },
    addOab () {
      let isValid = true
      this.$refs.roleForm.validateField(['oab', 'state'], errorMessage => {
        if (errorMessage || !this.roleForm.oab || !this.roleForm.state) isValid = false
      })
      if (isValid) {
        let self = this
        this.roleForm.oab = this.roleForm.oab.replace(/ /g, '')
        let isDuplicated = this.roleForm.oabs.findIndex(o => o.number === self.roleForm.oab && o.state === self.roleForm.state)
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
    removeOab (index) {
      this.roleForm.oabs.splice(index, 1)
    },
    removeRole (role) {
      this.$confirm('Tem certeza que deseja excluir esta parte?', 'Atenção!', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'warning',
        cancelButtonClass: 'is-plain'
      }).then(() => {
        this.$store.dispatch('removeRole', {
          disputeId: this.dispute.id,
          roleId: role.id
        }).then(response => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Pessoa removida com sucesso.',
            type: 'success'
          })
        }).catch(() => {
          this.$jusNotification({ type: 'error' })
        })
      })
    },
    addBankData () {
      this.$refs.addBankForm.validate(valid => {
        if (valid) {
          if (!this.roleForm.bankAccounts) {
            this.roleForm.bankAccounts = []
          }
          let bankForm = JSON.parse(JSON.stringify(this.addBankForm))
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
    removeBankData (index, id) {
      this.bankAccountIdstoUnlink.push(id)
      this.roleForm.bankAccounts.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.dispute-overview-view {
  margin-bottom: -20px;
  .jus-status-dot {
    float: initial !important;
  }
  &__info-line {
    > span:not(.title) {
      display: flex;
      margin-left: 12px;
    }
    .title {
      font-weight: 600;
    }
    .ellipsis {
      display: flex;
      align-items: center;
      width: 100%;
      span {
        margin-left: 6px;
        margin-right: 6px;
        max-width: 164px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
      padding-left: 6px;
      font-size: 13px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      width: 100%;
    }
    .bordered {
      width: 100%;
      height: auto;
      display: flex;
      align-items: center;
      padding: 6px 11px;
      margin-top: 10px;
      margin-left: 0 !important;
      .el-checkbox__input {
        vertical-align: super;
      }
      .el-checkbox__label {
        padding-left: 6px;
        font-size: 13px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
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
    margin-top: 20px;
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
  &__name {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
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
}
</style>
