(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[4379],{64379:function(r,e,o){"use strict";o.r(e),o.d(e,{default:function(){return d}});var a=function(){var r=this,e=r._self._c;return e("div",{staticClass:"chart-card-view"},[e("el-row",{ref:"chartViewRow"},r._l(r.datasets,(function(o){return e("el-col",{key:o.label,style:`width: ${o.width}%; height: ${r.cardheight}%`},[e("el-card",{staticClass:"chart-card-view__card",class:{center:o.isGraph},style:`background: ${o.color};`,attrs:{id:o.label,shadow:"never"}},[o.isGraph?r._e():e("div",{class:"chart-card-view__icon "+o.label},[e("jus-icon",{attrs:{icon:o.icon}})],1),e("el-tooltip",{attrs:{content:"Valor referente a todo o período desse time"}},[o.isGraph?e("div",{staticClass:"chart-card-view__info",class:{"dark-text":o.labelDark}},[e("el-progress",{attrs:{type:"dashboard",width:r.npsWidth,color:r.colors,percentage:r._f("calcNps")(o.data[0]),format:r=>`${o.data[0]}`}}),e("span",{staticClass:"progress-label"},[r._v(" nps ")])],1):e("div",{staticClass:"chart-card-view__info",class:{"dark-text":o.labelDark}},[e("span",{staticClass:"chart-card-view__label"},[r._v(" "+r._s(r._f("capitalize")(r.$t("dashboard."+o.label)))+" ")]),e("span",{staticClass:"chart-card-view__value"},[o.isPercentage?e("span",[r._v(" "+r._s(r._f("number")(o.data[0]))+"% ")]):e("span",[r._v(" "+r._s(r._f("currency")(o.data[0]))+" ")]),o.savingsPercentage?e("span",[r._v("("+r._s(o.savingsPercentage)+"%)")]):r._e()])])])],1)],1)})),1)],1)},t=[],l={name:"JusChartCard",filters:{calcNps:r=>parseInt((r+100)/2)},props:{data:{type:Object,default:()=>{}}},computed:{datasets(){return this.data&&this.data.datasets?this.data.datasets.filter((r=>"SAVINGS_PERCENTAGE"!==r.label)).map((r=>{switch(r.label){case"NPS_PROMOTER_PERCENTAGE":r.icon="nps-promoter-emoji",r.width=25,r.isPercentage=!0,r.labelDark=!1,r.color="#0bde5e";break;case"NPS":r.isGraph=!0,r.labelDark=!0,r.width=25;break;case"NPS_DETRACTOR_PERCENTAGE":r.icon="nps-detractor-emoji",r.width=25,r.isPercentage=!0,r.labelDark=!1,r.color="#f76751";break;case"NPS_NEUTRAL_PERCENTAGE":r.icon="nps-neutral-emoji",r.width=25,r.isPercentage=!0,r.labelDark=!0,r.color="#F5F5F5";break;case"UPPER_RANGE_AVG":r.icon="settled-deals-emoji",r.width=50,r.isPercentage=!1,r.labelDark=!1,r.color="#00cae4";break;case"SETTLED_DEALS_AVG":r.icon="upper-range-emoji",r.width=50,r.isPercentage=!1,r.labelDark=!1,r.color="#0d5feb";break;case"SAVINGS_TOTAL":r.icon="savings-total-emoji",r.width=100,r.isPercentage=!1,r.labelDark=!1,r.color="#8b5eba",r.savingsPercentage=this.savingsPercentage;break}return r})):[]},savingsPercentage(){return this.data&&this.data.datasets?this.data.datasets.find((r=>"SAVINGS_PERCENTAGE"===r.label)).data[0]:null},colors(){return[{color:"#f76751",percentage:40},{color:"#707070",percentage:60},{color:"#0bde5e",percentage:100}]},npsWidth(){return(document.querySelector("#NPS")?.clientHeight||50)-5},cardheight(){const r=this.datasets.map((({width:r})=>r||0)).reduce(((r,e)=>r+e));return parseInt(100/(r/100))}}},c=l,n=(o(31417),o(1001)),i=(0,n.Z)(c,a,t,!1,null,null,null),d=i.exports},23275:function(r,e,o){"use strict";o.r(e);var a=o(87537),t=o.n(a),l=o(23645),c=o.n(l),n=c()(t());n.push([r.id,".chart-card-view .el-row .el-col{min-height:70px;padding:5px}.chart-card-view .el-row .el-col .chart-card-view__card{flex:1;display:flex;align-items:center;justify-content:flex-end;position:relative;border:none}.chart-card-view .el-row .el-col .chart-card-view__card.center{margin-bottom:0;justify-content:center}.chart-card-view .el-row .el-col .chart-card-view__card+.chart-card-view__card{margin-top:10px}.chart-card-view .el-row .el-col .chart-card-view__card .el-card__body{display:flex;align-items:center;padding:5px 15px}.chart-card-view .el-row .el-col .chart-card-view__card .el-card__body .chart-card-view__icon{position:absolute;bottom:0;left:0;z-index:1;margin:0 0 4px 8px}.chart-card-view .el-row .el-col .chart-card-view__card .el-card__body .chart-card-view__icon img{width:30px;height:30px}.chart-card-view .el-row .el-col .chart-card-view__card .el-card__body .chart-card-view__info{display:flex;flex-direction:column;text-align:right;color:#fff;z-index:2}.chart-card-view .el-row .el-col .chart-card-view__card .el-card__body .chart-card-view__info.dark-text{color:#424242}.chart-card-view .el-row .el-col .chart-card-view__card .el-card__body .chart-card-view__info .chart-card-view__label{font-size:14px}.chart-card-view .el-row .el-col .chart-card-view__card .el-card__body .chart-card-view__info .chart-card-view__value{font-weight:700;margin-top:4px}.chart-card-view .el-row .el-col .chart-card-view__card .el-card__body .chart-card-view__info .el-progress .el-progress__text{color:#424242;font-size:12px!important;font-weight:600}.chart-card-view .el-row .el-col .chart-card-view__card .el-card__body .chart-card-view__info .progress-label{width:100%;display:flex;justify-content:center;position:absolute;bottom:0;left:0;text-transform:uppercase;font-size:12px;font-weight:600;color:#424242}","",{version:3,sources:["webpack://./src/components/charts/JusChartCard.vue","webpack://./node_modules/projuris-acordos-theme/src/common/colors.scss"],names:[],mappings:"AAKI,iCACE,eAAA,CACA,WAAA,CAEA,wDACE,MAAA,CACA,YAAA,CACA,kBAAA,CACA,wBAAA,CACA,iBAAA,CACA,WAAA,CAEA,+DACE,eAAA,CACA,sBAAA,CAGF,+EACE,eAAA,CAGF,uEACE,YAAA,CACA,kBAAA,CACA,gBAAA,CAEA,8FACE,iBAAA,CACA,QAAA,CACA,MAAA,CACA,SAAA,CACA,kBAAA,CAEA,kGACE,UAAA,CACA,WAAA,CAIJ,8FACE,YAAA,CACA,qBAAA,CACA,gBAAA,CACA,UC7CI,CD8CJ,SAAA,CAEA,wGACE,aChDE,CDmDJ,sHACE,cAAA,CAGF,sHACE,eAAA,CACA,cAAA,CAIA,8HACE,aC9DA,CD+DA,wBAAA,CACA,eAAA,CAIJ,8GACE,UAAA,CACA,YAAA,CACA,sBAAA,CAEA,iBAAA,CACA,QAAA,CACA,MAAA,CAEA,wBAAA,CACA,cAAA,CACA,eAAA,CACA,aChFE",sourcesContent:["\n@import '~projuris-acordos-theme/src/common/colors.scss';\n\n.chart-card-view {\n  .el-row {\n    .el-col {\n      min-height: 70px;\n      padding: 5px;\n\n      .chart-card-view__card {\n        flex: 1;\n        display: flex;\n        align-items: center;\n        justify-content: flex-end;\n        position: relative;\n        border: none;\n\n        &.center {\n          margin-bottom: 0;\n          justify-content: center;\n        }\n\n        &+ .chart-card-view__card {\n          margin-top: 10px;\n        }\n\n        .el-card__body {\n          display: flex;\n          align-items: center;\n          padding: 5px 15px;\n\n          .chart-card-view__icon {\n            position: absolute;\n            bottom: 0;\n            left: 0;\n            z-index: 1;\n            margin: 0 0 4px 8px;\n\n            img {\n              width: 30px;\n              height: 30px;\n            }\n          }\n\n          .chart-card-view__info {\n            display: flex;\n            flex-direction: column;\n            text-align: right;\n            color: $--color-white;\n            z-index: 2;\n\n            &.dark-text {\n              color: $--color-text-primary;\n            }\n\n            .chart-card-view__label {\n              font-size: 14px;\n            }\n\n            .chart-card-view__value {\n              font-weight: bold;\n              margin-top: 4px;\n            }\n\n            .el-progress {\n              .el-progress__text {\n                color: $--color-text-primary;\n                font-size: 12px !important;\n                font-weight: 600;\n              }\n            }\n\n            .progress-label {\n              width: 100%;\n              display: flex;\n              justify-content: center;\n\n              position: absolute;\n              bottom: 0;\n              left: 0;\n\n              text-transform: uppercase;\n              font-size: 12px;\n              font-weight: 600;\n              color: $--color-text-primary;\n            }\n          }\n        }\n      }\n    }\n  }\n}\n","/* Colors\n-------------------------- */\n\n$--color-white: #fff !default;\n$--color-black: #424242 !default;\n$--color-gray: #979797 !default;\n$--color-gray-light-1: mix($--color-white, $--color-gray, 10%) !default;\n$--color-light-gray: #f3f4f5 !default;\n$--color-whatsapp: #075E54 !default;\n\n$--pj-color-darker-blue: #0A0022 !default;\n$--pj-color-dark-blue: #280BA0 !default;\n$--pj-color-blue: #0756e4 !default;\n$--pj-color-light-blue: #018EF0 !default;\n$--pj-color-lighter-blue: #30A9FB !default;\n$--pj-color-white-blue: #F0F9FE !default;\n$--pj-color-disabled-blue: #9ad2f9 !default;\n\n$-pg-color-overlay: #19415F !default;\n\n$--pj-color-red: #CC4148 !default;\n$--pj-color-light-red: #EC767C !default;\n$--pj-color-disable-red: #FFF2F3 !default;\n\n$--color-primary: $--pj-color-blue !default;\n$--color-primary-light-1: mix($--color-white, $--color-primary, 10%) !default;\n$--color-primary-light-2: mix($--color-white, $--color-primary, 20%) !default;\n$--color-primary-light-3: mix($--color-white, $--color-primary, 30%) !default;\n$--color-primary-light-4: mix($--color-white, $--color-primary, 40%) !default;\n$--color-primary-light-5: mix($--color-white, $--color-primary, 50%) !default;\n$--color-primary-light-6: mix($--color-white, $--color-primary, 60%) !default;\n$--color-primary-light-7: mix($--color-white, $--color-primary, 70%) !default;\n$--color-primary-light-8: mix($--color-white, $--color-primary, 80%) !default;\n$--color-primary-light-9: mix($--color-white, $--color-primary, 90%) !default;\n\n$--color-secondary: $--pj-color-light-blue !default;\n$--color-secondary-light-1: mix($--color-white, $--color-secondary, 10%) !default;\n$--color-secondary-light-2: mix($--color-white, $--color-secondary, 20%) !default;\n$--color-secondary-light-3: mix($--color-white, $--color-secondary, 30%) !default;\n$--color-secondary-light-4: mix($--color-white, $--color-secondary, 40%) !default;\n$--color-secondary-light-5: mix($--color-white, $--color-secondary, 50%) !default;\n$--color-secondary-light-6: mix($--color-white, $--color-secondary, 60%) !default;\n$--color-secondary-light-7: mix($--color-white, $--color-secondary, 70%) !default;\n$--color-secondary-light-8: mix($--color-white, $--color-secondary, 80%) !default;\n$--color-secondary-light-9: mix($--color-white, $--color-secondary, 90%) !default;\n\n$--color-primary-dark: $--pj-color-dark-blue !default;\n$--color-success: #14CC30 !default;\n$--color-warning: #FFC900 !default;\n$--color-danger: #FF4B54 !default;\n$--color-info: #2FBBEC !default;\n\n$--color-success-light-1: mix($--color-white, $--color-success, 10%) !default;\n$--color-success-light-5: mix($--color-white, $--color-success, 50%) !default;\n$--color-warning-light-5: mix($--color-white, $--color-warning, 50%) !default;\n$--color-danger-light-5: mix($--color-white, $--color-danger, 50%) !default;\n$--color-danger-light-3: mix($--color-white, $--color-danger, 30%) !default;\n$--color-info-light-5: mix($--color-white, $--color-info, 50%) !default;\n\n$--color-success-light: mix($--color-white, $--color-success, 80%) !default;\n$--color-warning-light: mix($--color-white, $--color-warning, 80%) !default;\n$--color-danger-light: mix($--color-white, $--color-danger, 80%) !default;\n$--color-info-light: mix($--color-white, $--color-info, 80%) !default;\n\n$--color-success-lighter: mix($--color-white, $--color-success, 90%) !default;\n$--color-warning-lighter: mix($--color-white, $--color-warning, 90%) !default;\n$--color-danger-lighter: mix($--color-white, $--color-danger, 90%) !default;\n$--color-info-lighter: mix($--color-white, $--color-info, 90%) !default;\n\n$--color-text-primary: $--color-black !default;\n$--color-text-secondary: $--color-gray !default;\n\n$--color-nps-promoter: #14CC30 !default;\n$--color-nps-neutral: #979797 !default;\n$--color-nps-detractor: #FF4B54 !default;\n\n$--color-negotiator-bg: #9461f74f !default;\n$--color-email-bg: $--color-info-light !default;\n$--color-whatsapp-bg: $--color-success-light-5 !default;"],sourceRoot:""}]),e["default"]=n},31417:function(r,e,o){var a=o(23275);a.__esModule&&(a=a.default),"string"===typeof a&&(a=[[r.id,a,""]]),a.locals&&(r.exports=a.locals);var t=o(39185).Z;t("91664ee6",a,!0,{sourceMap:!0,shadowMode:!1})}}]);
//# sourceMappingURL=4379.js.map