(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[9290],{99290:function(e,t,o){"use strict";o.r(t),o.d(t,{default:function(){return s}});o(57658);var i=function(){var e=this,t=e._self._c;return t("section",{staticClass:"ticket-header-container",class:{"dispute-mode":e.isInDispute},attrs:{id:"headerTicketNegotiation"}},[e.isInDispute?t("router-link",{staticClass:"ticket-header-container__back",attrs:{to:"/management"}},[t("i",{staticClass:"el-icon-back"})]):t("article",{staticClass:"ticket-header-container__title"},[t("div",{staticClass:"ticket-header-container__process-code"},[t("el-tooltip",{staticClass:"mr8",attrs:{content:"Fechar fechar"}},[t("el-button",{attrs:{type:"text"},on:{click:function(t){return e.$router.push({name:"negotiation"})}}},[t("i",{staticClass:"el-icon-back"})])],1),t("span",[e._v("Processo: ")]),t("TicketCode",{staticClass:"ticket-header-container__process-link",attrs:{code:e.ticket.code,"get-befor-mount":""}})],1),t("div",{staticClass:"ticket-header-container__overview-link",on:{click:e.handleShowOverview}},[t("span",{staticClass:"ticket-header-container__additional-info"},[e._v("Informações adicionais")]),t("i",{staticClass:"ticket-header-container__additional-info-icon el-icon-arrow-right"})])]),t("TicketActions",{staticClass:"ticket-header-container__actions",attrs:{ticket:e.ticket,"is-in-dispute":e.isInDispute}}),e.isOverviewActive?e._e():t("Dialer",{staticClass:"ticket-header-container__dialer"}),e.isInDispute?t("div",{staticClass:"ticket-header-container__hide-overview"},[t("i",{class:{"el-icon-arrow-right":!e.isCollapsed,"el-icon-arrow-left":e.isCollapsed},on:{click:e.handleShowOverview}})]):e._e()],1)},r=[],n=o(90408),a={name:"TicketHeader",components:{TicketCode:()=>o.e(740).then(o.bind(o,740)),TicketActions:()=>o.e(173).then(o.bind(o,40173)),Dialer:()=>o.e(989).then(o.bind(o,20989))},props:{showOverview:{type:Boolean,default:!1},isInDispute:{type:Boolean,default:!1},isCollapsed:{type:Boolean,default:!1}},computed:{...(0,n.Se)({ticket:"getTicketOverview",innerWidth:"getWindowWidth"}),isOverviewActive(){return this.innerWidth>1200?!this.showOverview:this.showOverview}},methods:{handleShowOverview(){this.$emit("toggle-show-overview"),this.$emit("update:is-collapsed",!this.isCollapsed)}}},c=a,l=(o(5588),o(1001)),d=(0,l.Z)(c,i,r,!1,null,"16bc61d0",null),s=d.exports},83815:function(e,t,o){"use strict";o.r(t);var i=o(87537),r=o.n(i),n=o(23645),a=o.n(n),c=a()(r());c.push([e.id,".ticket-header-container[data-v-16bc61d0]{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;height:auto;background-color:#fff}.ticket-header-container .ticket-header-container__title[data-v-16bc61d0]{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;font-weight:600;color:#424242;font-size:18px}.ticket-header-container .ticket-header-container__title .ticket-header-container__overview-link[data-v-16bc61d0]{display:none}.ticket-header-container .ticket-header-container__dialer[data-v-16bc61d0]{border-radius:6px;padding:8px;margin-left:8px;border:thin solid #d3d3d3;cursor:pointer}.ticket-header-container .ticket-header-container__back[data-v-16bc61d0],.ticket-header-container .ticket-header-container__hide-overview[data-v-16bc61d0]{cursor:pointer}.ticket-header-container .ticket-header-container__back i[data-v-16bc61d0],.ticket-header-container .ticket-header-container__hide-overview i[data-v-16bc61d0]{font-size:24px;margin-left:8px;color:#424242}.ticket-header-container.dispute-mode[data-v-16bc61d0]{justify-content:flex-start;gap:8px}.ticket-header-container.dispute-mode .ticket-header-container__hide-overview[data-v-16bc61d0]{margin-left:auto}@media(max-height:900px){.ticket-header-container[data-v-16bc61d0]{padding:8px 12px}.ticket-header-container .ticket-header-container__title[data-v-16bc61d0]{font-size:16px}}@media(max-width:1200px){.ticket-header-container .ticket-header-container__title[data-v-16bc61d0]{font-size:14px}.ticket-header-container .ticket-header-container__title .ticket-header-container__process-code[data-v-16bc61d0]{margin-bottom:6px}.ticket-header-container .ticket-header-container__title .ticket-header-container__process-code .ticket-header-container__process-link[data-v-16bc61d0]{font-size:13px}.ticket-header-container .ticket-header-container__title .ticket-header-container__overview-link[data-v-16bc61d0]{color:#0756e4;display:flex;align-items:center}.ticket-header-container .ticket-header-container__title .ticket-header-container__overview-link .ticket-header-container__additional-info[data-v-16bc61d0]{text-decoration:underline}.ticket-header-container .ticket-header-container__title .ticket-header-container__overview-link .ticket-header-container__additional-info-icon[data-v-16bc61d0]{font-size:16px;margin-top:2px}.ticket-header-container .ticket-header-container__title .ticket-header-container__overview-link[data-v-16bc61d0]:hover{cursor:pointer;color:#2067e7}}","",{version:3,sources:["webpack://./src/views/main/negotiation/partials/ticket/TicketHeader.vue","webpack://./node_modules/projuris-acordos-theme/src/common/colors.scss"],names:[],mappings:"AAGA,0CACE,YAAA,CACA,6BAAA,CACA,kBAAA,CACA,gBAAA,CACA,WAAA,CACA,qBCNc,CDQd,0EACE,MAAA,CACA,YAAA,CACA,qBAAA,CACA,sBAAA,CACA,sBAAA,CACA,eAAA,CACA,aCdY,CDeZ,cAAA,CAEA,kHACE,YAAA,CAIJ,2EACE,iBAAA,CACA,WAAA,CACA,eAAA,CACA,yBAAA,CACA,cAAA,CAGF,2JAEE,cAAA,CAEA,+JACE,cAAA,CACA,eAAA,CACA,aCrCU,CDyCd,uDACE,0BAAA,CACA,OAAA,CAEA,+FACE,gBAAA,CAKN,yBACE,0CACE,gBAAA,CAEA,0EACA,cAAA,CAAA,CAKJ,yBAEI,0EACE,cAAA,CAEA,iHACE,iBAAA,CAEA,wJACE,cAAA,CAIJ,kHACE,aCnEU,CDoEV,YAAA,CACA,kBAAA,CAEA,4JACE,yBAAA,CAGF,iKACE,cAAA,CACA,cAAA,CAGF,wHACE,cAAA,CACA,aCrEgB,CAAA",sourcesContent:["\n@import '~projuris-acordos-theme/src/common/colors.scss';\n\n.ticket-header-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 8px 12px;\n  height: auto;\n  background-color: $--color-white;\n\n  .ticket-header-container__title {\n    flex: 1;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: flex-start;\n    font-weight: 600;\n    color: $--color-text-primary;\n    font-size: 18px;\n\n    .ticket-header-container__overview-link {\n      display: none;\n    }\n  }\n\n  .ticket-header-container__dialer {\n    border-radius: 6px;\n    padding: 8px;\n    margin-left: 8px;\n    border: solid lightgray thin;\n    cursor: pointer;\n  }\n\n  .ticket-header-container__hide-overview,\n  .ticket-header-container__back {\n    cursor: pointer;\n\n    i {\n      font-size: 24px;\n      margin-left: 8px;\n      color: $--color-black;\n    }\n  }\n\n  &.dispute-mode {\n    justify-content: flex-start;\n    gap: 8px;\n\n    .ticket-header-container__hide-overview {\n      margin-left: auto;\n    }\n  }\n}\n\n@media (max-height: 900px) {\n  .ticket-header-container {\n    padding: 8px 12px;\n\n    .ticket-header-container__title {\n    font-size: 16px;\n    }\n  }\n}\n\n@media (max-width: 1200px) {\n  .ticket-header-container {\n    .ticket-header-container__title {\n      font-size: 14px;\n\n      .ticket-header-container__process-code {\n        margin-bottom: 6px;\n\n        .ticket-header-container__process-link {\n          font-size: 13px;\n        }\n      }\n\n      .ticket-header-container__overview-link {\n        color: $--color-primary;\n        display: flex;\n        align-items: center;\n\n        .ticket-header-container__additional-info {\n          text-decoration: underline;\n        }\n\n        .ticket-header-container__additional-info-icon {\n          font-size: 16px;\n          margin-top: 2px;\n        }\n\n        &:hover {\n          cursor: pointer;\n          color: $--color-primary-light-1;\n        }\n      }\n    }\n  }\n}\n","/* Colors\n-------------------------- */\n\n$--color-white: #fff !default;\n$--color-black: #424242 !default;\n$--color-gray: #979797 !default;\n$--color-gray-light-1: mix($--color-white, $--color-gray, 10%) !default;\n$--color-light-gray: #f3f4f5 !default;\n$--color-whatsapp: #075E54 !default;\n\n$--pj-color-darker-blue: #0A0022 !default;\n$--pj-color-dark-blue: #280BA0 !default;\n$--pj-color-blue: #0756e4 !default;\n$--pj-color-light-blue: #018EF0 !default;\n$--pj-color-lighter-blue: #30A9FB !default;\n$--pj-color-white-blue: #F0F9FE !default;\n$--pj-color-disabled-blue: #9ad2f9 !default;\n\n$-pg-color-overlay: #19415F !default;\n\n$--pj-color-red: #CC4148 !default;\n$--pj-color-light-red: #EC767C !default;\n$--pj-color-disable-red: #FFF2F3 !default;\n\n$--color-primary: $--pj-color-blue !default;\n$--color-primary-light-1: mix($--color-white, $--color-primary, 10%) !default;\n$--color-primary-light-2: mix($--color-white, $--color-primary, 20%) !default;\n$--color-primary-light-3: mix($--color-white, $--color-primary, 30%) !default;\n$--color-primary-light-4: mix($--color-white, $--color-primary, 40%) !default;\n$--color-primary-light-5: mix($--color-white, $--color-primary, 50%) !default;\n$--color-primary-light-6: mix($--color-white, $--color-primary, 60%) !default;\n$--color-primary-light-7: mix($--color-white, $--color-primary, 70%) !default;\n$--color-primary-light-8: mix($--color-white, $--color-primary, 80%) !default;\n$--color-primary-light-9: mix($--color-white, $--color-primary, 90%) !default;\n\n$--color-secondary: $--pj-color-light-blue !default;\n$--color-secondary-light-1: mix($--color-white, $--color-secondary, 10%) !default;\n$--color-secondary-light-2: mix($--color-white, $--color-secondary, 20%) !default;\n$--color-secondary-light-3: mix($--color-white, $--color-secondary, 30%) !default;\n$--color-secondary-light-4: mix($--color-white, $--color-secondary, 40%) !default;\n$--color-secondary-light-5: mix($--color-white, $--color-secondary, 50%) !default;\n$--color-secondary-light-6: mix($--color-white, $--color-secondary, 60%) !default;\n$--color-secondary-light-7: mix($--color-white, $--color-secondary, 70%) !default;\n$--color-secondary-light-8: mix($--color-white, $--color-secondary, 80%) !default;\n$--color-secondary-light-9: mix($--color-white, $--color-secondary, 90%) !default;\n\n$--color-primary-dark: $--pj-color-dark-blue !default;\n$--color-success: #14CC30 !default;\n$--color-warning: #FFC900 !default;\n$--color-danger: #FF4B54 !default;\n$--color-info: #2FBBEC !default;\n\n$--color-success-light-1: mix($--color-white, $--color-success, 10%) !default;\n$--color-success-light-5: mix($--color-white, $--color-success, 50%) !default;\n$--color-warning-light-5: mix($--color-white, $--color-warning, 50%) !default;\n$--color-danger-light-5: mix($--color-white, $--color-danger, 50%) !default;\n$--color-danger-light-3: mix($--color-white, $--color-danger, 30%) !default;\n$--color-info-light-5: mix($--color-white, $--color-info, 50%) !default;\n\n$--color-success-light: mix($--color-white, $--color-success, 80%) !default;\n$--color-warning-light: mix($--color-white, $--color-warning, 80%) !default;\n$--color-danger-light: mix($--color-white, $--color-danger, 80%) !default;\n$--color-info-light: mix($--color-white, $--color-info, 80%) !default;\n\n$--color-success-lighter: mix($--color-white, $--color-success, 90%) !default;\n$--color-warning-lighter: mix($--color-white, $--color-warning, 90%) !default;\n$--color-danger-lighter: mix($--color-white, $--color-danger, 90%) !default;\n$--color-info-lighter: mix($--color-white, $--color-info, 90%) !default;\n\n$--color-text-primary: $--color-black !default;\n$--color-text-secondary: $--color-gray !default;\n\n$--color-nps-promoter: #14CC30 !default;\n$--color-nps-neutral: #979797 !default;\n$--color-nps-detractor: #FF4B54 !default;\n\n$--color-negotiator-bg: #9461f74f !default;\n$--color-email-bg: $--color-info-light !default;\n$--color-whatsapp-bg: $--color-success-light-5 !default;"],sourceRoot:""}]),t["default"]=c},5588:function(e,t,o){var i=o(83815);i.__esModule&&(i=i.default),"string"===typeof i&&(i=[[e.id,i,""]]),i.locals&&(e.exports=i.locals);var r=o(39185).Z;r("2248beb8",i,!0,{sourceMap:!0,shadowMode:!1})}}]);
//# sourceMappingURL=9290.js.map