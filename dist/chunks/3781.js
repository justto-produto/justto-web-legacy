(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[3781],{53781:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return c}});var i=function(){var e=this,t=e._self._c;return t("el-dialog",{staticClass:"jus-import-dialog",attrs:{"close-on-click-modal":!1,visible:e.visible,title:"Nova importação de disputas"},on:{"update:visible":function(t){e.visible=t}}},[t("label",{attrs:{for:"fileupload"},on:{dragover:function(e){e.preventDefault()},drop:function(t){return t.preventDefault(),e.handleFile(t)}}},[t("el-card",{staticClass:"el-card--dashed-hover",attrs:{shadow:"never"}},[e.isInitial?t("div",[t("jus-icon",{attrs:{icon:"upload-file","is-active":""}}),t("div",[t("br"),e._v(" Clique aqui e importe sua planilha nos"),t("br"),e._v(" formatos XLSX, CSV ou XLS. ")])],1):e._e(),e.isSaving?t("div",[t("br"),t("br"),t("div",{directives:[{name:"loading",rawName:"v-loading",value:!0,expression:"true"}],staticClass:"import-view__loading"}),t("div",[t("br"),t("br"),t("br"),e._v(" Carregando... ")])]):e._e(),e.isSuccess?t("div",[t("jus-icon",{attrs:{icon:"spreadsheet-xlsx"}}),t("div",[t("br"),t("br"),e._v(" "+e._s(e.uploadedFile.file_name)+" ")])],1):e._e()]),t("input",{ref:"fileupload",staticClass:"jus-import-dialog__upload",attrs:{id:"fileupload",type:"file"},on:{change:function(t){return e.handleFile(t)}}})],1),t("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[t("el-button",{on:{click:e.closeDialog}},[e._v("Cancelar")]),t("el-button",{attrs:{disabled:!e.isSuccess,type:"primary"},on:{click:e.startImport}},[e._v(" Importar ")])],1)])},a=[];s(57658);const o=0,r=1,n=2;var l={name:"JusImportDialog",props:{dialogVisible:{type:Boolean,default:!1}},data(){return{currentStatus:0,uploadedFile:null,uploadError:null}},computed:{visible:{get(){return this.dialogVisible},set(e){this.$emit("update:dialogVisible",e)}},isInitial(){return this.currentStatus===o},isSaving(){return this.currentStatus===r},isSuccess(){return this.currentStatus===n}},methods:{startImport(){this.$jusSegment("Importação 2/4 Importação iniciada",{fileName:this.uploadedFile.file_name}),this.$router.push("/import/new"),this.$store.dispatch("hideLoading")},handleFile(e){this.$notify.closeAll();const t=e.dataTransfer?e.dataTransfer.files[0]:e.target.files[0],s=t.size/1024/1024<20,i=t.name.toLowerCase().endsWith(".xlsx")||t.name.toLowerCase().endsWith(".xls")||t.name.toLowerCase().endsWith(".csv");if(i||this.$jusNotification({title:"Ops!",message:"Arquivo em formato inválido.",type:"warning"}),s||this.$jusNotification({title:"Ops!",message:"Arquivo não pode ultrapassar 20MB.",type:"warning"}),s&&i){const e=new FormData;e.append("file",t),e.append("created_person_id",this.$store.getters.loggedPersonId),e.append("created_name",this.$store.getters.loggedPersonName),e.append("created_by",this.$store.getters.accountEmail),this.saveFile(e),this.$jusSegment("Importação 1/4 Ulpoad concluido",{fileName:t.name})}else this.removeFile()},saveFile(e){this.currentStatus=r,this.$store.dispatch("uploadImportFile",e).then((e=>{this.currentStatus=n,this.uploadedFile=e,this.$store.commit("setImportsFile",e)})).catch((e=>{this.handleError(e.response),this.removeFile(),this.currentStatus=o}))},handleError(e){const t={};406===e.status?(t.message=e.data.error,t.type="warning"):e.data.error?(t.message="Arquivo vazio ou fora do formato padrão. Verifique o seu conteúdo e tente novamente.",t.type="warning"):e.data.file.length?(t.message="",e.data.file.forEach((e=>{e.startsWith("Ensure this filename")?t.message=`${t.message}Nome do arquivo deve ter no máximo 100 caracteres.<br>`:t.message=`${t.message}${e}<br>`})),t.type="error"):(t.message="Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.",t.type="error"),this.currentStatus=o,this.$jusNotification({title:"Ops!",message:t.message,dangerouslyUseHTMLString:!0,type:t.type})},closeDialog(){this.visible=!1,this.removeFile()},removeFile(){const e=this.$refs.fileupload;e.type="text",e.type="file",this.$store.commit("removeImportsFile"),this.currentStatus=o,this.uploadedFile=null,this.uploadError=null}}},d=l,u=(s(68869),s(1001)),p=(0,u.Z)(d,i,a,!1,null,null,null),c=p.exports},20630:function(e,t,s){"use strict";s.r(t);var i=s(87537),a=s.n(i),o=s(23645),r=s.n(o),n=r()(a());n.push([e.id,".jus-import-dialog .el-card{padding:30px;margin:20px 0;cursor:pointer}.jus-import-dialog img{width:60px}.jus-import-dialog .el-card__body>div{text-align:center}.jus-import-dialog__upload{display:none}","",{version:3,sources:["webpack://./src/components/dialogs/JusImportDialog.vue"],names:[],mappings:"AAEE,4BACE,YAAA,CACA,aAAA,CACA,cAAA,CAEF,uBACE,UAAA,CAEF,sCACE,iBAAA,CAEF,2BACE,YAAA",sourcesContent:["\n.jus-import-dialog {\n  .el-card {\n    padding: 30px;\n    margin: 20px 0;\n    cursor: pointer;\n  }\n  img {\n    width: 60px;\n  }\n  .el-card__body > div{\n    text-align: center;\n  }\n  &__upload {\n    display: none\n  }\n}\n"],sourceRoot:""}]),t["default"]=n},68869:function(e,t,s){var i=s(20630);i.__esModule&&(i=i.default),"string"===typeof i&&(i=[[e.id,i,""]]),i.locals&&(e.exports=i.locals);var a=s(39185).Z;a("0676a2c5",i,!0,{sourceMap:!0,shadowMode:!1})}}]);
//# sourceMappingURL=3781.js.map