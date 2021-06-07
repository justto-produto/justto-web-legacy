const scapeHtml = (text) => {
  return text.replace(/(<([^>]+)>)/gi, '')
}

export default scapeHtml
