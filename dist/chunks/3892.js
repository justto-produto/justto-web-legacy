(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[3892],{43892:function(e,t,o){"use strict";o.r(t),o.d(t,{default:function(){return d}});var r=function(){var e=this,t=e._self._c;return t("section",{staticClass:"scheduler-container"},[e.toPrint?t("div",{staticClass:"date-to-print"},[e._v(" "+e._s(e._f("moment")(e.sendDate,"[Em] DD/MM [-] HH:mm"))+" ")]):e._e(),e.hideInfo?e._e():t("span",{staticClass:"scheduler-container__contact"},[t("JusIcon",{staticClass:"scheduler-container__contact-icon",attrs:{icon:e.messageType}}),e.to?t("span",[e._v(" para ")]):e._e(),!e.isSimilarName&&e.person?t("span",{staticClass:"communication-container__email-person"},[e._v(" "+e._s(e.person)+" ")]):e._e(),e.to?t("span",{staticClass:"scheduler-container__contact-address",on:{click:e.copyEmail}},[t("span",[e._v(" < ")]),e._v(" "+e._s(e.to)+" "),t("span",[e._v(" > ")])]):e._e()],1),e.hideContent?e._e():t("div",{staticClass:"scheduler-container__message"},[e.canShowFullMessage||e.isSmallText?e._e():t("span",{staticClass:"scheduler-container__message-link",on:{click:function(t){return e.deleteFullMessage(e.interaction.message.messageId)}}},[e._v(" Ver menos ")]),t("span",{domProps:{innerHTML:e._s(e.message)}}),e.canShowFullMessage?t("span",{staticClass:"scheduler-container__message-link",on:{click:function(t){return e.getFullMessage(e.interaction.message.messageId)}}},[e._v(" Ver mais ")]):e._e()]),e.isCanceled?t("p",{staticClass:"scheduler-container__alert"},[t("i",{staticClass:"el-icon-close"}),e._v(" Mensagem automática agendada foi "),t("strong",[e._v("CANCELADA")]),e._v(". ")]):e.isWaiting?t("p",{staticClass:"scheduler-container__alert"},[t("jus-icon",{attrs:{icon:"clock"}}),e._v(" Mensagem "),t("strong",[e._v("AGENDADA")]),e._v(" para "+e._s(e._f("moment")(e.scheduledTime,"DD/MM[ às ]HH:mm"))+" que ainda não foi entregue. ")],1):e.isFailed?t("p",{staticClass:"scheduler-container__alert"},[t("i",{staticClass:"el-icon-close"}),e._v(" Mensagem automática em "),t("strong",[e._v("FALHA")]),e._v(". ")]):t("p",{staticClass:"scheduler-container__alert"},[t("i",{staticClass:"el-icon-circle-check"}),e._v(" Mensagem automática foi "),t("strong",[e._v("ENVIADA")]),e._v(" em "+e._s(e._f("moment")(e.scheduledTime,"LLL"))+". ")])])},n=[],c=o(90408),a=o(4593),s={mixins:[a.Z],props:{value:{type:Object,required:!0},hideContent:{type:Boolean,default:!1},occurrence:{type:Object,required:!0},hideInfo:{type:Boolean,default:!1},hiddenSendStatus:{type:Boolean,default:!1},hideGrouping:{type:Boolean,default:!1}},computed:{...(0,c.Se)({fullMessages:"getFullMessages"}),interaction(){return this.value},to(){return this.interaction.message.receiver||!1},messageType(){const e={EMAIL:"email",WHATSAPP:"whatsapp",NEGOTIATOR_MESSAGE:"negotiator-message-2",PHONE_CALL:"tts"};if(this.value?.message?.communicationType){const{communicationType:t}=this.value.message;if(Object.keys(e).includes(t))return e[t]}return"email"},text(){return this.interaction?.message?.resume||this.interaction?.message?.parameters?.SUBJECT||this.occurrence?.description||""},message(){const{messageId:e}=this.interaction.message;return this.fullMessages[e]||this.text},status(){return this.interaction?.message?.status},isSmallText(){return this.text.length<100},canShowFullMessage(){const{messageId:e}=this.interaction.message;return!this.isSmallText&&!Object.keys(this.fullMessages).includes(String(e))},hasError(){return this.interaction?.message?.parameters?.FAILED_SEND},isCanceled(){const e="PHONE_CALL"===this.value?.type&&this.$moment().diff(this.$moment(this.value?.message?.scheduledTime?.dateTime),"days")>0;return"CANCELED"===this.occurrence?.interaction?.message?.status||e},isFailed(){return"FAILED"===this.occurrence?.interaction?.message?.status},isWaiting(){return"WAITING"===this.occurrence?.interaction?.message?.status},scheduledTime(){return this.occurrence?.interaction?.message?.scheduledTime?.dateTime}},updated(){this.$set(this.occurrence,"renderCompleted",!0)},mounted(){this.$set(this.occurrence,"renderCompleted",!0)},methods:{...(0,c.nv)(["deleteFullMessage","getFullMessage"]),copyEmail(e){this.to&&(navigator.clipboard.writeText(this.to),this.$message({message:"E-mail copiado para a área de transferência.",type:"info",center:!0,showClose:!0}))}}},i=s,l=(o(86467),o(1001)),u=(0,l.Z)(i,r,n,!1,null,"2bf6e96b",null),d=u.exports},4593:function(e,t,o){"use strict";var r=o(40917),n=o(90408);t.Z={computed:{...(0,n.Se)({toPrint:"getExportTicketModalVisible"}),person(){const e=this.directionIn?"SENDER_NAME":"RECEIVER_NAME";if(this.interaction?.message?.parameters[e]){const t=this.interaction?.message?.parameters[e];return this.$options.filters.resumedName(t||"")}return this?.interaction?.properties?.PERSON_NAME?this.$options.filters.resumedName(this?.interaction?.properties?.PERSON_NAME):""},isSimilarName(){return(0,r.z_)(this.person,this.contact,75)},directionIn(){return"INBOUND"===this.interaction?.direction},sendDate(){return this.occurrence.updateAt?.dateTime||this.occurrence.createAt?.dateTime},sendStatus(){const e=this.interaction?.message?.parameters||{},t=Object.keys(e);return t.includes("READ_DATE")?"readed":t.includes("RECEIVER_DATE")?"recived":(t.includes("SEND_DATE"),"sent")},sendStatusDate(){const e=this.interaction?.message?.parameters||{},t=Object.keys(e);return t.includes("READ_DATE")?e?.READ_DATE?.includes("[UTC]")?this.$moment(e?.READ_DATE.slice(e?.READ_DATE.indexOf("[UTC]"))):(0,r.be)(e.READ_DATE):t.includes("RECEIVER_DATE")?e?.RECEIVER_DATE?.includes("[UTC]")?this.$moment(e?.RECEIVER_DATE.slice(e?.RECEIVER_DATE.indexOf("[UTC]"))):(0,r.be)(e.RECEIVER_DATE):t.includes("SEND_DATE")?e?.SEND_DATE?.includes("[UTC]")?this.$moment(e?.SEND_DATE.slice(e?.SEND_DATE.indexOf("[UTC]"))):(0,r.be)(e.SEND_DATE):this.interaction?.createAt?.dateTime},properties(){return this.occurrence?.properties},groupedOccurrences(){try{return this.occurrence?.properties?.GROUPED_OCCURRENCES?.length>2?JSON.parse(this.occurrence?.properties?.GROUPED_OCCURRENCES.replace(/'/g,'"')):[]}catch(e){return[]}},haveGroupedOccurrences(){return this.groupedOccurrences.length>0}}}},67213:function(e,t,o){"use strict";o.r(t);var r=o(87537),n=o.n(r),c=o(23645),a=o.n(c),s=a()(n());s.push([e.id,".scheduler-container[data-v-2bf6e96b]{margin:12px}.scheduler-container .scheduler-container__message[data-v-2bf6e96b]{font-size:16px;color:#3c3b3b}@media(max-height:900px){.scheduler-container .scheduler-container__message[data-v-2bf6e96b]{font-size:14px}}.scheduler-container .scheduler-container__message .scheduler-container__message-link[data-v-2bf6e96b]{cursor:pointer;font-size:12px;text-decoration:underline;color:#0756e4;display:inline-block;margin-left:6px}.scheduler-container .scheduler-container__status[data-v-2bf6e96b]{font-style:italic}.scheduler-container .scheduler-container__status .scheduler-container__status-about[data-v-2bf6e96b]{font-style:normal;margin-top:-24px;display:flex;justify-content:flex-end;align-items:center;gap:6px;font-size:12px;color:#9a9797}.scheduler-container .scheduler-container__status .scheduler-container__status-about .scheduler-container__status-about-icon[data-v-2bf6e96b]{width:18px}.scheduler-container .scheduler-container__contact[data-v-2bf6e96b]{color:#018ef0;font-weight:600;display:flex;align-items:center;margin-bottom:6px;gap:6px}.scheduler-container .scheduler-container__contact .scheduler-container__contact-icon[data-v-2bf6e96b]{width:16px}.scheduler-container .scheduler-container__contact .scheduler-container__contact-address[data-v-2bf6e96b]{cursor:copy;display:flex}.scheduler-container .scheduler-container__alert[data-v-2bf6e96b]{font-style:italic}.scheduler-container .scheduler-container__alert i[data-v-2bf6e96b],.scheduler-container .scheduler-container__alert img[data-v-2bf6e96b]{width:14px;margin-bottom:-1.2px}","",{version:3,sources:["webpack://./src/views/main/negotiation/partials/ticket/omnichannel/occurrences/occurrence/interaction/partials/Scheduler.vue","webpack://./node_modules/projuris-acordos-theme/src/common/colors.scss"],names:[],mappings:"AAGA,sCACE,WAAA,CAEA,oEACE,cAAA,CACA,aAAA,CAEA,yBAJF,oEAKI,cAAA,CAAA,CAGF,uGACE,cAAA,CACA,cAAA,CACA,yBAAA,CACA,aCNY,CDOZ,oBAAA,CACA,eAAA,CAIJ,mEACE,iBAAA,CAEA,sGACE,iBAAA,CACA,gBAAA,CAEA,YAAA,CACA,wBAAA,CACA,kBAAA,CACA,OAAA,CAEA,cAAA,CACA,aAAA,CAEA,8IACE,UAAA,CAKN,oEACE,aCjCoB,CDkCpB,eAAA,CACA,YAAA,CACA,kBAAA,CACA,iBAAA,CACA,OAAA,CAEA,uGACE,UAAA,CAGF,0GACE,WAAA,CACA,YAAA,CAIJ,kEACE,iBAAA,CAEA,0IACE,UAAA,CACA,oBAAA",sourcesContent:["\n@import '~projuris-acordos-theme/src/common/colors.scss';\n\n.scheduler-container {\n  margin: 12px;\n\n  .scheduler-container__message {\n    font-size: 16px;\n    color: #3C3B3B;\n\n    @media (max-height: 900px) {\n      font-size: 14px;\n    }\n\n    .scheduler-container__message-link {\n      cursor: pointer;\n      font-size: 12px;\n      text-decoration: underline;\n      color: $--color-primary;\n      display: inline-block;\n      margin-left: 6px;\n    }\n  }\n\n  .scheduler-container__status {\n    font-style: italic;\n\n    .scheduler-container__status-about {\n      font-style: normal;\n      margin-top: -24px;\n\n      display: flex;\n      justify-content: flex-end;\n      align-items: center;\n      gap: 6px;\n\n      font-size: 12px;\n      color: #9A9797;\n\n      .scheduler-container__status-about-icon {\n        width: 18px;\n      }\n    }\n  }\n\n  .scheduler-container__contact {\n    color: $--color-secondary;\n    font-weight: 600;\n    display: flex;\n    align-items: center;\n    margin-bottom: 6px;\n    gap: 6px;\n\n    .scheduler-container__contact-icon {\n      width: 16px;\n    }\n\n    .scheduler-container__contact-address {\n      cursor: copy;\n      display: flex;\n    }\n  }\n\n  .scheduler-container__alert {\n    font-style: italic;\n\n    i, img {\n      width: 14px;\n      margin-bottom: -1.2px;\n    }\n  }\n}\n","/* Colors\n-------------------------- */\n\n$--color-white: #fff !default;\n$--color-black: #424242 !default;\n$--color-gray: #979797 !default;\n$--color-gray-light-1: mix($--color-white, $--color-gray, 10%) !default;\n$--color-light-gray: #f3f4f5 !default;\n$--color-whatsapp: #075E54 !default;\n\n$--pj-color-darker-blue: #0A0022 !default;\n$--pj-color-dark-blue: #280BA0 !default;\n$--pj-color-blue: #0756e4 !default;\n$--pj-color-light-blue: #018EF0 !default;\n$--pj-color-lighter-blue: #30A9FB !default;\n$--pj-color-white-blue: #F0F9FE !default;\n$--pj-color-disabled-blue: #9ad2f9 !default;\n\n$-pg-color-overlay: #19415F !default;\n\n$--pj-color-red: #CC4148 !default;\n$--pj-color-light-red: #EC767C !default;\n$--pj-color-disable-red: #FFF2F3 !default;\n\n$--color-primary: $--pj-color-blue !default;\n$--color-primary-light-1: mix($--color-white, $--color-primary, 10%) !default;\n$--color-primary-light-2: mix($--color-white, $--color-primary, 20%) !default;\n$--color-primary-light-3: mix($--color-white, $--color-primary, 30%) !default;\n$--color-primary-light-4: mix($--color-white, $--color-primary, 40%) !default;\n$--color-primary-light-5: mix($--color-white, $--color-primary, 50%) !default;\n$--color-primary-light-6: mix($--color-white, $--color-primary, 60%) !default;\n$--color-primary-light-7: mix($--color-white, $--color-primary, 70%) !default;\n$--color-primary-light-8: mix($--color-white, $--color-primary, 80%) !default;\n$--color-primary-light-9: mix($--color-white, $--color-primary, 90%) !default;\n\n$--color-secondary: $--pj-color-light-blue !default;\n$--color-secondary-light-1: mix($--color-white, $--color-secondary, 10%) !default;\n$--color-secondary-light-2: mix($--color-white, $--color-secondary, 20%) !default;\n$--color-secondary-light-3: mix($--color-white, $--color-secondary, 30%) !default;\n$--color-secondary-light-4: mix($--color-white, $--color-secondary, 40%) !default;\n$--color-secondary-light-5: mix($--color-white, $--color-secondary, 50%) !default;\n$--color-secondary-light-6: mix($--color-white, $--color-secondary, 60%) !default;\n$--color-secondary-light-7: mix($--color-white, $--color-secondary, 70%) !default;\n$--color-secondary-light-8: mix($--color-white, $--color-secondary, 80%) !default;\n$--color-secondary-light-9: mix($--color-white, $--color-secondary, 90%) !default;\n\n$--color-primary-dark: $--pj-color-dark-blue !default;\n$--color-success: #14CC30 !default;\n$--color-warning: #FFC900 !default;\n$--color-danger: #FF4B54 !default;\n$--color-info: #2FBBEC !default;\n\n$--color-success-light-1: mix($--color-white, $--color-success, 10%) !default;\n$--color-success-light-5: mix($--color-white, $--color-success, 50%) !default;\n$--color-warning-light-5: mix($--color-white, $--color-warning, 50%) !default;\n$--color-danger-light-5: mix($--color-white, $--color-danger, 50%) !default;\n$--color-danger-light-3: mix($--color-white, $--color-danger, 30%) !default;\n$--color-info-light-5: mix($--color-white, $--color-info, 50%) !default;\n\n$--color-success-light: mix($--color-white, $--color-success, 80%) !default;\n$--color-warning-light: mix($--color-white, $--color-warning, 80%) !default;\n$--color-danger-light: mix($--color-white, $--color-danger, 80%) !default;\n$--color-info-light: mix($--color-white, $--color-info, 80%) !default;\n\n$--color-success-lighter: mix($--color-white, $--color-success, 90%) !default;\n$--color-warning-lighter: mix($--color-white, $--color-warning, 90%) !default;\n$--color-danger-lighter: mix($--color-white, $--color-danger, 90%) !default;\n$--color-info-lighter: mix($--color-white, $--color-info, 90%) !default;\n\n$--color-text-primary: $--color-black !default;\n$--color-text-secondary: $--color-gray !default;\n\n$--color-nps-promoter: #14CC30 !default;\n$--color-nps-neutral: #979797 !default;\n$--color-nps-detractor: #FF4B54 !default;\n\n$--color-negotiator-bg: #9461f74f !default;\n$--color-email-bg: $--color-info-light !default;\n$--color-whatsapp-bg: $--color-success-light-5 !default;"],sourceRoot:""}]),t["default"]=s},86467:function(e,t,o){var r=o(67213);r.__esModule&&(r=r.default),"string"===typeof r&&(r=[[e.id,r,""]]),r.locals&&(e.exports=r.locals);var n=o(39185).Z;n("1e4b4f6b",r,!0,{sourceMap:!0,shadowMode:!1})}}]);
//# sourceMappingURL=3892.js.map