(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[2597],{12597:function(o,e,t){"use strict";t.r(e),t.d(e,{default:function(){return u}});var r=function(){var o=this,e=o._self._c;return e("el-dialog",{attrs:{title:"Enviar mensagem para",visible:o.visible,width:"50%","append-to-body":""},on:{"update:visible":function(e){o.visible=e}}},[e("div",{directives:[{name:"loading",rawName:"v-loading",value:o.isLoading,expression:"isLoading"}],staticClass:"dialog-reply-negotiator__alert-container"},[o.dispute.getDisputeHasFirstClaimant?e("span",{staticClass:"alert-container__first-claimant"},[e("i",{staticClass:"icon el-icon-info"}),o._v(" "+o._s(o.$tc("ARTICLE",!o.isRecovery).toUpperCase())+" "+o._s(o.$tc("PARTY_RESPONDENT",o.isRecovery))+" "),e("span",{staticClass:"alert-container__name"},[o._v(o._s(o.dispute.getDisputeFirstClaimantName))]),o._v(" está "),e("span",{staticClass:"alert-container__status"},[o._v(o._s(o.dispute.getDisputeFirstClaimantStatus))]),o._v(" no momento. ")]):o._e(),o.dispute.getDisputeHasFirstClaimantLawyer?e("span",{staticClass:"alert-container__first-claimant-lawyer"},[e("i",{staticClass:"icon el-icon-info"}),o._v(" O advogado "),e("span",{staticClass:"alert-container__name"},[o._v(o._s(o.dispute.getDisputeFirstClaimantLawyerName))]),o._v(" está "),e("span",{staticClass:"alert-container__status"},[o._v(o._s(o.dispute.getDisputeFirstClaimantLawyerStatus))]),o._v(" no momento. ")]):o._e(),e("span",{staticClass:"alert-container__message"},[o._v(" Envie uma mensagem pelo chat de comunicação da ProJuris. ")]),e("div",{staticClass:"dialog-reply-negotiator__container"},[e("el-input",{staticStyle:{"padding-bottom":"10px"},attrs:{type:"textarea",rows:"4",placeholder:`Escreva alguma coisa para ${o.isRecovery?"a":"o"} ${o.$tc("PARTY_RESPONDENT",o.isRecovery)}`},model:{value:o.messageDialogReplyEditor,callback:function(e){o.messageDialogReplyEditor=e},expression:"messageDialogReplyEditor"}}),e("div",{staticClass:"dialog-reply-negotiator__footer"},[e("el-button",{attrs:{size:"mini"},on:{click:function(e){o.visible=!1}}},[o._v(" Cancelar ")]),e("el-button",{attrs:{type:"primary",size:"mini",icon:"el-icon-s-promotion"},on:{click:function(e){return o.sendMessage()}}},[o._v(" Enviar ")])],1)],1)])])},a=[],i=t(90408),l={computed:{...(0,i.Se)({isLoading:"loading"})},methods:{...(0,i.nv)(["showLoading","hideLoading","getLastInteractions","sendNegotiator"]),async sendMessage(){const o=this.dispute.getDisputeId,e=this.dispute.getDisputeLastReceivedMessage;let t="";e?.message?.sender?t=e?.message?.sender||"":await this.getLastInteractions(o).then((o=>{t=o.length&&o[0].address||""}));const r={message:this.messageDialogReplyEditor,roleId:null,email:t};this.showLoading(),this.$store.dispatch("sendNegotiator",{disputeId:o,data:r}).then((()=>{this.messageDialogReplyEditor="",this.$jusNotification({title:"Yay!",message:"Mensagem enviada com sucesso!",type:"success"})})).catch((o=>{this.$jusNotification({error:o})})).finally((()=>{this.hideLoading(),this.handleVisibilityEditor(!1)}))}}},n={mixins:[l],props:{value:{type:Boolean,required:!0},dispute:{type:Object,required:!0}},data(){return{messageDialogReplyEditor:""}},computed:{...(0,i.Se)({isRecovery:"isWorkspaceRecovery"}),visible:{get(){return this.value},set(){this.$emit("close")}}}},c=n,s=(t(35410),t(1001)),d=(0,s.Z)(c,r,a,!1,null,null,null),u=d.exports},73596:function(o,e,t){"use strict";t.r(e);var r=t(87537),a=t.n(r),i=t(23645),l=t.n(i),n=l()(a());n.push([o.id,".dialog-reply-negotiator__alert-container{display:flex;flex-direction:column;margin-bottom:8px}.dialog-reply-negotiator__alert-container .alert-container__first-claimant .icon,.dialog-reply-negotiator__alert-container .alert-container__first-claimant-lawyer .icon{color:#018ef0}.dialog-reply-negotiator__alert-container .alert-container__first-claimant .alert-container__name,.dialog-reply-negotiator__alert-container .alert-container__first-claimant-lawyer .alert-container__name{text-transform:capitalize;font-weight:700}.dialog-reply-negotiator__alert-container .alert-container__first-claimant .alert-container__status,.dialog-reply-negotiator__alert-container .alert-container__first-claimant-lawyer .alert-container__status{text-decoration:underline}.dialog-reply-negotiator__alert-container .alert-container__message{padding:8px 0;color:#0756e4;font-weight:500}.dialog-reply-negotiator__container{padding-bottom:16px}.dialog-reply-negotiator__container .dialog-reply-negotiator__footer{float:right}","",{version:3,sources:["webpack://./src/views/main/management/partials/partials/NegotiatorActiveReply.vue","webpack://./node_modules/projuris-acordos-theme/src/common/colors.scss"],names:[],mappings:"AAGA,0CACE,YAAA,CACA,qBAAA,CACA,iBAAA,CAGE,yKACE,aCGkB,CAAA,2MDClB,yBAAA,CACA,eAAA,CAGF,+MACE,yBAAA,CAIJ,oEACE,aAAA,CACA,aCbc,CDcd,eAAA,CAGJ,oCACE,mBAAA,CAEA,qEACE,WAAA",sourcesContent:["\n@import '~projuris-acordos-theme/src/common/colors.scss';\n\n.dialog-reply-negotiator__alert-container {\n  display: flex;\n  flex-direction: column;\n  margin-bottom: 8px;\n\n  .alert-container__first-claimant, .alert-container__first-claimant-lawyer {\n    .icon {\n      color: $--color-secondary;\n    }\n\n    .alert-container__name {\n      text-transform: capitalize;\n      font-weight: bold;\n    }\n\n    .alert-container__status {\n      text-decoration: underline;\n    }\n  }\n\n  .alert-container__message {\n    padding: 8px 0px;\n    color: $--color-primary;\n    font-weight: 500;\n  }\n}\n.dialog-reply-negotiator__container {\n  padding-bottom: 16px;\n\n  .dialog-reply-negotiator__footer {\n    float: right;\n  }\n}\n","/* Colors\n-------------------------- */\n\n$--color-white: #fff !default;\n$--color-black: #424242 !default;\n$--color-gray: #979797 !default;\n$--color-gray-light-1: mix($--color-white, $--color-gray, 10%) !default;\n$--color-light-gray: #f3f4f5 !default;\n$--color-whatsapp: #075E54 !default;\n\n$--pj-color-darker-blue: #0A0022 !default;\n$--pj-color-dark-blue: #280BA0 !default;\n$--pj-color-blue: #0756e4 !default;\n$--pj-color-light-blue: #018EF0 !default;\n$--pj-color-lighter-blue: #30A9FB !default;\n$--pj-color-white-blue: #F0F9FE !default;\n$--pj-color-disabled-blue: #9ad2f9 !default;\n\n$-pg-color-overlay: #19415F !default;\n\n$--pj-color-red: #CC4148 !default;\n$--pj-color-light-red: #EC767C !default;\n$--pj-color-disable-red: #FFF2F3 !default;\n\n$--color-primary: $--pj-color-blue !default;\n$--color-primary-light-1: mix($--color-white, $--color-primary, 10%) !default;\n$--color-primary-light-2: mix($--color-white, $--color-primary, 20%) !default;\n$--color-primary-light-3: mix($--color-white, $--color-primary, 30%) !default;\n$--color-primary-light-4: mix($--color-white, $--color-primary, 40%) !default;\n$--color-primary-light-5: mix($--color-white, $--color-primary, 50%) !default;\n$--color-primary-light-6: mix($--color-white, $--color-primary, 60%) !default;\n$--color-primary-light-7: mix($--color-white, $--color-primary, 70%) !default;\n$--color-primary-light-8: mix($--color-white, $--color-primary, 80%) !default;\n$--color-primary-light-9: mix($--color-white, $--color-primary, 90%) !default;\n\n$--color-secondary: $--pj-color-light-blue !default;\n$--color-secondary-light-1: mix($--color-white, $--color-secondary, 10%) !default;\n$--color-secondary-light-2: mix($--color-white, $--color-secondary, 20%) !default;\n$--color-secondary-light-3: mix($--color-white, $--color-secondary, 30%) !default;\n$--color-secondary-light-4: mix($--color-white, $--color-secondary, 40%) !default;\n$--color-secondary-light-5: mix($--color-white, $--color-secondary, 50%) !default;\n$--color-secondary-light-6: mix($--color-white, $--color-secondary, 60%) !default;\n$--color-secondary-light-7: mix($--color-white, $--color-secondary, 70%) !default;\n$--color-secondary-light-8: mix($--color-white, $--color-secondary, 80%) !default;\n$--color-secondary-light-9: mix($--color-white, $--color-secondary, 90%) !default;\n\n$--color-primary-dark: $--pj-color-dark-blue !default;\n$--color-success: #14CC30 !default;\n$--color-warning: #FFC900 !default;\n$--color-danger: #FF4B54 !default;\n$--color-info: #2FBBEC !default;\n\n$--color-success-light-1: mix($--color-white, $--color-success, 10%) !default;\n$--color-success-light-5: mix($--color-white, $--color-success, 50%) !default;\n$--color-warning-light-5: mix($--color-white, $--color-warning, 50%) !default;\n$--color-danger-light-5: mix($--color-white, $--color-danger, 50%) !default;\n$--color-danger-light-3: mix($--color-white, $--color-danger, 30%) !default;\n$--color-info-light-5: mix($--color-white, $--color-info, 50%) !default;\n\n$--color-success-light: mix($--color-white, $--color-success, 80%) !default;\n$--color-warning-light: mix($--color-white, $--color-warning, 80%) !default;\n$--color-danger-light: mix($--color-white, $--color-danger, 80%) !default;\n$--color-info-light: mix($--color-white, $--color-info, 80%) !default;\n\n$--color-success-lighter: mix($--color-white, $--color-success, 90%) !default;\n$--color-warning-lighter: mix($--color-white, $--color-warning, 90%) !default;\n$--color-danger-lighter: mix($--color-white, $--color-danger, 90%) !default;\n$--color-info-lighter: mix($--color-white, $--color-info, 90%) !default;\n\n$--color-text-primary: $--color-black !default;\n$--color-text-secondary: $--color-gray !default;\n\n$--color-nps-promoter: #14CC30 !default;\n$--color-nps-neutral: #979797 !default;\n$--color-nps-detractor: #FF4B54 !default;\n\n$--color-negotiator-bg: #9461f74f !default;\n$--color-email-bg: $--color-info-light !default;\n$--color-whatsapp-bg: $--color-success-light-5 !default;"],sourceRoot:""}]),e["default"]=n},35410:function(o,e,t){var r=t(73596);r.__esModule&&(r=r.default),"string"===typeof r&&(r=[[o.id,r,""]]),r.locals&&(o.exports=r.locals);var a=t(39185).Z;a("af871aa6",r,!0,{sourceMap:!0,shadowMode:!1})}}]);
//# sourceMappingURL=2597.js.map