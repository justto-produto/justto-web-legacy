(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[9642],{49642:function(o,e,t){"use strict";t.r(e),t.d(e,{default:function(){return c}});var a=function(){var o=this,e=o._self._c;return e("section",[e("el-dialog",{attrs:{visible:o.toShow,"close-on-click-modal":!1,"custom-class":"associate-contacts-dialog","destroy-on-close":"","append-to-body":"",title:"Encontramos dados de contatos na inicial da disputa",width:"50%","before-close":o.handleBeforeClose},on:{"update:visible":function(e){o.toShow=e}}},[o.toShow?e("div",{directives:[{name:"loading",rawName:"v-loading",value:o.loading,expression:"loading"}],staticClass:"dialog-body"},[e("div",{staticClass:"dialog-body__title"},[o._v(" Associe os novos endereços de contato ")]),e("div",{staticClass:"dialog-body__content"},[o.phones&&o.phones.length?e("div",{staticClass:"dialog-body__content-items"},[e("span",{staticClass:"dialog-body__content-label"},[o._v(" Telefones: ")]),o._l(o.phones,(function(t,a){return e("div",{key:a,staticClass:"dialog-body__content-item"},[e("span",{staticClass:"dialog-body__content-item-concainer"},[e("el-popover",{ref:`popover-phone-${a}`,refInFor:!0,staticClass:"popover__content-body",attrs:{"popper-class":"popover__content",placement:"top",trigger:"click"}},o._l(t.origins,(function(t){return e("div",{key:t.id,staticClass:"popover__content-item"},[e("div",{staticClass:"popover__content-title"},[o._v(" Encontrado no anexo '"+o._s(t.name)+"' ")]),e("a",{staticClass:"popover__content-url",attrs:{href:t.url,target:"_blank"}},[o._v(" Click aqui para ver o documento ")])])})),0),e("i",{directives:[{name:"popover",rawName:"v-popover",value:`popover-phone-${a}`,expression:"`popover-phone-${phoneIndex}`"}],staticClass:"el-icon-question"}),e("span",{staticClass:"dialog-body__item-address"},[o._v(" "+o._s(t.address)+" ")])],1),e("span",{staticClass:"dialog-body__item-arow"}),e("div",{staticClass:"dialog-body__item-select"},[e("el-select",{attrs:{size:"mini"},model:{value:t.associateWith,callback:function(e){o.$set(t,"associateWith",e)},expression:"phone.associateWith"}},[e("el-option",{attrs:{label:"Ignorar",value:0}},[o._v(" Ignorar ")]),o._l(o.disputeRoles,(function(t){return e("el-option",{key:t.id,attrs:{label:t.name,value:t.id}},[o._v(" "+o._s(t.name)+" ")])}))],2)],1)])}))],2):o._e(),o.emails&&o.emails.length?e("div",{staticClass:"dialog-body__content-items"},[e("span",{staticClass:"dialog-body__content-label"},[o._v(" E-mails: ")]),o._l(o.emails,(function(t,a){return e("div",{key:a,staticClass:"dialog-body__content-item"},[e("span",{staticClass:"dialog-body__content-item-concainer"},[e("el-popover",{ref:`popover-email-${a}`,refInFor:!0,staticClass:"popover__content-body",attrs:{"popper-class":"popover__content",placement:"top",trigger:"click"}},o._l(t.origins,(function(t){return e("div",{key:t.id,staticClass:"popover__content-item"},[e("div",{staticClass:"popover__content-title"},[o._v(" Encontrado no anexo '"+o._s(t.name)+"' ")]),e("a",{staticClass:"popover__content-url",attrs:{href:t.url,target:"_blank"}},[o._v(" Click aqui para ver o documento ")])])})),0),e("i",{directives:[{name:"popover",rawName:"v-popover",value:`popover-email-${a}`,expression:"`popover-email-${emailIndex}`"}],staticClass:"el-icon-question"}),e("span",{staticClass:"dialog-body__item-address"},[o._v(" "+o._s(t.address)+" ")])],1),e("span",{staticClass:"dialog-body__item-arow"}),e("div",{staticClass:"dialog-body__item-select"},[e("el-select",{attrs:{size:"mini"},model:{value:t.associateWith,callback:function(e){o.$set(t,"associateWith",e)},expression:"email.associateWith"}},[e("el-option",{attrs:{label:"Ignorar",value:0}},[o._v(" Ignorar ")]),o._l(o.disputeRoles,(function(t){return e("el-option",{key:t.id,attrs:{label:t.name,value:t.id}},[o._v(" "+o._s(t.name)+" ")])}))],2)],1)])}))],2):o._e()])]):o._e(),e("span",{attrs:{slot:"footer"},slot:"footer"},[e("el-button",{on:{click:function(e){return o.skip("MAIS TARDE")}}},[o._v(" Associar mais tarde ")]),o.hasAssociations?e("el-button",{attrs:{disabled:o.loading,type:"primary"},on:{click:function(e){return o.submit()}}},[o._v(" Salvar associações ")]):e("el-button",{attrs:{disabled:o.loading,type:"primary"},on:{click:function(e){return o.skip("SIM")}}},[o._v(" Ignorar ")])],1)])],1)},i=[],n=(t(57658),t(90408)),l={name:"AssociateContactsModal",props:{value:{required:!0,type:Boolean,default:!1},current:{required:!0,type:[String,Boolean],default:!1},metadata:{type:Object,default:()=>({emails:[],phones:[]})},parties:{type:Array,default:()=>[]}},data(){return{loading:!1,emails:[],phones:[]}},computed:{disputeRoles(){return this.parties.filter((({party:o,polarity:e,roles:t})=>("CLAIMANT"===o||"CLAIMANT"===e)&&(t.includes("PARTY")||t.includes("LAWYER")))).map((({id:o,name:e,disputeRoleId:t})=>o?{id:o,name:e}:{id:t,name:e}))},toShow:{get(){return Boolean(this.value)&&(this.emails?.length>0||this.phones?.length>0)},set(o){}},hasAssociations(){const o=this.phones.filter((o=>!!o.associateWith)).length,e=this.emails.filter((o=>!!o.associateWith)).length;return o+e>0}},watch:{metadata(){this.update()},toShow(o){o||(this.loading=!1)}},mounted(){this.update()},beforeDestroy(){this.loading=!1},methods:{...(0,n.nv)(["setDisputeProperty","addPhoneToDisputeRole","addEmailToDisputeRole","restartDisputeRoleEngagement"]),handleBeforeClose(o){new Promise(((o,e)=>{this.current?e(new Error("Current is true")):o()})).then((()=>{this.skip("MAIS TARDE")})).catch((()=>{this.skip("MAIS TARDE")})).finally(o)},update(){function o(o){return{associateWith:0,...o}}this.emails=this.metadata.emails.map(o),this.phones=this.metadata.phones.map(o),this.$nextTick((()=>{this.loading=!1}))},skip(o){this.$emit("input",o),this.loading=!0},handleAssociateContacts(){const{id:o}=this.$route.params,e=[];return this.loading=!0,this.phones.filter((o=>!!o.associateWith)).map((({address:t,associateWith:a})=>{e.push(this.addPhoneToDisputeRole({disputeId:o,disputeRoleId:a,value:t}))})),this.emails.filter((o=>!!o.associateWith)).map((({address:t,associateWith:a})=>{e.push(this.addEmailToDisputeRole({disputeId:o,disputeRoleId:a,value:t}))})),new Promise(((o,t)=>{Promise.all(e).then((()=>{this.loading=!1,this.$emit("input","SIM"),o()})).catch(t)}))},submit(){const{id:o}=this.$route.params,e=[...this.phones.filter((({associateWith:o},e,t)=>!!o&&t.findIndex((({associateWith:e})=>e===o))===e)).map((({associateWith:o})=>o)),...this.emails.filter((({associateWith:o},e,t)=>!!o&&t.findIndex((({associateWith:e})=>e===o))===e)).map((({associateWith:o})=>o))];if(e.length){const t="Detectamos alterações nos dados de contato. Quer reagendar as mensagens da(s) parte(s) para incluir o(s) novo(s) contato(s)?";this.$confirm(t,"Reengajar",{confirmButtonText:"Sim",cancelButtonText:"Não",closeOnPressEscape:!1,closeOnClickModal:!1,showClose:!1,center:!0}).then((()=>{this.handleAssociateContacts().then((()=>{Promise.all(e.map((e=>this.restartDisputeRoleEngagement({disputeRoleId:e,disputeId:o}))))}))}))}else this.handleAssociateContacts()}}},r=l,s=(t(16696),t(46873),t(1001)),d=(0,s.Z)(r,a,i,!1,null,"218785a9",null),c=d.exports},31074:function(o,e,t){"use strict";t.r(e);var a=t(87537),i=t.n(a),n=t(23645),l=t.n(n),r=l()(i());r.push([o.id,".popover__content{padding:10px 20px;max-width:600px;max-height:216px;overflow:auto}.associate-contacts-dialog .el-dialog__body{margin:0!important}","",{version:3,sources:["webpack://./src/components/dialogs/AssociateContactsModal.vue"],names:[],mappings:"AACA,kBACE,iBAAA,CACA,eAAA,CACA,gBAAA,CACA,aAAA,CAGA,4CACE,kBAAA",sourcesContent:["\n.popover__content {\n  padding: 10px 20px;\n  max-width: 600px;\n  max-height: 216px;\n  overflow: auto;\n}\n.associate-contacts-dialog {\n  .el-dialog__body {\n    margin: 0px !important;\n  }\n}\n"],sourceRoot:""}]),e["default"]=r},61487:function(o,e,t){"use strict";t.r(e);var a=t(87537),i=t.n(a),n=t(23645),l=t.n(n),r=l()(i());r.push([o.id,'.popover__content .popover__content-item[data-v-218785a9]{margin:10px 0}.popover__content .popover__content-item .popover__content-title[data-v-218785a9]{font-weight:700;word-wrap:break-word}.popover__content .popover__content-item .popover__content-url[data-v-218785a9]{font-size:12}.el-dialog .el-dialog__header .dialog-title[data-v-218785a9]{color:#0756e4;font:normal normal 800 20px/20px Montserrat}.el-dialog .el-dialog__body .dialog-body .dialog-body__title[data-v-218785a9]{display:flex;justify-content:flex-start;font-size:16px}.el-dialog .el-dialog__body .dialog-body .dialog-body__content .dialog-body__content-items[data-v-218785a9]{margin-top:16px;display:flex;flex-direction:column}.el-dialog .el-dialog__body .dialog-body .dialog-body__content .dialog-body__content-items .dialog-body__content-label[data-v-218785a9]{font-weight:700}.el-dialog .el-dialog__body .dialog-body .dialog-body__content .dialog-body__content-items .dialog-body__content-item[data-v-218785a9]{display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin:4px 0}.el-dialog .el-dialog__body .dialog-body .dialog-body__content .dialog-body__content-items .dialog-body__content-item .dialog-body__content-item-concainer .el-icon-question[data-v-218785a9]{color:#0756e4}.el-dialog .el-dialog__body .dialog-body .dialog-body__content .dialog-body__content-items .dialog-body__content-item .dialog-body__content-item-concainer .dialog-body__item-address[data-v-218785a9]{font-size:16px}.el-dialog .el-dialog__body .dialog-body .dialog-body__content .dialog-body__content-items .dialog-body__content-item .dialog-body__item-arow[data-v-218785a9]{background-color:#0756e4;flex:1;height:2px;margin:0 8px;position:relative}.el-dialog .el-dialog__body .dialog-body .dialog-body__content .dialog-body__content-items .dialog-body__content-item .dialog-body__item-arow[data-v-218785a9]:after{content:"";right:-4px;top:-7px;position:absolute;display:inline-block;vertical-align:middle;width:0;height:0;border-top:8px solid transparent;border-bottom:8px solid transparent;border-left:8px solid #0756e4}.el-dialog .el-dialog__body .dialog-body .dialog-body__content .dialog-body__content-items .dialog-body__content-item .dialog-body__item-select[data-v-218785a9]{width:300px}.el-dialog .el-dialog__footer>span[data-v-218785a9]{display:flex;justify-content:center}',"",{version:3,sources:["webpack://./src/components/dialogs/AssociateContactsModal.vue","webpack://./node_modules/projuris-acordos-theme/src/common/colors.scss"],names:[],mappings:"AAIE,0DACE,aAAA,CAEA,kFACE,eAAA,CACA,oBAAA,CAGF,gFACE,YAAA,CAOF,6DACE,aCTY,CDUZ,2CAAA,CAMA,8EACE,YAAA,CACA,0BAAA,CACA,cAAA,CAGA,4GACE,eAAA,CACA,YAAA,CACA,qBAAA,CAEA,wIACE,eAAA,CAEF,uIACE,YAAA,CACA,kBAAA,CACA,6BAAA,CACA,kBAAA,CACA,YAAA,CAGE,8LACE,aCvCE,CDyCJ,uMACE,cAAA,CAIJ,+JACE,wBC/CI,CDgDJ,MAAA,CACA,UAAA,CACA,YAAA,CACA,iBAAA,CACA,qKACE,UAAA,CACA,UAAA,CACA,QAAA,CACA,iBAAA,CACA,oBAAA,CACA,qBAAA,CACA,OAAA,CACA,QAAA,CACA,gCAAA,CACA,mCAAA,CACA,6BAAA,CAIJ,iKACE,WAAA,CASZ,oDACE,YAAA,CACA,sBAAA",sourcesContent:["\n@import '~projuris-acordos-theme/src/common/colors.scss';\n\n.popover__content {\n  .popover__content-item {\n    margin: 10px 0px;\n\n    .popover__content-title {\n      font-weight: bold;\n      word-wrap: break-word;\n    }\n\n    .popover__content-url {\n      font-size: 12;\n    }\n  }\n}\n\n.el-dialog {\n  .el-dialog__header {\n    .dialog-title {\n      color: $--color-primary;\n      font: normal normal 800 20px/20px Montserrat;\n    }\n  }\n\n  .el-dialog__body {\n    .dialog-body {\n      .dialog-body__title {\n        display: flex;\n        justify-content: flex-start;\n        font-size: 16px;\n      }\n      .dialog-body__content {\n        .dialog-body__content-items {\n          margin-top: 16px;\n          display: flex;\n          flex-direction: column;\n\n          .dialog-body__content-label {\n            font-weight: bold;\n          }\n          .dialog-body__content-item {\n            display: flex;\n            flex-direction: row;\n            justify-content: space-between;\n            align-items: center;\n            margin: 4px 0px;\n\n            .dialog-body__content-item-concainer {\n              .el-icon-question {\n                color: $--color-primary;\n              }\n              .dialog-body__item-address {\n                font-size: 16px;\n              }\n            }\n\n            .dialog-body__item-arow {\n              background-color: $--color-primary;\n              flex: 1;\n              height: 2px;\n              margin: 0px 8px;\n              position: relative;\n              &:after {\n                content: '';\n                right: -4px;\n                top: -7px;\n                position: absolute;\n                display: inline-block;\n                vertical-align: middle;\n                width: 0;\n                height: 0;\n                border-top: 8px solid transparent;\n                border-bottom: 8px solid transparent;\n                border-left: 8px solid $--color-primary;\n              }\n            }\n\n            .dialog-body__item-select {\n              width: 300px;\n            }\n          }\n        }\n\n      }\n    }\n  }\n\n  .el-dialog__footer > span {\n    display: flex;\n    justify-content: center;\n  }\n}\n","/* Colors\n-------------------------- */\n\n$--color-white: #fff !default;\n$--color-black: #424242 !default;\n$--color-gray: #979797 !default;\n$--color-gray-light-1: mix($--color-white, $--color-gray, 10%) !default;\n$--color-light-gray: #f3f4f5 !default;\n$--color-whatsapp: #075E54 !default;\n\n$--pj-color-darker-blue: #0A0022 !default;\n$--pj-color-dark-blue: #280BA0 !default;\n$--pj-color-blue: #0756e4 !default;\n$--pj-color-light-blue: #018EF0 !default;\n$--pj-color-lighter-blue: #30A9FB !default;\n$--pj-color-white-blue: #F0F9FE !default;\n$--pj-color-disabled-blue: #9ad2f9 !default;\n\n$-pg-color-overlay: #19415F !default;\n\n$--pj-color-red: #CC4148 !default;\n$--pj-color-light-red: #EC767C !default;\n$--pj-color-disable-red: #FFF2F3 !default;\n\n$--color-primary: $--pj-color-blue !default;\n$--color-primary-light-1: mix($--color-white, $--color-primary, 10%) !default;\n$--color-primary-light-2: mix($--color-white, $--color-primary, 20%) !default;\n$--color-primary-light-3: mix($--color-white, $--color-primary, 30%) !default;\n$--color-primary-light-4: mix($--color-white, $--color-primary, 40%) !default;\n$--color-primary-light-5: mix($--color-white, $--color-primary, 50%) !default;\n$--color-primary-light-6: mix($--color-white, $--color-primary, 60%) !default;\n$--color-primary-light-7: mix($--color-white, $--color-primary, 70%) !default;\n$--color-primary-light-8: mix($--color-white, $--color-primary, 80%) !default;\n$--color-primary-light-9: mix($--color-white, $--color-primary, 90%) !default;\n\n$--color-secondary: $--pj-color-light-blue !default;\n$--color-secondary-light-1: mix($--color-white, $--color-secondary, 10%) !default;\n$--color-secondary-light-2: mix($--color-white, $--color-secondary, 20%) !default;\n$--color-secondary-light-3: mix($--color-white, $--color-secondary, 30%) !default;\n$--color-secondary-light-4: mix($--color-white, $--color-secondary, 40%) !default;\n$--color-secondary-light-5: mix($--color-white, $--color-secondary, 50%) !default;\n$--color-secondary-light-6: mix($--color-white, $--color-secondary, 60%) !default;\n$--color-secondary-light-7: mix($--color-white, $--color-secondary, 70%) !default;\n$--color-secondary-light-8: mix($--color-white, $--color-secondary, 80%) !default;\n$--color-secondary-light-9: mix($--color-white, $--color-secondary, 90%) !default;\n\n$--color-primary-dark: $--pj-color-dark-blue !default;\n$--color-success: #14CC30 !default;\n$--color-warning: #FFC900 !default;\n$--color-danger: #FF4B54 !default;\n$--color-info: #2FBBEC !default;\n\n$--color-success-light-1: mix($--color-white, $--color-success, 10%) !default;\n$--color-success-light-5: mix($--color-white, $--color-success, 50%) !default;\n$--color-warning-light-5: mix($--color-white, $--color-warning, 50%) !default;\n$--color-danger-light-5: mix($--color-white, $--color-danger, 50%) !default;\n$--color-danger-light-3: mix($--color-white, $--color-danger, 30%) !default;\n$--color-info-light-5: mix($--color-white, $--color-info, 50%) !default;\n\n$--color-success-light: mix($--color-white, $--color-success, 80%) !default;\n$--color-warning-light: mix($--color-white, $--color-warning, 80%) !default;\n$--color-danger-light: mix($--color-white, $--color-danger, 80%) !default;\n$--color-info-light: mix($--color-white, $--color-info, 80%) !default;\n\n$--color-success-lighter: mix($--color-white, $--color-success, 90%) !default;\n$--color-warning-lighter: mix($--color-white, $--color-warning, 90%) !default;\n$--color-danger-lighter: mix($--color-white, $--color-danger, 90%) !default;\n$--color-info-lighter: mix($--color-white, $--color-info, 90%) !default;\n\n$--color-text-primary: $--color-black !default;\n$--color-text-secondary: $--color-gray !default;\n\n$--color-nps-promoter: #14CC30 !default;\n$--color-nps-neutral: #979797 !default;\n$--color-nps-detractor: #FF4B54 !default;\n\n$--color-negotiator-bg: #9461f74f !default;\n$--color-email-bg: $--color-info-light !default;\n$--color-whatsapp-bg: $--color-success-light-5 !default;"],sourceRoot:""}]),e["default"]=r},16696:function(o,e,t){var a=t(31074);a.__esModule&&(a=a.default),"string"===typeof a&&(a=[[o.id,a,""]]),a.locals&&(o.exports=a.locals);var i=t(39185).Z;i("13eb3f13",a,!0,{sourceMap:!0,shadowMode:!1})},46873:function(o,e,t){var a=t(61487);a.__esModule&&(a=a.default),"string"===typeof a&&(a=[[o.id,a,""]]),a.locals&&(o.exports=a.locals);var i=t(39185).Z;i("0df0425f",a,!0,{sourceMap:!0,shadowMode:!1})}}]);
//# sourceMappingURL=9642.js.map