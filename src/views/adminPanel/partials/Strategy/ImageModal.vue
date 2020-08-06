droparea.addEventListener('drop', (e) => {
  let files = e.dataTransfer.files

  if (files.length > 0) {
    const image = files[0]

    const activeEmailID = this.activeEmailId

    this.$store.dispatch('uploadInlineImage', {image, activeEmailID}).then(url => {
      this.url = url

      // Prepare data for sending to parent
      const data = {
        command: this.command,
        data: {
          src: this.url,
          alt: this.alt,
          title: this.title,
        }
      }

      this.$emit('onClose', data)
      this.resetData()
      this.$modal.hide(this.modalName)
    })
  }
})
