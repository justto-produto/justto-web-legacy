"use strict";(self["webpackChunk_projuris_justto_web"]=self["webpackChunk_projuris_justto_web"]||[]).push([[7674],{37674:function(e,t,r){r.r(t);r(57658),r(82801);var n=/^(attrs|props|on|nativeOn|class|style|hook)$/,a=function(e){return e.reduce((function(e,t){var r,a,s,o,c;for(s in t)if(r=e[s],a=t[s],r&&n.test(s))if("class"===s&&("string"===typeof r&&(c=r,e[s]=r={},r[c]=!0),"string"===typeof a&&(c=a,t[s]=a={},a[c]=!0)),"on"===s||"nativeOn"===s||"hook"===s)for(o in a)r[o]=i(r[o],a[o]);else if(Array.isArray(r))e[s]=r.concat(a);else if(Array.isArray(a))e[s]=[r].concat(a);else for(o in a)r[o]=a[o];else e[s]=t[s];return e}),{})};function i(e,t){return function(){e&&e.apply(this,arguments),t&&t.apply(this,arguments)}}function s(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function o(e,t){return t={exports:{}},e(t,t.exports),t.exports}var c=function(e,t){return{value:t,done:!!e}},u={},f={}.toString,h=function(e){return f.call(e).slice(8,-1)},l=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==h(e)?e.split(""):Object(e)},d=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e},p=function(e){return l(d(e))},v=o((function(e){var t=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=t)})),b=o((function(e){var t=e.exports={version:"2.6.2"};"number"==typeof __e&&(__e=t)})),y=(b.version,function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}),g=function(e,t,r){if(y(e),void 0===t)return e;switch(r){case 1:return function(r){return e.call(t,r)};case 2:return function(r,n){return e.call(t,r,n)};case 3:return function(r,n,a){return e.call(t,r,n,a)}}return function(){return e.apply(t,arguments)}},m=function(e){return"object"===typeof e?null!==e:"function"===typeof e},_=function(e){if(!m(e))throw TypeError(e+" is not an object!");return e},S=function(e){try{return!!e()}catch(t){return!0}},x=!S((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})),O=v.document,w=m(O)&&m(O.createElement),A=function(e){return w?O.createElement(e):{}},j=!x&&!S((function(){return 7!=Object.defineProperty(A("div"),"a",{get:function(){return 7}}).a})),T=function(e,t){if(!m(e))return e;var r,n;if(t&&"function"==typeof(r=e.toString)&&!m(n=r.call(e)))return n;if("function"==typeof(r=e.valueOf)&&!m(n=r.call(e)))return n;if(!t&&"function"==typeof(r=e.toString)&&!m(n=r.call(e)))return n;throw TypeError("Can't convert object to primitive value")},L=Object.defineProperty,E=x?Object.defineProperty:function(e,t,r){if(_(e),t=T(t,!0),_(r),j)try{return L(e,t,r)}catch(n){}if("get"in r||"set"in r)throw TypeError("Accessors not supported!");return"value"in r&&(e[t]=r.value),e},C={f:E},M=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}},k=x?function(e,t,r){return C.f(e,t,M(1,r))}:function(e,t,r){return e[t]=r,e},R={}.hasOwnProperty,P=function(e,t){return R.call(e,t)},I="prototype",F=function(e,t,r){var n,a,i,s=e&F.F,o=e&F.G,c=e&F.S,u=e&F.P,f=e&F.B,h=e&F.W,l=o?b:b[t]||(b[t]={}),d=l[I],p=o?v:c?v[t]:(v[t]||{})[I];for(n in o&&(r=t),r)a=!s&&p&&void 0!==p[n],a&&P(l,n)||(i=a?p[n]:r[n],l[n]=o&&"function"!=typeof p[n]?r[n]:f&&a?g(i,v):h&&p[n]==i?function(e){var t=function(t,r,n){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,r)}return new e(t,r,n)}return e.apply(this,arguments)};return t[I]=e[I],t}(i):u&&"function"==typeof i?g(Function.call,i):i,u&&((l.virtual||(l.virtual={}))[n]=i,e&F.R&&d&&!d[n]&&k(d,n,i)))};F.F=1,F.G=2,F.S=4,F.P=8,F.B=16,F.W=32,F.U=64,F.R=128;var N=F,V=k,U=Math.ceil,D=Math.floor,$=function(e){return isNaN(e=+e)?0:(e>0?D:U)(e)},B=Math.min,G=function(e){return e>0?B($(e),9007199254740991):0},H=Math.max,z=Math.min,q=function(e,t){return e=$(e),e<0?H(e+t,0):z(e,t)},J=function(e){return function(t,r,n){var a,i=p(t),s=G(i.length),o=q(n,s);if(e&&r!=r){while(s>o)if(a=i[o++],a!=a)return!0}else for(;s>o;o++)if((e||o in i)&&i[o]===r)return e||o||0;return!e&&-1}},W=o((function(e){var t="__core-js_shared__",r=v[t]||(v[t]={});(e.exports=function(e,t){return r[e]||(r[e]=void 0!==t?t:{})})("versions",[]).push({version:b.version,mode:"pure",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})})),X=0,Y=Math.random(),Z=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++X+Y).toString(36))},K=W("keys"),Q=function(e){return K[e]||(K[e]=Z(e))},ee=J(!1),te=Q("IE_PROTO"),re=function(e,t){var r,n=p(e),a=0,i=[];for(r in n)r!=te&&P(n,r)&&i.push(r);while(t.length>a)P(n,r=t[a++])&&(~ee(i,r)||i.push(r));return i},ne="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(","),ae=Object.keys||function(e){return re(e,ne)},ie=x?Object.defineProperties:function(e,t){_(e);var r,n=ae(t),a=n.length,i=0;while(a>i)C.f(e,r=n[i++],t[r]);return e},se=v.document,oe=se&&se.documentElement,ce=Q("IE_PROTO"),ue=function(){},fe="prototype",he=function(){var e,t=A("iframe"),r=ne.length,n="<",a=">";t.style.display="none",oe.appendChild(t),t.src="javascript:",e=t.contentWindow.document,e.open(),e.write(n+"script"+a+"document.F=Object"+n+"/script"+a),e.close(),he=e.F;while(r--)delete he[fe][ne[r]];return he()},le=Object.create||function(e,t){var r;return null!==e?(ue[fe]=_(e),r=new ue,ue[fe]=null,r[ce]=e):r=he(),void 0===t?r:ie(r,t)},de=o((function(e){var t=W("wks"),r=v.Symbol,n="function"==typeof r,a=e.exports=function(e){return t[e]||(t[e]=n&&r[e]||(n?r:Z)("Symbol."+e))};a.store=t})),pe=C.f,ve=de("toStringTag"),be=function(e,t,r){e&&!P(e=r?e:e.prototype,ve)&&pe(e,ve,{configurable:!0,value:t})},ye={};k(ye,de("iterator"),(function(){return this}));var ge=function(e,t,r){e.prototype=le(ye,{next:M(1,r)}),be(e,t+" Iterator")},me=function(e){return Object(d(e))},_e=Q("IE_PROTO"),Se=Object.prototype,xe=Object.getPrototypeOf||function(e){return e=me(e),P(e,_e)?e[_e]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?Se:null},Oe=de("iterator"),we=!([].keys&&"next"in[].keys()),Ae="@@iterator",je="keys",Te="values",Le=function(){return this},Ee=function(e,t,r,n,a,i,s){ge(r,t,n);var o,c,f,h=function(e){if(!we&&e in v)return v[e];switch(e){case je:return function(){return new r(this,e)};case Te:return function(){return new r(this,e)}}return function(){return new r(this,e)}},l=t+" Iterator",d=a==Te,p=!1,v=e.prototype,b=v[Oe]||v[Ae]||a&&v[a],y=b||h(a),g=a?d?h("entries"):y:void 0,m="Array"==t&&v.entries||b;if(m&&(f=xe(m.call(new e)),f!==Object.prototype&&f.next&&be(f,l,!0)),d&&b&&b.name!==Te&&(p=!0,y=function(){return b.call(this)}),s&&(we||p||!v[Oe])&&k(v,Oe,y),u[t]=y,u[l]=Le,a)if(o={values:d?y:h(Te),keys:i?y:h(je),entries:g},s)for(c in o)c in v||V(v,c,o[c]);else N(N.P+N.F*(we||p),t,o);return o};Ee(Array,"Array",(function(e,t){this._t=p(e),this._i=0,this._k=t}),(function(){var e=this._t,t=this._k,r=this._i++;return!e||r>=e.length?(this._t=void 0,c(1)):c(0,"keys"==t?r:"values"==t?e[r]:[r,e[r]])}),"values");u.Arguments=u.Array;for(var Ce=de("toStringTag"),Me="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),ke=0;ke<Me.length;ke++){var Re=Me[ke],Pe=v[Re],Ie=Pe&&Pe.prototype;Ie&&!Ie[Ce]&&k(Ie,Ce,Re),u[Re]=u.Array}var Fe=function(e){return function(t,r){var n,a,i=String(d(t)),s=$(r),o=i.length;return s<0||s>=o?e?"":void 0:(n=i.charCodeAt(s),n<55296||n>56319||s+1===o||(a=i.charCodeAt(s+1))<56320||a>57343?e?i.charAt(s):n:e?i.slice(s,s+2):a-56320+(n-55296<<10)+65536)}},Ne=Fe(!0);Ee(String,"String",(function(e){this._t=String(e),this._i=0}),(function(){var e,t=this._t,r=this._i;return r>=t.length?{value:void 0,done:!0}:(e=Ne(t,r),this._i+=e.length,{value:e,done:!1})}));var Ve=de("toStringTag"),Ue="Arguments"==h(function(){return arguments}()),De=function(e,t){try{return e[t]}catch(r){}},$e=function(e){var t,r,n;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(r=De(t=Object(e),Ve))?r:Ue?h(t):"Object"==(n=h(t))&&"function"==typeof t.callee?"Arguments":n},Be=de("iterator"),Ge=b.isIterable=function(e){var t=Object(e);return void 0!==t[Be]||"@@iterator"in t||u.hasOwnProperty($e(t))},He=Ge,ze=o((function(e){e.exports={default:He,__esModule:!0}}));s(ze);var qe=de("iterator"),Je=b.getIteratorMethod=function(e){if(void 0!=e)return e[qe]||e["@@iterator"]||u[$e(e)]},We=b.getIterator=function(e){var t=Je(e);if("function"!=typeof t)throw TypeError(e+" is not iterable!");return _(t.call(e))},Xe=We,Ye=o((function(e){e.exports={default:Xe,__esModule:!0}}));s(Ye);var Ze=o((function(e,t){t.__esModule=!0;var r=a(ze),n=a(Ye);function a(e){return e&&e.__esModule?e:{default:e}}t.default=function(){function e(e,t){var r=[],a=!0,i=!1,s=void 0;try{for(var o,c=(0,n.default)(e);!(a=(o=c.next()).done);a=!0)if(r.push(o.value),t&&r.length===t)break}catch(u){i=!0,s=u}finally{try{!a&&c["return"]&&c["return"]()}finally{if(i)throw s}}return r}return function(t,n){if(Array.isArray(t))return t;if((0,r.default)(Object(t)))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}()})),Ke=s(Ze),Qe=function(e,t,r,n){try{return n?t(_(r)[0],r[1]):t(r)}catch(i){var a=e["return"];throw void 0!==a&&_(a.call(e)),i}},et=de("iterator"),tt=Array.prototype,rt=function(e){return void 0!==e&&(u.Array===e||tt[et]===e)},nt=function(e,t,r){t in e?C.f(e,t,M(0,r)):e[t]=r},at=de("iterator"),it=!1;try{var st=[7][at]();st["return"]=function(){it=!0},Array.from(st,(function(){throw 2}))}catch(Yt){}var ot=function(e,t){if(!t&&!it)return!1;var r=!1;try{var n=[7],a=n[at]();a.next=function(){return{done:r=!0}},n[at]=function(){return a},e(n)}catch(Yt){}return r};N(N.S+N.F*!ot((function(e){Array.from(e)})),"Array",{from:function(e){var t,r,n,a,i=me(e),s="function"==typeof this?this:Array,o=arguments.length,c=o>1?arguments[1]:void 0,u=void 0!==c,f=0,h=Je(i);if(u&&(c=g(c,o>2?arguments[2]:void 0,2)),void 0==h||s==Array&&rt(h))for(t=G(i.length),r=new s(t);t>f;f++)nt(r,f,u?c(i[f],f):i[f]);else for(a=h.call(i),r=new s;!(n=a.next()).done;f++)nt(r,f,u?Qe(a,c,[n.value,f],!0):n.value);return r.length=f,r}});var ct=b.Array.from,ut=o((function(e){e.exports={default:ct,__esModule:!0}}));s(ut);var ft=o((function(e,t){t.__esModule=!0;var r=n(ut);function n(e){return e&&e.__esModule?e:{default:e}}t.default=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return(0,r.default)(e)}})),ht=s(ft),lt=function(e,t){var r=(b.Object||{})[e]||Object[e],n={};n[e]=t(r),N(N.S+N.F*S((function(){r(1)})),"Object",n)};lt("keys",(function(){return function(e){return ae(me(e))}}));for(var dt=b.Object.keys,pt=o((function(e){e.exports={default:dt,__esModule:!0}})),vt=s(pt),bt=function(e){return"[object RegExp]"===Object.prototype.toString.call(e)},yt={global:"g",ignoreCase:"i",multiline:"m",dotAll:"s",sticky:"y",unicode:"u"},gt=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!bt(e))throw new TypeError("Expected a RegExp instance");var r=vt(yt).map((function(r){return("boolean"===typeof t[r]?t[r]:e[r])?yt[r]:""})).join(""),n=new RegExp(t.source||e.source,r);return n.lastIndex="number"===typeof t.lastIndex?t.lastIndex:e.lastIndex,n},mt=At,_t=[{base:" ",chars:" "},{base:"0",chars:"߀"},{base:"A",chars:"ⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ"},{base:"AA",chars:"Ꜳ"},{base:"AE",chars:"ÆǼǢ"},{base:"AO",chars:"Ꜵ"},{base:"AU",chars:"Ꜷ"},{base:"AV",chars:"ꜸꜺ"},{base:"AY",chars:"Ꜽ"},{base:"B",chars:"ⒷＢḂḄḆɃƁ"},{base:"C",chars:"ⒸＣꜾḈĆCĈĊČÇƇȻ"},{base:"D",chars:"ⒹＤḊĎḌḐḒḎĐƊƉᴅꝹ"},{base:"Dh",chars:"Ð"},{base:"DZ",chars:"ǱǄ"},{base:"Dz",chars:"ǲǅ"},{base:"E",chars:"ɛⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎᴇ"},{base:"F",chars:"ꝼⒻＦḞƑꝻ"},{base:"G",chars:"ⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾɢ"},{base:"H",chars:"ⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ"},{base:"I",chars:"ⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ"},{base:"J",chars:"ⒿＪĴɈȷ"},{base:"K",chars:"ⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ"},{base:"L",chars:"ⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ"},{base:"LJ",chars:"Ǉ"},{base:"Lj",chars:"ǈ"},{base:"M",chars:"ⓂＭḾṀṂⱮƜϻ"},{base:"N",chars:"ꞤȠⓃＮǸŃÑṄŇṆŅṊṈƝꞐᴎ"},{base:"NJ",chars:"Ǌ"},{base:"Nj",chars:"ǋ"},{base:"O",chars:"ⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ"},{base:"OE",chars:"Œ"},{base:"OI",chars:"Ƣ"},{base:"OO",chars:"Ꝏ"},{base:"OU",chars:"Ȣ"},{base:"P",chars:"ⓅＰṔṖƤⱣꝐꝒꝔ"},{base:"Q",chars:"ⓆＱꝖꝘɊ"},{base:"R",chars:"ⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ"},{base:"S",chars:"ⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ"},{base:"T",chars:"ⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ"},{base:"Th",chars:"Þ"},{base:"TZ",chars:"Ꜩ"},{base:"U",chars:"ⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ"},{base:"V",chars:"ⓋＶṼṾƲꝞɅ"},{base:"VY",chars:"Ꝡ"},{base:"W",chars:"ⓌＷẀẂŴẆẄẈⱲ"},{base:"X",chars:"ⓍＸẊẌ"},{base:"Y",chars:"ⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ"},{base:"Z",chars:"ⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ"},{base:"a",chars:"ⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐɑ"},{base:"aa",chars:"ꜳ"},{base:"ae",chars:"æǽǣ"},{base:"ao",chars:"ꜵ"},{base:"au",chars:"ꜷ"},{base:"av",chars:"ꜹꜻ"},{base:"ay",chars:"ꜽ"},{base:"b",chars:"ⓑｂḃḅḇƀƃɓƂ"},{base:"c",chars:"ｃⓒćĉċčçḉƈȼꜿↄ"},{base:"d",chars:"ⓓｄḋďḍḑḓḏđƌɖɗƋᏧԁꞪ"},{base:"dh",chars:"ð"},{base:"dz",chars:"ǳǆ"},{base:"e",chars:"ⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇǝ"},{base:"f",chars:"ⓕｆḟƒ"},{base:"ff",chars:"ﬀ"},{base:"fi",chars:"ﬁ"},{base:"fl",chars:"ﬂ"},{base:"ffi",chars:"ﬃ"},{base:"ffl",chars:"ﬄ"},{base:"g",chars:"ⓖｇǵĝḡğġǧģǥɠꞡꝿᵹ"},{base:"h",chars:"ⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ"},{base:"hv",chars:"ƕ"},{base:"i",chars:"ⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı"},{base:"j",chars:"ⓙｊĵǰɉ"},{base:"k",chars:"ⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ"},{base:"l",chars:"ⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇɭ"},{base:"lj",chars:"ǉ"},{base:"m",chars:"ⓜｍḿṁṃɱɯ"},{base:"n",chars:"ⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥлԉ"},{base:"nj",chars:"ǌ"},{base:"o",chars:"ⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿꝋꝍɵɔᴑ"},{base:"oe",chars:"œ"},{base:"oi",chars:"ƣ"},{base:"oo",chars:"ꝏ"},{base:"ou",chars:"ȣ"},{base:"p",chars:"ⓟｐṕṗƥᵽꝑꝓꝕρ"},{base:"q",chars:"ⓠｑɋꝗꝙ"},{base:"r",chars:"ⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ"},{base:"s",chars:"ⓢｓśṥŝṡšṧṣṩșşȿꞩꞅẛʂ"},{base:"ss",chars:"ß"},{base:"t",chars:"ⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ"},{base:"th",chars:"þ"},{base:"tz",chars:"ꜩ"},{base:"u",chars:"ⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ"},{base:"v",chars:"ⓥｖṽṿʋꝟʌ"},{base:"vy",chars:"ꝡ"},{base:"w",chars:"ⓦｗẁẃŵẇẅẘẉⱳ"},{base:"x",chars:"ⓧｘẋẍ"},{base:"y",chars:"ⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ"},{base:"z",chars:"ⓩｚźẑżžẓẕƶȥɀⱬꝣ"}],St={},xt=0;xt<_t.length;xt+=1)for(var Ot=_t[xt].chars,wt=0;wt<Ot.length;wt+=1)St[Ot[wt]]=_t[xt].base;function At(e){return e.replace(/[^\u0000-\u007e]/g,(function(e){return St[e]||e}))}var jt=_t,Tt=St,Lt={remove:mt,replacementList:jt,diacriticsMap:Tt};function Et(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=r.caseSensitive,a=void 0!==n&&n,i=r.diacriticsSensitive,s=void 0!==i&&i;if(t instanceof RegExp){var o=gt(t,{global:!0}),c=[],u=o.exec(e);while(u){var f=u.index+u[0].length;c.push([u.index,f]),u=o.exec(e)}return c}var h=t.length;if(0===h)return[];var l=[],d=e,p=t;a||(d=e.toLocaleLowerCase(),p=t.toLocaleLowerCase()),s||(d=Lt.remove(d),p=Lt.remove(p));var v=0,b=d.indexOf(p,v);while(b>-1)v=b+h,l.push([b,v]),b=d.indexOf(p,b+1);return l}var Ct=o((function(e,t){t.__esModule=!0;var r=n(ut);function n(e){return e&&e.__esModule?e:{default:e}}t.default=function(e){return Array.isArray(e)?e:(0,r.default)(e)}})),Mt=s(Ct);function kt(e){var t=Mt(e),r=t.slice(0);if(!r.length)return[];r.sort((function(e,t){return e[0]!==t[0]?e[0]-t[0]:e[1]-t[1]}));var n=[],a=r[0][0],i=r[0][1];return r.shift(),r.forEach((function(e){var t=Ke(e,2),r=t[0],s=t[1];r>=i?(n.push([a,i]),a=r,i=s):s>i&&(i=s)})),n.push([a,i]),n}function Rt(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=r.caseSensitive,a=void 0!==n&&n,i=r.diacriticsSensitive,s=void 0!==i&&i,o=t;if("string"===typeof t||t instanceof RegExp)o=[t];else if(!Array.isArray(t))return[];var c=[];o.forEach((function(t){c.push.apply(c,ht(Et(e,t,{caseSensitive:a,diacriticsSensitive:s})))}));var u=kt(c),f=[],h=0;return u.forEach((function(t,r){var n=Ke(t,2),a=n[0],i=n[1];h!==a&&f.push({isHighlighted:!1,text:e.slice(h,a)}),f.push({isHighlighted:!0,text:e.slice(a,i),highlightIndex:r}),h=i})),h!==e.length&&f.push({isHighlighted:!1,text:e.slice(h)}),f}var Pt=[Object,Array,String],It={name:"text-highlight",props:{queries:[Array,String,RegExp],caseSensitive:Boolean,diacriticsSensitive:Boolean,highlightStyle:Pt,highlightClass:Pt,highlightComponent:{type:[String,Object],default:"mark"}},data:function(){return{text:""}},render:function(e){var t=this;return e("span",[this.highlights.map((function(r){var n=r.text,i=r.isHighlighted,s=r.highlightIndex;return i?e(t.highlightComponent,a([{class:["text__highlight",t.highlightClass],style:t.highlightStyle,key:s,attrs:{index:s,text:n}},t.attributes]),[n]):n}))])},beforeMount:function(){this.setTextFromSlot()},beforeUpdate:function(){this.setTextFromSlot()},methods:{setTextFromSlot:function(){var e=this.$slots.default;e?(e[0].tag,this.text=e[0].text):this.text=""}},computed:{attributes:function(){return{props:this.$attrs,on:this.$listeners}},highlights:function(){var e=this.text,t=this.queries,r=this.caseSensitive,n=this.diacriticsSensitive;return Rt(e,t,{caseSensitive:r,diacriticsSensitive:n})}}};function Ft(e,t,r,n,a,i,s,o,c,u){"boolean"!==typeof s&&(c=o,o=s,s=!1);var f,h="function"===typeof r?r.options:r;if(e&&e.render&&(h.render=e.render,h.staticRenderFns=e.staticRenderFns,h._compiled=!0,a&&(h.functional=!0)),n&&(h._scopeId=n),i?(f=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"===typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),t&&t.call(this,c(e)),e&&e._registeredComponents&&e._registeredComponents.add(i)},h._ssrRegister=f):t&&(f=s?function(){t.call(this,u(this.$root.$options.shadowRoot))}:function(e){t.call(this,o(e))}),f)if(h.functional){var l=h.render;h.render=function(e,t){return f.call(t),l(e,t)}}else{var d=h.beforeCreate;h.beforeCreate=d?[].concat(d,f):[f]}return r}var Nt=Ft,Vt="undefined"!==typeof navigator&&/msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());function Ut(e){return function(e,t){return Bt(e,t)}}var Dt=document.head||document.getElementsByTagName("head")[0],$t={};function Bt(e,t){var r=Vt?t.media||"default":e,n=$t[r]||($t[r]={ids:new Set,styles:[]});if(!n.ids.has(e)){n.ids.add(e);var a=t.source;if(t.map&&(a+="\n/*# sourceURL="+t.map.sources[0]+" */",a+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(t.map))))+" */"),n.element||(n.element=document.createElement("style"),n.element.type="text/css",t.media&&n.element.setAttribute("media",t.media),Dt.appendChild(n.element)),"styleSheet"in n.element)n.styles.push(a),n.element.styleSheet.cssText=n.styles.filter(Boolean).join("\n");else{var i=n.ids.size-1,s=document.createTextNode(a),o=n.element.childNodes;o[i]&&n.element.removeChild(o[i]),o.length?n.element.insertBefore(s,o[i]):n.element.appendChild(s)}}}var Gt=Ut,Ht=It,zt=function(e){e&&e("data-v-f670ad86_0",{source:".text__highlight{background:#fc0;border-radius:3px}",map:void 0,media:void 0})},qt=void 0,Jt=void 0,Wt=void 0,Xt=Nt({},zt,Ht,qt,Wt,Jt,Gt,void 0);t["default"]=Xt}}]);
//# sourceMappingURL=7674.js.map