(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[1270],{51270:function(e,l,a){"use strict";a.r(l),a.d(l,{default:function(){return p}});var t=function(){var e=this,l=e._self._c;return l("el-dialog",{attrs:{title:"Atenção - Em chamada","custom-class":"call-help-dialog",visible:e.visible,modal:!1,"close-on-click-modal":!1,"close-on-press-escape":!1,"modal-append-to-body":!1,"append-to-body":!0,"lock-scroll":!1,"destroy-on-close":"","show-close":!1,center:""},on:{"update:visible":function(l){e.visible=l}}},[e.visible?l("section",{directives:[{name:"loading",rawName:"v-loading",value:e.isLoading,expression:"isLoading"}],staticClass:"call-help__container"},[l("el-carousel",{ref:"carousel",staticClass:"call-help__carousel",attrs:{autoplay:!1,arrow:"never","indicator-position":"none"}},[l("el-carousel-item",{staticClass:"call-help__carousel-item"},[l("h3",{staticClass:"call-help__carousel-item-info"},[e._v(" Se identifique e confirme com quem está falando! ")]),l("div",{staticClass:"call-help__suggestion-balloon"},[l("div",{staticClass:"call-help__suggestion-balloon-label"},[l("span",[e._v(" Sugestão ")])]),l("ul",{staticClass:"call-help__suggestion-balloon-text"},[l("li",[e._v("Bom dia, meu nome é "+e._s(e.thamirisName)+".")]),l("li",[e._v("Estou falando com "+e._s(e.claimantName)+"?")]),l("li",[e._v("É sobre um caso envolvendo "+e._s(e.respondentName)+"!")])])]),e.showIncorrectContactForm?l("div",{staticClass:"call-help__carousel-item-incorrect-contact"},[l("el-select",{staticClass:"incorrect-contact__select",model:{value:e.invalidNumberReason,callback:function(l){e.invalidNumberReason=l},expression:"invalidNumberReason"}},[l("el-option",{attrs:{label:e.$tc("call.interaction.status.DIFFERENT_OWNER"),value:"DIFFERENT_OWNER"}}),l("el-option",{attrs:{label:e.$tc("call.interaction.status.NONEXISTENT"),value:"NONEXISTENT"}})],1),l("el-button",{attrs:{type:"primary",disabled:!e.invalidNumberReason},on:{click:function(l){return e.registerProblemWithNumber()}}},[e._v(" Registrar problema ")])],1):e._e(),l("div",{staticClass:"call-help__carousel-item-actions"},[l("el-button",{attrs:{type:"danger"},on:{click:e.handleIncorrectContact}},[e._v(" Contato incorreto ")]),l("el-tooltip",{attrs:{content:"Ao termino da contagem, o contato será confirmado automaticamente!"}},[l("el-button",{staticClass:"call-help__carousel-item-actions__correct_contact",attrs:{type:"primary"},on:{click:function(l){return e.next("contact")}}},[e._v(" Contato correto "),l("Countdown",{ref:"countdown",attrs:{end:e.autoValidateContactTime,stop:e.ending}})],1)],1)],1)]),l("el-carousel-item",{ref:"carouselItemCallHelp",staticClass:"call-help__carousel-item"},[l("h3",{staticClass:"call-help__carousel-item-info"},[e._v(" Informe "+e._s(e.claimantName)+" que a conversa está sendo gravada. ")]),l("div",{staticClass:"call-help__suggestion-balloon"},[l("div",{staticClass:"call-help__suggestion-balloon-label"},[l("span",[e._v("Sugestão")])]),l("ul",{staticClass:"call-help__suggestion-balloon-text"},[l("li",[e._v(e._s(e.claimantName)+", para fins de auditoria, nossa conversa está sendo gravada.")])])]),l("div",{staticClass:"call-help__carousel-item-actions"},[l("el-button",{attrs:{slot:"reference",type:"danger"},on:{click:function(l){return e.toggleDontRecCallForm()}},slot:"reference"},[e._v(" Não concordou ")]),l("el-button",{attrs:{type:"primary"},on:{click:function(l){return e.close()}}},[e._v(" Concordou ")])],1),e.showDontRecCallForm?l("div",{staticClass:"call-help__dont-rec-call"},[l("p",{staticClass:"dont-rec-call__help"},[e._v(" Qual outro canal de comunicação podemos conversar? ")]),l("el-radio-group",{on:{input:()=>{e.newContactModel=""}},model:{value:e.newContactType,callback:function(l){e.newContactType=l},expression:"newContactType"}},[l("el-radio",{attrs:{label:"email"}},[e._v(" E-mail ")]),l("el-radio",{attrs:{label:"whatsapp"}},[e._v(" WhatsApp ")])],1),l("div",{staticClass:"dont-rec-call__add-contact"},["whatsapp"===e.newContactType?l("div",{staticClass:"el-input el-input--mini"},[l("input",{directives:[{name:"model",rawName:"v-model",value:e.newContactModel,expression:"newContactModel"},{name:"mask",rawName:"v-mask",value:["(##) ####-####","(##) 9 ####-####"],expression:"['(##) ####-####', '(##) 9 ####-####']"}],staticClass:"el-input__inner dont-rec-call__add-contact-input",attrs:{type:"text",size:"small"},domProps:{value:e.newContactModel},on:{input:function(l){l.target.composing||(e.newContactModel=l.target.value)}}})]):l("el-input",{staticClass:"dont-rec-call__add-contact-input",attrs:{type:"email",size:"mini"},model:{value:e.newContactModel,callback:function(l){e.newContactModel=l},expression:"newContactModel"}}),l("el-button",{attrs:{type:"primary",size:"mini",disabled:!e.canSaveNewContact},on:{click:e.addNewContact}},[e._v(" Adicionar ")])],1),l("div",{staticClass:"dont-rec-call__label-contacts"},[e._v(" Contatos cadastratos: ")]),e._l(e.call.contacts||{},(function(a,t,o){return l("div",{key:`${t}-${o}`,staticClass:"dont-rec-call__contacts"},e._l(a,(function(a,o){return l("div",{key:`contact-${t}-${o}`,staticClass:"dont-rec-call__contacts-value"},[e._v(" "+e._s(e._f("phoneOrEmail")(a.address||a.number))+" ")])})),0)})),l("el-button",{attrs:{type:"danger",size:"small"},on:{click:function(l){return e.closeCall()}}},[e._v(" Encerrar chamada ")])],2):e._e()])],1)],1):e._e()])},o=[],n=a(90408),c=a(62383),i={components:{Countdown:()=>a.e(9737).then(a.bind(a,39737))},props:{ending:{type:Boolean,default:!1}},data:()=>({invalidNumberReason:"",isLoading:!1,visible:!1,newContactType:"email",newContactModel:"",showIncorrectContactForm:!1,showDontRecCallForm:!1,contactValidityBrand:!1,contactsAddedRecent:{emails:[],phones:[]},autoValidateContactTime:"",autocontactTimeout:null}),computed:{...(0,n.Se)({call:"getCurrentCall",thamirisName:"loggedPersonName",ticketParties:"getTicketOverviewParties",isRecoveryStrategy:"isWorkspaceRecovery"}),claimantName(){return this.call?.toRoleName||""},respondentName(){let e=`Nome ${this.isRecoveryStrategy?"da":"do"} ${this.$tc("PARTY_RESPONDENT",this.isRecoveryStrategy)} aqui`;return this.ticketParties.filter((({polarity:e})=>["RESPONDENT"].includes(e))).forEach(((l,a)=>{a||(e=l.name)})),e},canSaveNewContact(){const e=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return"whatsapp"===this.newContactType&&16===this.newContactModel.length||e.test(String(this.newContactModel).toLowerCase())}},watch:{call:{deep:!0,handler(e,l){clearTimeout(this.autocontactTimeout),this.visible=e?.status===c.CALL_STATUS.ACTIVE_CALL,this.visible&&(this.contactValidityBrand=!1,this.showIncorrectContactForm=!1,this.$emit("queue:hide"),this.autocontactTimeout=setTimeout((()=>{this.next("contact")}),12e4),this.autoValidateContactTime=this.$moment().add(2,"m").format(),setTimeout((()=>this.$nextTick().then((()=>{this.$refs.countdown&&this.$refs.countdown.reset()}))),500))}}},methods:{...(0,n.nv)(["setValidNumberInCall","updatePhoneCallStatus","setInvalidNumberInCall","setTicketOverviewPartyContact","setInteractionMessageContent"]),next(e){"contact"===e&&(this.setValidNumberInCall(this.call),this.contactValidityBrand=!0,clearTimeout(this.autocontactTimeout)),this.$refs.carousel.next()},handleIncorrectContact(){this.showIncorrectContactForm=!this.showIncorrectContactForm,this.contactValidityBrand=!0},handleCloseCall({interactionId:e,disputeId:l}){e&&l&&this.setValidNumberInCall({interactionId:e,disputeId:l})},close(){this.visible=!1},closeCall(){const{emails:e,phones:l}=this.contactsAddedRecent,a=e.length?`<br>Email(s): ${e.join(", ")}`:"",t=l.length?`<br>Telefone(s): ${l.join(", ")}`:"",o=e.length||l.length?"<br>Informou novos dados de contato para negociar:":"",n=`<p>${this.claimantName} atendeu, mas se recusou a prosseguir com ligação por estar sendo gravada.${o}${a}${t}</p>`;this.saveMassageContent(n)},saveMassageContent(e){this.isLoading=!0,this.setInteractionMessageContent({disputeId:this.call?.disputeId,content:e,communicationMessageId:this.call?.messageId}).then((()=>{this.$emit("call:end"),this.$refs.dontRecCallPopover.doClose()})).catch((e=>{this.$jusNotification({error:e})})).finally((()=>{this.isLoading=!1}))},addNewContact(){const e={roleId:this.call?.toRoleId,disputeId:this.call?.disputeId,contactType:"whatsapp"===this.newContactType?"phone":"email",contactData:{value:this.newContactModel}};this.isLoading=!0,this.setTicketOverviewPartyContact(e).then((({emails:e,phones:l})=>{const a="whatsapp"===this.newContactType?"phones":"emails";this.$set(this.call.contacts,a,"whatsapp"===this.newContactType?l:e),this.contactsAddedRecent[a]=[...this.contactsAddedRecent[a],this.newContactModel]})).catch((e=>{this.$jusNotification({error:e})})).finally((()=>{this.isLoading=!1,this.newContactModel=""}))},registerProblemWithNumber(){this.isLoading=!0,this.setInvalidNumberInCall({reason:this.invalidNumberReason}).then((()=>{this.$emit("call:end"),this.showIncorrectContactForm=!1})).catch((e=>{this.$jusNotification({error:e})})).finally((()=>{this.isLoading=!1,this.invalidNumberReason=""}))},toggleDontRecCallForm(){this.showDontRecCallForm=!this.showDontRecCallForm;const e=this.$refs?.carouselItemCallHelp?.$el;if(console.log(e),e)if(this.showDontRecCallForm){const l=e.scrollHeight+50;this.$nextTick().then((()=>{e.scrollTo(0,l)}))}else e.scrollTo(0,0)}}},s=i,r=(a(25088),a(1001)),d=(0,r.Z)(s,t,o,!1,null,null,null),p=d.exports},28063:function(e,l,a){"use strict";a.r(l);var t=a(87537),o=a.n(t),n=a(23645),c=a.n(n),i=c()(o());i.push([e.id,".el-dialog__wrapper:has(.call-help-dialog){margin:24vh auto!important;padding:0;z-index:2004;width:50vw}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog{margin:0!important;width:100%}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog .el-dialog__header{background:#9461f7;color:#fff}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog .el-dialog__header .el-dialog__title{color:#fff}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog .el-dialog__body{margin:0!important;padding:0!important}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog .el-dialog__body .call-help__container .call-help__call{display:flex;flex-direction:column;align-items:center;justify-content:center;margin:16px 0 8px;gap:8px}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog .el-dialog__body .call-help__container .call-help__carousel{padding:0}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog .el-dialog__body .call-help__container .call-help__carousel .el-carousel__container .el-carousel__item{display:flex;flex-direction:column;gap:16px}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog .el-dialog__body .call-help__container .call-help__carousel .el-carousel__container .el-carousel__item.call-help__carousel-item{overflow-y:scroll;padding:0 24px;width:100%}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog .el-dialog__body .call-help__container .call-help__carousel .el-carousel__container .el-carousel__item .call-help__carousel-item-info{padding:0;text-align:center;word-break:keep-all}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog .el-dialog__body .call-help__container .call-help__carousel .el-carousel__container .el-carousel__item .call-help__suggestion-balloon{border:none;box-shadow:0 3px 6px #00000029;border-radius:10px;padding:8px;word-break:break-word}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog .el-dialog__body .call-help__container .call-help__carousel .el-carousel__container .el-carousel__item .call-help__suggestion-balloon .call-help__suggestion-balloon-label{text-align:center;margin-top:-18px}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog .el-dialog__body .call-help__container .call-help__carousel .el-carousel__container .el-carousel__item .call-help__suggestion-balloon .call-help__suggestion-balloon-label span{padding:0 8px;background-color:#fff;font-weight:600}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog .el-dialog__body .call-help__container .call-help__carousel .el-carousel__container .el-carousel__item .call-help__dont-rec-call{margin:24px 0;display:flex;flex-direction:column;gap:8px;align-items:center;border:none;box-shadow:0 3px 6px #00000029;border-radius:10px;padding:8px}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog .el-dialog__body .call-help__container .call-help__carousel .el-carousel__container .el-carousel__item .call-help__dont-rec-call .dont-rec-call__help{margin-top:-16px;background:#fff;padding:0 8px;font-weight:600}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog .el-dialog__body .call-help__container .call-help__carousel .el-carousel__container .el-carousel__item .call-help__dont-rec-call .dont-rec-call__add-contact{display:flex;flex-direction:row;gap:4px}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog .el-dialog__body .call-help__container .call-help__carousel .el-carousel__container .el-carousel__item .call-help__carousel-item-incorrect-contact{display:flex;justify-content:space-between}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog .el-dialog__body .call-help__container .call-help__carousel .el-carousel__container .el-carousel__item .call-help__carousel-item-incorrect-contact .el-select{flex:3}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog .el-dialog__body .call-help__container .call-help__carousel .el-carousel__container .el-carousel__item .call-help__carousel-item-incorrect-contact .el-button{flex:1;height:40px}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog .el-dialog__body .call-help__container .call-help__carousel .el-carousel__container .el-carousel__item .call-help__carousel-item-actions{display:flex;flex-direction:row;justify-content:space-around}.el-dialog__wrapper:has(.call-help-dialog) .call-help-dialog .el-dialog__body .call-help__container .call-help__carousel .el-carousel__container .el-carousel__item .call-help__carousel-item-actions .call-help__carousel-item-actions__correct_contact span{display:flex;align-items:center;gap:8px}.dont-rec-call__popover,.incorrect-contact__popover{padding:16px!important;display:flex;flex-direction:column;gap:16px}.dont-rec-call__popover .el-popover__title,.incorrect-contact__popover .el-popover__title{margin:0;font-weight:600;text-align:center}.dont-rec-call__popover .dont-rec-call__label-contacts,.incorrect-contact__popover .dont-rec-call__label-contacts{font-weight:600;text-transform:capitalize;margin-bottom:-16px;font-size:14px}.dont-rec-call__popover .dont-rec-call__contacts,.incorrect-contact__popover .dont-rec-call__contacts{margin-bottom:-16px}.dont-rec-call__popover .dont-rec-call__contacts:last-of-type,.incorrect-contact__popover .dont-rec-call__contacts:last-of-type{margin-bottom:16px}.dont-rec-call__popover .dont-rec-call__add-contact,.incorrect-contact__popover .dont-rec-call__add-contact{display:flex;flex-direction:row;gap:8px}","",{version:3,sources:["webpack://./src/components/dialogs/CallHelpWizard.vue"],names:[],mappings:"AAGA,2CACE,0BAAA,CACA,SAAA,CACA,YAAA,CACA,UAAA,CAEA,6DACE,kBAAA,CACA,UAAA,CAEA,gFACE,kBAAA,CACA,UAAA,CAEA,kGACE,UAAA,CAIJ,8EACE,kBAAA,CACA,mBAAA,CAGE,qHACE,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,sBAAA,CACA,iBAAA,CACA,OAAA,CAGF,yHACE,SAAA,CAGE,oKACE,YAAA,CACA,qBAAA,CACA,QAAA,CAEA,6LACE,iBAAA,CACA,cAAA,CACA,UAAA,CAGF,mMACE,SAAA,CACA,iBAAA,CACA,mBAAA,CAGF,mMACE,WAAA,CACA,8BAAA,CACA,kBAAA,CACA,WAAA,CACA,qBAAA,CAEA,wOACE,iBAAA,CACA,gBAAA,CAEA,6OACE,aAAA,CACA,qBAAA,CACA,eAAA,CAKN,8LACE,aAAA,CACA,YAAA,CACA,qBAAA,CACA,OAAA,CACA,kBAAA,CAEA,WAAA,CACA,8BAAA,CACA,kBAAA,CACA,WAAA,CAEA,mNACE,gBAAA,CACA,eAAA,CACA,aAAA,CACA,eAAA,CAGF,0NACE,YAAA,CACA,kBAAA,CACA,OAAA,CASJ,gNACE,YAAA,CACA,6BAAA,CAEA,2NACE,MAAA,CAGF,2NACE,MAAA,CACA,WAAA,CAIJ,sMACE,YAAA,CACA,kBAAA,CACA,4BAAA,CAGE,8PACE,YAAA,CACA,kBAAA,CACA,OAAA,CAYpB,oDAEE,sBAAA,CACA,YAAA,CACA,qBAAA,CACA,QAAA,CAEA,0FACE,QAAA,CACA,eAAA,CACA,iBAAA,CAGF,kHACE,eAAA,CACA,yBAAA,CACA,mBAAA,CACA,cAAA,CAGF,sGACE,mBAAA,CAGF,gIACE,kBAAA,CAGF,4GACE,YAAA,CACA,kBAAA,CACA,OAAA",sourcesContent:["\n@import '~projuris-acordos-theme/src/common/colors.scss';\n\n.el-dialog__wrapper:has(.call-help-dialog) {\n  margin: 24vh auto !important;\n  padding: 0;\n  z-index: 2004;\n  width: 50vw;\n\n  .call-help-dialog {\n    margin: 0 !important;\n    width: 100%;\n\n    .el-dialog__header {\n      background: #9461f7;\n      color: white;\n\n      .el-dialog__title {\n        color: white;\n      }\n    }\n\n    .el-dialog__body {\n      margin: 0 !important;\n      padding: 0 !important;\n\n      .call-help__container {\n        .call-help__call {\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          justify-content: center;\n          margin: 16px 0 8px;\n          gap: 8px;\n        }\n\n        .call-help__carousel {\n          padding: 0;\n\n          .el-carousel__container {\n            .el-carousel__item {\n              display: flex;\n              flex-direction: column;\n              gap: 16px;\n\n              &.call-help__carousel-item {\n                overflow-y: scroll;\n                padding: 0 24px;\n                width: 100%;\n              }\n\n              .call-help__carousel-item-info {\n                padding: 0;\n                text-align: center;\n                word-break: keep-all;\n              }\n\n              .call-help__suggestion-balloon {\n                border: none;\n                box-shadow: 0px 3px 6px #00000029;\n                border-radius: 10px;\n                padding: 8px;\n                word-break: break-word;\n\n                .call-help__suggestion-balloon-label {\n                  text-align: center;\n                  margin-top: -18px;\n\n                  span {\n                    padding: 0 8px;\n                    background-color: white;\n                    font-weight: 600;\n                  }\n                }\n              }\n\n              .call-help__dont-rec-call {\n                margin: 24px 0;\n                display: flex;\n                flex-direction: column;\n                gap: 8px;\n                align-items: center;\n\n                border: none;\n                box-shadow: 0px 3px 6px #00000029;\n                border-radius: 10px;\n                padding: 8px;\n\n                .dont-rec-call__help {\n                  margin-top: -16px;\n                  background: white;\n                  padding: 0 8px;\n                  font-weight: 600;\n                }\n\n                .dont-rec-call__add-contact {\n                  display: flex;\n                  flex-direction: row;\n                  gap: 4px;\n                }\n\n                /*.dont-rec-call__contacts,\n                .dont-rec-call__label-contacts {\n                  align-self: flex-start;\n                }*/\n              }\n\n              .call-help__carousel-item-incorrect-contact {\n                display: flex;\n                justify-content: space-between;\n\n                .el-select {\n                  flex: 3;\n                }\n\n                .el-button {\n                  flex: 1;\n                  height: 40px;\n                }\n              }\n\n              .call-help__carousel-item-actions {\n                display: flex;\n                flex-direction: row;\n                justify-content: space-around;\n\n                .call-help__carousel-item-actions__correct_contact {\n                  span {\n                    display: flex;\n                    align-items: center;\n                    gap: 8px;\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\n.incorrect-contact__popover,\n.dont-rec-call__popover {\n  padding: 16px !important;\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n\n  .el-popover__title {\n    margin: 0;\n    font-weight: 600;\n    text-align: center;\n  }\n\n  .dont-rec-call__label-contacts {\n    font-weight: 600;\n    text-transform: capitalize;\n    margin-bottom: -16px;\n    font-size: 14px;\n  }\n\n  .dont-rec-call__contacts {\n    margin-bottom: -16px;\n  }\n\n  .dont-rec-call__contacts:last-of-type {\n    margin-bottom: 16px;\n  }\n\n  .dont-rec-call__add-contact {\n    display: flex;\n    flex-direction: row;\n    gap: 8px;\n  }\n}\n"],sourceRoot:""}]),l["default"]=i},25088:function(e,l,a){var t=a(28063);t.__esModule&&(t=t.default),"string"===typeof t&&(t=[[e.id,t,""]]),t.locals&&(e.exports=t.locals);var o=a(39185).Z;o("950c6d26",t,!0,{sourceMap:!0,shadowMode:!1})}}]);
//# sourceMappingURL=1270.js.map