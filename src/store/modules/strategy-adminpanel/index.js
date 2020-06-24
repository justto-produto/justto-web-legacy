import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const StrategyModule = {
  state: {
    strategies: [
      {
        id: 1,
        name: 'Mock Strategy',
        isActive: true,
        isPrivate: false,
        workspaces: [],
        communications: [
          // Message mock
          {
            id: null,
            createAt: null,
            updateAt: null,
            archived: false,
            name: '1º contato SMS',
            recipients: [
              'PARTY',
              'LAWYER',
            ],
            parties: [
              'CLAIMANT',
            ],
            duration: null,
            orderExecution: 3,
            template: {
              id: null,
              createAt: null,
              updateAt: null,
              archived: false,
              title: 'Contato SMS',
              body: 'Ola, {{receiver_first_name}}, temos uma proposta de acordo da {{respondent.name}}. Mais detalhes envie um whatsapp para 12996810653. Pfv nao responda essa msg',
              contentType: 'TEXT',
              protocolId: null,
            },
            communicationType: 'SMS',
            durationtToString: null,
          },

          // interval mock
          {
            id: null,
            createAt: null,
            updateAt: null,
            archived: false,
            name: 'Espera 3hs',
            recipients: [],
            parties: [],
            duration: 10800.000000000,
            orderExecution: 2,
            template: null,
            communicationType: 'DELAY',
            durationtToString: 'PT3H',
          },
        ],
      },
      {
        id: 2,
        name: 'Private Mock Strategy',
        isActive: true,
        isPrivate: true,
        workspaces: [
          { id: 1, name: 'Mock Workspace' },
          { id: 2, name: 'Test 1' },
          { id: 3, name: 'Test 2' },
        ],
        communications: [
          // Message mock
          {
            id: null,
            createAt: null,
            updateAt: null,
            archived: false,
            name: '1º contato SMS',
            recipients: [
              'PARTY',
              'LAWYER',
            ],
            parties: [
              'CLAIMANT',
            ],
            duration: null,
            orderExecution: 3,
            template: {
              id: null,
              createAt: null,
              updateAt: null,
              archived: false,
              title: 'Contato SMS',
              body: 'Ola, {{receiver_first_name}}, temos uma proposta de acordo da {{respondent.name}}. Mais detalhes envie um whatsapp para 12996810653. Pfv nao responda essa msg',
              contentType: 'TEXT',
              protocolId: null,
            },
            communicationType: 'SMS',
            durationtToString: null,
          },

          // interval mock
          {
            id: null,
            createAt: null,
            updateAt: null,
            archived: false,
            name: 'Espera 3hs',
            recipients: [],
            parties: [],
            duration: 10800.000000000,
            orderExecution: 2,
            template: null,
            communicationType: 'DELAY',
            durationtToString: 'PT3H',
          },
        ],
      },
    ],
  },
  actions,
  getters,
  mutations,
}

export default StrategyModule
