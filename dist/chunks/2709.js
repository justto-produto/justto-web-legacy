(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[2709],{52709:function(e,t,i){"use strict";i.r(t),i.d(t,{default:function(){return _}});var n=function(){var e=this,t=e._self._c;return t("article",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"api-integration__container",attrs:{"show-close":!1,"close-on-click-modal":!1,"close-on-press-escape":!1}},[!e.hasFields||e.disable&&e.useBFF?e.useBFF&&e.disable&&e.fields.PROJURIS_SOAP_ACTIVE?t("ProjurisSoapConfigView",{attrs:{fields:e.fields},on:{reset:e.handleEdit,close:e.handleClose}}):t("InitialIntegrationForm",{on:{submit:e.handleVerifyIntegrationType,cancel:e.handleClose}}):t("el-form",{staticClass:"api-integration__form",attrs:{model:e.fields,autocomplete:"off"}},[t("el-row",{staticClass:"api-integration__fields"},e._l(e.fields,(function(i,n){return t("el-col",{directives:[{name:"show",rawName:"v-show",value:!n.includes("_ACTIVE"),expression:"!fieldKey.includes('_ACTIVE')"}],key:n,staticClass:"api-integration__field",attrs:{span:24}},[t("el-form-item",{attrs:{label:e.buildTitleByKey(n)}},[n.includes("_ACTIVE")?e._e():t("el-input",{attrs:{"show-password":n.includes("_PASSWORD"),"prefix-icon":e.buildIconByKey(n),autocomplete:"off","auto-complete":"off"},model:{value:e.fields[n],callback:function(t){e.$set(e.fields,n,t)},expression:"fields[fieldKey]"}},[n.includes("_URL")?t("el-button",{attrs:{slot:"append",type:"transparent",icon:"el-icon-delete"},on:{click:e.handleReset},slot:"append"}):e._e()],1)],1)],1)})),1),Object.keys(e.fields).length?t("el-form-item",{staticClass:"actions"},[t("el-button",{on:{click:e.handleClose}},[e._v(" Fechar ")]),e.disable||e.forceEdit?t("el-button",{attrs:{type:"secondary"},on:{click:e.handleReset}},[e._v(" Resetar ")]):e._e(),t("el-button",{attrs:{type:"primary"},on:{click:e.handleSave}},[e._v(" Salvar ")])],1):e._e()],1),t("SelectIntegrationTypeDialog",{ref:"selectTypeDialog"})],1)},o=[],s=i(90408),a={name:"ApiIntegrationForm",components:{InitialIntegrationForm:()=>i.e(6497).then(i.bind(i,96497)),SelectIntegrationTypeDialog:()=>i.e(6779).then(i.bind(i,96779)),ProjurisSoapConfigView:()=>i.e(1742).then(i.bind(i,21742))},props:{feature:{required:!0,type:Number}},data:()=>({loading:!1,forceEdit:!1}),computed:{...(0,s.Se)({configurations:"getIntegrationConfigsList",workspaceId:"workspaceId",getFields:"getIntegrationConfigs",useBFF:"useIntegrationBff"}),fields:{get(){return this.getFields},set(e){this.setIntegrationConfigs(e)}},hasFields(){return this.forceEdit||this.fields?.FINCH_ACTIVE||this.fields?.PROJURIS_SOAP_ACTIVE||this.fields?.JUSTTO_WEBHOOK_ACTIVE},disable(){return!this.forceEdit&&(this.configurations||[]).filter((({key:e="",value:t=""})=>e.includes("_ACTIVE")&&t===String(!0))).length>0},isNotEditable(){return e=>["PROJURIS_SOAP_URL"].includes(e)}},watch:{hasFields(e){if(e){const e=document.querySelector(".el-form.api-integration__form");e&&e.setAttribute("autocomplete","off")}}},mounted(){this.init()},methods:{...(0,s.nv)(["detectIntegration","getFeatureProperties","getIntegrationConfigs","saveIntegrationConfigs","setApiIntegrationConfiguration","resetIntegrationConfigs"]),...(0,s.OI)(["setIntegrationConfigs"]),init(){const e=(e,t)=>(e??[]).find((({key:e})=>e===t))?.value||"",t=(this?.configurations||[]).find((({key:e="",value:t=""})=>e.includes("_ACTIVE")&&"true"===t))?.key;switch(this.getIntegrationConfigs(),t){case"PROJURIS_SOAP_ACTIVE":this.handleInitProjurisIntegration({url:e(this.configurations,"PROJURIS_SOAP_URL"),token:e(this.configurations,"PROJURIS_SOAP_TOKEN"),password:"******",usename:e(this.configurations,"PROJURIS_SOAP_USERNAME")});break;case"FINCH_ACTIVE":this.initFinchIntegration({url:e(this.configurations,"FINCH_ENDPOINT"),password:"******",usename:e(this.configurations,"FINCH_USERNAME")});break;case"JUSTTO_WEBHOOK_ACTIVE":this.initJusttoIntegration({url:e(this.configurations,"JUSTTO_WEBHOOK_ENDPOINT"),password:"******",usename:e(this.configurations,"JUSTTO_WEBHOOK_USERNAME")});break;default:break}},handleVerifyIntegrationType(e){this.detectIntegration(e).then((({url:e,type:t})=>{this.handleInitIntegration({url:e,type:t})})).catch((e=>this.$jusNotification({error:e})))},handleSelectIntegrationType({url:e,action:t,type:i}){switch(t){case"cancel":this.handleVerifyIntegrationType(e);break;case"select":this.handleInitIntegration({url:e,type:i});break;default:break}},handleInitIntegration({url:e,type:t}){switch(t){case"PROJURIS_SOAP":this.handleInitProjurisIntegration({url:e});break;case"FINCH":this.initFinchIntegration({url:e});break;default:this.initJusttoIntegration({url:e});break}},handleInitProjurisIntegration({url:e,token:t=""}){this.fields={PROJURIS_SOAP_ACTIVE:!0,PROJURIS_SOAP_TOKEN:t,PROJURIS_SOAP_URL:e}},initFinchIntegration({url:e,password:t="",usename:i=""}){this.fields={FINCH_ACTIVE:!0,FINCH_ENDPOINT:e,FINCH_USERNAME:i,FINCH_PASSWORD:t}},initJusttoIntegration({url:e,password:t="",usename:i=""}){this.fields={JUSTTO_WEBHOOK_ACTIVE:!0,JUSTTO_WEBHOOK_ENDPOINT:e,JUSTTO_WEBHOOK_USERNAME:i,JUSTTO_WEBHOOK_PASSWORD:t}},buildIconByKey(e){return["JUSTTO_WEBHOOK_ENDPOINT","FINCH_ENDPOINT","PROJURIS_SOAP_URL"].includes(e)?"el-icon-link":["JUSTTO_WEBHOOK_USERNAME","FINCH_USERNAME","PROJURIS_SOAP_USERNAME"].includes(e)?"el-icon-user":["JUSTTO_WEBHOOK_PASSWORD","FINCH_PASSWORD","PROJURIS_SOAP_PASSWORD"].includes(e)?"el-icon-lock":["PROJURIS_SOAP_TOKEN"].includes(e)?"el-icon-connection":"el-icon-open"},buildTitleByKey(e){return["JUSTTO_WEBHOOK_ENDPOINT","FINCH_ENDPOINT","PROJURIS_SOAP_URL"].includes(e)?"Endereço configurado":["JUSTTO_WEBHOOK_USERNAME","FINCH_USERNAME","PROJURIS_SOAP_USERNAME"].includes(e)?"USERNAME":["JUSTTO_WEBHOOK_PASSWORD","FINCH_PASSWORD","PROJURIS_SOAP_PASSWORD"].includes(e)?"PASSWORD":["PROJURIS_SOAP_TOKEN"].includes(e)?"Forneça o token de acesso para prosseguir":e},handleClose(){this.forceEdit=!1,this.$emit("close")},handleReset(){this.$confirm("Deseja realmente reiniciar a configuração?",{confirmButtonText:"Sim",cancelButtonText:"Não",showClose:!1,closeOnClickModal:!1,closeOnPressEscape:!1}).then((()=>{this.loading=!0,this.forceEdit=!1,this.resetIntegrationConfigs().then((()=>{this.$jusNotification({type:"success",title:"Yay!",message:"Resetado com sucesso!"}),this.fields={},this.$nextTick().then(this.handleRefresh)})).catch((e=>this.$jusNotification({error:e}))).finally((()=>{this.loading=!1}))}))},handleSave(){this.loading=!0,this.forceEdit=!1;const e=Object.keys(this.fields).reduce(((e,t)=>("******"!==this.fields[t]&&(e[t]=String(this.fields[t])),e)),{});this.saveIntegrationConfigs({...e}).then((()=>{this.$jusNotification({type:"success",title:"Yay!",message:"Salvo com sucesso!"}),this.fields={},this.$nextTick().then(this.handleRefresh)})).catch((e=>this.$jusNotification({error:e}))).finally((()=>{this.loading=!1}))},handleRefresh(){this.getIntegrationConfigs().then(this.init).catch((e=>this.$jusNotification({error:e}))).finally((()=>{this.loading=!1}))},handleEdit(){console.log("handleEdit"),this.forceEdit=!0}}},r=a,l=(i(72439),i(1001)),c=(0,l.Z)(r,n,o,!1,null,null,null),_=c.exports},10138:function(e,t,i){"use strict";i.r(t);var n=i(87537),o=i.n(n),s=i(23645),a=i.n(s),r=a()(o());r.push([e.id,'.api-integration__container .api-integration__fields{display:flex;flex-direction:column;gap:8px}.api-integration__container .api-integration__fields .api-integration__field .el-form-item{margin:0}.api-integration__container .api-integration__fields .api-integration__field .el-form-item .el-form-item__label{line-height:unset}.api-integration__container .api-integration__fields .api-integration__field .el-form-item .el-form-item__label:after{content:":"}.api-integration__container .api-integration__fields .api-integration__field .el-form-item .el-form-item__content{line-height:unset}.api-integration__container .api-integration__form .actions .el-form-item__content:last-child{display:flex;justify-content:flex-end;gap:8px}.api-integration__container .api-integration__form .actions .el-form-item__content:last-child:after,.api-integration__container .api-integration__form .actions .el-form-item__content:last-child:before{display:none}.api-integration__container .api-integration__form .actions .el-form-item__content:last-child .el-button{margin:0}',"",{version:3,sources:["webpack://./src/views/main/configurations/partials/FeaturesAndModulesDialogs/partials/ApiIntegrationForm.vue"],names:[],mappings:"AAEE,qDACE,YAAA,CACA,qBAAA,CACA,OAAA,CAEE,2FACE,QAAA,CAEA,gHACE,iBAAA,CAEA,sHAAA,WAAA,CAGF,kHACE,iBAAA,CAMR,8FACI,YAAA,CACA,wBAAA,CACA,OAAA,CAEA,yMACE,YAAA,CAGF,yGACE,QAAA",sourcesContent:["\n.api-integration__container {\n  .api-integration__fields {\n    display: flex;\n    flex-direction: column;\n    gap: 8px;\n    .api-integration__field {\n      .el-form-item {\n        margin: 0;\n\n        .el-form-item__label {\n          line-height: unset;\n\n          &::after { content: ':'; }\n        }\n\n        .el-form-item__content {\n          line-height: unset;\n        }\n      }\n    }\n  }\n\n  .api-integration__form .actions .el-form-item__content:last-child {\n      display: flex;\n      justify-content: flex-end;\n      gap: 8px;\n\n      &:after, &:before {\n        display: none;\n      }\n\n      .el-button {\n        margin: 0;\n      }\n  }\n}\n"],sourceRoot:""}]),t["default"]=r},72439:function(e,t,i){var n=i(10138);n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[e.id,n,""]]),n.locals&&(e.exports=n.locals);var o=i(39185).Z;o("0e490c60",n,!0,{sourceMap:!0,shadowMode:!1})}}]);
//# sourceMappingURL=2709.js.map