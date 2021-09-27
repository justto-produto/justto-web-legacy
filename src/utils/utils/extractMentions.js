export default (html) => {
  const tempEl = document.createElement('span')
  const mentions = []

  tempEl.innerHTML = html

  const mentionsList = tempEl.getElementsByClassName('justto-mention') || []

  mentionsList.forEach(el => {
    mentions.push({ accountId: Number(el.getAttribute('account-id')) })
  })

  return mentions
}
