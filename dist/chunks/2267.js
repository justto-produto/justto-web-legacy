(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[2267],{22267:function(o,r,l){"use strict";l.r(r),l.d(r,{default:function(){return $}});var e=function(){var o=this,r=o._self._c;return r("article",{staticClass:"minimized-drafts"},o._l(o.draftsIds.filter((r=>Number(r)===Number(o.$route.params.id))),(function(l){return r("div",{key:l,staticClass:"minimized-draft__item"},[r("div",{staticClass:"left-triangle"}),r("el-tag",{attrs:{closable:"",size:"mini"},on:{close:function(r){return o.handleCloseDraft(l)},click:function(r){return o.handleRedirectToDraft(l)}}},[o._v(" Minuta "+o._s(`#${l}`)+" ")]),r("div",{staticClass:"right-triangle"})],1)})),0)},t=[],c=(l(57658),l(90408)),i={computed:{...(0,c.Se)({draftsIds:"getStoredDraftsIds"})},methods:{...(0,c.nv)(["openStoredDraft","forgetMinimizedDraft"]),handleRedirectToDraft(o){const r=Number(this.$route.params.id)!==Number(o);this.$confirm(`Gerênciar minuta da disputa #${o}?`,"Gerênciar minuta",{confirmButtonText:"Sim",cancelButtonText:"Não",center:!0,showClose:!1,closeOnClickModal:!1,closeOnPressEscape:!1}).then((()=>{this.openStoredDraft(o),r&&this.$router.push({name:this.$route.name,params:{id:o}})}))},handleCloseDraft(o){this.$confirm(`Esquecer minuta da disputa #${o}?`,"Esquecer minuta",{confirmButtonText:"Sim",cancelButtonText:"Não",center:!0,showClose:!1,closeOnClickModal:!1,closeOnPressEscape:!1}).then((()=>{this.forgetMinimizedDraft(o)})).catch((()=>{}))}}},n=i,a=(l(30943),l(23559),l(1001)),d=(0,a.Z)(n,e,t,!1,null,"03a89064",null),$=d.exports},66062:function(o,r,l){"use strict";l.r(r);var e=l(87537),t=l.n(e),c=l(23645),i=l.n(c),n=i()(t());n.push([o.id,".minimized-drafts[data-v-03a89064]{position:absolute;top:0;left:0;margin-top:-20px;margin-left:12px;display:flex;gap:4px}.minimized-drafts .minimized-draft__item[data-v-03a89064]{display:flex}.minimized-drafts .minimized-draft__item .left-triangle[data-v-03a89064]{width:6px;height:20px;background-color:#f3f4f5;-webkit-clip-path:polygon(0 100%,100% 0,100% 100%);clip-path:polygon(0 100%,100% 0,100% 100%)}.minimized-drafts .minimized-draft__item .el-tag[data-v-03a89064]{border:none;cursor:pointer;border-radius:0;color:#424242;background-color:#f3f4f5}.minimized-drafts .minimized-draft__item .right-triangle[data-v-03a89064]{width:6px;height:20px;background-color:#f3f4f5;-webkit-clip-path:polygon(0 100%,0 0,100% 100%);clip-path:polygon(0 100%,0 0,100% 100%)}","",{version:3,sources:["webpack://./src/components/buttons/MinimizedDrafts.vue","webpack://./node_modules/projuris-acordos-theme/src/common/colors.scss"],names:[],mappings:"AAGA,mCACE,iBAAA,CACA,KAAA,CACA,MAAA,CACA,gBAAA,CACA,gBAAA,CACA,YAAA,CACA,OAAA,CAEA,0DACE,YAAA,CAEA,yEACE,SAAA,CACA,WAAA,CACA,wBCXe,CDYf,kDAAA,CAAA,0CAAA,CAGF,kEACE,WAAA,CACA,cAAA,CACA,eAAA,CACA,aCtBU,CDuBV,wBCpBe,CDuBjB,0EACE,SAAA,CACA,WAAA,CACA,wBC1Be,CD2Bf,+CAAA,CAAA,uCAAA",sourcesContent:["\n@import '~projuris-acordos-theme/src/common/colors.scss';\n\n.minimized-drafts {\n  position: absolute;\n  top: 0;\n  left: 0;\n  margin-top: -20px;\n  margin-left: 12px;\n  display: flex;\n  gap: 4px;\n\n  .minimized-draft__item {\n    display: flex;\n\n    .left-triangle {\n      width: 6px;\n      height: 20px;\n      background-color: $--color-light-gray;\n      clip-path: polygon(0% 100%, 100% 0%, 100% 100%)\n    }\n\n    .el-tag {\n      border: none;\n      cursor: pointer;\n      border-radius: 0;\n      color: $--color-black;\n      background-color: $--color-light-gray;\n    }\n\n    .right-triangle {\n      width: 6px;\n      height: 20px;\n      background-color: $--color-light-gray;\n      clip-path: polygon(0% 100%, 0% 0%, 100% 100%)\n    }\n  }\n\n}\n","/* Colors\n-------------------------- */\n\n$--color-white: #fff !default;\n$--color-black: #424242 !default;\n$--color-gray: #979797 !default;\n$--color-gray-light-1: mix($--color-white, $--color-gray, 10%) !default;\n$--color-light-gray: #f3f4f5 !default;\n$--color-whatsapp: #075E54 !default;\n\n$--pj-color-darker-blue: #0A0022 !default;\n$--pj-color-dark-blue: #280BA0 !default;\n$--pj-color-blue: #0756e4 !default;\n$--pj-color-light-blue: #018EF0 !default;\n$--pj-color-lighter-blue: #30A9FB !default;\n$--pj-color-white-blue: #F0F9FE !default;\n$--pj-color-disabled-blue: #9ad2f9 !default;\n\n$-pg-color-overlay: #19415F !default;\n\n$--pj-color-red: #CC4148 !default;\n$--pj-color-light-red: #EC767C !default;\n$--pj-color-disable-red: #FFF2F3 !default;\n\n$--color-primary: $--pj-color-blue !default;\n$--color-primary-light-1: mix($--color-white, $--color-primary, 10%) !default;\n$--color-primary-light-2: mix($--color-white, $--color-primary, 20%) !default;\n$--color-primary-light-3: mix($--color-white, $--color-primary, 30%) !default;\n$--color-primary-light-4: mix($--color-white, $--color-primary, 40%) !default;\n$--color-primary-light-5: mix($--color-white, $--color-primary, 50%) !default;\n$--color-primary-light-6: mix($--color-white, $--color-primary, 60%) !default;\n$--color-primary-light-7: mix($--color-white, $--color-primary, 70%) !default;\n$--color-primary-light-8: mix($--color-white, $--color-primary, 80%) !default;\n$--color-primary-light-9: mix($--color-white, $--color-primary, 90%) !default;\n\n$--color-secondary: $--pj-color-light-blue !default;\n$--color-secondary-light-1: mix($--color-white, $--color-secondary, 10%) !default;\n$--color-secondary-light-2: mix($--color-white, $--color-secondary, 20%) !default;\n$--color-secondary-light-3: mix($--color-white, $--color-secondary, 30%) !default;\n$--color-secondary-light-4: mix($--color-white, $--color-secondary, 40%) !default;\n$--color-secondary-light-5: mix($--color-white, $--color-secondary, 50%) !default;\n$--color-secondary-light-6: mix($--color-white, $--color-secondary, 60%) !default;\n$--color-secondary-light-7: mix($--color-white, $--color-secondary, 70%) !default;\n$--color-secondary-light-8: mix($--color-white, $--color-secondary, 80%) !default;\n$--color-secondary-light-9: mix($--color-white, $--color-secondary, 90%) !default;\n\n$--color-primary-dark: $--pj-color-dark-blue !default;\n$--color-success: #14CC30 !default;\n$--color-warning: #FFC900 !default;\n$--color-danger: #FF4B54 !default;\n$--color-info: #2FBBEC !default;\n\n$--color-success-light-1: mix($--color-white, $--color-success, 10%) !default;\n$--color-success-light-5: mix($--color-white, $--color-success, 50%) !default;\n$--color-warning-light-5: mix($--color-white, $--color-warning, 50%) !default;\n$--color-danger-light-5: mix($--color-white, $--color-danger, 50%) !default;\n$--color-danger-light-3: mix($--color-white, $--color-danger, 30%) !default;\n$--color-info-light-5: mix($--color-white, $--color-info, 50%) !default;\n\n$--color-success-light: mix($--color-white, $--color-success, 80%) !default;\n$--color-warning-light: mix($--color-white, $--color-warning, 80%) !default;\n$--color-danger-light: mix($--color-white, $--color-danger, 80%) !default;\n$--color-info-light: mix($--color-white, $--color-info, 80%) !default;\n\n$--color-success-lighter: mix($--color-white, $--color-success, 90%) !default;\n$--color-warning-lighter: mix($--color-white, $--color-warning, 90%) !default;\n$--color-danger-lighter: mix($--color-white, $--color-danger, 90%) !default;\n$--color-info-lighter: mix($--color-white, $--color-info, 90%) !default;\n\n$--color-text-primary: $--color-black !default;\n$--color-text-secondary: $--color-gray !default;\n\n$--color-nps-promoter: #14CC30 !default;\n$--color-nps-neutral: #979797 !default;\n$--color-nps-detractor: #FF4B54 !default;\n\n$--color-negotiator-bg: #9461f74f !default;\n$--color-email-bg: $--color-info-light !default;\n$--color-whatsapp-bg: $--color-success-light-5 !default;"],sourceRoot:""}]),r["default"]=n},44145:function(o,r,l){"use strict";l.r(r);var e=l(87537),t=l.n(e),c=l(23645),i=l.n(c),n=i()(t());n.push([o.id,".minimized-drafts .minimized-draft__item .el-tag .el-tag__close{color:#424242}.minimized-drafts .minimized-draft__item .el-tag .el-tag__close:hover{background-color:#424242;color:#fff}","",{version:3,sources:["webpack://./src/components/buttons/MinimizedDrafts.vue","webpack://./node_modules/projuris-acordos-theme/src/common/colors.scss"],names:[],mappings:"AAMM,gEACE,aCHQ,CDKR,sEACE,wBCNM,CDON,UCRM",sourcesContent:["\n@import '~projuris-acordos-theme/src/common/colors.scss';\n\n.minimized-drafts {\n  .minimized-draft__item {\n    .el-tag {\n      .el-tag__close {\n        color: $--color-black;\n\n        &:hover {\n          background-color: $--color-black;\n          color: $--color-white;\n        }\n      }\n    }\n  }\n}\n","/* Colors\n-------------------------- */\n\n$--color-white: #fff !default;\n$--color-black: #424242 !default;\n$--color-gray: #979797 !default;\n$--color-gray-light-1: mix($--color-white, $--color-gray, 10%) !default;\n$--color-light-gray: #f3f4f5 !default;\n$--color-whatsapp: #075E54 !default;\n\n$--pj-color-darker-blue: #0A0022 !default;\n$--pj-color-dark-blue: #280BA0 !default;\n$--pj-color-blue: #0756e4 !default;\n$--pj-color-light-blue: #018EF0 !default;\n$--pj-color-lighter-blue: #30A9FB !default;\n$--pj-color-white-blue: #F0F9FE !default;\n$--pj-color-disabled-blue: #9ad2f9 !default;\n\n$-pg-color-overlay: #19415F !default;\n\n$--pj-color-red: #CC4148 !default;\n$--pj-color-light-red: #EC767C !default;\n$--pj-color-disable-red: #FFF2F3 !default;\n\n$--color-primary: $--pj-color-blue !default;\n$--color-primary-light-1: mix($--color-white, $--color-primary, 10%) !default;\n$--color-primary-light-2: mix($--color-white, $--color-primary, 20%) !default;\n$--color-primary-light-3: mix($--color-white, $--color-primary, 30%) !default;\n$--color-primary-light-4: mix($--color-white, $--color-primary, 40%) !default;\n$--color-primary-light-5: mix($--color-white, $--color-primary, 50%) !default;\n$--color-primary-light-6: mix($--color-white, $--color-primary, 60%) !default;\n$--color-primary-light-7: mix($--color-white, $--color-primary, 70%) !default;\n$--color-primary-light-8: mix($--color-white, $--color-primary, 80%) !default;\n$--color-primary-light-9: mix($--color-white, $--color-primary, 90%) !default;\n\n$--color-secondary: $--pj-color-light-blue !default;\n$--color-secondary-light-1: mix($--color-white, $--color-secondary, 10%) !default;\n$--color-secondary-light-2: mix($--color-white, $--color-secondary, 20%) !default;\n$--color-secondary-light-3: mix($--color-white, $--color-secondary, 30%) !default;\n$--color-secondary-light-4: mix($--color-white, $--color-secondary, 40%) !default;\n$--color-secondary-light-5: mix($--color-white, $--color-secondary, 50%) !default;\n$--color-secondary-light-6: mix($--color-white, $--color-secondary, 60%) !default;\n$--color-secondary-light-7: mix($--color-white, $--color-secondary, 70%) !default;\n$--color-secondary-light-8: mix($--color-white, $--color-secondary, 80%) !default;\n$--color-secondary-light-9: mix($--color-white, $--color-secondary, 90%) !default;\n\n$--color-primary-dark: $--pj-color-dark-blue !default;\n$--color-success: #14CC30 !default;\n$--color-warning: #FFC900 !default;\n$--color-danger: #FF4B54 !default;\n$--color-info: #2FBBEC !default;\n\n$--color-success-light-1: mix($--color-white, $--color-success, 10%) !default;\n$--color-success-light-5: mix($--color-white, $--color-success, 50%) !default;\n$--color-warning-light-5: mix($--color-white, $--color-warning, 50%) !default;\n$--color-danger-light-5: mix($--color-white, $--color-danger, 50%) !default;\n$--color-danger-light-3: mix($--color-white, $--color-danger, 30%) !default;\n$--color-info-light-5: mix($--color-white, $--color-info, 50%) !default;\n\n$--color-success-light: mix($--color-white, $--color-success, 80%) !default;\n$--color-warning-light: mix($--color-white, $--color-warning, 80%) !default;\n$--color-danger-light: mix($--color-white, $--color-danger, 80%) !default;\n$--color-info-light: mix($--color-white, $--color-info, 80%) !default;\n\n$--color-success-lighter: mix($--color-white, $--color-success, 90%) !default;\n$--color-warning-lighter: mix($--color-white, $--color-warning, 90%) !default;\n$--color-danger-lighter: mix($--color-white, $--color-danger, 90%) !default;\n$--color-info-lighter: mix($--color-white, $--color-info, 90%) !default;\n\n$--color-text-primary: $--color-black !default;\n$--color-text-secondary: $--color-gray !default;\n\n$--color-nps-promoter: #14CC30 !default;\n$--color-nps-neutral: #979797 !default;\n$--color-nps-detractor: #FF4B54 !default;\n\n$--color-negotiator-bg: #9461f74f !default;\n$--color-email-bg: $--color-info-light !default;\n$--color-whatsapp-bg: $--color-success-light-5 !default;"],sourceRoot:""}]),r["default"]=n},30943:function(o,r,l){var e=l(66062);e.__esModule&&(e=e.default),"string"===typeof e&&(e=[[o.id,e,""]]),e.locals&&(o.exports=e.locals);var t=l(39185).Z;t("1592232c",e,!0,{sourceMap:!0,shadowMode:!1})},23559:function(o,r,l){var e=l(44145);e.__esModule&&(e=e.default),"string"===typeof e&&(e=[[o.id,e,""]]),e.locals&&(o.exports=e.locals);var t=l(39185).Z;t("744f8db6",e,!0,{sourceMap:!0,shadowMode:!1})}}]);
//# sourceMappingURL=2267.js.map