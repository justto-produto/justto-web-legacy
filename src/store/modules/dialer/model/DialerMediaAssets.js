// eslint-disable-next-line no-unused-vars

/**
 * DialerMediaAssets is a model container to storage all assets to feature
 * @class
 * @constructor
 * @public
 */
export default class DialerMediaAssets {
  _autoAnswerRingSound = 'https://portalnew.inov8.cloud/assets/audio/auto_answer_ring.wav'
  _busySound = 'https://portalnew.inov8.cloud/assets/audio/busy_tone.mp3'
  _ringtoneSound = 'https://portalnew.inov8.cloud/assets/audio/ringtone.wav'

  get autoAnswerRingSound() {
    return this._autoAnswerRingSound
  }

  get busySound() {
    return this._busySound
  }

  get ringtoneSound() {
    return this._ringtoneSound
  }
}
