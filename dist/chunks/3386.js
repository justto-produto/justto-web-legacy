(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[3386],{33386:function(o,i,t){"use strict";t.r(i),t.d(i,{default:function(){return f}});var r=function(){var o=this,i=o._self._c;return i("article",{staticClass:"notification__drawer__list-item",class:{"notification__drawer__list-item-pendent":!o.notification.readDate}},[i("span",{staticClass:"notification__drawer__list-item-name",on:{click:function(i){return o.$emit("openMention",o.notification)}}},[i("div",{class:{"justtine-notification":null===o.notification.fromAccountId}},[null===o.notification.fromAccountId?i("span",[i("jus-avatar-user",{attrs:{name:"Justtine",src:o.justtineUrl,purple:!1,shape:"circle",size:"sm"}})],1):o._e(),o._v(" "+o._s(o._f("resumedName")(o.getMemberName(o.notification.fromAccountId)))+" citou você na disputa "+o._s(`#${o.notification.disputeId}`)+". ")])]),i("span",{staticClass:"notification__drawer__list-item-date"},[o._v(" "+o._s(o.parseDate(o.notification.createdAt))+" ")]),i("el-tooltip",{attrs:{"open-delay":500,content:"Marcar como lida",placement:"bottom-start"}},[o.notification.readDate?o._e():i("div",{staticClass:"notification__drawer__list-item-status el-icon-pulse",on:{click:function(i){return o.$emit("setReaded",o.notification.id)}}})])],1)},n=[],e=t(90408),a=t(40917),l={props:{notification:{type:Object,required:!0}},computed:{...(0,e.Se)({members:"workspaceMembers"}),justtineUrl(){return t(63849)},getMemberName(){return o=>{if(null===o)return"JUSTTINE";const i=this.members.find((({accountId:i})=>Number(i)===Number(o)));return i?.person?.name||i?.accountEmail||""}},parseDate(){return o=>(0,a.sU)(o)}}},c=l,s=(t(53156),t(1001)),d=(0,s.Z)(c,r,n,!1,null,null,null),f=d.exports},9607:function(o,i,t){"use strict";t.r(i);var r=t(87537),n=t.n(r),e=t(23645),a=t.n(e),l=a()(n());l.push([o.id,".notification__drawer__list-item{padding:8px 2%;border-radius:4px;display:flex;justify-content:space-between!important;align-items:center;flex-flow:row wrap!important;gap:0 8px!important}.notification__drawer__list-item .notification__drawer__list-item-name{display:flex;align-items:center;gap:4px;flex-wrap:nowrap;color:#979797;width:100%;word-break:break-word}.notification__drawer__list-item .notification__drawer__list-item-name *{flex-wrap:nowrap}.notification__drawer__list-item .notification__drawer__list-item-name .justtine-notification{display:flex;align-items:center;gap:8px}.notification__drawer__list-item .notification__drawer__list-item-name .justtine-notification span .jus-avatar-user img{width:24px}.notification__drawer__list-item .notification__drawer__list-item-name .jus-avatar-user{width:24px;height:24px;font-size:10px}.notification__drawer__list-item .notification__drawer__list-item-name .jus-avatar-user img{width:24px;height:24px}.notification__drawer__list-item.notification__drawer__list-item-pendent .notification__drawer__list-item-name{color:#424242}.notification__drawer__list-item.notification__drawer__list-item-pendent .notification__drawer__list-item-name div{font-weight:700}.notification__drawer__list-item .notification__drawer__list-item-status{background-color:#0756e4;width:8px;height:8px;border-radius:50%}.notification__drawer__list-item:hover{background-color:#f3f4f5}.notification__drawer__list-item .notification__drawer__list-item-icon{display:flex;align-items:center;justify-content:center;margin-right:12px}.notification__drawer__list-item .notification__drawer__list-item-icon .el-icon-success{color:#14cc30}.notification__drawer__list-item .notification__drawer__list-item-label-gray{font-size:14px;color:#979797}.notification__drawer__list-item .notification__drawer__list-item-label-black{color:#424242;font-size:14px;font-weight:500}","",{version:3,sources:["webpack://./src/components/drawer/partials/SimpleNotification.vue","webpack://./node_modules/projuris-acordos-theme/src/common/colors.scss"],names:[],mappings:"AAGA,iCACE,cAAA,CACA,iBAAA,CACA,YAAA,CACA,uCAAA,CACA,kBAAA,CACA,4BAAA,CACA,mBAAA,CAEA,uEACE,YAAA,CACA,kBAAA,CACA,OAAA,CACA,gBAAA,CACA,aCZW,CDaX,UAAA,CACA,qBAAA,CAEA,yEACE,gBAAA,CAGF,8FACE,YAAA,CACA,kBAAA,CACA,OAAA,CAII,wHACE,UAAA,CAOR,wFACE,UAAA,CACA,WAAA,CACA,cAAA,CAEA,4FACE,UAAA,CACA,WAAA,CAMJ,+GACE,aClDU,CDoDV,mHACE,eAAA,CAKN,yEACE,wBCnDc,CDoDd,SAAA,CACA,UAAA,CACA,iBAAA,CAGF,uCACE,wBC/DiB,CDkEnB,uEACE,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,iBAAA,CAEA,wFACE,aCjCY,CDqChB,6EACE,cAAA,CACA,aCjFW,CDoFb,8EACE,aCtFY,CDuFZ,cAAA,CACA,eAAA",sourcesContent:["\n@import '~projuris-acordos-theme/src/common/colors.scss';\n\n.notification__drawer__list-item {\n  padding: 8px 2%;\n  border-radius: 4px;\n  display: flex;\n  justify-content: space-between !important;\n  align-items: center;\n  flex-flow: row wrap !important;\n  gap: 0 8px !important;\n\n  .notification__drawer__list-item-name {\n    display: flex;\n    align-items: center;\n    gap: 4px;\n    flex-wrap: nowrap;\n    color: $--color-text-secondary;\n    width: 100%;\n    word-break: break-word;\n\n    * {\n      flex-wrap: nowrap;\n    }\n\n    .justtine-notification {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n\n      span {\n        .jus-avatar-user {\n          img {\n            width: 24px;\n          }\n        }\n      }\n\n    }\n\n    .jus-avatar-user {\n      width: 24px;\n      height: 24px;\n      font-size: 10px;\n\n      img {\n        width: 24px;\n        height: 24px;\n      }\n    }\n  }\n\n  &.notification__drawer__list-item-pendent {\n    .notification__drawer__list-item-name {\n      color: $--color-black;\n\n      div {\n        font-weight: bold;\n      }\n    }\n  }\n\n  .notification__drawer__list-item-status {\n    background-color: $--color-primary;\n    width: 8px;\n    height: 8px;\n    border-radius: 50%;\n  }\n\n  &:hover {\n    background-color: $--color-light-gray;\n  }\n\n  .notification__drawer__list-item-icon {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    margin-right: 12px;\n\n    .el-icon-success {\n      color: $--color-success;\n    }\n  }\n\n  .notification__drawer__list-item-label-gray {\n    font-size: 14px;\n    color: $--color-gray;\n  }\n\n  .notification__drawer__list-item-label-black {\n    color: $--color-black;\n    font-size: 14px;\n    font-weight: 500;\n  }\n}\n","/* Colors\n-------------------------- */\n\n$--color-white: #fff !default;\n$--color-black: #424242 !default;\n$--color-gray: #979797 !default;\n$--color-gray-light-1: mix($--color-white, $--color-gray, 10%) !default;\n$--color-light-gray: #f3f4f5 !default;\n$--color-whatsapp: #075E54 !default;\n\n$--pj-color-darker-blue: #0A0022 !default;\n$--pj-color-dark-blue: #280BA0 !default;\n$--pj-color-blue: #0756e4 !default;\n$--pj-color-light-blue: #018EF0 !default;\n$--pj-color-lighter-blue: #30A9FB !default;\n$--pj-color-white-blue: #F0F9FE !default;\n$--pj-color-disabled-blue: #9ad2f9 !default;\n\n$-pg-color-overlay: #19415F !default;\n\n$--pj-color-red: #CC4148 !default;\n$--pj-color-light-red: #EC767C !default;\n$--pj-color-disable-red: #FFF2F3 !default;\n\n$--color-primary: $--pj-color-blue !default;\n$--color-primary-light-1: mix($--color-white, $--color-primary, 10%) !default;\n$--color-primary-light-2: mix($--color-white, $--color-primary, 20%) !default;\n$--color-primary-light-3: mix($--color-white, $--color-primary, 30%) !default;\n$--color-primary-light-4: mix($--color-white, $--color-primary, 40%) !default;\n$--color-primary-light-5: mix($--color-white, $--color-primary, 50%) !default;\n$--color-primary-light-6: mix($--color-white, $--color-primary, 60%) !default;\n$--color-primary-light-7: mix($--color-white, $--color-primary, 70%) !default;\n$--color-primary-light-8: mix($--color-white, $--color-primary, 80%) !default;\n$--color-primary-light-9: mix($--color-white, $--color-primary, 90%) !default;\n\n$--color-secondary: $--pj-color-light-blue !default;\n$--color-secondary-light-1: mix($--color-white, $--color-secondary, 10%) !default;\n$--color-secondary-light-2: mix($--color-white, $--color-secondary, 20%) !default;\n$--color-secondary-light-3: mix($--color-white, $--color-secondary, 30%) !default;\n$--color-secondary-light-4: mix($--color-white, $--color-secondary, 40%) !default;\n$--color-secondary-light-5: mix($--color-white, $--color-secondary, 50%) !default;\n$--color-secondary-light-6: mix($--color-white, $--color-secondary, 60%) !default;\n$--color-secondary-light-7: mix($--color-white, $--color-secondary, 70%) !default;\n$--color-secondary-light-8: mix($--color-white, $--color-secondary, 80%) !default;\n$--color-secondary-light-9: mix($--color-white, $--color-secondary, 90%) !default;\n\n$--color-primary-dark: $--pj-color-dark-blue !default;\n$--color-success: #14CC30 !default;\n$--color-warning: #FFC900 !default;\n$--color-danger: #FF4B54 !default;\n$--color-info: #2FBBEC !default;\n\n$--color-success-light-1: mix($--color-white, $--color-success, 10%) !default;\n$--color-success-light-5: mix($--color-white, $--color-success, 50%) !default;\n$--color-warning-light-5: mix($--color-white, $--color-warning, 50%) !default;\n$--color-danger-light-5: mix($--color-white, $--color-danger, 50%) !default;\n$--color-danger-light-3: mix($--color-white, $--color-danger, 30%) !default;\n$--color-info-light-5: mix($--color-white, $--color-info, 50%) !default;\n\n$--color-success-light: mix($--color-white, $--color-success, 80%) !default;\n$--color-warning-light: mix($--color-white, $--color-warning, 80%) !default;\n$--color-danger-light: mix($--color-white, $--color-danger, 80%) !default;\n$--color-info-light: mix($--color-white, $--color-info, 80%) !default;\n\n$--color-success-lighter: mix($--color-white, $--color-success, 90%) !default;\n$--color-warning-lighter: mix($--color-white, $--color-warning, 90%) !default;\n$--color-danger-lighter: mix($--color-white, $--color-danger, 90%) !default;\n$--color-info-lighter: mix($--color-white, $--color-info, 90%) !default;\n\n$--color-text-primary: $--color-black !default;\n$--color-text-secondary: $--color-gray !default;\n\n$--color-nps-promoter: #14CC30 !default;\n$--color-nps-neutral: #979797 !default;\n$--color-nps-detractor: #FF4B54 !default;\n\n$--color-negotiator-bg: #9461f74f !default;\n$--color-email-bg: $--color-info-light !default;\n$--color-whatsapp-bg: $--color-success-light-5 !default;"],sourceRoot:""}]),i["default"]=l},53156:function(o,i,t){var r=t(9607);r.__esModule&&(r=r.default),"string"===typeof r&&(r=[[o.id,r,""]]),r.locals&&(o.exports=r.locals);var n=t(39185).Z;n("5b5be248",r,!0,{sourceMap:!0,shadowMode:!1})}}]);
//# sourceMappingURL=3386.js.map