const dialerGetters = {
  isDialerLoggedIn: state => state?.currentDialerUser?.token,
  getCurrentDialerUser: state => state?.currentDialerUser,
  getCurrentCallId: state => state?.call?.id,
  getCurrentCallStatus: state => state?.call?.status,
  isBuyDialogVisible: state => state?.buyDialogVisible
}

export default dialerGetters
