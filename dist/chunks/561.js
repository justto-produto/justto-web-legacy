(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[561],{50561:function(e,t,i){"use strict";i.r(t),i.d(t,{default:function(){return l}});var o=function(){var e=this,t=e._self._c;return t("el-form",{staticClass:"pre-negotiation__form",attrs:{"label-position":"top"}},[t("el-form-item",{staticClass:"pre-negotiation__form-select",attrs:{label:"Palavras a serem detectadas para classificar como pré negociação"}},[t("el-select",{attrs:{multiple:"",filterable:"","allow-create":"","default-first-option":""},model:{value:e.workspacePreNegotiation.keyWords,callback:function(t){e.$set(e.workspacePreNegotiation,"keyWords",t)},expression:"workspacePreNegotiation.keyWords"}})],1),t("el-form-item",{attrs:{label:"Limite de valor do processo para classificar como pré negociação"}},[t("div",{staticClass:"el-input"},[t("money",{staticClass:"el-input__inner",attrs:{maxlength:"16"},model:{value:e.workspacePreNegotiation.limitValue,callback:function(t){e.$set(e.workspacePreNegotiation,"limitValue",t)},expression:"workspacePreNegotiation.limitValue"}})],1)]),t("el-form-item",[t("el-button",{attrs:{type:"primary"},on:{click:function(t){return t.preventDefault(),e.saveProperties.apply(null,arguments)}}},[e._v(" Salvar ")])],1)],1)},a=[],r=i(90408),s={data:()=>({workspacePreNegotiation:{preNegotiation:!1,keyWords:[],limitValue:0}}),computed:{...(0,r.Se)({preNegotiation:"getPreNegotiation",workspaceProperties:"workspaceProperties"}),preNegotiationAlreadyEnebled(){return this.workspaceProperties.PRE_NEGOTIATION&&"true"===this.workspaceProperties.PRE_NEGOTIATION}},watch:{workspaceProperties(){this.workspacePreNegotiation.preNegotiation=this.preNegotiationAlreadyEnebled},"workspacePreNegotiation.preNegotiation"(){if(this.workspacePreNegotiation.preNegotiation&&!this.preNegotiationAlreadyEnebled){const e="Esta funcionalidade irá gerar custos adicionais.",t="\n        Se você tem alguma dúvida de seu funcionamento, converse com seu <i>Key Account</i> antes.\n        <br/><br/>\n        Tem certeza que deseja ativar a pré negociação?\n        ";this.$confirm(t,e,{confirmButtonText:"Sim",cancelButtonText:"Não",showClose:!1,dangerouslyUseHTMLString:!0}).then((()=>{this.workspacePreNegotiation.preNegotiation=!0,this.saveProperties()})).catch((()=>{this.workspacePreNegotiation.preNegotiation=!1}))}}},mounted(){this.workspacePreNegotiation.preNegotiation=this.workspaceProperties.PRE_NEGOTIATION&&"true"===this.workspaceProperties.PRE_NEGOTIATION,this.initPreNegotiation()},methods:{...(0,r.nv)(["editWorkpaceProperties","getPreNegotiationLimitValue","putPreNegotiationLimitValue","getWorkspacePreNegotiationKeywords","putWorkspacePreNegotiationKeywords"]),initPreNegotiation(){Promise.all([this.getWorkspacePreNegotiationKeywords(),this.getPreNegotiationLimitValue()]).then((()=>{Object.assign(this.workspacePreNegotiation,this.preNegotiation)}))},saveProperties(){const e={PRE_NEGOTIATION:this.workspacePreNegotiation.preNegotiation},{limitValue:t,keyWords:i}=this.workspacePreNegotiation;Promise.all([this.editWorkpaceProperties(e),this.putPreNegotiationLimitValue(e.PRE_NEGOTIATION?t:0),this.putWorkspacePreNegotiationKeywords(i)]).then((()=>{this.$jusSegment("Configurações da pré negociação"),this.$jusNotification({title:"Yay!",message:"Configurações da pré negociação alteradas com sucesso.",type:"success"}),this.$emit("close")})).catch((e=>{this.$jusNotification({error:e})}))}}},n=s,c=(i(95454),i(1001)),p=(0,c.Z)(n,o,a,!1,null,"b0982528",null),l=p.exports},68932:function(e,t,i){"use strict";i.r(t);var o=i(87537),a=i.n(o),r=i(23645),s=i.n(r),n=s()(a());n.push([e.id,".pre-negotiation__form .pre-negotiation-form-switch[data-v-b0982528]{display:flex;align-items:center}.pre-negotiation__form .pre-negotiation-form-switch span[data-v-b0982528]{margin:0 2px}.pre-negotiation__form .el-form-item[data-v-b0982528]:last-child{display:flex;justify-content:flex-end}","",{version:3,sources:["webpack://./src/views/main/configurations/partials/PreNegotiation.vue"],names:[],mappings:"AAEE,qEACE,YAAA,CACA,kBAAA,CAEA,0EACE,YAAA,CAIJ,iEACE,YAAA,CACA,wBAAA",sourcesContent:["\n.pre-negotiation__form {\n  .pre-negotiation-form-switch {\n    display: flex;\n    align-items: center;\n\n    span {\n      margin: 0px 2px;\n    }\n  }\n\n  .el-form-item:last-child {\n    display: flex;\n    justify-content: flex-end;\n  }\n}\n"],sourceRoot:""}]),t["default"]=n},95454:function(e,t,i){var o=i(68932);o.__esModule&&(o=o.default),"string"===typeof o&&(o=[[e.id,o,""]]),o.locals&&(e.exports=o.locals);var a=i(39185).Z;a("5d72e138",o,!0,{sourceMap:!0,shadowMode:!1})}}]);
//# sourceMappingURL=561.js.map