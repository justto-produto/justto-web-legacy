(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[7897],{97897:function(a,e,t){"use strict";t.r(e),t.d(e,{default:function(){return u}});var s=function(){var a=this,e=a._self._c;return e("article",{staticClass:"mapear-estrategiar__container"},[a._m(0),e("el-table",{staticStyle:{width:"100%"},attrs:{data:a.estrategias,size:"mini",stripe:"",border:""}},[e("el-table-column",{attrs:{label:"Estratégia"},scopedSlots:a._u([{key:"default",fn:function(t){return e("span",{},[a._v(" "+a._s(t.row.estrategia.nome)+" ")])}}])}),e("el-table-column",{attrs:{label:"Descrição"},scopedSlots:a._u([{key:"default",fn:function(t){return e("span",{},[a._v(" "+a._s(a.descricao(t.row.condicoes))+" ")])}}])}),e("el-table-column",{attrs:{fixed:"right",width:"64"},scopedSlots:a._u([{key:"default",fn:function(t){return e("el-button",{attrs:{type:"danger",icon:"el-icon-delete",circle:"",plain:""},on:{click:function(e){return a.removerEstrategia(t.row)}}})}}])})],1),e("footer",{staticClass:"mapear-estrategiar__rodape"},[e("el-button",{attrs:{type:"primary",size:"mini",icon:"el-icon-plus"},on:{click:a.adicionarMapeamento}},[a._v(" Adicionar mapeamento ")])],1),e("DialogMapearEstrategia",{ref:"mapearEstrategia"})],1)},r=[function(){var a=this,e=a._self._c;return e("header",{staticClass:"mapear-estrategiar__titulo"},[a._v(" Configure como o sistema irá selecionar as estratégias nos casos que irão ser importados via integrações. Note que a estratégia padrão será "),e("strong",[a._v("manual")]),a._v(". ")])}],i=t(90408),o={components:{DialogMapearEstrategia:()=>t.e(6676).then(t.bind(t,96676))},computed:{...(0,i.Se)({estrategias:"getIntegrationEstrategias"}),descricao(){return(a=[])=>a.map((({campo:a,operador:e,valor:t})=>`${a.nome} ${e} ${t}`)).join("; ")+"."}},mounted(){this.buscarEstrategias()},methods:{...(0,i.nv)({buscarEstrategias:"getIntegrationEstrategias",salvarEstrategias:"saveIntegrationEstrategias"}),save(){return Promise.resolve()},adicionarMapeamento(){this.$refs.mapearEstrategia.open(this.mapearEstrategia)},mapearEstrategia(a){this.salvarEstrategias({estrategias:[...this.estrategias,a]}).then((()=>this.$jusNotification({type:"success",messae:"Mapeamento salvo com sucesso!"}))).catch((a=>this.$jusNotification({error:a})))},removerEstrategia(a){this.estrategias.splice(this.estrategias.indexOf(a),1),this.salvarEstrategias({estrategias:this.estrategias}).then((()=>this.$jusNotification({type:"success",messae:"Mapeamento salvo com sucesso!"}))).catch((a=>this.$jusNotification({error:a})))}}},n=o,c=(t(16852),t(1001)),l=(0,c.Z)(n,s,r,!1,null,"864db02c",null),u=l.exports},76075:function(a,e,t){"use strict";t.r(e);var s=t(87537),r=t.n(s),i=t(23645),o=t.n(i),n=o()(r());n.push([a.id,".mapear-estrategiar__container[data-v-864db02c]{display:flex;flex-direction:column;gap:16px}.mapear-estrategiar__container .mapear-estrategiar__rodape[data-v-864db02c]{text-align:center}","",{version:3,sources:["webpack://./src/views/main/configurations/partials/FeaturesAndModulesDialogs/partials/partials/partials/FormularioMapearEstrategias.vue"],names:[],mappings:"AACA,gDACE,YAAA,CACA,qBAAA,CACA,QAAA,CAEA,4EACE,iBAAA",sourcesContent:["\n.mapear-estrategiar__container {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n\n  .mapear-estrategiar__rodape {\n    text-align: center;\n  }\n}\n"],sourceRoot:""}]),e["default"]=n},16852:function(a,e,t){var s=t(76075);s.__esModule&&(s=s.default),"string"===typeof s&&(s=[[a.id,s,""]]),s.locals&&(a.exports=s.locals);var r=t(39185).Z;r("8638cd82",s,!0,{sourceMap:!0,shadowMode:!1})}}]);
//# sourceMappingURL=7897.js.map