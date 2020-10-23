import { normalizeString } from '@/utils/jusUtils'

const filterByTerm = (term, array, key1, key2) => {
  term = normalizeString(term)
  return array ? array.filter(i => normalizeString(i[key1]).includes(term) || normalizeString(i[key2]).includes(term)) : []
}

export default filterByTerm
