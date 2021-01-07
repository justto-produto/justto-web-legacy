<template lang="html">
  <ul
    v-chat-scroll="{always: false, smooth: true, scrollonremoved: true }"
    class="dispute-view-occurrences"
  >
    <infinite-loading
      :identifier="infiniteId"
      :distance="10"
      spinner="spiral"
      direction="top"
      @infinite="loadOccurrences"
    >
      <div
        slot="no-more"
        data-testid="occurences-start"
      >
        Início das ocorrências
      </div>
      <div
        slot="no-results"
        data-testid="occurences-start"
      >
        Início das ocorrências
      </div>
    </infinite-loading>
    <div
      v-for="(datedOccurrence, date, index) in datedOccurrences"
      :key="`${date}-${index}`"
    >
      <el-card
        class="dispute-view-occurrences__date el-card--bg-info"
        shadow="never"
      >
        {{ date }}
      </el-card>
      <li
        v-for="(occurrence, occurrenceIndex) in datedOccurrence"
        :key="`occurrency-${occurrenceIndex}`"
      >
        <div class="dispute-view-occurrences__occurrence">
          <div
            v-if="!occurrence.id"
            class="dispute-view-occurrences__interaction OUTBOUND LOADING"
          >
            <div class="dispute-view-occurrences__avatar">
              <el-tooltip :content="occurrence.sender">
                <jus-avatar-user
                  :name="occurrence.sender"
                  :src="buildAvatar(occurrence)"
                  shape="circle"
                  size="sm"
                />
              </el-tooltip>
            </div>
            <div class="dispute-view-occurrences__card-box">
              <el-card
                :class="occurrence.type.toUpperCase()"
                shadow="never"
                class="dispute-view-occurrences__card COMMUNICATION"
                data-testid="message-box"
              >
                <span v-html="occurrence.message" />
              </el-card>
              <div class="dispute-view-occurrences__card-info">
                Para: {{ occurrence.receiver | phoneNumber }}
                <div> • </div>
                <jus-icon :icon="occurrence.type" />
                <div> • </div>
                {{ occurrence.createAt.dateTime | moment('HH:mm') }}
              </div>
            </div>
            <div class="dispute-view-occurrences__side-icon">
              <i class="el-icon-loading" />
            </div>
          </div>
          <el-card
            v-else-if="occurrence.type === 'LOG' ||
              (occurrence.interaction && ['VISUALIZATION', 'CLICK', 'NEGOTIATOR_ACCESS'].includes(occurrence.interaction.type))"
            shadow="never"
            class="dispute-view-occurrences__log el-card--bg-warning"
          >
            <el-tooltip
              :disabled="!buildTooltip(occurrence)"
              :content="buildTooltip(occurrence)"
            >
              <span
                :class="{ 'dispute-view-occurrences__log-canceled': occurrence.interaction && occurrence.interaction.message && occurrence.interaction.message.status === 'CANCELED'}"
                class="dispute-view-occurrences__log-icon"
              >
                <jus-icon
                  :icon="buildIcon(occurrence)"
                  :class="buildIcon(occurrence)"
                />
              </span>
            </el-tooltip>
            <span
              class="occurrence-content"
              v-html="buildContent(occurrence)"
            />
            <div
              v-if="canHandleUnknowParty(occurrence)"
              class="fast-occurrence-actions"
            >
              <br>
              <span
                v-if="getUnknowPartys(occurrence).length === 0"
                class="ok"
              >Esta pendência já foi resolvida!</span>
              <div
                v-for="role in getUnknowPartys(occurrence)"
                :key="`role-party-${role.id}`"
                class="fast-occurrence-actions__items"
              >
                <span />
                <a
                  v-if="!handlePartyId['party_role' + role.id]"
                  href="#"
                  @click="openOptionsParty(role)"
                >
                  Definir polaridade de {{ role.name }}
                </a>
                <span class="fast-occurrence-actions__select-container">
                  <el-select
                    v-if="role.party === 'UNKNOWN' && handlePartyId['party_role' + role.id]"
                    v-model="role.party"
                    size="mini"
                    placeholder="Defina o polo desta parte"
                    @change="setDisputeParty(role)"
                  >
                    <el-option
                      v-for="party in disputePartys"
                      :key="party.value"
                      :label="party.label"
                      :value="party.value"
                    />
                  </el-select>
                  <el-tooltip
                    v-if="handlePartyId['party_role' + role.id]"
                    class="fast-occurrence-actions__cancel-tooltip"
                  >
                    <div slot="content">
                      Cancelar edição de polaridade de {{ role.name }}
                    </div>
                    <el-button
                      size="mini"
                      icon="el-icon-close"
                      circle
                      @click="closeOptionsParty(role)"
                    />
                  </el-tooltip>
                </span>
              </div>
              <span class="fast-occurrence__log-info">
                <span v-text="buildHour(occurrence)" />
                <div>•</div>
                <el-tooltip :content="buildStatusTooltip(occurrence)">
                  <jus-icon :icon="buildStatusIcon(occurrence)" />
                </el-tooltip>
                <el-tooltip v-if="occurrence.merged">
                  <div slot="content">
                    <div
                      v-for="(merged, mergedIndex) in occurrence.merged"
                      :key="`merged-${mergedIndex}-#${merged.id}`"
                      class="dispute-view-occurrences__log-info-content"
                    >
                      Hora: {{ buildHour(merged) }}
                      <span v-if="merged.interaction && merged.interaction.message && merged.interaction.message.receiver && getDirection(occurrence.interaction) === 'OUTBOUND'">
                        - Para: {{ merged.interaction.message.receiver | phoneNumber }}
                      </span>
                      <span v-if="merged.interaction && merged.interaction.message && merged.interaction.message.parameters && getDirection(occurrence.interaction) === 'INBOUND'">
                        - Por: {{ merged.interaction.message.parameters.SENDER_NAME }} ({{ merged.interaction.message.parameters.SENDER || merged.interaction.message.sender | phoneNumber }})
                      </span>
                    </div>
                  </div>
                  <span>
                    (+{{ occurrence.merged.length }})
                  </span>
                </el-tooltip>
              </span>
            </div>
            <span
              v-else
              class="dispute-view-occurrences__log-info"
            >
              <span v-text="buildHour(occurrence)" />
              <div>•</div>
              <el-tooltip :content="buildStatusTooltip(occurrence)">
                <jus-icon :icon="buildStatusIcon(occurrence)" />
              </el-tooltip>
              <el-tooltip v-if="occurrence.merged">
                <div slot="content">
                  <div
                    v-for="(merged, mergedIndex) in occurrence.merged"
                    :key="`merged-${mergedIndex}-#${merged.id}`"
                    class="dispute-view-occurrences__log-info-content"
                  >
                    Hora: {{ buildHour(merged) }}
                    <span v-if="merged.interaction && merged.interaction.message && merged.interaction.message.receiver && getDirection(occurrence.interaction) === 'OUTBOUND'">
                      - Para: {{ merged.interaction.message.receiver | phoneNumber }}
                    </span>
                    <span v-if="merged.interaction && merged.interaction.message && merged.interaction.message.parameters && getDirection(occurrence.interaction) === 'INBOUND'">
                      - Por: {{ merged.interaction.message.parameters.SENDER_NAME }} ({{ merged.interaction.message.parameters.SENDER || merged.interaction.message.sender | phoneNumber }})
                    </span>
                  </div>
                </div>
                <span>
                  (+{{ occurrence.merged.length }})
                </span>
              </el-tooltip>
            </span>
          </el-card>
          <div
            v-else-if="occurrence.type !== 'NOTE'"
            :class="getDirection(occurrence.interaction)"
            class="dispute-view-occurrences__interaction"
          >
            <div class="dispute-view-occurrences__avatar">
              <el-tooltip
                :disabled="!buildName(occurrence)"
                :content="buildName(occurrence)"
              >
                <jus-avatar-user
                  :name="buildName(occurrence)"
                  :src="buildAvatar(occurrence)"
                  shape="circle"
                  size="sm"
                />
              </el-tooltip>
              <el-tooltip v-if="isJusttineMessage(occurrence)">
                <div slot="content">
                  Sou JUSTTINE, sua assistente virtual<br>
                  Enviei esta mensagem para você, ok?<br>
                  Criei ela a partir da estratégia que você definiu na disputa.
                </div>
                <i class="el-icon-question" />
              </el-tooltip>
            </div>
            <div class="dispute-view-occurrences__card-box">
              <attachment-occurrence
                v-if="occurrence.interaction.type === 'ATTACHMENT'"
                :value="occurrence"
                :class="(occurrence.interaction ? occurrence.interaction.type : '') + ' ' + buildCommunicationType(occurrence) + ' ' + (occurrence.interaction && occurrence.interaction.message ? occurrence.interaction.message.status : '')"
                shadow="never"
                class="dispute-view-occurrences__card"
              />
              <el-card
                v-else
                :class="(occurrence.interaction ? occurrence.interaction.type : '') + ' ' + buildCommunicationType(occurrence) + ' ' + (occurrence.interaction && occurrence.interaction.message ? occurrence.interaction.message.status : '')"
                shadow="never"
                class="dispute-view-occurrences__card"
                data-testid="message-box"
              >
                <div>
                  <div
                    v-if="canShowFullMessage(occurrence) && !showResume(occurrence)"
                    style="text-align: right;"
                  >
                    <a
                      href="#"
                      data-testid="hide-email"
                      @click.prevent="hideFullMessage(occurrence.id)"
                    > ver menos</a>
                  </div>
                  <span>
                    <span
                      :ref="getMessageRef(occurrence)"
                      v-html="buildContent(occurrence)"
                    />
                    <span
                      v-if="buildCommunicationType(occurrence).startsWith('WHATSAPP') && buildWhatsappStatus(occurrence.interaction.message, occurrence.executionDateTime || occurrence.createAt)"
                      class="dispute-view-occurrences__whats-status"
                    >
                      <el-tooltip popper-class="mw400">
                        <div
                          slot="content"
                          style="max-width: 400px;text-align: justify;"
                        >
                          <span v-html="buildWhatsappStatus(occurrence.interaction.message, occurrence.executionDateTime || occurrence.createAt).message" />
                        </div>
                        <jus-icon :icon="buildWhatsappStatus(occurrence.interaction.message, occurrence.executionDateTime || occurrence.createAt).icon" />
                      </el-tooltip>
                    </span>
                    <span
                      v-if="buildCommunicationType(occurrence).startsWith('SMS') && buildEmailStatus(occurrence)"
                      class="dispute-view-occurrences__whats-status"
                    >
                      <el-tooltip popper-class="mw400">
                        <div
                          slot="content"
                          style="max-width: 400px;text-align: justify;"
                        >
                          <span v-html="buildEmailStatus(occurrence).message" />
                        </div>
                        <jus-icon :icon="buildEmailStatus(occurrence).icon" />
                      </el-tooltip>
                    </span>
                    <span v-if="showResume(occurrence)">
                      <a
                        href="#"
                        data-testid="show-email"
                        @click.prevent="showFullMessage(occurrence.id, occurrence.interaction.message.messageId || false)"
                      > ver mais</a>
                    </span>
                    <span
                      v-if="buildCommunicationType(occurrence).startsWith('EMAIL') && buildEmailStatus(occurrence)"
                      class="dispute-view-occurrences__whats-status"
                    >
                      <el-tooltip popper-class="mw400">
                        <div
                          slot="content"
                          style="max-width: 400px;text-align: justify;"
                        >
                          <span v-html="buildEmailStatus(occurrence).message" />
                        </div>
                        <jus-icon :icon="buildEmailStatus(occurrence).icon" />
                      </el-tooltip>
                    </span>
                  </span>
                  <br>
                  <i v-if="occurrence.interaction && occurrence.interaction.message && occurrence.interaction.message.status === 'CANCELED'">
                    <br>
                    <i
                      class="el-icon-close"
                      style="width: 14px;margin-bottom: -1.2px;"
                    />
                    Mensagem automática agendada foi <strong>CANCELADA</strong>.
                  </i>
                  <i v-else-if="occurrence.interaction && occurrence.interaction.message && occurrence.interaction.type === 'SCHEDULER' && occurrence.interaction.message.status === 'WAITING'">
                    <br>
                    <jus-icon
                      icon="clock"
                      style="width: 14px;margin-bottom: -1.2px;"
                    />
                    Mensagem agendada para
                    {{ occurrence.interaction.message.scheduledTime.dateTime | moment('DD/MM[ às ]HH:mm') }}
                    que ainda não foi entregue.
                  </i>
                </div>
              </el-card>
              <div
                :class="getDirection(occurrence.interaction)"
                class="dispute-view-occurrences__card-info"
              >
                <el-tooltip
                  v-if="occurrence.merged"
                  :disabled="false"
                >
                  <div slot="content">
                    Existem mais {{ occurrence.merged.length }} ocorrência(s) parecida(s) com esta.
                  </div>
                  <span
                    class="dispute-view-occurrences__expand-button"
                    @click="setActiveactiveOccurrency(occurrence)"
                  >
                    (+{{ occurrence.merged.length }} )
                    <i :class="getIconIsMerged(occurrence)" />
                  </span>
                </el-tooltip>
                <div v-if="occurrence.merged">
                  •
                </div>
                <el-tooltip :content="buildStatusTooltip(occurrence)">
                  <jus-icon :icon="buildStatusIcon(occurrence)" />
                </el-tooltip>
                <div>•</div>
                <span v-html="buildHour(occurrence)" />
                <div v-if="!!buildIcon(occurrence)">
                  •
                </div>
                <jus-icon
                  v-if="!!buildIcon(occurrence)"
                  :icon="buildIcon(occurrence)"
                  :class="{'NEGOTIATOR': occurrence.interaction && occurrence.interaction.type.startsWith('NEGOTIATOR')}"
                />
                <div v-if="(occurrence.interaction && occurrence.interaction.message) && (occurrence.interaction.message.receiver || occurrence.interaction.message.parameters)">
                  •
                </div>
                <span v-if="occurrence.interaction && occurrence.interaction.message && occurrence.interaction.message.receiver && getDirection(occurrence.interaction) === 'OUTBOUND'">
                  Para: {{ occurrence.interaction.message.receiver | phoneNumber }}
                </span>
                <span v-if="occurrence.interaction && occurrence.interaction.message && occurrence.interaction.message.parameters && getDirection(occurrence.interaction) === 'INBOUND'">
                  Por:
                  <span v-if="![occurrence.interaction.message.sender, occurrence.interaction.message.parameters.SENDER].includes(occurrence.interaction.message.parameters.SENDER_NAME)">
                    {{ occurrence.interaction.message.parameters.SENDER_NAME }}
                    ({{ occurrence.interaction.message.parameters.SENDER || occurrence.interaction.message.sender | phoneNumber }})
                  </span>
                  <span v-else>
                    {{ occurrence.interaction.message.parameters.SENDER || occurrence.interaction.message.sender | phoneNumber }}
                  </span>
                </span>
              </div>
            </div>
            <div
              v-if="showReply(occurrence)"
              class="dispute-view-occurrences__side-icon"
            >
              <el-tooltip content="Responder">
                <a
                  href="#"
                  @click.prevent="startReply(occurrence)"
                >
                  <jus-icon
                    icon="reply"
                    style="position: styck;"
                  />
                </a>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div
          v-if="activeOccurrency.id === occurrence.id"
          class="dispute-view-occurrences__occurrence-merged"
        >
          <div
            v-for="(mergedOccurency, mergedOccurencyIndex) of activeOccurrency.merged"
            :key="`merged-${mergedOccurencyIndex}`"
            :class="getDirection(occurrence.interaction)"
            class="dispute-view-occurrences__interaction dispute-view-occurrences__interaction-merged"
          >
            <div class="dispute-view-occurrences__avatar">
              <el-tooltip
                :disabled="!buildName(mergedOccurency)"
                :content="buildName(mergedOccurency)"
              >
                <jus-avatar-user
                  :name="buildName(mergedOccurency)"
                  :src="buildAvatar(mergedOccurency)"
                  shape="circle"
                  size="sm"
                />
              </el-tooltip>
            </div>
            <div class="dispute-view-occurrences__card-box">
              <attachment-occurrence
                v-if="mergedOccurency.interaction.type === 'ATTACHMENT'"
                :value="mergedOccurency"
                :class="(mergedOccurency.interaction ? mergedOccurency.interaction.type : '') + ' ' + buildCommunicationType(mergedOccurency) + ' ' + (mergedOccurency.interaction && mergedOccurency.interaction.message ? mergedOccurency.interaction.message.status : '')"
                shadow="never"
                class="dispute-view-occurrences__card"
              />
              <el-card
                v-else
                :class="(mergedOccurency.interaction ? mergedOccurency.interaction.type : '') + ' ' + buildCommunicationType(mergedOccurency) + ' ' + (mergedOccurency.interaction && mergedOccurency.interaction.message ? mergedOccurency.interaction.message.status : '')"
                shadow="never"
                class="dispute-view-occurrences__card"
                data-testid="message-box"
              >
                <div>
                  <span>
                    <div
                      v-if="canShowFullMessage(mergedOccurency) && !showResume(mergedOccurency)"
                      style="text-align: right;">
                      <a
                        href="#"
                        data-testid="hide-email"
                        @click.prevent="hideFullMessage(mergedOccurency.id)"
                      > ver menos</a>
                    </div>
                    <span
                      :ref="getMessageRef(mergedOccurency)"
                      v-html="buildContent(mergedOccurency)"
                    />
                    <span
                      v-if="buildCommunicationType(mergedOccurency).startsWith('WHATSAPP') && buildWhatsappStatus(mergedOccurency.interaction.message, mergedOccurency.executionDateTime || mergedOccurency.createAt)"
                      class="dispute-view-occurrences__whats-status"
                    >
                      <el-tooltip popper-class="mw400">
                        <div
                          slot="content"
                          style="max-width: 400px;text-align: justify;"
                        >
                          <span v-html="buildWhatsappStatus(mergedOccurency.interaction.message, mergedOccurency.executionDateTime || mergedOccurency.createAt).message" />
                        </div>
                        <jus-icon :icon="buildWhatsappStatus(mergedOccurency.interaction.message, mergedOccurency.executionDateTime || mergedOccurency.createAt).icon" />
                      </el-tooltip>
                    </span>
                    <span v-if="showResume(mergedOccurency)">
                      <a
                        href="#"
                        data-testid="show-email"
                        @click.prevent="showFullMessage(mergedOccurency.id, mergedOccurency.interaction.message.messageId || false)"
                      > ver mais</a>
                    </span>
                    <span
                      v-if="buildCommunicationType(mergedOccurency).startsWith('EMAIL') && buildEmailStatus(mergedOccurency)"
                      class="dispute-view-occurrences__whats-status"
                    >
                      <el-tooltip popper-class="mw400">
                        <div
                          slot="content"
                          style="max-width: 400px;text-align: justify;"
                        >
                          <span v-html="buildEmailStatus(mergedOccurency).message" />
                        </div>
                        <jus-icon :icon="buildEmailStatus(mergedOccurency).icon" />
                      </el-tooltip>
                    </span>
                  </span>
                  <br>
                  <i v-if="mergedOccurency.interaction && mergedOccurency.interaction.message && mergedOccurency.interaction.message.status === 'CANCELED'">
                    <br>
                    <i
                      class="el-icon-close"
                      style="width: 14px;margin-bottom: -1.2px;"
                    />
                    Mensagem automática agendada foi <strong>CANCELADA</strong>.
                  </i>
                  <i v-else-if="mergedOccurency.interaction && mergedOccurency.interaction.message && mergedOccurency.interaction.type === 'SCHEDULER' && mergedOccurency.interaction.message.status === 'WAITING'">
                    <br>
                    <jus-icon
                      icon="clock"
                      style="width: 14px;margin-bottom: -1.2px;"
                    />
                    Mensagem agendada para
                    {{ mergedOccurency.interaction.message.scheduledTime.dateTime | moment('DD/MM[ às ]HH:mm') }}
                    que ainda não foi entregue.
                  </i>
                </div>
              </el-card>
              <div
                :class="getDirection(mergedOccurency.interaction)"
                class="dispute-view-occurrences__card-info"
              >
                <el-tooltip :content="buildStatusTooltip(mergedOccurency)">
                  <jus-icon :icon="buildStatusIcon(mergedOccurency)" />
                </el-tooltip>
                <div>•</div>
                <span v-text="buildHour(mergedOccurency)" />
                <div v-if="!!buildIcon(mergedOccurency)">
                  •
                </div>
                <jus-icon
                  v-if="!!buildIcon(mergedOccurency)"
                  :icon="buildIcon(mergedOccurency)"
                  :class="{'NEGOTIATOR': mergedOccurency.interaction && mergedOccurency.interaction.type.startsWith('NEGOTIATOR')}"
                />
                <div v-if="(mergedOccurency.interaction && mergedOccurency.interaction.message) && (mergedOccurency.interaction.message.receiver || mergedOccurency.interaction.message.parameters)">
                  •
                </div>
                <span v-if="mergedOccurency.interaction && mergedOccurency.interaction.message && mergedOccurency.interaction.message.receiver && getDirection(mergedOccurency.interaction) === 'OUTBOUND'">
                  Para: {{ mergedOccurency.interaction.message.receiver | phoneNumber }}
                </span>
                <span v-if="mergedOccurency.interaction && mergedOccurency.interaction.message && mergedOccurency.interaction.message.parameters && getDirection(mergedOccurency.interaction) === 'INBOUND'">
                  Por:
                  <span v-if="![mergedOccurency.interaction.message.sender, mergedOccurency.interaction.message.parameters.SENDER].includes(mergedOccurency.interaction.message.parameters.SENDER_NAME)">
                    {{ mergedOccurency.interaction.message.parameters.SENDER_NAME }}
                    ({{ mergedOccurency.interaction.message.parameters.SENDER || mergedOccurency.interaction.message.sender | phoneNumber }})
                  </span>
                  <span v-else>
                    {{ mergedOccurency.interaction.message.parameters.SENDER || mergedOccurency.interaction.message.sender | phoneNumber }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </li>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="messageDialogVisible"
      data-testid="email-dialog"
      width="70%"
    >
      <span slot="title">
        <h2>Mensagem</h2>
      </span>
      <div v-loading="loadingMessage">
        <span v-if="messageError && !loadingMessage">
          <el-alert
            :closable="false"
            type="error"
          >
            <strong>Não foi possível buscar o conteúdo da mensagem neste momento.</strong>
            <br><br>
            Tente novamente ou entre em contato com o administrador do sistema.
          </el-alert>
        </span>
        <span v-else-if="!message && !loadingMessage">
          <el-alert
            :closable="false"
            type="warning"
          >
            <strong>Não foi possível exibir o conteúdo da mensagem.</strong>
            <br><br>
            Mídias de áudio ou vídeo ainda não estão disponíveis para visualização na plataforma Justto.
          </el-alert>
        </span>
        <span
          v-else
          v-html="message"
        />
      </div>
      <span slot="footer">
        <el-button
          plain
          data-testid="close-button"
          @click="messageDialogVisible = false"
        >Fechar</el-button>
      </span>
    </el-dialog>
    <div style="margin-top: 20px">
      <slot />
    </div>
  </ul>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import { isSimilarStrings, normalizeString } from '@/utils'
import { mapGetters, mapActions } from 'vuex'
import { uniq } from 'lodash'

export default {
  name: 'DisputeOccurrences',
  components: {
    InfiniteLoading,
    AttachmentOccurrence: () => import('./partials/AttachmentOccurrence')
  },
  props: {
    disputeId: {
      type: String,
      default: ''
    },
    typingTab: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      loadingMessage: 'false',
      message: '',
      messageError: false,
      messageDialogVisible: false,
      showFullMessageList: [],
      fullMessageBank: {},
      infiniteId: +new Date(),
      handlePartyId: {},
      disputePartys: [
        {
          value: 'RESPONDENT',
          label: 'Advogado do réu'
        },
        {
          value: 'CLAIMANT',
          label: 'Advogado da parte contrária'
        },
        {
          value: 'UNKNOWN',
          label: 'Desconhecido'
        }
      ],
      negotiatorTypes: [
        'NEGOTIATOR_ACCESS',
        'NEGOTIATOR_PROPOSAL',
        'NEGOTIATOR_COUNTERPROSAL',
        'NEGOTIATOR_CHECKOUT',
        'NEGOTIATOR_ACCEPTED',
        'NEGOTIATOR_REJECTED'
      ]
    }
  },
  computed: {
    ...mapGetters([
      'activeOccurrency',
      'disputeLastInteractions'
    ]),

    datedOccurrences() {
      // APENAS ABA COMUNICAÇÃO
      const self = this
      const filteredOccurrences = this.$store.getters.occurrences.filter(o => {
        if (o.type === 'NOTE') return null
        if (self.typingTab === '1' && (
          ['NOTE', 'LOG'].includes(o.type) ||
          (o.interaction && ['VISUALIZATION', 'CLICK', 'NEGOTIATOR_ACCESS'].includes(o.interaction.type)) ||
          (o.interaction && o.interaction.type === 'SCHEDULER' && o.interaction.message && o.interaction.message.status !== 'FAILED')
        )) return null
        return true
      })
      // AGRUPA POR DATA
      const datedOccurrences = {}
      filteredOccurrences.forEach(fo => {
        const currentDay = this.$moment(fo.createAt.dateTime).format('DD/MM/YYYY')
        // eslint-disable-next-line no-prototype-builtins
        if (!datedOccurrences.hasOwnProperty(currentDay)) datedOccurrences[currentDay] = []
        datedOccurrences[currentDay].push(fo)
      })
      // MERGE DE DESCRIÇÃO
      Object.keys(datedOccurrences).forEach((item) => {
        const datedOccurrence = datedOccurrences[item]
        let previousOccurrenceIndex
        datedOccurrence.forEach((fo, index) => {
          if (fo.interaction && fo.interaction.message && fo.interaction.message.communicationType === 'WHATSAPP') return
          let similarity
          if (fo.interaction && fo.interaction.type) {
            similarity = ['MANUAL_COUNTERPROPOSAL', 'NEGOTIATOR_PROPOSAL', 'NEGOTIATOR_COUNTERPROSAL', 'MANUAL_PROPOSAL'].includes(fo.interaction.type) ? 100 : 75
          } else {
            similarity = 75
          }
          const previous = datedOccurrence[previousOccurrenceIndex]
          if (previous && isSimilarStrings(this.buildContent(fo), this.buildContent(previous), similarity) && (fo.interaction && previous.interaction && fo.interaction.direction === previous.interaction.direction)) {
            fo.toDelete = true
            if (!previous.merged) {
              previous.merged = []
              previous.toDelete = false
            }
            if (!previous.merged.map(i => i.id).includes(fo.id)) {
              previous.merged.push(fo)
            }
          } else previousOccurrenceIndex = index
        })
        datedOccurrences[item] = datedOccurrence.filter(fo => !fo.toDelete)
      })
      return datedOccurrences
    },
    fetchAction() {
      if (this.typingTab === '1') {
        return 'getDisputeCommunications'
      } else {
        return 'getDisputeOccurrences'
      }
    }
  },
  watch: {
    typingTab() {
      this.clearOccurrences()
      this.infiniteId += 1
    }
  },
  mounted() {
    this.clearOccurrences()
  },
  methods: {
    ...mapActions(['setActiveactiveOccurrency']),

    getIconIsMerged(occurrency) {
      return this.activeOccurrency.id === occurrency.id ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
    },
    openOptionsParty(role) {
      this.$set(this.handlePartyId, 'party_role' + role.id, true)
    },
    closeOptionsParty(role) {
      this.$set(this.handlePartyId, 'party_role' + role.id, false)
    },
    setDisputeParty(role) {
      this.handlePartyId['party_role' + role.id] = false
      const params = {
        disputeId: this.disputeId,
        disputeRoleId: role.id,
        disputeParty: role.party
      }
      this.$jusSegment('Defiido função em participante da disputa', {
        page: this.$route.name
      })
      this.$store.dispatch('setDisputeparty', params).then(() => {
        this.$jusNotification({
          title: 'Yay!',
          message: 'Função definida com sucesso!',
          type: 'success',
          dangerouslyUseHTMLString: true
        })
      })
    },
    clearOccurrences() {
      this.$store.commit('clearOccurrencesSize')
      this.$store.commit('clearDisputeOccurrences')
    },

    loadOccurrences($state) {
      this.$store.dispatch(this.fetchAction, this.disputeId).then(response => {
        if (response.last) {
          $state.complete()
        } else {
          $state.loaded()
          this.$store.commit('incrementOccurrencesSize')
        }
      })
    },

    showFullMessage(occurrenceId, messageId = false) {
      this.showFullMessageList.push(occurrenceId)
      if (messageId) {
        this.getOccurrenceMessage(messageId, occurrenceId)
      }
    },

    hideFullMessage(occurrenceId) {
      if (this.showFullMessageList.pop(occurrenceId)) {
        delete this.fullMessageBank[occurrenceId]
      }
    },

    showMessageDialog(messageId) {
      this.messageDialogVisible = true
      this.message = ''
      this.loadingMessage = true
      this.messageError = false
      this.$store.dispatch('getOccurrenceMessage', messageId)
        .then(message => {
          this.message = message.content
        }).catch(error => {
          this.messageError = true
          console.error(error)
        }).finally(() => {
          this.loadingMessage = false
        })
    },

    getMessageRef(occurrence) {
      if (occurrence.interaction &&
        occurrence.interaction.message &&
        occurrence.interaction.message.messageId) {
        return occurrence.id
      }
    },

    buildTooltip(occurrence) {
      let text = ''
      if (occurrence.interaction && occurrence.interaction.parameters && occurrence.interaction.parameters.DEVICE) {
        text = text + 'Dispositivo: ' + occurrence.interaction.properties.DEVICE
      }
      return text
    },

    buildIcon(occurrence) {
      if (occurrence.interaction && occurrence.interaction.type === 'CLICK') {
        return 'click'
      }
      if (occurrence.interaction && occurrence.interaction.type === 'VISUALIZATION') {
        return 'eye'
      }
      if (occurrence.interaction && occurrence.interaction.message && !!occurrence.interaction.message.communicationType) {
        let icon = occurrence.interaction.message.communicationType
        icon += ''
        return icon.replace('_', '-').toLowerCase()
      }
      if (occurrence.interaction && ['NEGOTIATOR_PROPOSAL', 'NEGOTIATOR_REJECTED', 'NEGOTIATOR_ACCEPTED', 'NEGOTIATOR_CHECKOUT', 'NEGOTIATOR_ACCESS'].includes(occurrence.interaction.type + '')) {
        return 'justto'
      }
      if (occurrence.type === 'LOG') {
        if (occurrence.description.toLowerCase().includes('disputa dada como ganha')) return 'win'
        if (occurrence.description.toLowerCase().includes('disputa pausada')) return 'pause'
        if (occurrence.description.toLowerCase().includes('disputa alterada para perdido')) return 'lose'
        if (occurrence.description.toLowerCase().includes('reiniciou o engajamento')) return 'refresh'
        if (occurrence.description.toLowerCase().includes('disputa retomada')) return 'start-again'
        if (occurrence.description.toLowerCase().includes('disputa marcada como favorita')) return 'star'
        if (occurrence.description.toLowerCase().includes('disputa expirou')) return 'calendar-clock'
        if (occurrence.description.toLowerCase().includes('disputa expirada')) return 'calendar-clock'
      }
      return ''
    },

    getDirection(interaction) {
      if (!interaction) return ''
      if (['MANUAL_COUNTERPROPOSAL', 'MANUAL_PROPOSAL'].includes(interaction.type)) {
        return 'OUTBOUND'
      } else return interaction.direction
    },

    buildName(occurrence) {
      if (occurrence.interaction) {
        if (this.isJusttineMessage(occurrence)) {
          return ''
        }
        if (occurrence.interaction.type &&
        ['ATTACHMENT'].includes(occurrence.interaction.type)
        ) {
          return occurrence.properties.SENDER_NAME
        }
        if (occurrence.interaction.type &&
          ['MANUAL_COUNTERPROPOSAL', 'MANUAL_PROPOSAL', 'CLICK'].includes(occurrence.interaction.type) &&
          occurrence.interaction.properties.USER) {
          return occurrence.interaction.properties.USER.toUpperCase()
        }
        if (occurrence.interaction.type &&
          occurrence.interaction.message &&
          occurrence.interaction.message.parameters &&
          occurrence.interaction.message.parameters.RECEIVER_NAME &&
          ['VISUALIZATION', 'CLICK'].includes(occurrence.interaction.type)) {
          return occurrence.interaction.message.parameters.RECEIVER_NAME.toUpperCase()
        }
        if (occurrence.interaction.message &&
          occurrence.interaction.message.parameters &&
          occurrence.interaction.message.parameters.SENDER_NAME) {
          return occurrence.interaction.message.parameters.SENDER_NAME.toUpperCase()
        }
        if (occurrence.interaction.properties &&
          occurrence.interaction.properties.PERSON_NAME) {
          return occurrence.interaction.properties.PERSON_NAME.toUpperCase()
        }
      }
      return ''
    },

    isJusttineMessage(occurrence) {
      return occurrence.interaction &&
      occurrence.interaction.message &&
      occurrence.interaction.message.status !== 'PROCESSED_BY_USER' &&
      occurrence.interaction.message.createdBy === 'system' &&
      occurrence.interaction.direction === 'OUTBOUND'
    },

    buildAvatar(occurrence) {
      if (this.isJusttineMessage(occurrence)) {
        return require('@/assets/justtine/profile.png')
      } return ''
    },

    getOccurrenceMessage(messageId, occurrenceId) {
      if (!Object.keys(this.fullMessageBank).includes(occurrenceId)) {
        this.$store.dispatch('getOccurrenceMessage', messageId).then(message => {
          const ref = this.$refs[occurrenceId]
          ref[0].innerHTML = message.content
          this.fullMessageBank[occurrenceId] = message.content
        })
      }
    },

    buildLogContent(occurrence) {
      if (occurrence.interaction && occurrence.interaction.type === 'NEGOTIATOR_ACCESS') {
        return 'Disputa visualizada'
      }
      return occurrence.description
    },
    canHandleUnknowParty(occurrence) {
      return occurrence.properties && occurrence.properties.HANDLE_UNKNOW_PARTY && occurrence.properties.UNKNOW_ROLE_IDS
    },
    getUnknowPartys(occurrence) {
      const canHandleParty = this.canHandleUnknowParty(occurrence)
      if (canHandleParty) {
        const dispute = this.$store.getters.dispute
        const roleIds = JSON.parse(occurrence.properties.UNKNOW_ROLE_IDS)
        const filteredRole = dispute.disputeRoles.filter(r => roleIds.includes(r.id) && r.party === 'UNKNOWN')
        return filteredRole
      }
      return canHandleParty
    },
    buildContent(occurrence) {
      if (!occurrence) return ''
      if (occurrence.type === 'LOG' || (occurrence.interaction && ['VISUALIZATION', 'CLICK', 'NEGOTIATOR_ACCESS'].includes(occurrence.interaction.type))) {
        if (occurrence.interaction && occurrence.interaction.type === 'NEGOTIATOR_ACCESS') {
          return 'Disputa visualizada'
        }
        return occurrence.description
      }
      if (occurrence.interaction && Object.keys(occurrence.interaction.properties).length) {
        if (occurrence.interaction.type === 'NEGOTIATOR_CHECKOUT' && occurrence.interaction.properties.BANK_INFO) {
          return '<strong>Dados bancários:</strong> <br>' + occurrence.interaction.properties.BANK_INFO.replace(/,/g, '<br>')
        } else if (['MANUAL_COUNTERPROPOSAL', 'MANUAL_PROPOSAL'].includes(occurrence.interaction.type)) {
          return `
            Negociador <b>${occurrence.interaction.properties.USER ? occurrence.interaction.properties.USER : ''}</b>
            informou uma proposta realizada por <b>${occurrence.interaction.properties.PERSON_NAME}</b>
            no valor de <b>${occurrence.interaction.properties.VALUE}</b>${occurrence.interaction.properties.NOTE ? ' com a observação: ' + occurrence.interaction.properties.NOTE : ''}.`
        } else if (['NEGOTIATOR_COUNTERPROSAL', 'NEGOTIATOR_PROPOSAL'].includes(occurrence.interaction.type)) {
          return `
            Proposta realizada por <b>${occurrence.interaction.properties.PERSON_NAME}</b>
            no valor de <b>${occurrence.interaction.properties.VALUE}</b>${occurrence.interaction.properties.NOTE ? ' com a observação: ' + occurrence.interaction.properties.NOTE : ''}.`
        } else if (['COMMUNICATION'].includes(occurrence.interaction.type) && occurrence.interaction.message && ['NEGOTIATOR_MESSAGE'].includes(occurrence.interaction.message.communicationType)) {
          if (this.showResume(occurrence)) {
            return occurrence.interaction.message.resume + '...'
          } else {
            return occurrence.interaction.message.resume
          }
        }
        return occurrence.description
      }
      if (occurrence.id && Object.keys(this.fullMessageBank).includes(occurrence.id.toString())) {
        return this.fullMessageBank[occurrence.id]
      }
      if (this.showFullMessageList.includes(occurrence.id) && !Object.keys(this.fullMessageBank).includes(occurrence.id)) {
        this.getOccurrenceMessage(occurrence.interaction.message.messageId, occurrence.id)
        return ''
      }
      if (occurrence.interaction &&
        occurrence.interaction.message &&
        occurrence.interaction.message.resume) {
        if (this.showResume(occurrence)) {
          return occurrence.interaction.message.resume + '...'
        }
        return occurrence.interaction.message.resume
      }
      return occurrence.description
    },

    canShowFullMessage(occurrence) {
      return (occurrence.interaction &&
        occurrence.interaction.message &&
        occurrence.interaction.message.resume &&
        occurrence.interaction.message.resume.length >= 100)
    },

    showResume(occurrence) {
      if (!this.showFullMessageList.includes(occurrence.id) &&
        this.canShowFullMessage(occurrence)) {
        return true
      }
      return false
    },

    buildStatusIcon(occurrence) {
      if (occurrence.status) {
        return occurrence.status.toLowerCase()
      }
    },

    buildStatusTooltip(occurrence) {
      return 'No momento desta ocorrência, esta disputa estava ' + this.$t('dispute.status.' + occurrence.status)
    },

    buildHour(occurrence) {
      return this.$moment(occurrence.createAt.dateTime).format('HH:mm')
    },

    buildCommunicationType(occurrence) {
      let typeClass = ''
      if (occurrence.interaction && occurrence.interaction.message) {
        if (occurrence.interaction.message.communicationType) {
          typeClass = occurrence.interaction.message.communicationType
        }
        if (occurrence.interaction.message.status) {
          typeClass = typeClass + ' ' + occurrence.interaction.message.status
        }
      }
      return typeClass
    },
    showReply(occurrence) {
      if (occurrence.interaction &&
        ((occurrence.interaction.message &&
        occurrence.interaction.message.communicationType &&
        !['ATTACHMENT'].includes(occurrence.interaction.type) &&
        ['EMAIL', 'WHATSAPP', 'NEGOTIATOR_MESSAGE'].includes(occurrence.interaction.message.communicationType)) ||
        (this.negotiatorTypes.includes(occurrence.interaction.type) ||
        this.disputeLastInteractions.length)) &&
        occurrence.interaction.direction === 'INBOUND') {
        return true
      }
      return false
    },

    isNegotiatorMessage(occurrence) {
      return this.negotiatorTypes.includes(occurrence.interaction.type) ||
        ['NEGOTIATOR_MESSAGE'].includes(occurrence.interaction.message.communicationType)
    },

    startReply(occurrence) {
      let senders, resume, type
      if (occurrence.interaction && occurrence.interaction.message && occurrence.interaction.message.sender) {
        senders = [occurrence.interaction.message.sender]
      } else {
        senders = uniq(this.disputeLastInteractions.map(item => item.address))
      }
      if (this.isNegotiatorMessage(occurrence)) {
        resume = this.buildContent(occurrence)
        type = 'negotiation'
      } else {
        resume = occurrence.interaction.message.resume
        type = occurrence.interaction.message.communicationType
      }
      this.$emit('dispute:reply', { senders, resume, type })
    },

    /** @method buildWhatsappStatus
      * @param {Message} message
      * @param {DateTime} executionDateTime
      * @returns {Object} {icon, message}
      * @description Return icon and message according to status
      // WAITING
      // PROCESSED
      // PROCESSED_BY_USER
      // FAILED
      // CANCELED
    */
    buildWhatsappStatus(message, executionDateTime) {
      if (!message) return null
      if (message.status.startsWith('PROCESSED')) {
        const sendDate = message.parameters && message.parameters.SEND_DATE ? message.parameters.SEND_DATE : this.$moment(executionDateTime.dateTime).format('DD/MM/YYYY HH:mm')
        const receiverDate = message.parameters ? message.parameters.RECEIVER_DATE : ''
        const readDate = (message.parameters && message.parameters.READ_DATE) ? this.$moment(message.parameters.READ_DATE).format('DD/MM/YYYY HH:mm') : ''
        let icon = 'status-sent'
        let msg = `Enviado em ${sendDate}.`
        if (receiverDate) {
          msg += `<br>Recebido em ${receiverDate}.`
          icon = 'status-recived'
        }
        if (readDate) {
          msg += `<br>Lido em ${readDate}.`
          icon = 'status-readed'
        }
        return { icon, message: msg }
      } else if (message.status === 'CANCELED') {
        return { icon: 'error', message: 'Envio da mensagem cancelado.' }
      } else if (message.status === 'RETRYING') {
        return { icon: 'refresh', message: 'Falha na entrega desta mensagem. Tentando reenviar.' }
      } else if (message.status === 'FAILED') {
        const failed = normalizeString(message.parameters.FAILED_SEND)
        const msg = normalizeString('WhatsApp não recomenda novo envio sem ter resposta do número')
        if (failed.includes(msg)) {
          return { icon: 'alert-active', message: `Falha na entrega desta mensagem. Detalhes da falha: <i>${message.parameters.FAILED_SEND || 'Desconhecido'}.</i>` }
        } else {
          return { icon: 'alert', message: `Falha na entrega desta mensagem. Detalhes da falha: <i>${message.parameters.FAILED_SEND || 'Desconhecido'}.</i>` }
        }
      }
      return null
    },

    buildEmailStatus(occurrency) {
      if (occurrency.interaction.message.status === 'FAILED') {
        return {
          message: occurrency.interaction.message.parameters.FAILED_SEND,
          icon: 'alert'
        }
      }
      return false
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.fix-display {
  display: inline !important;
}

.dispute-view-occurrences {
  list-style: none;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  height: 100%;

  .fast-occurrence-actions{

    .ok {
      text-decoration-line: underline;
      padding-top: 0.75rem;
    }

    .fast-occurrence-actions__items {
      padding-top: 0.75rem;
      display: flex;
      flex-direction: row;
      justify-content: center;

      .fast-occurrence-actions__select-container {
        .el-select {
          width: 250px;
          text-align: center;
        }

        .fast-occurrence-actions__cancel-tooltip {
          margin-left: 0.5rem;
          background-color: #9461f7;
          color: white;
          border: none;
        }
      }

    }

    .fast-occurrence__log-info {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      gap: 5px;
    }
  }
  .occurrence-content {
    line-height: 30px;
  }
  .dispute-view-occurrences__log-info{
    margin-top: 10px;
  }
  &__occurrence {
    display: flex;
    justify-content: center;
  }
  &__occurrence-merged {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  &__interaction {
    margin-top: 20px;
    display: flex;
    width: 100%;
    &.OUTBOUND {
      flex-direction: row-reverse;
      .dispute-view-occurrences__card {
        margin-left: 8px;
      }
      .dispute-view-occurrences__avatar {
        margin: 0 20px 0 12px;
      }
    }
    &.INBOUND {
      .dispute-view-occurrences__card {
        margin-right: 8px;
      }

    }
    &.LOADING {
      opacity: 0.5;
    }
  }
  &__interaction-merged {
    padding-right: 4rem;
    display: flex;
  }
  &__card {
    border-radius: 8px;
    height: fit-content;
    &--note {
      border-radius: 0px;
      border: none;
      position: relative;
      .el-card__header {
        padding: 8px 20px !important;
      }
      .el-card__body {
        padding: 12px 20px !important;
      }
    }
    &--note-header {
      display: flex;
      justify-content: flex-end;
      i {
        margin-left: 8px;
        cursor: pointer;
      }
    }
    &.WAITING, &.CANCELED {
      border: 2px dashed #343c4b;
    }
    &.COMMUNICATION, &.SCHEDULER {
      .el-card__header {
        padding: 10px 20px 0;
      }
      &.WHATSAPP {
        background-color: $--color-success-light-5;
      }
      &.EMAIL {
        background-color: $--color-info-light;
      }
      &.UNKNOWN {
        background-color: $--color-cloudy-blue;
      }
      &.EMAIL_CNA {
        background-color: #B6FFFB;
      }
      &.SMS {
        background-color: #ececec;
      }
    }
    &.NEGOTIATOR_REJECTED,
    &.NEGOTIATOR_PROPOSAL,
    &.NEGOTIATOR_ACCEPTED,
    &.MANUAL_COUNTERPROPOSAL,
    &.NEGOTIATOR_COUNTERPROSAL,
    &.MANUAL_PROPOSAL {
      border: 1px solid #FFC5A5;
      .el-card__header {
        background-color: #FFC5A5;
      }
      .note {
        font-weight: lighter;
        font-style: italic;
        color: #000;
      }
    }
    &.NEGOTIATOR_CHECKOUT {
      border: 1px solid #B691FB;
      .el-card__header {
        background-color: #B691FB;
      }
    }
    .el-card__header {
      padding: 10px 20px;
      font-weight: bold;
      border: 0;
      text-transform: capitalize;
      > div {
        display: flex;
        align-items: center;
      }
      span {
        margin-left: 8px;
      }
      img {
        width: 15px;
      }
    }
    .el-card__body {
      padding: 10px 20px;
      word-break: break-word;
      strong {
        margin-bottom: 8px;
        display: inline-block;
      }
      table:not([style]) {
        width: 100%;
      }
      table, table tbody, table tbody *  {
        background: none !important;
      }
      img {
        max-width: 100%;
      }
    }
  }
  &__card-box {
    max-width: 70%;
  }
  &__card-info {
    display: flex;
    margin: 4px 22px 0 22px;
    white-space: nowrap;

    .dispute-view-occurrences__expand-button {
      cursor: pointer;
    }
    div {
      margin: 0 4px;
    }
    img {
      width: 16px;
    }
    span {
      font-weight: 300;
    }
    &.OUTBOUND {
      flex-direction: row-reverse;
    }
  }
  &__show-dialog {
    margin-top: 8px;
    display: block;
  }
  &__log {
    display: inline-block;
    border-radius: 8px;
    margin: 20px 20px 0;
    border: none;
    .el-card__body {
      padding: 8px 20px;
      word-break: break-word;
      text-align: center;
      br:first-child {
        content: " ";
        display: block;
        margin: -7px 0;
      }
    }
    img {
      width: 15px;
      margin-right: 5px;
      &.justto {
        height: 11px;
      }
    }
  }
  &__log-info {
    display: flex;
    float: right;
    font-size: 11px;
    margin-top: 4px;
    margin-left: 10px;
    div {
      font-weight: 500;
      margin: 0 4px;
    }
    img {
      width: 16px;
    }
    span {
      font-weight: 300;
    }
  }
  &__log-info-content {
    & + .dispute-view-occurrences__log-info-content {
      margin-top: 2px;
    }
  }
  &__note {
    border-radius: 8px;
    margin: 20px 20px 0;
    border: none;
    display: flex;
    width: 100%;
    flex-direction: row-reverse;
    .el-card__body {
      padding: 8px 20px;
      word-break: break-word;
      background-color: #f6f1ff;
    }
    .el-card__header {
      background-color: #efe7ff;
    }
  }
  &__avatar {
    margin: 0 12px 0 20px;
    display: flex;
    flex-direction: column;
    width: max-content;
    text-align: center;
    span {
      font-size: 12px;
      margin-top: 4px;
    }
    .el-icon-question {
      margin-top: 2px;
      color: $--color-text-secondary;
    }
  }
  &__empty {
    width: 100%;
    height: 100%;
    font-weight: 400;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: $--color-text-secondary;
    img {
      margin-bottom: 20px;
      width: 60px;
    }
  }
  &__date {
    + .dispute-view-occurrences__occurrence {
      margin-top: -12px;
    }
    padding: 4px;
    position: sticky;
    top: 12px;
    margin: auto;
    margin-top: 20px;
    margin-bottom: 24px;
    width: fit-content;
    background-color: transparent;
    border: none;
    .el-card__body {
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      padding: 10px;
    }
  }
  .el-dialog__body {
    min-height: 128px;
    .el-loading-parent--relative {
      height: 100%;
    }
  }
  .infinite-status-prompt {
    padding-top: 30px !important;
    color: $--color-text-secondary !important;
    font-style: italic;
  }
  .loading-spiral {
    border: 2px solid #9461f7 !important;
    border-right-color: transparent !important;
  }
  .el-alert__description {
    font-size: 14px;
  }
  &__log-canceled {
    position: relative;
    &:before {
      content: "x";
      color: #fff4cc;
      position: absolute;
      bottom: 2px;
      right: 4px;
      height: 9px;
      width: 10px;
      font-size: 9px;
      background-color: #5a5646;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 1px;
    }
  }
  &__textarea .el-textarea__inner {
    height: 40vh;
    resize: none;
  }
  &__side-icon {
    align-self: center;
    margin-bottom: 22px;
    position: sticky;
    top: 8px;
    bottom: 8px;

    img {
      width: 20px;
    }
  }
  &__whats-status {
    float: right;
    margin-left: 10px;
    margin-top: 5px;
    margin-right: -10px;
    img {
      width: 18px;
    }
  }
}
</style>
