(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[2125],{72125:function(e,o,r){"use strict";r.r(o),r.d(o,{default:function(){return d}});var n=function(){var e=this,o=e._self._c;return o("section",{staticClass:"recipients-container",attrs:{id:"recipientsMessagesEditorOmnichannelTicketNegotiation"}},[e.recipients.length>0?o("span",{staticClass:"recipients-container__content",class:{"recipients-container__content-reverse":e.isReversed,"recipients-container__whatsapp":"whatsapp"===e.type&&e.usingColors,"recipients-container__email":"email"===e.type&&e.usingColors,"recipients-container__negotiator":["negotiator_message","negotiation"].includes(e.type)&&e.usingColors}},[o("span",{staticClass:"recipients-container__label"},[o("el-popover",{attrs:{placement:"top",trigger:"click","popper-class":"recipients-popover",disabled:e.recipients.length<=1}},[o("ul",{staticClass:"recipients-container__list"},e._l(e.recipients.slice(1),(function(r,n){return o("li",{key:`recipient-${n}`,staticClass:"recipients-container__list-item"},[o("i",{staticClass:"recipients-container__item-icon el-icon-caret-right"}),e._v(" "+e._s(r.value)+" ")])})),0),o("el-badge",{staticClass:"item",attrs:{slot:"reference",type:"primary",value:"+"+(e.recipients.length-1),hidden:e.recipients.length<=1},slot:"reference"},[o("span",{staticClass:"recipients-container__label-text"},["whatsapp"===e.type?o("span",[e._v(" "+e._s(e._f("phoneNumber")(e.recipients[0].value))+" ")]):o("span",[e._v(" "+e._s(e.recipients[0].value)+" ")])])])],1)],1),"whatsapp"===e.type&&null!==e.recipient&&e.canAccessDialer?o("el-popover",{attrs:{placement:"top-end",title:"Ligar para:",width:"auto",trigger:"click","popper-class":"call-current-recipient-popover","popper-options":{offset:[0,12]}}},[o("div",{staticClass:"popover__content"},[o("div",{staticClass:"name"},[e._v(" "+e._s(e._f("resumedName")((e.recipient.toRoleName||"").toLowerCase()))+" ")]),o("el-button",{attrs:{type:"primary",size:"mini"},on:{click:e.handleAddCall}},[e._v(" Ligar ")])],1),o("i",{staticClass:"text-inline-editor__icon el-icon-phone",attrs:{slot:"reference"},slot:"reference"})]):e._e()],1):e._e()])},t=[],i=r(90408),l=r(40917),c={name:"Recipients",props:{isReversed:{type:Boolean,default:!1}},data:()=>({recipient:null}),computed:{...(0,i.Se)({recipients:"getEditorRecipients",type:"getEditorMessageType",userProperties:"userProperties",usingColors:"isOmnichannelUsingColors",canAccessDialer:"canAccessDialer",appInstance:"getAppInstance",ticketStatus:"getTicketOverviewStatus"})},watch:{recipients:{deep:!0,handler:"handleUpdateRecipients"}},mounted(){this.handleUpdateRecipients(this.recipients)},methods:{...(0,i.nv)(["addCall","getTicketOverviewParty","getTicketOverviewPartiesTemp"]),handleAddCall(){this.addCall(this.recipient)},handlePossibleRecipient({disputeRoleId:e},{name:o,emails:r,phones:n}){const t=this.recipients[0]?.value,i=Number(this.$route.params.id),{ticketStatus:l,appInstance:c}=this;this.recipient={disputeId:i,number:t,disputeStatus:l,appInstance:c,toRoleId:e,toRoleName:o,contacts:{emails:r,phones:n}}},handleUpdateRecipients(e){if(e.length&&"whatsapp"===e[0].type){const e=this.recipients[0]?.value,o=Number(this.$route.params.id);this.getTicketOverviewPartiesTemp(o).then((r=>{r.map((async r=>{const{disputeRoleId:n}=r;this.getTicketOverviewParty({disputeId:o,disputeRoleId:n}).then((o=>{const{phones:n}=o;for(const t of n)if((0,l.z_)(t?.number,e,90)){this.handlePossibleRecipient(r,o);break}}))}))}))}else this.recipient=null}}},a=c,s=(r(163),r(29158),r(1001)),p=(0,s.Z)(a,n,t,!1,null,"938bbb2e",null),d=p.exports},28219:function(e,o,r){"use strict";r.r(o);var n=r(87537),t=r.n(n),i=r(23645),l=r.n(i),c=l()(t());c.push([e.id,".recipients-container[data-v-938bbb2e]{display:flex;align-items:center}.recipients-container .recipients-container__content[data-v-938bbb2e]{display:flex;align-items:center;justify-content:flex-end;gap:12px;padding:2px 6px 4px;border-radius:8px}.recipients-container .recipients-container__content .recipients-container__icon[data-v-938bbb2e]{width:16px}.recipients-container .recipients-container__content .recipients-container__icon.negotiation[data-v-938bbb2e]{margin-top:2px}.recipients-container .recipients-container__content span[data-v-938bbb2e]{cursor:pointer}.recipients-container .recipients-container__content-reverse[data-v-938bbb2e]{flex-direction:row-reverse}.recipients-container .recipients-container__whatsapp[data-v-938bbb2e]{background-color:#8ae698}.recipients-container .recipients-container__email[data-v-938bbb2e]{background-color:#d5f1fb}.recipients-container .recipients-container__negotiator[data-v-938bbb2e]{background-color:#9461f74f}","",{version:3,sources:["webpack://./src/views/main/negotiation/partials/ticket/omnichannel/editor/partials/Recipients.vue","webpack://./node_modules/projuris-acordos-theme/src/common/colors.scss"],names:[],mappings:"AAGA,uCACE,YAAA,CACA,kBAAA,CAEA,sEACE,YAAA,CACA,kBAAA,CACA,wBAAA,CACA,QAAA,CAEA,mBAAA,CACA,iBAAA,CAMA,kGACE,UAAA,CAEA,8GACE,cAAA,CAIJ,2EACE,cAAA,CAIJ,8EACE,0BAAA,CAGF,uEACE,wBAAA,CAGF,oEACE,wBAAA,CAGF,yEACE,0BC8BoB",sourcesContent:["\n@import '~projuris-acordos-theme/src/common/colors';\n\n.recipients-container {\n  display: flex;\n  align-items: center;\n\n  .recipients-container__content {\n    display: flex;\n    align-items: center;\n    justify-content: flex-end;\n    gap: 12px;\n\n    padding: 2px 6px 4px;\n    border-radius: 8px;\n\n    // .recipients-container__label {\n    //   cursor: pointer;\n    // }\n\n    .recipients-container__icon {\n      width: 16px;\n\n      &.negotiation {\n        margin-top: 2px;\n      }\n    }\n\n    span {\n      cursor: pointer;\n    }\n  }\n\n  .recipients-container__content-reverse {\n    flex-direction: row-reverse;\n  }\n\n  .recipients-container__whatsapp {\n    background-color: #8ae698;\n  }\n\n  .recipients-container__email {\n    background-color: #d5f1fb;\n  }\n\n  .recipients-container__negotiator {\n    background-color: $--color-negotiator-bg;\n  }\n}\n","/* Colors\n-------------------------- */\n\n$--color-white: #fff !default;\n$--color-black: #424242 !default;\n$--color-gray: #979797 !default;\n$--color-gray-light-1: mix($--color-white, $--color-gray, 10%) !default;\n$--color-light-gray: #f3f4f5 !default;\n$--color-whatsapp: #075E54 !default;\n\n$--pj-color-darker-blue: #0A0022 !default;\n$--pj-color-dark-blue: #280BA0 !default;\n$--pj-color-blue: #0756e4 !default;\n$--pj-color-light-blue: #018EF0 !default;\n$--pj-color-lighter-blue: #30A9FB !default;\n$--pj-color-white-blue: #F0F9FE !default;\n$--pj-color-disabled-blue: #9ad2f9 !default;\n\n$-pg-color-overlay: #19415F !default;\n\n$--pj-color-red: #CC4148 !default;\n$--pj-color-light-red: #EC767C !default;\n$--pj-color-disable-red: #FFF2F3 !default;\n\n$--color-primary: $--pj-color-blue !default;\n$--color-primary-light-1: mix($--color-white, $--color-primary, 10%) !default;\n$--color-primary-light-2: mix($--color-white, $--color-primary, 20%) !default;\n$--color-primary-light-3: mix($--color-white, $--color-primary, 30%) !default;\n$--color-primary-light-4: mix($--color-white, $--color-primary, 40%) !default;\n$--color-primary-light-5: mix($--color-white, $--color-primary, 50%) !default;\n$--color-primary-light-6: mix($--color-white, $--color-primary, 60%) !default;\n$--color-primary-light-7: mix($--color-white, $--color-primary, 70%) !default;\n$--color-primary-light-8: mix($--color-white, $--color-primary, 80%) !default;\n$--color-primary-light-9: mix($--color-white, $--color-primary, 90%) !default;\n\n$--color-secondary: $--pj-color-light-blue !default;\n$--color-secondary-light-1: mix($--color-white, $--color-secondary, 10%) !default;\n$--color-secondary-light-2: mix($--color-white, $--color-secondary, 20%) !default;\n$--color-secondary-light-3: mix($--color-white, $--color-secondary, 30%) !default;\n$--color-secondary-light-4: mix($--color-white, $--color-secondary, 40%) !default;\n$--color-secondary-light-5: mix($--color-white, $--color-secondary, 50%) !default;\n$--color-secondary-light-6: mix($--color-white, $--color-secondary, 60%) !default;\n$--color-secondary-light-7: mix($--color-white, $--color-secondary, 70%) !default;\n$--color-secondary-light-8: mix($--color-white, $--color-secondary, 80%) !default;\n$--color-secondary-light-9: mix($--color-white, $--color-secondary, 90%) !default;\n\n$--color-primary-dark: $--pj-color-dark-blue !default;\n$--color-success: #14CC30 !default;\n$--color-warning: #FFC900 !default;\n$--color-danger: #FF4B54 !default;\n$--color-info: #2FBBEC !default;\n\n$--color-success-light-1: mix($--color-white, $--color-success, 10%) !default;\n$--color-success-light-5: mix($--color-white, $--color-success, 50%) !default;\n$--color-warning-light-5: mix($--color-white, $--color-warning, 50%) !default;\n$--color-danger-light-5: mix($--color-white, $--color-danger, 50%) !default;\n$--color-danger-light-3: mix($--color-white, $--color-danger, 30%) !default;\n$--color-info-light-5: mix($--color-white, $--color-info, 50%) !default;\n\n$--color-success-light: mix($--color-white, $--color-success, 80%) !default;\n$--color-warning-light: mix($--color-white, $--color-warning, 80%) !default;\n$--color-danger-light: mix($--color-white, $--color-danger, 80%) !default;\n$--color-info-light: mix($--color-white, $--color-info, 80%) !default;\n\n$--color-success-lighter: mix($--color-white, $--color-success, 90%) !default;\n$--color-warning-lighter: mix($--color-white, $--color-warning, 90%) !default;\n$--color-danger-lighter: mix($--color-white, $--color-danger, 90%) !default;\n$--color-info-lighter: mix($--color-white, $--color-info, 90%) !default;\n\n$--color-text-primary: $--color-black !default;\n$--color-text-secondary: $--color-gray !default;\n\n$--color-nps-promoter: #14CC30 !default;\n$--color-nps-neutral: #979797 !default;\n$--color-nps-detractor: #FF4B54 !default;\n\n$--color-negotiator-bg: #9461f74f !default;\n$--color-email-bg: $--color-info-light !default;\n$--color-whatsapp-bg: $--color-success-light-5 !default;"],sourceRoot:""}]),o["default"]=c},60012:function(e,o,r){"use strict";r.r(o);var n=r(87537),t=r.n(n),i=r(23645),l=r.n(i),c=l()(t());c.push([e.id,".recipients-popover{padding:12px}.recipients-popover .recipients-container__list{list-style:none;margin:0;padding:0}.recipients-popover .recipients-container__list .recipients-container__list-item{margin-top:6px}.recipients-popover .recipients-container__list .recipients-container__list-item:first-child{margin-top:0}.recipients-popover .recipients-container__list .recipients-container__list-item .recipients-container__item-icon{color:#979797}.call-current-recipient-popover{display:flex;flex-direction:column;align-items:center;gap:12px;top:-12px!important}.call-current-recipient-popover .el-popover__title{margin:0;width:100%;text-align:center}.call-current-recipient-popover .popover__content{display:flex;flex-direction:column;align-items:center;padding:0;gap:12px;width:100%}.call-current-recipient-popover .popover__content .name{text-transform:capitalize}.call-current-recipient-popover .popover__content .el-button{display:flex;width:100%;justify-content:center}","",{version:3,sources:["webpack://./src/views/main/negotiation/partials/ticket/omnichannel/editor/partials/Recipients.vue","webpack://./node_modules/projuris-acordos-theme/src/common/colors.scss"],names:[],mappings:"AAGA,oBACE,YAAA,CAEA,gDACE,eAAA,CACA,QAAA,CACA,SAAA,CAEA,iFACE,cAAA,CACA,6FAAA,YAAA,CAEA,kHACE,aCXO,CDiBf,gCACE,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,QAAA,CACA,mBAAA,CAEA,mDACE,QAAA,CACA,UAAA,CACA,iBAAA,CAGF,kDACE,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,SAAA,CACA,QAAA,CACA,UAAA,CAEA,wDACE,yBAAA,CAGF,6DACE,YAAA,CACA,UAAA,CACA,sBAAA",sourcesContent:["\n@import '~projuris-acordos-theme/src/common/colors';\n\n.recipients-popover {\n  padding: 12px;\n\n  .recipients-container__list {\n    list-style: none;\n    margin: 0;\n    padding: 0;\n\n    .recipients-container__list-item {\n      margin-top: 6px;\n      &:first-child {margin-top: 0;}\n\n      .recipients-container__item-icon {\n        color: $--color-text-secondary;\n      }\n    }\n  }\n}\n\n.call-current-recipient-popover {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 12px;\n  top: -12px !important;\n\n  .el-popover__title {\n    margin: 0;\n    width: 100%;\n    text-align: center;\n  }\n\n  .popover__content {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    padding: 0;\n    gap: 12px;\n    width: 100%;\n\n    .name {\n      text-transform: capitalize;\n    }\n\n    .el-button {\n      display: flex;\n      width: 100%;\n      justify-content: center;\n    }\n  }\n}\n","/* Colors\n-------------------------- */\n\n$--color-white: #fff !default;\n$--color-black: #424242 !default;\n$--color-gray: #979797 !default;\n$--color-gray-light-1: mix($--color-white, $--color-gray, 10%) !default;\n$--color-light-gray: #f3f4f5 !default;\n$--color-whatsapp: #075E54 !default;\n\n$--pj-color-darker-blue: #0A0022 !default;\n$--pj-color-dark-blue: #280BA0 !default;\n$--pj-color-blue: #0756e4 !default;\n$--pj-color-light-blue: #018EF0 !default;\n$--pj-color-lighter-blue: #30A9FB !default;\n$--pj-color-white-blue: #F0F9FE !default;\n$--pj-color-disabled-blue: #9ad2f9 !default;\n\n$-pg-color-overlay: #19415F !default;\n\n$--pj-color-red: #CC4148 !default;\n$--pj-color-light-red: #EC767C !default;\n$--pj-color-disable-red: #FFF2F3 !default;\n\n$--color-primary: $--pj-color-blue !default;\n$--color-primary-light-1: mix($--color-white, $--color-primary, 10%) !default;\n$--color-primary-light-2: mix($--color-white, $--color-primary, 20%) !default;\n$--color-primary-light-3: mix($--color-white, $--color-primary, 30%) !default;\n$--color-primary-light-4: mix($--color-white, $--color-primary, 40%) !default;\n$--color-primary-light-5: mix($--color-white, $--color-primary, 50%) !default;\n$--color-primary-light-6: mix($--color-white, $--color-primary, 60%) !default;\n$--color-primary-light-7: mix($--color-white, $--color-primary, 70%) !default;\n$--color-primary-light-8: mix($--color-white, $--color-primary, 80%) !default;\n$--color-primary-light-9: mix($--color-white, $--color-primary, 90%) !default;\n\n$--color-secondary: $--pj-color-light-blue !default;\n$--color-secondary-light-1: mix($--color-white, $--color-secondary, 10%) !default;\n$--color-secondary-light-2: mix($--color-white, $--color-secondary, 20%) !default;\n$--color-secondary-light-3: mix($--color-white, $--color-secondary, 30%) !default;\n$--color-secondary-light-4: mix($--color-white, $--color-secondary, 40%) !default;\n$--color-secondary-light-5: mix($--color-white, $--color-secondary, 50%) !default;\n$--color-secondary-light-6: mix($--color-white, $--color-secondary, 60%) !default;\n$--color-secondary-light-7: mix($--color-white, $--color-secondary, 70%) !default;\n$--color-secondary-light-8: mix($--color-white, $--color-secondary, 80%) !default;\n$--color-secondary-light-9: mix($--color-white, $--color-secondary, 90%) !default;\n\n$--color-primary-dark: $--pj-color-dark-blue !default;\n$--color-success: #14CC30 !default;\n$--color-warning: #FFC900 !default;\n$--color-danger: #FF4B54 !default;\n$--color-info: #2FBBEC !default;\n\n$--color-success-light-1: mix($--color-white, $--color-success, 10%) !default;\n$--color-success-light-5: mix($--color-white, $--color-success, 50%) !default;\n$--color-warning-light-5: mix($--color-white, $--color-warning, 50%) !default;\n$--color-danger-light-5: mix($--color-white, $--color-danger, 50%) !default;\n$--color-danger-light-3: mix($--color-white, $--color-danger, 30%) !default;\n$--color-info-light-5: mix($--color-white, $--color-info, 50%) !default;\n\n$--color-success-light: mix($--color-white, $--color-success, 80%) !default;\n$--color-warning-light: mix($--color-white, $--color-warning, 80%) !default;\n$--color-danger-light: mix($--color-white, $--color-danger, 80%) !default;\n$--color-info-light: mix($--color-white, $--color-info, 80%) !default;\n\n$--color-success-lighter: mix($--color-white, $--color-success, 90%) !default;\n$--color-warning-lighter: mix($--color-white, $--color-warning, 90%) !default;\n$--color-danger-lighter: mix($--color-white, $--color-danger, 90%) !default;\n$--color-info-lighter: mix($--color-white, $--color-info, 90%) !default;\n\n$--color-text-primary: $--color-black !default;\n$--color-text-secondary: $--color-gray !default;\n\n$--color-nps-promoter: #14CC30 !default;\n$--color-nps-neutral: #979797 !default;\n$--color-nps-detractor: #FF4B54 !default;\n\n$--color-negotiator-bg: #9461f74f !default;\n$--color-email-bg: $--color-info-light !default;\n$--color-whatsapp-bg: $--color-success-light-5 !default;"],sourceRoot:""}]),o["default"]=c},163:function(e,o,r){var n=r(28219);n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[e.id,n,""]]),n.locals&&(e.exports=n.locals);var t=r(39185).Z;t("056f290e",n,!0,{sourceMap:!0,shadowMode:!1})},29158:function(e,o,r){var n=r(60012);n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[e.id,n,""]]),n.locals&&(e.exports=n.locals);var t=r(39185).Z;t("70f8cd44",n,!0,{sourceMap:!0,shadowMode:!1})}}]);
//# sourceMappingURL=2125.js.map