(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[5052],{43020:function(n,t,e){"use strict";e.r(t),e.d(t,{default:function(){return l}});var i=function(){var n=this,t=n._self._c;return t("div",{staticClass:"export-ticket"},[t("OverviewResume",{attrs:{ticket:n.ticket,"ticket-parties":n.ticketParties}}),t("OmnichannelResume")],1)},o=[],a=e(90408),c={components:{OmnichannelResume:()=>e.e(8049).then(e.bind(e,8049)),OverviewResume:()=>e.e(8606).then(e.bind(e,68606))},data:()=>({ticket:{},ticketParties:[]}),computed:{ticketId(){return this.$route?.params?.id},activeTab(){return this.$route?.query?.tab||"MESSAGES"}},created(){this.getTicket().finally((()=>this.getTicketParties().finally((()=>this.getTicketOccurrences()))))},mounted(){window.onload=setTimeout(this.handlePrint,7500),document.addEventListener("keydown",(n=>{const t=n.key,e=n.code;"Control"!==t&&n.ctrlKey&&"KeyP"===e&&(n.preventDefault(),this.handlePrint())}),!1)},methods:{...(0,a.nv)(["getFullMessage","getAllOccurrences","getTicketOverview","setOmnichannelActiveTab","getTicketOverviewParties"]),getTicket(){return this.getTicketOverview(this.ticketId).then((n=>{this.ticket={...n}}))},getTicketParties(){return this.getTicketOverviewParties(this.ticketId).then((n=>{this.ticketParties=[...n]}))},getTicketOccurrences(){return this.setOmnichannelActiveTab(this.activeTab).finally((()=>{this.getAllOccurrences(this.ticketId).then((({content:n})=>{Promise.all(n.filter((({id:n,interaction:t})=>n&&t?.message?.messageId)).map((({interaction:n})=>this.getFullMessage(n?.message?.messageId))))}))}))},handlePrint(){const n=document.querySelector(".export-ticket").innerHTML;window.onbeforeprint=()=>document.body.innerHTML=n,window.onafterprint=()=>setTimeout(window.close,500),window.print()}}},r=c,s=(e(69287),e(1001)),A=(0,s.Z)(r,i,o,!1,null,null,null),l=A.exports},29760:function(n,t,e){"use strict";e.r(t);var i=e(87537),o=e.n(i),a=e(23645),c=e.n(a),r=c()(o());r.push([n.id,"@media print{@page{size:landscape}.print-button{visibility:hidden}.communication-container__message{max-height:200vh}.inbound{display:flex;overflow-y:hidden}.inbound .interaction-container{padding:0}.inbound .interaction-container .interaction-container__balloon .interaction-container__balloon-content .communication-container .communication-container__about,.inbound .interaction-container .interaction-container__balloon .interaction-container__balloon-content .communication-container .communication-container__message .communication-container__message-link{display:none}}.export-ticket{width:100vw;height:100vh}.print-button{position:absolute;bottom:32px;left:80px}@media print{.print-button{display:none}}","",{version:3,sources:["webpack://./src/views/main/print/Ticket.vue"],names:[],mappings:"AACA,aACE,MACE,cAAA,CAGF,cACE,iBAAA,CAGF,kCACE,gBAAA,CAGF,SACE,YAAA,CACA,iBAAA,CAEA,gCACE,SAAA,CAWM,2WACE,YAAA,CAAA,CASd,eACE,WAAA,CACA,YAAA,CAGF,cACE,iBAAA,CACA,WAAA,CACA,SAAA,CAEA,aALF,cAMI,YAAA,CAAA",sourcesContent:["\n@media print{\n  @page {\n    size: landscape;\n  }\n\n  .print-button {\n    visibility: hidden;\n  }\n\n  .communication-container__message {\n    max-height: 200vh;\n  }\n\n  .inbound {\n    display: flex;\n    overflow-y: hidden;\n\n    .interaction-container {\n      padding: 0;\n\n      .interaction-container__balloon {\n        .interaction-container__balloon-content {\n          .communication-container {\n            .communication-container__message {\n              .communication-container__message-link {\n                display: none;\n              }\n            }\n\n            .communication-container__about {\n              display: none;\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\n.export-ticket {\n  width: 100vw;\n  height: 100vh;\n}\n\n.print-button {\n  position: absolute;\n  bottom: 32px;\n  left: 80px;\n\n  @media print {\n    display: none;\n  }\n}\n"],sourceRoot:""}]),t["default"]=r},69287:function(n,t,e){var i=e(29760);i.__esModule&&(i=i.default),"string"===typeof i&&(i=[[n.id,i,""]]),i.locals&&(n.exports=i.locals);var o=e(39185).Z;o("1bff5870",i,!0,{sourceMap:!0,shadowMode:!1})}}]);
//# sourceMappingURL=printTicket.js.map