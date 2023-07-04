export default {
  getIntegrationConfigs: state => state.configs,
  getIntegrationConfigsList: state => Object.entries(state.configs).map(([key, value]) => ({ key, value }))
}
