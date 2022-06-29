import { normalizeString } from '@/utils'

const isAutor = (values) => {
  return values.map(normalizeString).includes('ativo')
}

export default isAutor
