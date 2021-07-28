<script>
export default {
  methods: {
    open() {
      return this.$confirm('Data limite para negociação excedida.<br>Deseja continuar?', 'Disputa expirada', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        type: 'warning',
        center: true
      })
    }
  }
}
</script>
