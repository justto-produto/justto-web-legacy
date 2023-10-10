(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[200],{70200:function(e,t,o){"use strict";o.r(t),o.d(t,{default:function(){return d}});var a=function(){var e=this,t=e._self._c;return t("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"data-table el-table--disputes",attrs:{"element-loading-text":e.loadingText,data:e.data,size:"mini",height:"100%"}},[t("el-table-column",{attrs:{label:"Data",width:"75"},scopedSlots:e._u([{key:"default",fn:function(o){return[t("span",[e._v(e._s(e._f("moment")(o.row.occurredDate,"DD/MM/YY")))])]}}])}),t("el-table-column",{attrs:{label:"Lançamento"},scopedSlots:e._u([{key:"default",fn:function(o){return[t("span",{domProps:{innerHTML:e._s(e.transactionResume(o.row))}})]}}])}),t("el-table-column",{attrs:{label:"Nota"},scopedSlots:e._u([{key:"default",fn:function(o){return[t("span",[e._v(e._s(e.transactionTableNote(o.row.note,o.row.type)))])]}}])}),t("el-table-column",{attrs:{label:"Tipo",width:"110"},scopedSlots:e._u([{key:"default",fn:function(o){return[t("span",[e._v(e._s(e._f("capitalize")(e.$t(`transactions.${o.row.type}`))))])]}}])}),t("el-table-column",{attrs:{prop:"respondent",label:e.$tc("PARTY_RESPONDENT",e.isWorkspaceRecovery),width:"160"},scopedSlots:e._u([{key:"default",fn:function(o){return[t("span",[e._v(e._s(o.row.respondent||"-"))])]}}])}),t("el-table-column",{attrs:{prop:"code",label:"Processo",width:"130"},scopedSlots:e._u([{key:"default",fn:function(o){return[t("span",[e._v(e._s(o.row.code||"-"))])]}}])}),t("el-table-column",{attrs:{label:"#ID",width:"90"},scopedSlots:e._u([{key:"default",fn:function(o){return[t("span",{staticClass:"data-table__dispute-link"},[t("el-tooltip",{attrs:{disabled:!o.row.disputeArchived,content:"Esta disputa foi excluída"}},[o.row.referenceId?t("el-link",{attrs:{underline:!1,disabled:o.row.disputeArchived,href:e.disputeLink(o.row.referenceId),target:"_blank"}},[e._v(" "+e._s(o.row.referenceId)+" "),o.row.disputeArchived?t("i",{staticClass:"el-icon-warning-outline data-table__dispute-link-icon data-table__dispute-link-icon--alert"}):t("jus-icon",{staticClass:"data-table__dispute-link-icon",attrs:{icon:"external-link"}})],1):t("span",[e._v("-")])],1)],1)]}}])}),t("el-table-column",{attrs:{label:"ID Interno",width:"100"},scopedSlots:e._u([{key:"default",fn:function(o){return[t("span",[e._v(e._s(o.row.externalId||"-"))])]}}])}),t("el-table-column",{attrs:{label:"Valor",width:"120"},scopedSlots:e._u([{key:"default",fn:function(o){return[t("span",[e._v(e._s(e._f("currency")(o.row.value)))])]}}])}),t("el-table-column",{attrs:{"class-name":"data-table__hidden-actions",width:"1px"},scopedSlots:e._u([{key:"default",fn:function(o){return[t("JusFloatActions",{attrs:{actions:e.availableActions,scope:o.row},on:{floatAction:e.floatAction}})]}}])}),t("template",{slot:"empty"},[t("transition",{attrs:{name:"el-fade-in-linear"}},[t("span",{directives:[{name:"show",rawName:"v-show",value:!e.data.lenght,expression:"!data.lenght"}]},[t("jus-icon",{staticClass:"data-table__empty-table",attrs:{icon:"empty-screen-filter"}}),t("h4",{attrs:{"data-testid":"cases-empty-text"}},[e._v(" Nenhum lançamento para exibir. "),t("br"),e._v(" Selecione um tipo de lançamento nos cards acima para visualizar. ")])],1)])],1),e.pagination.totalElements>=20?t("infinite-loading",{attrs:{slot:"append",distance:20,spinner:"spiral","force-use-infinite-wrapper":".el-table__body-wrapper"},on:{infinite:e.infiniteHandler},slot:"append"},[t("div",{attrs:{slot:"no-more"},slot:"no-more"},[e._v(" Fim dos lançamentos ")]),t("div",{attrs:{slot:"no-results"},slot:"no-results"},[e._v(" Fim dos lançamentos ")])]):e._e()],2)},l=[],n=o(90408),r={name:"JusDataTable",components:{InfiniteLoading:()=>o.e(5675).then(o.t.bind(o,35675,23)),JusFloatActions:()=>o.e(6289).then(o.bind(o,86289))},props:{data:{type:Array,required:!0},pagination:{type:Object,required:!1,default:()=>{}},loading:{type:Boolean,default:!1},loadingText:{type:String,default:"Carregando..."}},data(){return{}},computed:{...(0,n.Se)(["isJusttoAdmin","isWorkspaceRecovery"]),availableActions(){return[{icon:"edit",label:"Editar lançamento",trigger:"editTransaction",condition:e=>"MANUAL"===e.type&&this.isJusttoAdmin},{icon:"trash",label:"Cancelar lançamento",trigger:"cancelTransaction",condition:e=>!!e.value&&this.isJusttoAdmin}]}},methods:{floatAction(e){this.$emit("floatAction",e)},transactionResume(e){return this.$options.filters.capitalize(this.$t(`transactions.${e.type}`))+(["MANUAL","SUBSCRIPTION"].includes(e.type)?"":" na disputa #"+e.referenceId+"<br>"+e.code)},transactionTableNote(e,t){return"MANUAL"!==t?"-":e||"-"},disputeLink(e){return`https://acordos.projuris.com.br/#/management/dispute/${e}`},infiniteHandler(e){this.$emit("infiniteHandler",e)}}},i=r,c=(o(92868),o(40035),o(1001)),s=(0,c.Z)(i,a,l,!1,null,"62ee5927",null),d=s.exports},6817:function(e,t,o){"use strict";o.r(t);var a=o(87537),l=o.n(a),n=o(23645),r=o.n(n),i=r()(l());i.push([e.id,".data-table .data-table__dispute-link .data-table__dispute-link-icon[data-v-62ee5927]{display:none;width:16px;margin-left:4px;margin-top:1px}.data-table .data-table__dispute-link .data-table__dispute-link-icon.data-table__dispute-link-icon--alert[data-v-62ee5927]{color:#ff4b54;display:inline;font-size:16px}.data-table .data-table__dispute-link:hover .data-table__dispute-link-icon[data-v-62ee5927]{display:inline}.data-table .data-table__empty-table[data-v-62ee5927]{margin-top:40px;width:60px}","",{version:3,sources:["webpack://./src/components/tables/JusDataTable.vue","webpack://./node_modules/projuris-acordos-theme/src/common/colors.scss"],names:[],mappings:"AAKI,sFACE,YAAA,CACA,UAAA,CACA,eAAA,CACA,cAAA,CAEA,2HACE,aCqCS,CDpCT,cAAA,CACA,cAAA,CAIJ,4FACE,cAAA,CAIJ,sDACE,eAAA,CACA,UAAA",sourcesContent:["\n@import '~projuris-acordos-theme/src/common/colors.scss';\n\n.data-table {\n  .data-table__dispute-link {\n    .data-table__dispute-link-icon {\n      display: none;\n      width: 16px;\n      margin-left: 4px;\n      margin-top: 1px;\n\n      &.data-table__dispute-link-icon--alert {\n        color: $--color-danger;\n        display: inline;\n        font-size: 16px;\n      }\n    }\n\n    &:hover .data-table__dispute-link-icon {\n      display: inline;\n    }\n  }\n\n  .data-table__empty-table {\n    margin-top: 40px;\n    width: 60px;\n  }\n}\n","/* Colors\n-------------------------- */\n\n$--color-white: #fff !default;\n$--color-black: #424242 !default;\n$--color-gray: #979797 !default;\n$--color-gray-light-1: mix($--color-white, $--color-gray, 10%) !default;\n$--color-light-gray: #f3f4f5 !default;\n$--color-whatsapp: #075E54 !default;\n\n$--pj-color-darker-blue: #0A0022 !default;\n$--pj-color-dark-blue: #280BA0 !default;\n$--pj-color-blue: #0756e4 !default;\n$--pj-color-light-blue: #018EF0 !default;\n$--pj-color-lighter-blue: #30A9FB !default;\n$--pj-color-white-blue: #F0F9FE !default;\n$--pj-color-disabled-blue: #9ad2f9 !default;\n\n$-pg-color-overlay: #19415F !default;\n\n$--pj-color-red: #CC4148 !default;\n$--pj-color-light-red: #EC767C !default;\n$--pj-color-disable-red: #FFF2F3 !default;\n\n$--color-primary: $--pj-color-blue !default;\n$--color-primary-light-1: mix($--color-white, $--color-primary, 10%) !default;\n$--color-primary-light-2: mix($--color-white, $--color-primary, 20%) !default;\n$--color-primary-light-3: mix($--color-white, $--color-primary, 30%) !default;\n$--color-primary-light-4: mix($--color-white, $--color-primary, 40%) !default;\n$--color-primary-light-5: mix($--color-white, $--color-primary, 50%) !default;\n$--color-primary-light-6: mix($--color-white, $--color-primary, 60%) !default;\n$--color-primary-light-7: mix($--color-white, $--color-primary, 70%) !default;\n$--color-primary-light-8: mix($--color-white, $--color-primary, 80%) !default;\n$--color-primary-light-9: mix($--color-white, $--color-primary, 90%) !default;\n\n$--color-secondary: $--pj-color-light-blue !default;\n$--color-secondary-light-1: mix($--color-white, $--color-secondary, 10%) !default;\n$--color-secondary-light-2: mix($--color-white, $--color-secondary, 20%) !default;\n$--color-secondary-light-3: mix($--color-white, $--color-secondary, 30%) !default;\n$--color-secondary-light-4: mix($--color-white, $--color-secondary, 40%) !default;\n$--color-secondary-light-5: mix($--color-white, $--color-secondary, 50%) !default;\n$--color-secondary-light-6: mix($--color-white, $--color-secondary, 60%) !default;\n$--color-secondary-light-7: mix($--color-white, $--color-secondary, 70%) !default;\n$--color-secondary-light-8: mix($--color-white, $--color-secondary, 80%) !default;\n$--color-secondary-light-9: mix($--color-white, $--color-secondary, 90%) !default;\n\n$--color-primary-dark: $--pj-color-dark-blue !default;\n$--color-success: #14CC30 !default;\n$--color-warning: #FFC900 !default;\n$--color-danger: #FF4B54 !default;\n$--color-info: #2FBBEC !default;\n\n$--color-success-light-1: mix($--color-white, $--color-success, 10%) !default;\n$--color-success-light-5: mix($--color-white, $--color-success, 50%) !default;\n$--color-warning-light-5: mix($--color-white, $--color-warning, 50%) !default;\n$--color-danger-light-5: mix($--color-white, $--color-danger, 50%) !default;\n$--color-danger-light-3: mix($--color-white, $--color-danger, 30%) !default;\n$--color-info-light-5: mix($--color-white, $--color-info, 50%) !default;\n\n$--color-success-light: mix($--color-white, $--color-success, 80%) !default;\n$--color-warning-light: mix($--color-white, $--color-warning, 80%) !default;\n$--color-danger-light: mix($--color-white, $--color-danger, 80%) !default;\n$--color-info-light: mix($--color-white, $--color-info, 80%) !default;\n\n$--color-success-lighter: mix($--color-white, $--color-success, 90%) !default;\n$--color-warning-lighter: mix($--color-white, $--color-warning, 90%) !default;\n$--color-danger-lighter: mix($--color-white, $--color-danger, 90%) !default;\n$--color-info-lighter: mix($--color-white, $--color-info, 90%) !default;\n\n$--color-text-primary: $--color-black !default;\n$--color-text-secondary: $--color-gray !default;\n\n$--color-nps-promoter: #14CC30 !default;\n$--color-nps-neutral: #979797 !default;\n$--color-nps-detractor: #FF4B54 !default;\n\n$--color-negotiator-bg: #9461f74f !default;\n$--color-email-bg: $--color-info-light !default;\n$--color-whatsapp-bg: $--color-success-light-5 !default;"],sourceRoot:""}]),t["default"]=i},63414:function(e,t,o){"use strict";o.r(t);var a=o(87537),l=o.n(a),n=o(23645),r=o.n(n),i=r()(l());i.push([e.id,".data-table .el-table__row{height:46px}.data-table .el-table__row:hover .data-table__hidden-actions .cell{display:contents}.data-table .data-table__hidden-actions{position:relative}.data-table .data-table__hidden-actions .cell{display:none}.data-table.el-table--disputes .el-table__row{cursor:auto!important}","",{version:3,sources:["webpack://./src/components/tables/JusDataTable.vue"],names:[],mappings:"AAEE,2BACE,WAAA,CAEA,mEACE,gBAAA,CAIJ,wCACE,iBAAA,CAGF,8CACE,YAAA,CAGF,8CACE,qBAAA",sourcesContent:["\n.data-table {\n  .el-table__row {\n    height: 46px;\n\n    &:hover .data-table__hidden-actions .cell {\n      display: contents;\n    }\n  }\n\n  .data-table__hidden-actions {\n    position: relative;\n  }\n\n  .data-table__hidden-actions .cell {\n    display: none;\n  }\n\n  &.el-table--disputes .el-table__row {\n    cursor: initial !important;\n  }\n}\n"],sourceRoot:""}]),t["default"]=i},92868:function(e,t,o){var a=o(6817);a.__esModule&&(a=a.default),"string"===typeof a&&(a=[[e.id,a,""]]),a.locals&&(e.exports=a.locals);var l=o(39185).Z;l("2b0a4906",a,!0,{sourceMap:!0,shadowMode:!1})},40035:function(e,t,o){var a=o(63414);a.__esModule&&(a=a.default),"string"===typeof a&&(a=[[e.id,a,""]]),a.locals&&(e.exports=a.locals);var l=o(39185).Z;l("591b74e0",a,!0,{sourceMap:!0,shadowMode:!1})}}]);
//# sourceMappingURL=200.js.map