export default (html) => {
  const tempEl = document.createElement('span')
  const mentions = []

  tempEl.innerHTML = html

  tempEl.getElementsByClassName('justto-mention').forEach(el => {
    mentions.push({ accountId: Number(el.getAttribute('account-id')) })
  })

  return mentions
}
