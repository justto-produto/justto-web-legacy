export default {
  // TODO: Mandar esse mixin para os mixins globais.

  methods: {
    handleKeys(event) {
      const { code, key, keyCode, isTrusted } = event

      if (isTrusted && (keyCode === 27 || key === 'Escape' || code === 'Escape')) {
        this.handleEsc(event)
      } else if (isTrusted && (keyCode === 13 || key === 'Enter' || code === 'Enter')) {
        this.handleEnter(event)
      } else if (!isTrusted) {
        console.error('Evento duvidoso detectado!')
        console.table(event)
      }
    }
  }
}
