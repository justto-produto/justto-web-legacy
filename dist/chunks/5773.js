(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[5773],{75773:function(e,t,i){"use strict";i.r(t),i.d(t,{default:function(){return h}});var n=function(){var e=this,t=e._self._c;return t("header",{staticClass:"tickets-header-container"},[t("el-autocomplete",{ref:"searchInput",staticClass:"tickets-header-container__input",attrs:{min:3,"trigger-on-focus":!1,"fetch-suggestions":e.handleInput,debounce:800,size:"small","prefix-icon":"el-icon-search","popper-class":"tickets-header-container__popover",placeholder:"Busque sua disputa..."},scopedSlots:e._u([{key:"default",fn:function({item:i}){return[i.id?t("JusDisputeResume",{attrs:{dispute:i},on:{click:e.goToTicket}}):t("span",[e._v(" Não foram encontradas disputas para esta busca. ")])]}}]),model:{value:e.searchTerm,callback:function(t){e.searchTerm=t},expression:"searchTerm"}}),["ticket","negotiation"].includes(e.$route.name)&&"MANAGEMENT"!==e.ticketListMode&&!e.isToHideTickets?t("TicketsFilters",{attrs:{"active-tab":e.activeTab},on:{"ticket:getDisputes":function(t){return e.$emit("ticket:getDisputes")}}}):e._e()],1)},s=[],a=(i(57658),i(32715)),r=i(40917),c=i(90408),o={name:"TicketsHeader",components:{TicketsFilters:()=>i.e(4903).then(i.bind(i,34903)),JusDisputeResume:()=>i.e(3467).then(i.bind(i,43467))},props:{targetPath:{type:String,default:"management/dispute"}},data:()=>({searchTerm:"",debounce:null}),computed:{...(0,c.Se)({ticketListMode:"getTicketListMode",isToHideTickets:"isToHideTickets",activeTab:"getTicketsActiveTab"}),showFilters(){return(this.$route?.fullPath||"").includes("/negotiation")}},beforeMount(){this.getPrescriptions()},mounted(){r.YB.$on(a["default"].SEARCH_FOCUS.callback,this.focusOnSearch)},beforeDestroy(){r.YB.$off(a["default"].SEARCH_FOCUS.callback,this.focusOnSearch)},methods:{...(0,c.nv)(["searchDisputes","getPrescriptions"]),handleInput(e,t){e.trim().length?(clearTimeout(this.debounce),this.debounce=setTimeout((()=>{this.searchDisputes({key:"term",value:e.trim()}).then((i=>{this.$jusSegment("Busca global de disputas",{description:`Termo utilizado: ${e}`}),i.length?t(i):t([{}])}))}),800)):t([{}])},goToTicket({disputeId:e}){"dispute"===this.$route.name?(this.$router.push(`/${this.targetPath}/${e}`),window.location.reload(!1)):this.$router.push(`/${this.targetPath}/${e}`)},focusOnSearch(){this.$refs.searchInput&&this.$refs.searchInput.focus()}}},u=o,d=(i(4530),i(50559),i(1001)),p=(0,d.Z)(u,n,s,!1,null,"3b3c8520",null),h=p.exports},75979:function(e,t,i){"use strict";i.r(t);var n=i(87537),s=i.n(n),a=i(23645),r=i.n(a),c=r()(s());c.push([e.id,".tickets-header-container[data-v-3b3c8520]{padding:0;display:flex;align-items:center}.tickets-header-container .tickets-header-container__input[data-v-3b3c8520]{padding:12px;width:100%}@media(max-height:900px){.tickets-header-container .tickets-header-container__input[data-v-3b3c8520]{padding:8px}}","",{version:3,sources:["webpack://./src/views/main/negotiation/partials/tickets/TicketsHeader.vue"],names:[],mappings:"AAGA,2CACE,SAAA,CACA,YAAA,CACA,kBAAA,CAEA,4EACE,YAAA,CACA,UAAA,CAIJ,yBAEI,4EACE,WAAA,CAAA",sourcesContent:["\n@import '~projuris-acordos-theme/src/common/colors.scss';\n\n.tickets-header-container {\n  padding: 0;\n  display: flex;\n  align-items: center;\n\n  .tickets-header-container__input {\n    padding: 12px;\n    width: 100%;\n  }\n}\n\n@media (max-height: 900px) {\n  .tickets-header-container {\n    .tickets-header-container__input {\n      padding: 8px;\n    }\n  }\n}\n"],sourceRoot:""}]),t["default"]=c},3367:function(e,t,i){"use strict";i.r(t);var n=i(87537),s=i.n(n),a=i(23645),r=i.n(a),c=r()(s());c.push([e.id,".tickets-header-container__popover{width:calc(100% - 132px)!important}.tickets-header-container .tickets-header-container__input .el-input__inner{border:none!important}@media(max-width:900px){.tickets-header-container__popover{width:calc(100% - 24px)!important}}","",{version:3,sources:["webpack://./src/views/main/negotiation/partials/tickets/TicketsHeader.vue"],names:[],mappings:"AACA,mCACE,kCAAA,CAKE,4EACE,qBAAA,CAIN,wBACE,mCACE,iCAAA,CAAA",sourcesContent:["\n.tickets-header-container__popover {\n  width: calc(100% - ((48px + 18px) * 2)) !important;\n}\n\n.tickets-header-container {\n  .tickets-header-container__input {\n    .el-input__inner {\n      border: none !important;\n    }\n  }\n}\n@media (max-width: 900px) {\n  .tickets-header-container__popover {\n    width: calc(100% - (12px * 2)) !important;\n  }\n}\n"],sourceRoot:""}]),t["default"]=c},4530:function(e,t,i){var n=i(75979);n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[e.id,n,""]]),n.locals&&(e.exports=n.locals);var s=i(39185).Z;s("68c17f36",n,!0,{sourceMap:!0,shadowMode:!1})},50559:function(e,t,i){var n=i(3367);n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[e.id,n,""]]),n.locals&&(e.exports=n.locals);var s=i(39185).Z;s("20b992ec",n,!0,{sourceMap:!0,shadowMode:!1})}}]);
//# sourceMappingURL=5773.js.map