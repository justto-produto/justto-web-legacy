export default
{
  name: 'FUNEL_TOUR',
  steps: [
    {
      title: 'Pré-negociação',
      description: 'Opa, legal. Você importou um monte de processos para negociar, mas identificamos que pode ter ocorrido baixa definitiva em alguns…',
      asset: '',
      target: '[data-jus-tour="PRE_NEGOTIATION_TAB"]',
      steps: 0,
    },
    {
      title: 'Pré-negociação',
      description: 'Nesta aba, vamos indicar para você os processos com suspeita de baixa. Você decide se vai prosseguir e negocia-los.',
      asset: '',
      target: '[data-jus-tour="PRE_NEGOTIATION_TAB"]',
      steps: 1,
    },
    {
      title: 'Sem resposta',
      description: 'Nesta fase do funil, o objetivo é garantir que a parte contrária seja contactada',
      asset: '',
      target: '[data-jus-tour="WITHOUT_RESPONSE_TAB"]',
      steps: 2,
    },
    {
      title: 'Sem resposta',
      description: 'Vamos centralizar nesta aba, todas as disputa que precisarem de sua atenção para iniciar o engajamento da parte contrária',
      asset: '',
      target: '[data-jus-tour="WITHOUT_RESPONSE_TAB"]',
      steps: 3,
    },
    {
      title: 'Com interação',
      description: 'Bacana, temos o primeiro contato da parte contrária. Vamos atras do nosso acordo',
      asset: '',
      target: '[data-jus-tour="HAS_INTERACTION_TAB"]',
      steps: 4,
    },
    {
      title: 'Com interação',
      description: 'O objetivo é chegar numa proposta aceitável para as 2 partes da forma mais rápida possível. Por isto te mostramos os dados mais relevantes para você negociar',
      asset: '',
      target: '[data-jus-tour="HAS_INTERACTION_TAB"]',
      steps: 5,
    },
    {
      title: 'Proposta aceita',
      description: 'Sua proposta foi aceita. Ótimo, agora é formalizar nosso acordo.',
      asset: '',
      target: '[data-jus-tour="PROPOSAL_ACCEPTED_TAB"]',
      steps: 6,
    },
    {
      title: 'Proposta aceita',
      description: 'Neste momento, vamos te guiar na geração e assinatura da minuta de forma visual',
      asset: '',
      target: '[data-jus-tour="PROPOSAL_ACCEPTED_TAB"]',
      steps: 7,
    },
    {
      title: 'Todos',
      description: 'E por fim, aqui você encontra uma lista com TODAS as disputas que estão na plataforma :)',
      asset: '',
      target: '[data-jus-tour="ALL_DISPUTES_TAB"]',
      steps: 8,
    }
  ]
}
