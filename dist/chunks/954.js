(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[954],{20954:function(o,l,e){"use strict";e.r(l),e.d(l,{default:function(){return d}});var r=function(){var o=this,l=o._self._c;return l("el-dialog",{attrs:{"close-on-click-modal":!1,"show-close":!1,"close-on-press-escape":!1,visible:o.lgpdDialogVisible,"append-to-body":"",width:"604px"},on:{"update:visible":function(l){o.lgpdDialogVisible=l}}},[l("div",{staticClass:"lgpd-header"},[l("jusIcon",{staticClass:"lgpd-header__icon",attrs:{icon:"alert-active"}}),l("div",{staticClass:"lgpd-header__label"},[o._v(" ATENÇÃO ")])],1),l("div",{staticClass:"lgpd-body"},[l("span",{staticClass:"lgpd-body-item-alert"},[o._v("Alerta sobre Lei Geral de Proteção de Dados")]),l("span",{staticClass:"lgpd-body-item"},[l("span",{staticClass:"lgpd-body-item-person-name"},[o._v(" "+o._s(o.partyName.toLowerCase())+" ")]),o._v(" optou por não ser contatado nesse "+o._s(o.isPhoneNumber?"telefone":"e-mail")+"!")]),l("span",{staticClass:"lgpd-body-item"},[o._v("Ao realizar essa ação voce está violando as regras da LGPD.")]),l("strong",{staticClass:"lgpd-body-item"},[o._v("Quer mesmo continuar?")])]),l("span",{staticClass:"lgpd-footer"},[l("el-button",{attrs:{disabled:o.modalLoading,plain:""},on:{click:function(l){o.lgpdDialogVisible=!1}}},[o._v(" Cancelar ")]),l("el-button",{attrs:{loading:o.modalLoading,type:"primary"},on:{click:function(l){return o.$emit("confirm")}}},[o._v(" Continuar ")])],1)])},t=[],a={name:"WarningLGPD",props:{value:{type:Boolean,default:!1},isPhoneNumber:{type:Boolean,default:!1},partyName:{type:String,default:""}},data(){return{modalLoading:!1}},computed:{lgpdDialogVisible:{get(){return this.value},set(){this.$emit("close")}}}},n=a,i=(e(84752),e(1001)),c=(0,i.Z)(n,r,t,!1,null,"0cc1850b",null),d=c.exports},74749:function(o,l,e){"use strict";e.r(l);var r=e(87537),t=e.n(r),a=e(23645),n=e.n(a),i=n()(t());i.push([o.id,".lgpd-header[data-v-0cc1850b]{display:flex;flex-direction:row;justify-content:center;margin-bottom:10px}.lgpd-header .lgpd-header__icon[data-v-0cc1850b]{width:28px;height:28px;margin-right:8px}.lgpd-header .lgpd-header__label[data-v-0cc1850b]{color:#018ef0;font-weight:700;font-size:22px}.lgpd-body[data-v-0cc1850b]{display:flex;flex-direction:column;align-items:center}.lgpd-body .lgpd-body-item[data-v-0cc1850b]{margin-bottom:5px}.lgpd-body .lgpd-body-item .lgpd-body-item-person-name[data-v-0cc1850b]{text-transform:capitalize}.lgpd-body .lgpd-body-item-alert[data-v-0cc1850b]{font-size:18px;margin-bottom:8px;font-weight:700}.lgpd-footer[data-v-0cc1850b]{display:flex;flex-direction:row;justify-content:center;margin-top:12px}","",{version:3,sources:["webpack://./src/components/dialogs/WarningLGPD.vue","webpack://./node_modules/projuris-acordos-theme/src/common/colors.scss"],names:[],mappings:"AAGA,8BACE,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,kBAAA,CACA,iDACE,UAAA,CACA,WAAA,CACA,gBAAA,CAEF,kDACE,aCDoB,CDEpB,eAAA,CACA,cAAA,CAIJ,4BACE,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,4CACE,iBAAA,CAEA,wEACE,yBAAA,CAGJ,kDACE,cAAA,CACA,iBAAA,CACA,eAAA,CAGJ,8BACE,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,eAAA",sourcesContent:["\n@import '~projuris-acordos-theme/src/common/colors.scss';\n\n.lgpd-header {\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  margin-bottom: 10px;\n  .lgpd-header__icon {\n    width: 28px;\n    height: 28px;\n    margin-right: 8px;\n  }\n  .lgpd-header__label {\n    color: $--color-secondary;\n    font-weight: bold;\n    font-size: 22px;\n  }\n}\n\n.lgpd-body {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  .lgpd-body-item {\n    margin-bottom: 5px;\n\n    .lgpd-body-item-person-name {\n      text-transform: capitalize;\n    }\n  }\n  .lgpd-body-item-alert {\n    font-size: 18px;\n    margin-bottom: 8px;\n    font-weight: bold;\n  }\n}\n.lgpd-footer {\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  margin-top: 12px;\n}\n","/* Colors\n-------------------------- */\n\n$--color-white: #fff !default;\n$--color-black: #424242 !default;\n$--color-gray: #979797 !default;\n$--color-gray-light-1: mix($--color-white, $--color-gray, 10%) !default;\n$--color-light-gray: #f3f4f5 !default;\n$--color-whatsapp: #075E54 !default;\n\n$--pj-color-darker-blue: #0A0022 !default;\n$--pj-color-dark-blue: #280BA0 !default;\n$--pj-color-blue: #0756e4 !default;\n$--pj-color-light-blue: #018EF0 !default;\n$--pj-color-lighter-blue: #30A9FB !default;\n$--pj-color-white-blue: #F0F9FE !default;\n$--pj-color-disabled-blue: #9ad2f9 !default;\n\n$-pg-color-overlay: #19415F !default;\n\n$--pj-color-red: #CC4148 !default;\n$--pj-color-light-red: #EC767C !default;\n$--pj-color-disable-red: #FFF2F3 !default;\n\n$--color-primary: $--pj-color-blue !default;\n$--color-primary-light-1: mix($--color-white, $--color-primary, 10%) !default;\n$--color-primary-light-2: mix($--color-white, $--color-primary, 20%) !default;\n$--color-primary-light-3: mix($--color-white, $--color-primary, 30%) !default;\n$--color-primary-light-4: mix($--color-white, $--color-primary, 40%) !default;\n$--color-primary-light-5: mix($--color-white, $--color-primary, 50%) !default;\n$--color-primary-light-6: mix($--color-white, $--color-primary, 60%) !default;\n$--color-primary-light-7: mix($--color-white, $--color-primary, 70%) !default;\n$--color-primary-light-8: mix($--color-white, $--color-primary, 80%) !default;\n$--color-primary-light-9: mix($--color-white, $--color-primary, 90%) !default;\n\n$--color-secondary: $--pj-color-light-blue !default;\n$--color-secondary-light-1: mix($--color-white, $--color-secondary, 10%) !default;\n$--color-secondary-light-2: mix($--color-white, $--color-secondary, 20%) !default;\n$--color-secondary-light-3: mix($--color-white, $--color-secondary, 30%) !default;\n$--color-secondary-light-4: mix($--color-white, $--color-secondary, 40%) !default;\n$--color-secondary-light-5: mix($--color-white, $--color-secondary, 50%) !default;\n$--color-secondary-light-6: mix($--color-white, $--color-secondary, 60%) !default;\n$--color-secondary-light-7: mix($--color-white, $--color-secondary, 70%) !default;\n$--color-secondary-light-8: mix($--color-white, $--color-secondary, 80%) !default;\n$--color-secondary-light-9: mix($--color-white, $--color-secondary, 90%) !default;\n\n$--color-primary-dark: $--pj-color-dark-blue !default;\n$--color-success: #14CC30 !default;\n$--color-warning: #FFC900 !default;\n$--color-danger: #FF4B54 !default;\n$--color-info: #2FBBEC !default;\n\n$--color-success-light-1: mix($--color-white, $--color-success, 10%) !default;\n$--color-success-light-5: mix($--color-white, $--color-success, 50%) !default;\n$--color-warning-light-5: mix($--color-white, $--color-warning, 50%) !default;\n$--color-danger-light-5: mix($--color-white, $--color-danger, 50%) !default;\n$--color-danger-light-3: mix($--color-white, $--color-danger, 30%) !default;\n$--color-info-light-5: mix($--color-white, $--color-info, 50%) !default;\n\n$--color-success-light: mix($--color-white, $--color-success, 80%) !default;\n$--color-warning-light: mix($--color-white, $--color-warning, 80%) !default;\n$--color-danger-light: mix($--color-white, $--color-danger, 80%) !default;\n$--color-info-light: mix($--color-white, $--color-info, 80%) !default;\n\n$--color-success-lighter: mix($--color-white, $--color-success, 90%) !default;\n$--color-warning-lighter: mix($--color-white, $--color-warning, 90%) !default;\n$--color-danger-lighter: mix($--color-white, $--color-danger, 90%) !default;\n$--color-info-lighter: mix($--color-white, $--color-info, 90%) !default;\n\n$--color-text-primary: $--color-black !default;\n$--color-text-secondary: $--color-gray !default;\n\n$--color-nps-promoter: #14CC30 !default;\n$--color-nps-neutral: #979797 !default;\n$--color-nps-detractor: #FF4B54 !default;\n\n$--color-negotiator-bg: #9461f74f !default;\n$--color-email-bg: $--color-info-light !default;\n$--color-whatsapp-bg: $--color-success-light-5 !default;"],sourceRoot:""}]),l["default"]=i},84752:function(o,l,e){var r=e(74749);r.__esModule&&(r=r.default),"string"===typeof r&&(r=[[o.id,r,""]]),r.locals&&(o.exports=r.locals);var t=e(39185).Z;t("05ebc91b",r,!0,{sourceMap:!0,shadowMode:!1})}}]);
//# sourceMappingURL=954.js.map