/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 2.28.785 on 2021-01-07 16:57:29.

/**
 * Representação dos participantes/envolvidos na disputa no sistema de negociações
 */
interface DisputeRoleDto extends EntityDto {
  party: DisputeParty;
  main: boolean;
  personId: number;
  disputeId: number;
  name: string;
  alias: string;
  documentNumber: string;
  personType: PersonType;
  phones: PhoneDto[];
  emails: EmailDto[];
  oabs: OabDto[];
  bankAccounts: BankAccountDto[];
  roles: DisputeRoleName[];
  personProperties: { [index: string]: string };
  roleNameParty: boolean;
  roleNameLawyer: boolean;
  roleNameNegotiator: boolean;
  namesake: boolean;
  dead: boolean;
  online: boolean;
  lastAccess: Date;
}

// interface CodedValueDomainDto {
//   id: number;
//   code: string;
//   description: string;
// }

// interface CommunicationEngagementStatusVm {
//   type: CommunicationType;
//   status: CommunicationMessageStatus;
// }

// interface DisputeOverviewInfoVm {
//   id: number;
//   strategyId: number;
//   contactPartyWhenInvalidLawyer: boolean;
//   contactPartyWhenNoLawyer: boolean;
//   businessHoursEngagement: boolean;
//   alwaysContactParty: boolean;
//   skipEnrichment: boolean;
//   denySavingDeposit: boolean;
//   ownerProposalRoleId: number;
//   requestedValue: number;
//   materialDamageValue: number;
//   moralDamageValue: number;
//   internalIdentification: string;
//   provisionedValue: number;
//   campaignName: string;
//   importedDate: DateTimeDto;
//   expireDate: DateTimeDto;
// }

// interface DisputeOverviewVm {
//   id: number;
//   code: string;
//   description: string;
//   status: DisputeStatus;
//   upperRanger: number;
//   internalId: string;
//   plaintiffProposal: ProposalVm;
//   defendantProposal: ProposalVm;
//   strategy: StrategyLeanDto;
// }

// interface ProposalVm {
//   ownerName: string;
//   value: number;
// }

// interface ReceivedMessageVm {
//   dateTime: DateTimeDto;
//   message: string;
// }

// interface TicketCommunicationItemVm extends TicketItemVm {
//   lastReceivedMessage: ReceivedMessageVm;
// }

// interface TicketEngagementItemVm extends TicketItemVm {
//   pendingReason: CodedValueDomainDto;
//   communications: CommunicationEngagementStatusVm[];
// }

// interface TicketItemVm {
//   disputeId: number;
//   disputeStatus: DisputeStatus;
//   plaintiff: string;
//   role: DisputeRoleName;
//   negotiatorId: number;
// }

/**
* Representação de data/hora nos objetos de transferência de dados da JUSTTO. Formatos aceitos: "yyyy-MM-dd'T'HH:mm:ss'Z'","yyyy-MM-dd HH:mm:ss","yyyy-MM-dd"
*/
interface DateTimeDto {
  dateTime: Date;
  javaDate: boolean;
}

/**
* Objeto representando um telefone. Dado de um participante de disputas ou de qualquer pessoa no sistema
// */
// interface PhoneDto extends PersonDataDto {
//   number: string;
//   isMobile: boolean;
//   service: PhoneServiceName;
// }

/**
* Objeto representando um email de uma pessoa dentro do sistema de negociações
*/
// interface EmailDto extends PersonDataDto {
//   address: string;
// }

/**
* Objeto representando uma OAB
// */
// interface OabDto extends PersonDataDto {
//   number: string;
//   state: BrazilianState;
// }

/**
* Represent a model to BankAccount information
*/
// interface BankAccountDto extends AuditDto, DtoInterface {
//   personId: number;
//   name: string;
//   document: string;
//   email: string;
//   number: string;
//   agency: string;
//   bank: string;
//   type: BankAccountType;
// }

/**
* Delimita e qualifica a base de Domain Transfer Objects de Entidades da JUSTTO
*/
interface EntityDto extends DtoInterface {
  createAt: DateTimeDto;
  updateAt: DateTimeDto;
  archived: boolean;
}

// interface StrategyLeanDto {
//   id: number;
//   name: string;
//   types: DisputeObjectType[];
//   triggerType: StrategyTriggerType;
// }

/**
* Representação genérica dos dados de uma pessoa dentro do sistema de negociação
*/
// interface PersonDataDto extends EntityDto {
//   enriched: boolean;
//   isValid: boolean;
//   isMain: boolean;
//   ranking: number;
//   source: DataSource;
// }

interface AuditDto {
  createdAt: Date;
  updatedAt: Date;
}

interface DtoInterface {
  id: number;
}

type DisputeParty = "RESPONDENT" | "CLAIMANT" | "IMPARTIAL" | "UNKNOWN";

type PersonType = "NATURAL" | "LEGAL";

type DisputeRoleName = "PARTY" | "LAWYER" | "NEGOTIATOR" | "WITNESS" | "MEDIATOR" | "ARBITRATOR" | "JUDGE" | "EXPERT" | "LITLLE_UNCLE_FROM_BEYOND";

type CommunicationType = "EMAIL" | "EMAIL_CNA" | "SMS" | "CALL" | "NOTIFICATION" | "PUSH_NOTIFICATION" | "CHAT" | "NOTE" | "TTS" | "WHATSAPP" | "DELAY" | "NEGOTIATOR_MESSAGE" | "UNKNOWN";

type CommunicationMessageStatus = "WAITING" | "PROCESSED" | "PROCESSED_BY_USER" | "FAILED" | "CANCELED" | "RETRYING" | "WAITING_TO_RESPONSE";

type DisputeStatus = "IMPORTED" | "ENRICHED" | "ENGAGEMENT" | "RUNNING" | "PENDING" | "ACCEPTED" | "CHECKOUT" | "EXPIRED" | "SETTLED" | "UNSETTLED" | "REFUSED" | "ARCHIVED" | "PRE_NEGOTIATION";

type DataSource = "CLIENT" | "ENRICHMENT";

type PhoneServiceName = "WHATSAPP" | "SKYPE" | "HANGOUT";

type BrazilianState = "AC" | "AL" | "AP" | "AM" | "BA" | "CE" | "DF" | "ES" | "GO" | "MA" | "MT" | "MS" | "MG" | "PA" | "PB" | "PR" | "PE" | "PI" | "RJ" | "RN" | "RS" | "RO" | "RR" | "SC" | "SP" | "SE" | "TO";

type BankAccountType = "SAVING" | "CHECKING";

type DisputeObjectType = "PAYMENT" | "RECOVERY" | "OBLIGATION" | "DISCOUNT" | "REFUND";

type StrategyTriggerType = "ENGAGEMENT" | "NEW_OFFER" | "RE_ENGAGEMENT" | "UNSETTLED" | "MANUAL";