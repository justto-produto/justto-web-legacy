(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[8098],{98098:function(o,r,t){"use strict";t.r(r),t.d(r,{default:function(){return d}});var i=function(){var o=this,r=o._self._c;return r("div",{staticClass:"notification"},[r("el-popover",{attrs:{placement:"bottom",width:"450",trigger:"click","popper-class":"notification-popover"}},[r("NotificationDrawer"),r("div",{staticClass:"notification__icon",attrs:{slot:"reference"},slot:"reference"},[0!==o.qtdNotifications?r("div",{staticClass:"notification__icon__counter el-icon-pulse",domProps:{textContent:o._s(o.qtdNotifications)}}):o._e(),r("i",{staticClass:"el-icon-bell"})])],1)],1)},l=[],e=t(90408),n={components:{NotificationDrawer:()=>t.e(8083).then(t.bind(t,58083))},computed:{...(0,e.Se)({qtdNotifications:"qtdNotifications",workspaceId:"workspaceId",loggedPersonId:"loggedPersonId",hoursDiff:"notificationHoursDiff"})},watch:{hoursDiff(o){o>=3&&this.toggleShowNotifications(!0)}},methods:{...(0,e.OI)({toggleShowNotifications:"toggleShowNotifications"}),...(0,e.nv)(["setNotificationsVisible"]),toggle(){this.$jusSegment("Clique Notificações",{qtdNotifications:this.qtdNotifications}),this.setNotificationsVisible(!0)}}},c=n,a=(t(77296),t(1001)),s=(0,a.Z)(c,i,l,!1,null,"0e9ae474",null),d=s.exports},65111:function(o,r,t){"use strict";t.r(r);var i=t(87537),l=t.n(i),e=t(23645),n=t.n(e),c=n()(l());c.push([o.id,".notification[data-v-0e9ae474]{text-align:center;margin-top:8px}.notification .notification__icon[data-v-0e9ae474]{text-align:center;height:30px;width:30px;border-radius:50px;font-size:25px;color:#5f5d5d;position:relative;cursor:pointer;margin-bottom:10px}.notification .notification__icon .notification__icon__counter[data-v-0e9ae474]{text-align:center;position:absolute;top:0;right:0;margin:-2px -2px 0 0;font-size:12px;background-color:#0756e4;border-radius:50px;padding:2px 6px;color:#fff;font-family:Montserrat,sans-serif!important}","",{version:3,sources:["webpack://./src/components/drawer/NotificationIcon.vue","webpack://./node_modules/projuris-acordos-theme/src/common/colors.scss"],names:[],mappings:"AAGA,+BACE,iBAAA,CACA,cAAA,CAEA,mDACE,iBAAA,CACA,WAAA,CACA,UAAA,CAGA,kBAAA,CACA,cAAA,CACA,aAAA,CACA,iBAAA,CACA,cAAA,CACA,kBAAA,CAEA,gFACE,iBAAA,CACA,iBAAA,CACA,KAAA,CACA,OAAA,CACA,oBAAA,CACA,cAAA,CACA,wBCfY,CDgBZ,kBAAA,CACA,eAAA,CACA,UAAA,CACA,2CAAA",sourcesContent:["\n@import '~projuris-acordos-theme/src/common/colors.scss';\n\n.notification {\n  text-align: center;\n  margin-top: 8px;\n\n  .notification__icon {\n    text-align: center;\n    height: 30px;\n    width: 30px;\n    -moz-border-radius: 50px;\n    -webkit-border-radius: 50px;\n    border-radius: 50px;\n    font-size: 25px;\n    color: rgb(95, 93, 93);\n    position: relative;\n    cursor: pointer;\n    margin-bottom: 10px;\n\n    .notification__icon__counter {\n      text-align: center;\n      position: absolute;\n      top: 0;\n      right: 0;\n      margin: -2px -2px 0 0;\n      font-size: 12px;\n      background-color: $--pj-color-blue;\n      border-radius: 50px;\n      padding: 2px 6px;\n      color: white;\n      font-family: \"Montserrat\", sans-serif !important;\n    }\n  }\n}\n\n","/* Colors\n-------------------------- */\n\n$--color-white: #fff !default;\n$--color-black: #424242 !default;\n$--color-gray: #979797 !default;\n$--color-gray-light-1: mix($--color-white, $--color-gray, 10%) !default;\n$--color-light-gray: #f3f4f5 !default;\n$--color-whatsapp: #075E54 !default;\n\n$--pj-color-darker-blue: #0A0022 !default;\n$--pj-color-dark-blue: #280BA0 !default;\n$--pj-color-blue: #0756e4 !default;\n$--pj-color-light-blue: #018EF0 !default;\n$--pj-color-lighter-blue: #30A9FB !default;\n$--pj-color-white-blue: #F0F9FE !default;\n$--pj-color-disabled-blue: #9ad2f9 !default;\n\n$-pg-color-overlay: #19415F !default;\n\n$--pj-color-red: #CC4148 !default;\n$--pj-color-light-red: #EC767C !default;\n$--pj-color-disable-red: #FFF2F3 !default;\n\n$--color-primary: $--pj-color-blue !default;\n$--color-primary-light-1: mix($--color-white, $--color-primary, 10%) !default;\n$--color-primary-light-2: mix($--color-white, $--color-primary, 20%) !default;\n$--color-primary-light-3: mix($--color-white, $--color-primary, 30%) !default;\n$--color-primary-light-4: mix($--color-white, $--color-primary, 40%) !default;\n$--color-primary-light-5: mix($--color-white, $--color-primary, 50%) !default;\n$--color-primary-light-6: mix($--color-white, $--color-primary, 60%) !default;\n$--color-primary-light-7: mix($--color-white, $--color-primary, 70%) !default;\n$--color-primary-light-8: mix($--color-white, $--color-primary, 80%) !default;\n$--color-primary-light-9: mix($--color-white, $--color-primary, 90%) !default;\n\n$--color-secondary: $--pj-color-light-blue !default;\n$--color-secondary-light-1: mix($--color-white, $--color-secondary, 10%) !default;\n$--color-secondary-light-2: mix($--color-white, $--color-secondary, 20%) !default;\n$--color-secondary-light-3: mix($--color-white, $--color-secondary, 30%) !default;\n$--color-secondary-light-4: mix($--color-white, $--color-secondary, 40%) !default;\n$--color-secondary-light-5: mix($--color-white, $--color-secondary, 50%) !default;\n$--color-secondary-light-6: mix($--color-white, $--color-secondary, 60%) !default;\n$--color-secondary-light-7: mix($--color-white, $--color-secondary, 70%) !default;\n$--color-secondary-light-8: mix($--color-white, $--color-secondary, 80%) !default;\n$--color-secondary-light-9: mix($--color-white, $--color-secondary, 90%) !default;\n\n$--color-primary-dark: $--pj-color-dark-blue !default;\n$--color-success: #14CC30 !default;\n$--color-warning: #FFC900 !default;\n$--color-danger: #FF4B54 !default;\n$--color-info: #2FBBEC !default;\n\n$--color-success-light-1: mix($--color-white, $--color-success, 10%) !default;\n$--color-success-light-5: mix($--color-white, $--color-success, 50%) !default;\n$--color-warning-light-5: mix($--color-white, $--color-warning, 50%) !default;\n$--color-danger-light-5: mix($--color-white, $--color-danger, 50%) !default;\n$--color-danger-light-3: mix($--color-white, $--color-danger, 30%) !default;\n$--color-info-light-5: mix($--color-white, $--color-info, 50%) !default;\n\n$--color-success-light: mix($--color-white, $--color-success, 80%) !default;\n$--color-warning-light: mix($--color-white, $--color-warning, 80%) !default;\n$--color-danger-light: mix($--color-white, $--color-danger, 80%) !default;\n$--color-info-light: mix($--color-white, $--color-info, 80%) !default;\n\n$--color-success-lighter: mix($--color-white, $--color-success, 90%) !default;\n$--color-warning-lighter: mix($--color-white, $--color-warning, 90%) !default;\n$--color-danger-lighter: mix($--color-white, $--color-danger, 90%) !default;\n$--color-info-lighter: mix($--color-white, $--color-info, 90%) !default;\n\n$--color-text-primary: $--color-black !default;\n$--color-text-secondary: $--color-gray !default;\n\n$--color-nps-promoter: #14CC30 !default;\n$--color-nps-neutral: #979797 !default;\n$--color-nps-detractor: #FF4B54 !default;\n\n$--color-negotiator-bg: #9461f74f !default;\n$--color-email-bg: $--color-info-light !default;\n$--color-whatsapp-bg: $--color-success-light-5 !default;"],sourceRoot:""}]),r["default"]=c},77296:function(o,r,t){var i=t(65111);i.__esModule&&(i=i.default),"string"===typeof i&&(i=[[o.id,i,""]]),i.locals&&(o.exports=i.locals);var l=t(39185).Z;l("3c1ecb46",i,!0,{sourceMap:!0,shadowMode:!1})}}]);
//# sourceMappingURL=8098.js.map