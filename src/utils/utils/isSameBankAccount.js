import { PIX } from '@/constants/bankAccountTypes'

const isSameBankAccount = (bAccount, account) => {
  const pixRule = (
    bAccount.type === account.type && (
      bAccount.document === account.document ||
      bAccount.email === account.email ||
      bAccount.number === account.number
    )
  )

  const noPixRule = (
    bAccount.agency === account.agency &&
    bAccount.document === account.document &&
    bAccount.number === account.number &&
    bAccount.bank === account.bank &&
    bAccount.type === account.type
  )

  return account.type === PIX ? pixRule : noPixRule
}

export default isSameBankAccount
