(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[3409],{3409:function(t,e,a){"use strict";a.r(e),a.d(e,{default:function(){return d}});var o=function(){var t=this,e=t._self._c;return e("div",{staticClass:"columns-step"},[e("h2",{staticClass:"new-import-view__title"},[t._v(" Mapeamento de colunas ")]),e("el-row",{staticClass:"columns-step__container",attrs:{gutter:60}},[e("el-col",{staticClass:"columns-step__container-column",attrs:{span:12,"data-testid":"import-columns"}},[e("h3",[t._v("Colunas do arquivo")]),e("p",[t._v(" Estas são as colunas do seu arquivo. Os dados em roxo, acima do campo, são os dados da primeira linha de cada coluna correspondente. ")]),t._l(t.columns,(function(a){return e("div",{directives:[{name:"show",rawName:"v-show",value:!t.loading,expression:"!loading"}],key:`${a.id}-${a.name}`,staticClass:"file-column",on:{drop:function(e){return t.dropTag(e,a)},dragover:function(t){t.preventDefault()}}},[e("div",{staticClass:"file-column__name"},[e("span",{staticClass:"file-column__title"},[t._v(t._s(a.name))]),e("span",{staticClass:"file-column__example"},[t._v(t._s(a.example))])]),e("el-tag",{staticClass:"el-tag--dropzone",class:{"el-tag--dropzone-active":a.tag},attrs:{closable:null!==a.tag},on:{close:function(e){return t.removeTag(a)}}},[a.tag?e("span",[void 0!==a.index&&null!==a.index?e("span",[t._v(" "+t._s(t._f("capitalize")(t.$tc(`fields.${t.getColumnTitle(a.tag.id)}`,t.isRecovery)))+" "+t._s(a.tag.index+1)+" - ")]):t._e(),t._v(" "+t._s(t._f("capitalize")(t.$tc(a.tag.key,t.isRecovery)))+" ")]):e("span",[t._v("Arraste a coluna aqui")])])],1)})),e("div",{directives:[{name:"show",rawName:"v-show",value:t.loading,expression:"loading"},{name:"loading",rawName:"v-loading",value:!0,expression:"true"}]},t._l([1,2,3,4,5],(function(a){return e("div",{key:a,staticClass:"file-column"},[e("div",{staticClass:"file-column__name",attrs:{item:a}},[e("span",{staticClass:"file-column__title"},[t._v("coluna")]),e("span",{staticClass:"file-column__example"},[t._v("exemplo")])]),e("el-tag",{staticClass:"el-tag--dropzone"},[e("span",[t._v("Arraste a coluna aqui")])])],1)})),0)],2),e("el-col",{staticClass:"columns-step__container-column",attrs:{span:12,"data-testid":"import-tags"}},[e("h3",[t._v("Campos do Sistema")]),e("p",[t._v(" Estes são os campos do sistema. Para mapeá-los, você deve arrastar os campos abaixo para a coluna correspondente. ")]),e("h3",[t._v("Dados do conflito")]),e("el-collapse",{directives:[{name:"loading",rawName:"v-loading",value:t.loadingTags,expression:"loadingTags"}],staticClass:"el-collapse--drag",attrs:{value:"1"}},[e("el-collapse-item",{attrs:{title:"Dados do conflito",name:"1"}},t._l(t.disputeTags,(function(a,o){return e("span",{key:`${a.id}-${a.name}`,staticClass:"el-tag--drag-container",class:{"el-tag--drag-active":!t.isAvailable(a)},attrs:{draggable:"true"},on:{dragstart:function(e){if(e.target!==e.currentTarget)return null;t.dragTag(e,JSON.stringify({tag:a,index:o}))}}},[e("el-tag",{staticClass:"el-tag--drag"},[t._v(" "+t._s(t._f("capitalize")(t.$tc(a.key,t.isRecovery)))+" ")])],1)})),0)],1),e("h3",{directives:[{name:"show",rawName:"v-show",value:!t.loadingTags,expression:"!loadingTags"}]},[t._v(" "+t._s(t.$tc("fields."+t.pluralizesTerm("claimantParty",t.claimantParties.length>1),t.isRecovery))+" "),e("a",{on:{click:function(e){return t.addTagList(t.claimantParties)}}},[e("i",{staticClass:"el-icon-plus right"})])]),t._l(t.claimantParties,(function(a){return e("div",{key:"claimantParty"+a,staticClass:"drag-group"},[e("el-collapse",{staticClass:"el-collapse--drag"},[e("el-collapse-item",{attrs:{title:`${t.$tc("fields.claimantParty",t.isRecovery)} ${a}`}},t._l(t.tags.claimantParty.tags,(function(o){return e("span",{key:`${o.id}-${o.name}`,staticClass:"el-tag--drag-container",class:{"el-tag--drag-active":!t.isMultipleAvailable(o,a)},attrs:{draggable:"true"},on:{dragstart:function(e){if(e.target!==e.currentTarget)return null;t.dragTag(e,JSON.stringify({tag:o,index:a}))}}},[e("el-tag",{staticClass:"el-tag--drag"},[t._v(" "+t._s(t.$tc("fields.claimantParty",t.isRecovery))+" "+t._s(a)+" - "+t._s(t._f("capitalize")(t.$t(o.key)))+" ")])],1)})),0)],1),1!==a&&t.claimantParties.length===a?e("a",{on:{click:function(e){return t.removeTagList(t.claimantParties,t.tags.claimantParty.tags)}}},[e("i",{staticClass:"el-icon-delete"})]):e("span",{staticStyle:{"margin-left":"24px"}})],1)})),e("h3",{directives:[{name:"show",rawName:"v-show",value:!t.loadingTags,expression:"!loadingTags"}]},[t._v(" "+t._s(t.$tc("fields."+t.pluralizesTerm("claimantLawyer",t.claimantLawyers.length>1),t.isRecovery))+" "),e("a",{on:{click:function(e){return t.addTagList(t.claimantLawyers)}}},[e("i",{staticClass:"el-icon-plus right"})])]),t._l(t.claimantLawyers,(function(a){return e("div",{key:"claimantLawyer"+a,staticClass:"drag-group"},[e("el-collapse",{staticClass:"el-collapse--drag"},[e("el-collapse-item",{attrs:{title:`${t.$tc("fields.claimantLawyer",t.isRecovery)} ${a}`}},t._l(t.tags.claimantLawyer.tags,(function(o){return e("span",{key:`${o.id}-${o.name}`,staticClass:"el-tag--drag-container",class:{"el-tag--drag-active":!t.isMultipleAvailable(o,a)},attrs:{draggable:"true"},on:{dragstart:function(e){if(e.target!==e.currentTarget)return null;t.dragTag(e,JSON.stringify({tag:o,index:a}))}}},[e("el-tag",{staticClass:"el-tag--drag"},[t._v(" "+t._s(t.$tc("fields.claimantLawyer",t.isRecovery))+" "+t._s(a+" - ")+t._s(t._f("capitalize")(t.$t(o.key)))+" ")])],1)})),0)],1),1!==a&&t.claimantLawyers.length===a?e("a",{on:{click:function(e){return t.removeTagList(t.claimantLawyers)}}},[e("i",{staticClass:"el-icon-delete"})]):e("span",{staticStyle:{"margin-left":"24px"}})],1)})),e("h3",{directives:[{name:"show",rawName:"v-show",value:!t.loadingTags,expression:"!loadingTags"}]},[t._v(" "+t._s(t.$tc("fields."+t.pluralizesTerm("respondentParty",t.respondentParties.length>1),t.isRecovery))+" "),e("a",{on:{click:function(e){return t.addTagList(t.respondentParties)}}},[e("i",{staticClass:"el-icon-plus right"})])]),t._l(t.respondentParties,(function(a){return e("div",{key:a,staticClass:"drag-group"},[e("el-collapse",{staticClass:"el-collapse--drag"},[e("el-collapse-item",{attrs:{title:`${t.$tc("fields.respondentParty",t.isRecovery)} ${a}`}},t._l(t.tags.respondentParty.tags,(function(o){return e("span",{key:`${o.id}-${o.name}`,staticClass:"el-tag--drag-container",class:{"el-tag--drag-active":!t.isMultipleAvailable(o,a)},attrs:{draggable:"true"},on:{dragstart:function(e){if(e.target!==e.currentTarget)return null;t.dragTag(e,JSON.stringify({tag:o,index:a}))}}},[e("el-tag",{staticClass:"el-tag--drag"},[t._v(" "+t._s(t.$tc("fields.respondentParty",t.isRecovery))+" "+t._s(a+" - ")+t._s(t._f("capitalize")(t.$t(o.key)))+" ")])],1)})),0)],1),1!==a&&t.respondentParties.length===a?e("a",{on:{click:function(e){return t.removeTagList(t.respondentParties)}}},[e("i",{staticClass:"el-icon-delete"})]):e("span",{staticStyle:{"margin-left":"24px"}})],1)}))],2)],1)],1)},l=[],r=(a(57658),a(90408)),i={name:"ColumnsStep",data(){return{tags:{},disputeTags:[],claimantParties:[],claimantLawyers:[],respondentParties:[],loadingTags:!1,errorColumns:!1,errorTags:!1,loading:!1}},computed:{...(0,r.Se)({isRecovery:"isWorkspaceRecovery"}),columns:{get(){return this.$store.state.importModule.map},set(t){this.$store.commit("setImportsMap",t)}},pluralizesTerm:()=>(t,e)=>({claimantParty:{0:"claimantParty",1:"claimantParties"},claimantLawyer:{0:"claimantLawyer",1:"claimantLawyers"},respondentParty:{0:"respondentParty",1:"respondentParties"},respondentLawyer:{0:"respondentLawyer",1:"respondentLawyers"}}[t][Number(e)])},watch:{loading(t){t||this.loadingTags||this.$store.dispatch("hideLoading")},loadingTags(t){t||this.loading||this.$store.dispatch("hideLoading")}},beforeMount(){this.$store.dispatch("showLoading"),this.$store.state.importModule.map.length||(this.loading=!0,this.$store.dispatch("getImportsColumns").catch((t=>{this.$jusNotification({error:t})})).finally((()=>{this.loading=!1}))),this.loadingTags=!0,this.$store.dispatch("getImportsTags").then((t=>{this.loadingTags=!1,this.tags=t,this.disputeTags=t.dispute.tags,this.claimantParties=Array.from({length:t.claimantParty.rows},((t,e)=>e+1)),this.claimantLawyers=Array.from({length:t.claimantLawyer.rows},((t,e)=>e+1)),this.respondentParties=Array.from({length:t.respondentParty.rows},((t,e)=>e+1))})).catch((t=>{this.$jusNotification({error:t})}))},mounted(){document.querySelector(".jus-main-view__container").setAttribute("class","jus-main-view__container jus-main-view--full-height")},destroyed(){document.querySelector(".jus-main-view__container").setAttribute("class","jus-main-view__container")},methods:{dragTag(t,e){const a=JSON.parse(e);t?.dataTransfer&&t.dataTransfer.setData("data",JSON.stringify({...a,tag:{...a?.tag||{},index:a?.index-1}}))},dropTag(t,e){if(!t?.dataTransfer)return;const a=JSON.parse(t.dataTransfer.getData("data"));this.columns.find((t=>{e.id===t.id&&(t.tag=a.tag,t.index=a.index)})),this.columns=this.columns},removeTag(t){this.columns.find((e=>{e===t&&(e.tag=null,e.index=0)}))},isAvailable(t){let e=!0;return this.columns.find((a=>{if(a.tag){const o=a.tag.id,l=t.id;o===l&&(e=!1)}})),e},isMultipleAvailable(t,e){let a=!0;return this.columns.find((o=>{if(o.tag){const l=o.index?o.index:0,r=o.tag.id,i=t.id;r===i&&l===e&&(a=!1)}})),a},addTagList(t){const e=t.slice(-1)[0];t.push(e+1)},removeTagList(t,e){this.removeLink(t,e),t.splice(-1,1)},removeLink(t,e){const a=t.length-1;this.columns.find((t=>{t.index&&t.index===a&&this.matchTagId(t.tag.id,e)&&(t.tag=null)})),this.columns=this.columns},matchTagId(t,e){let a=!1;return e.find((e=>{t===e.id&&(a=!0)})),a},getColumnTitle(t){let e="";for(const a in this.tags)Object.prototype.hasOwnProperty.call(this.tags,a)&&this.tags[a]&&this.tags[a].tags&&this.tags[a].tags.map((o=>{o.id===t&&(e=a)}));return e}}},n=i,s=(a(28968),a(1001)),c=(0,s.Z)(n,o,l,!1,null,null,null),d=c.exports},80871:function(t,e,a){"use strict";a.r(e);var o=a(87537),l=a.n(o),r=a(23645),i=a.n(r),n=i()(l());n.push([t.id,".columns-step{margin:0 40px}.columns-step .new-import-view__title{margin:0 0 16px}.columns-step .columns-step__container .columns-step__container-column{max-height:60vh;overflow-y:scroll}.columns-step p{height:80px}.columns-step .file-column{margin-bottom:20px}.columns-step .file-column .el-tag{width:100%;display:block}.columns-step .file-column__name{display:flex;justify-content:space-between;margin-bottom:10px}.columns-step .file-column__title{font-size:12px;font-weight:500;color:#979797}.columns-step .file-column__example{color:#0756e4}.columns-step .el-collapse--drag+h3{margin-top:40px}.columns-step .drag-group+h3{margin-top:30px}.columns-step .drag-group{display:flex;align-items:center}.columns-step .drag-group i{margin-left:10px}.columns-step .drag-group .el-collapse-item.is-active{margin-bottom:10px}.columns-step .drag-group+.drag-group{margin-top:20px}.columns-step .el-collapse-item__header{height:100%;line-height:inherit;padding:10px 0;font-size:14px;margin:1px}.columns-step .el-collapse-item__arrow{line-height:20px;margin:0}","",{version:3,sources:["webpack://./src/views/main/import/partials/ColumnsStep.vue","webpack://./node_modules/projuris-acordos-theme/src/common/colors.scss"],names:[],mappings:"AAGA,cACE,aAAA,CAEA,sCACE,eAAA,CAIA,uEACE,eAAA,CACA,iBAAA,CAIJ,gBACE,WAAA,CAGF,2BACE,kBAAA,CACA,mCACE,UAAA,CACA,aAAA,CAGJ,iCACE,YAAA,CACA,6BAAA,CACA,kBAAA,CAEF,kCACE,cAAA,CACA,eAAA,CACA,aC/BW,CDiCb,oCACE,aC3Bc,CD6BhB,oCACE,eAAA,CAEF,6BACE,eAAA,CAEF,0BACE,YAAA,CACA,kBAAA,CACA,4BACE,gBAAA,CAEF,sDACE,kBAAA,CAEF,sCACE,eAAA,CAGJ,wCACE,WAAA,CACA,mBAAA,CACA,cAAA,CACA,cAAA,CACA,UAAA,CAEF,uCACE,gBAAA,CACA,QAAA",sourcesContent:["\n@import '~projuris-acordos-theme/src/common/colors.scss';\n\n.columns-step {\n  margin: 0 40px;\n\n  .new-import-view__title {\n    margin: 0 0 16px;\n  }\n\n  .columns-step__container {\n    .columns-step__container-column {\n      max-height: 60vh;\n      overflow-y: scroll;\n    }\n  }\n\n  p {\n    height: 80px;\n  }\n\n  .file-column {\n    margin-bottom: 20px;\n    .el-tag {\n      width: 100%;\n      display: block;\n    }\n  }\n  .file-column__name {\n    display: flex;\n    justify-content: space-between;\n    margin-bottom: 10px;\n  }\n  .file-column__title {\n    font-size: 12px;\n    font-weight: 500;\n    color: $--color-text-secondary;\n  }\n  .file-column__example {\n    color: $--color-primary;\n  }\n  .el-collapse--drag + h3 {\n    margin-top: 40px;\n  }\n  .drag-group + h3 {\n    margin-top: 30px;\n  }\n  .drag-group {\n    display: flex;\n    align-items: center;\n    i {\n      margin-left: 10px;\n    }\n    .el-collapse-item.is-active {\n      margin-bottom: 10px;\n    }\n    &+.drag-group {\n      margin-top: 20px;\n    }\n  }\n  .el-collapse-item__header {\n    height: 100%;\n    line-height: inherit;\n    padding: 10px 0;\n    font-size: 14px;\n    margin: 1px;\n  }\n  .el-collapse-item__arrow {\n    line-height: 20px;\n    margin: 0;\n  }\n}\n","/* Colors\n-------------------------- */\n\n$--color-white: #fff !default;\n$--color-black: #424242 !default;\n$--color-gray: #979797 !default;\n$--color-gray-light-1: mix($--color-white, $--color-gray, 10%) !default;\n$--color-light-gray: #f3f4f5 !default;\n$--color-whatsapp: #075E54 !default;\n\n$--pj-color-darker-blue: #0A0022 !default;\n$--pj-color-dark-blue: #280BA0 !default;\n$--pj-color-blue: #0756e4 !default;\n$--pj-color-light-blue: #018EF0 !default;\n$--pj-color-lighter-blue: #30A9FB !default;\n$--pj-color-white-blue: #F0F9FE !default;\n$--pj-color-disabled-blue: #9ad2f9 !default;\n\n$-pg-color-overlay: #19415F !default;\n\n$--pj-color-red: #CC4148 !default;\n$--pj-color-light-red: #EC767C !default;\n$--pj-color-disable-red: #FFF2F3 !default;\n\n$--color-primary: $--pj-color-blue !default;\n$--color-primary-light-1: mix($--color-white, $--color-primary, 10%) !default;\n$--color-primary-light-2: mix($--color-white, $--color-primary, 20%) !default;\n$--color-primary-light-3: mix($--color-white, $--color-primary, 30%) !default;\n$--color-primary-light-4: mix($--color-white, $--color-primary, 40%) !default;\n$--color-primary-light-5: mix($--color-white, $--color-primary, 50%) !default;\n$--color-primary-light-6: mix($--color-white, $--color-primary, 60%) !default;\n$--color-primary-light-7: mix($--color-white, $--color-primary, 70%) !default;\n$--color-primary-light-8: mix($--color-white, $--color-primary, 80%) !default;\n$--color-primary-light-9: mix($--color-white, $--color-primary, 90%) !default;\n\n$--color-secondary: $--pj-color-light-blue !default;\n$--color-secondary-light-1: mix($--color-white, $--color-secondary, 10%) !default;\n$--color-secondary-light-2: mix($--color-white, $--color-secondary, 20%) !default;\n$--color-secondary-light-3: mix($--color-white, $--color-secondary, 30%) !default;\n$--color-secondary-light-4: mix($--color-white, $--color-secondary, 40%) !default;\n$--color-secondary-light-5: mix($--color-white, $--color-secondary, 50%) !default;\n$--color-secondary-light-6: mix($--color-white, $--color-secondary, 60%) !default;\n$--color-secondary-light-7: mix($--color-white, $--color-secondary, 70%) !default;\n$--color-secondary-light-8: mix($--color-white, $--color-secondary, 80%) !default;\n$--color-secondary-light-9: mix($--color-white, $--color-secondary, 90%) !default;\n\n$--color-primary-dark: $--pj-color-dark-blue !default;\n$--color-success: #14CC30 !default;\n$--color-warning: #FFC900 !default;\n$--color-danger: #FF4B54 !default;\n$--color-info: #2FBBEC !default;\n\n$--color-success-light-1: mix($--color-white, $--color-success, 10%) !default;\n$--color-success-light-5: mix($--color-white, $--color-success, 50%) !default;\n$--color-warning-light-5: mix($--color-white, $--color-warning, 50%) !default;\n$--color-danger-light-5: mix($--color-white, $--color-danger, 50%) !default;\n$--color-danger-light-3: mix($--color-white, $--color-danger, 30%) !default;\n$--color-info-light-5: mix($--color-white, $--color-info, 50%) !default;\n\n$--color-success-light: mix($--color-white, $--color-success, 80%) !default;\n$--color-warning-light: mix($--color-white, $--color-warning, 80%) !default;\n$--color-danger-light: mix($--color-white, $--color-danger, 80%) !default;\n$--color-info-light: mix($--color-white, $--color-info, 80%) !default;\n\n$--color-success-lighter: mix($--color-white, $--color-success, 90%) !default;\n$--color-warning-lighter: mix($--color-white, $--color-warning, 90%) !default;\n$--color-danger-lighter: mix($--color-white, $--color-danger, 90%) !default;\n$--color-info-lighter: mix($--color-white, $--color-info, 90%) !default;\n\n$--color-text-primary: $--color-black !default;\n$--color-text-secondary: $--color-gray !default;\n\n$--color-nps-promoter: #14CC30 !default;\n$--color-nps-neutral: #979797 !default;\n$--color-nps-detractor: #FF4B54 !default;\n\n$--color-negotiator-bg: #9461f74f !default;\n$--color-email-bg: $--color-info-light !default;\n$--color-whatsapp-bg: $--color-success-light-5 !default;"],sourceRoot:""}]),e["default"]=n},28968:function(t,e,a){var o=a(80871);o.__esModule&&(o=o.default),"string"===typeof o&&(o=[[t.id,o,""]]),o.locals&&(t.exports=o.locals);var l=a(39185).Z;l("4c20e3e6",o,!0,{sourceMap:!0,shadowMode:!1})}}]);
//# sourceMappingURL=3409.js.map