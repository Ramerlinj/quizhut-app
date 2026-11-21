function Ee(_){return _&&_.__esModule&&Object.prototype.hasOwnProperty.call(_,"default")?_.default:_}var ie={exports:{}},h={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var de;function Te(){if(de)return h;de=1;var _=Symbol.for("react.transitional.element"),m=Symbol.for("react.portal"),k=Symbol.for("react.fragment"),T=Symbol.for("react.strict_mode"),b=Symbol.for("react.profiler"),x=Symbol.for("react.consumer"),j=Symbol.for("react.context"),F=Symbol.for("react.forward_ref"),L=Symbol.for("react.suspense"),$=Symbol.for("react.memo"),N=Symbol.for("react.lazy"),U=Symbol.for("react.activity"),te=Symbol.for("react.view_transition"),X=Symbol.iterator;function re(e){return e===null||typeof e!="object"?null:(e=X&&e[X]||e["@@iterator"],typeof e=="function"?e:null)}var G={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},g=Object.assign,K={};function S(e,n,a){this.props=e,this.context=n,this.refs=K,this.updater=a||G}S.prototype.isReactComponent={},S.prototype.setState=function(e,n){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,n,"setState")},S.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function q(){}q.prototype=S.prototype;function B(e,n,a){this.props=e,this.context=n,this.refs=K,this.updater=a||G}var D=B.prototype=new q;D.constructor=B,g(D,S.prototype),D.isPureReactComponent=!0;var J=Array.isArray;function Y(){}var v={H:null,A:null,T:null,S:null},Q=Object.prototype.hasOwnProperty;function Z(e,n,a){var o=a.ref;return{$$typeof:_,type:e,key:n,ref:o!==void 0?o:null,props:a}}function ne(e,n){return Z(e.type,n,e.props)}function W(e){return typeof e=="object"&&e!==null&&e.$$typeof===_}function oe(e){var n={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(a){return n[a]})}var V=/\/+/g;function I(e,n){return typeof e=="object"&&e!==null&&e.key!=null?oe(""+e.key):n.toString(36)}function ee(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(Y,Y):(e.status="pending",e.then(function(n){e.status==="pending"&&(e.status="fulfilled",e.value=n)},function(n){e.status==="pending"&&(e.status="rejected",e.reason=n)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function P(e,n,a,o,s){var c=typeof e;(c==="undefined"||c==="boolean")&&(e=null);var u=!1;if(e===null)u=!0;else switch(c){case"bigint":case"string":case"number":u=!0;break;case"object":switch(e.$$typeof){case _:case m:u=!0;break;case N:return u=e._init,P(u(e._payload),n,a,o,s)}}if(u)return s=s(e),u=o===""?"."+I(e,0):o,J(s)?(a="",u!=null&&(a=u.replace(V,"$&/")+"/"),P(s,n,a,"",function(M){return M})):s!=null&&(W(s)&&(s=ne(s,a+(s.key==null||e&&e.key===s.key?"":(""+s.key).replace(V,"$&/")+"/")+u)),n.push(s)),1;u=0;var y=o===""?".":o+":";if(J(e))for(var d=0;d<e.length;d++)o=e[d],c=y+I(o,d),u+=P(o,n,a,c,s);else if(d=re(e),typeof d=="function")for(e=d.call(e),d=0;!(o=e.next()).done;)o=o.value,c=y+I(o,d++),u+=P(o,n,a,c,s);else if(c==="object"){if(typeof e.then=="function")return P(ee(e),n,a,o,s);throw n=String(e),Error("Objects are not valid as a React child (found: "+(n==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":n)+"). If you meant to render a collection of children, use an array instead.")}return u}function z(e,n,a){if(e==null)return e;var o=[],s=0;return P(e,o,"","",function(c){return n.call(a,c,s++)}),o}function ae(e){if(e._status===-1){var n=e._result,a=n();a.then(function(o){(e._status===0||e._status===-1)&&(e._status=1,e._result=o,a.status===void 0&&(a.status="fulfilled",a.value=o))},function(o){(e._status===0||e._status===-1)&&(e._status=2,e._result=o,a.status===void 0&&(a.status="rejected",a.reason=o))}),e._status===-1&&(e._status=0,e._result=a)}if(e._status===1)return e._result.default;throw e._result}var r=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)};function t(e){var n=v.T,a={};a.types=n!==null?n.types:null,v.T=a;try{var o=e(),s=v.S;s!==null&&s(a,o),typeof o=="object"&&o!==null&&typeof o.then=="function"&&o.then(Y,r)}catch(c){r(c)}finally{n!==null&&a.types!==null&&(n.types=a.types),v.T=n}}function i(e){var n=v.T;if(n!==null){var a=n.types;a===null?n.types=[e]:a.indexOf(e)===-1&&a.push(e)}else t(i.bind(null,e))}var l={map:z,forEach:function(e,n,a){z(e,function(){n.apply(this,arguments)},a)},count:function(e){var n=0;return z(e,function(){n++}),n},toArray:function(e){return z(e,function(n){return n})||[]},only:function(e){if(!W(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};return h.Activity=U,h.Children=l,h.Component=S,h.Fragment=k,h.Profiler=b,h.PureComponent=B,h.StrictMode=T,h.Suspense=L,h.ViewTransition=te,h.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=v,h.__COMPILER_RUNTIME={__proto__:null,c:function(e){return v.H.useMemoCache(e)}},h.addTransitionType=i,h.cache=function(e){return function(){return e.apply(null,arguments)}},h.cacheSignal=function(){return null},h.cloneElement=function(e,n,a){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var o=g({},e.props),s=e.key;if(n!=null)for(c in n.key!==void 0&&(s=""+n.key),n)!Q.call(n,c)||c==="key"||c==="__self"||c==="__source"||c==="ref"&&n.ref===void 0||(o[c]=n[c]);var c=arguments.length-2;if(c===1)o.children=a;else if(1<c){for(var u=Array(c),y=0;y<c;y++)u[y]=arguments[y+2];o.children=u}return Z(e.type,s,o)},h.createContext=function(e){return e={$$typeof:j,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:x,_context:e},e},h.createElement=function(e,n,a){var o,s={},c=null;if(n!=null)for(o in n.key!==void 0&&(c=""+n.key),n)Q.call(n,o)&&o!=="key"&&o!=="__self"&&o!=="__source"&&(s[o]=n[o]);var u=arguments.length-2;if(u===1)s.children=a;else if(1<u){for(var y=Array(u),d=0;d<u;d++)y[d]=arguments[d+2];s.children=y}if(e&&e.defaultProps)for(o in u=e.defaultProps,u)s[o]===void 0&&(s[o]=u[o]);return Z(e,c,s)},h.createRef=function(){return{current:null}},h.forwardRef=function(e){return{$$typeof:F,render:e}},h.isValidElement=W,h.lazy=function(e){return{$$typeof:N,_payload:{_status:-1,_result:e},_init:ae}},h.memo=function(e,n){return{$$typeof:$,type:e,compare:n===void 0?null:n}},h.startTransition=t,h.unstable_useCacheRefresh=function(){return v.H.useCacheRefresh()},h.use=function(e){return v.H.use(e)},h.useActionState=function(e,n,a){return v.H.useActionState(e,n,a)},h.useCallback=function(e,n){return v.H.useCallback(e,n)},h.useContext=function(e){return v.H.useContext(e)},h.useDebugValue=function(){},h.useDeferredValue=function(e,n){return v.H.useDeferredValue(e,n)},h.useEffect=function(e,n){return v.H.useEffect(e,n)},h.useEffectEvent=function(e){return v.H.useEffectEvent(e)},h.useId=function(){return v.H.useId()},h.useImperativeHandle=function(e,n,a){return v.H.useImperativeHandle(e,n,a)},h.useInsertionEffect=function(e,n){return v.H.useInsertionEffect(e,n)},h.useLayoutEffect=function(e,n){return v.H.useLayoutEffect(e,n)},h.useMemo=function(e,n){return v.H.useMemo(e,n)},h.useOptimistic=function(e,n){return v.H.useOptimistic(e,n)},h.useReducer=function(e,n,a){return v.H.useReducer(e,n,a)},h.useRef=function(e){return v.H.useRef(e)},h.useState=function(e){return v.H.useState(e)},h.useSyncExternalStore=function(e,n,a){return v.H.useSyncExternalStore(e,n,a)},h.useTransition=function(){return v.H.useTransition()},h.version="19.3.1",h}var ye;function be(){return ye||(ye=1,ie.exports=Te()),ie.exports}var H=be();const gt=Ee(H);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xe=_=>_.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),pe=(..._)=>_.filter((m,k,T)=>!!m&&m.trim()!==""&&T.indexOf(m)===k).join(" ").trim();/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Re={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ae=H.forwardRef(({color:_="currentColor",size:m=24,strokeWidth:k=2,absoluteStrokeWidth:T,className:b="",children:x,iconNode:j,...F},L)=>H.createElement("svg",{ref:L,...Re,width:m,height:m,stroke:_,strokeWidth:T?Number(k)*24/Number(m):k,className:pe("lucide",b),...F},[...j.map(([$,N])=>H.createElement($,N)),...Array.isArray(x)?x:[x]]));/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=(_,m)=>{const k=H.forwardRef(({className:T,...b},x)=>H.createElement(Ae,{ref:x,iconNode:m,className:pe(`lucide-${xe(_)}`,T),...b}));return k.displayName=`${_}`,k};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ne=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],_t=f("ArrowRight",Ne);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Se=[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]],Mt=f("ArrowUpRight",Se);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pe=[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]],kt=f("Award",Pe);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $e=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],wt=f("Check",$e);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ie=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],Ct=f("ChevronDown",Ie);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oe=[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]],Et=f("ChevronUp",Oe);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const je=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],Tt=f("CircleAlert",je);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Le=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],bt=f("CircleCheck",Le);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qe=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polygon",{points:"10 8 16 12 10 16 10 8",key:"1cimsy"}]],xt=f("CirclePlay",qe);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ze=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],Rt=f("CircleX",ze);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const He=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],At=f("Circle",He);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fe=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]],Nt=f("Clock",Fe);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ue=[["path",{d:"M12 13v8",key:"1l5pq0"}],["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"m8 17 4-4 4 4",key:"1quai1"}]],St=f("CloudUpload",Ue);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Be=[["path",{d:"m18 16 4-4-4-4",key:"1inbqp"}],["path",{d:"m6 8-4 4 4 4",key:"15zrgr"}],["path",{d:"m14.5 4-5 16",key:"e7oirm"}]],Pt=f("CodeXml",Be);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const De=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]],$t=f("Copy",De);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ye=[["path",{d:"M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z",key:"1f1r0c"}]],It=f("Diamond",Ye);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ze=[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]],Ot=f("Download",Ze);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const We=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],jt=f("EyeOff",We);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ve=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]],Lt=f("FileSpreadsheet",Ve);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xe=[["path",{d:"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",key:"96xj49"}]],qt=f("Flame",Xe);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ge=[["path",{d:"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",key:"yt0hxn"}]],zt=f("Hexagon",Ge);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ke=[["path",{d:"M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z",key:"1z0uae"}]],Ht=f("Infinity",Ke);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Je=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],Ft=f("Layers",Je);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qe=[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}]],Ut=f("LayoutGrid",Qe);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const et=[["path",{d:"m3 17 2 2 4-4",key:"1jhpwq"}],["path",{d:"m3 7 2 2 4-4",key:"1obspn"}],["path",{d:"M13 6h8",key:"15sg57"}],["path",{d:"M13 12h8",key:"h98zly"}],["path",{d:"M13 18h8",key:"oe0vm4"}]],Bt=f("ListChecks",et);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tt=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],Dt=f("Moon",tt);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rt=[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]],Yt=f("Play",rt);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nt=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],Zt=f("RefreshCw",nt);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ot=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]],Wt=f("RotateCcw",ot);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const at=[["path",{d:"m18 14 4 4-4 4",key:"10pe0f"}],["path",{d:"m18 2 4 4-4 4",key:"pucp1d"}],["path",{d:"M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22",key:"1ailkh"}],["path",{d:"M2 6h1.972a4 4 0 0 1 3.6 2.2",key:"km57vx"}],["path",{d:"M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45",key:"os18l9"}]],Vt=f("Shuffle",at);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const st=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]],Xt=f("Square",st);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const it=[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]],Gt=f("Star",it);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ct=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],Kt=f("Sun",ct);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ut=[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]],Jt=f("Terminal",ut);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lt=[["line",{x1:"10",x2:"14",y1:"2",y2:"2",key:"14vaq8"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11",key:"17fdiu"}],["circle",{cx:"12",cy:"14",r:"8",key:"1e1u0o"}]],Qt=f("Timer",lt);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],er=f("TriangleAlert",ht);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ft=[["path",{d:"M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",key:"14u9p9"}]],tr=f("Triangle",ft);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dt=[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]],rr=f("Upload",dt);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yt=[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]],nr=f("Volume2",yt);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pt=[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]],or=f("VolumeX",pt);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vt=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],ar=f("X",vt);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mt=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],sr=f("Zap",mt);var ce={};(function _(m,k,T,b){var x=!!(m.Worker&&m.Blob&&m.Promise&&m.OffscreenCanvas&&m.OffscreenCanvasRenderingContext2D&&m.HTMLCanvasElement&&m.HTMLCanvasElement.prototype.transferControlToOffscreen&&m.URL&&m.URL.createObjectURL),j=typeof Path2D=="function"&&typeof DOMMatrix=="function",F=(function(){if(!m.OffscreenCanvas)return!1;try{var r=new OffscreenCanvas(1,1),t=r.getContext("2d");t.fillRect(0,0,1,1);var i=r.transferToImageBitmap();t.createPattern(i,"no-repeat")}catch{return!1}return!0})();function L(){}function $(r){var t=k.exports.Promise,i=t!==void 0?t:m.Promise;return typeof i=="function"?new i(r):(r(L,L),null)}var N=(function(r,t){return{transform:function(i){if(r)return i;if(t.has(i))return t.get(i);var l=new OffscreenCanvas(i.width,i.height),e=l.getContext("2d");return e.drawImage(i,0,0),t.set(i,l),l},clear:function(){t.clear()}}})(F,new Map),U=(function(){var r=Math.floor(16.666666666666668),t,i,l={},e=0;return typeof requestAnimationFrame=="function"&&typeof cancelAnimationFrame=="function"?(t=function(n){var a=Math.random();return l[a]=requestAnimationFrame(function o(s){e===s||e+r-1<s?(e=s,delete l[a],n()):l[a]=requestAnimationFrame(o)}),a},i=function(n){l[n]&&cancelAnimationFrame(l[n])}):(t=function(n){return setTimeout(n,r)},i=function(n){return clearTimeout(n)}),{frame:t,cancel:i}})(),te=(function(){var r,t,i={};function l(e){function n(a,o){e.postMessage({options:a||{},callback:o})}e.init=function(o){var s=o.transferControlToOffscreen();e.postMessage({canvas:s},[s])},e.fire=function(o,s,c){if(t)return n(o,null),t;var u=Math.random().toString(36).slice(2);return t=$(function(y){function d(M){M.data.callback===u&&(delete i[u],e.removeEventListener("message",d),t=null,N.clear(),c(),y())}e.addEventListener("message",d),n(o,u),i[u]=d.bind(null,{data:{callback:u}})}),t},e.reset=function(){e.postMessage({reset:!0});for(var o in i)i[o](),delete i[o]}}return function(){if(r)return r;if(!T&&x){var e=["var CONFETTI, SIZE = {}, module = {};","("+_.toString()+")(this, module, true, SIZE);","onmessage = function(msg) {","  if (msg.data.options) {","    CONFETTI(msg.data.options).then(function () {","      if (msg.data.callback) {","        postMessage({ callback: msg.data.callback });","      }","    });","  } else if (msg.data.reset) {","    CONFETTI && CONFETTI.reset();","  } else if (msg.data.resize) {","    SIZE.width = msg.data.resize.width;","    SIZE.height = msg.data.resize.height;","  } else if (msg.data.canvas) {","    SIZE.width = msg.data.canvas.width;","    SIZE.height = msg.data.canvas.height;","    CONFETTI = module.exports.create(msg.data.canvas);","  }","}"].join(`
`);try{r=new Worker(URL.createObjectURL(new Blob([e])))}catch(n){return typeof console<"u"&&typeof console.warn=="function"&&console.warn("🎊 Could not load worker",n),null}l(r)}return r}})(),X={particleCount:50,angle:90,spread:45,startVelocity:45,decay:.9,gravity:1,drift:0,ticks:200,x:.5,y:.5,shapes:["square","circle"],zIndex:100,colors:["#26ccff","#a25afd","#ff5e7e","#88ff5a","#fcff42","#ffa62d","#ff36ff"],disableForReducedMotion:!1,scalar:1};function re(r,t){return t?t(r):r}function G(r){return r!=null}function g(r,t,i){return re(r&&G(r[t])?r[t]:X[t],i)}function K(r){return r<0?0:Math.floor(r)}function S(r,t){return Math.floor(Math.random()*(t-r))+r}function q(r){return parseInt(r,16)}function B(r){return r.map(D)}function D(r){var t=String(r).replace(/[^0-9a-f]/gi,"");return t.length<6&&(t=t[0]+t[0]+t[1]+t[1]+t[2]+t[2]),{r:q(t.substring(0,2)),g:q(t.substring(2,4)),b:q(t.substring(4,6))}}function J(r){var t=g(r,"origin",Object);return t.x=g(t,"x",Number),t.y=g(t,"y",Number),t}function Y(r){r.width=document.documentElement.clientWidth,r.height=document.documentElement.clientHeight}function v(r){var t=r.getBoundingClientRect();r.width=t.width,r.height=t.height}function Q(r){var t=document.createElement("canvas");return t.style.position="fixed",t.style.top="0px",t.style.left="0px",t.style.pointerEvents="none",t.style.zIndex=r,t}function Z(r,t,i,l,e,n,a,o,s){r.save(),r.translate(t,i),r.rotate(n),r.scale(l,e),r.arc(0,0,1,a,o,s),r.restore()}function ne(r){var t=r.angle*(Math.PI/180),i=r.spread*(Math.PI/180);return{x:r.x,y:r.y,wobble:Math.random()*10,wobbleSpeed:Math.min(.11,Math.random()*.1+.05),velocity:r.startVelocity*.5+Math.random()*r.startVelocity,angle2D:-t+(.5*i-Math.random()*i),tiltAngle:(Math.random()*(.75-.25)+.25)*Math.PI,color:r.color,shape:r.shape,tick:0,totalTicks:r.ticks,decay:r.decay,drift:r.drift,random:Math.random()+2,tiltSin:0,tiltCos:0,wobbleX:0,wobbleY:0,gravity:r.gravity*3,ovalScalar:.6,scalar:r.scalar,flat:r.flat}}function W(r,t){t.x+=Math.cos(t.angle2D)*t.velocity+t.drift,t.y+=Math.sin(t.angle2D)*t.velocity+t.gravity,t.velocity*=t.decay,t.flat?(t.wobble=0,t.wobbleX=t.x+10*t.scalar,t.wobbleY=t.y+10*t.scalar,t.tiltSin=0,t.tiltCos=0,t.random=1):(t.wobble+=t.wobbleSpeed,t.wobbleX=t.x+10*t.scalar*Math.cos(t.wobble),t.wobbleY=t.y+10*t.scalar*Math.sin(t.wobble),t.tiltAngle+=.1,t.tiltSin=Math.sin(t.tiltAngle),t.tiltCos=Math.cos(t.tiltAngle),t.random=Math.random()+2);var i=t.tick++/t.totalTicks,l=t.x+t.random*t.tiltCos,e=t.y+t.random*t.tiltSin,n=t.wobbleX+t.random*t.tiltCos,a=t.wobbleY+t.random*t.tiltSin;if(r.fillStyle="rgba("+t.color.r+", "+t.color.g+", "+t.color.b+", "+(1-i)+")",r.beginPath(),j&&t.shape.type==="path"&&typeof t.shape.path=="string"&&Array.isArray(t.shape.matrix))r.fill(P(t.shape.path,t.shape.matrix,t.x,t.y,Math.abs(n-l)*.1,Math.abs(a-e)*.1,Math.PI/10*t.wobble));else if(t.shape.type==="bitmap"){var o=Math.PI/10*t.wobble,s=Math.abs(n-l)*.1,c=Math.abs(a-e)*.1,u=t.shape.bitmap.width*t.scalar,y=t.shape.bitmap.height*t.scalar,d=new DOMMatrix([Math.cos(o)*s,Math.sin(o)*s,-Math.sin(o)*c,Math.cos(o)*c,t.x,t.y]);d.multiplySelf(new DOMMatrix(t.shape.matrix));var M=r.createPattern(N.transform(t.shape.bitmap),"no-repeat");M.setTransform(d),r.globalAlpha=1-i,r.fillStyle=M,r.fillRect(t.x-u/2,t.y-y/2,u,y),r.globalAlpha=1}else if(t.shape==="circle")r.ellipse?r.ellipse(t.x,t.y,Math.abs(n-l)*t.ovalScalar,Math.abs(a-e)*t.ovalScalar,Math.PI/10*t.wobble,0,2*Math.PI):Z(r,t.x,t.y,Math.abs(n-l)*t.ovalScalar,Math.abs(a-e)*t.ovalScalar,Math.PI/10*t.wobble,0,2*Math.PI);else if(t.shape==="star")for(var p=Math.PI/2*3,w=4*t.scalar,C=8*t.scalar,E=t.x,A=t.y,O=5,R=Math.PI/O;O--;)E=t.x+Math.cos(p)*C,A=t.y+Math.sin(p)*C,r.lineTo(E,A),p+=R,E=t.x+Math.cos(p)*w,A=t.y+Math.sin(p)*w,r.lineTo(E,A),p+=R;else r.moveTo(Math.floor(t.x),Math.floor(t.y)),r.lineTo(Math.floor(t.wobbleX),Math.floor(e)),r.lineTo(Math.floor(n),Math.floor(a)),r.lineTo(Math.floor(l),Math.floor(t.wobbleY));return r.closePath(),r.fill(),t.tick<t.totalTicks}function oe(r,t,i,l,e){var n=t.slice(),a=r.getContext("2d"),o,s,c=$(function(u){function y(){o=s=null,a.clearRect(0,0,l.width,l.height),N.clear(),e(),u()}function d(){T&&!(l.width===b.width&&l.height===b.height)&&(l.width=r.width=b.width,l.height=r.height=b.height),!l.width&&!l.height&&(i(r),l.width=r.width,l.height=r.height),a.clearRect(0,0,l.width,l.height),n=n.filter(function(M){return W(a,M)}),n.length?o=U.frame(d):y()}o=U.frame(d),s=y});return{addFettis:function(u){return n=n.concat(u),c},canvas:r,promise:c,reset:function(){o&&U.cancel(o),s&&s()}}}function V(r,t){var i=!r,l=!!g(t||{},"resize"),e=!1,n=g(t,"disableForReducedMotion",Boolean),a=x&&!!g(t||{},"useWorker"),o=a?te():null,s=i?Y:v,c=r&&o?!!r.__confetti_initialized:!1,u=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion)").matches,y;function d(p,w,C){for(var E=g(p,"particleCount",K),A=g(p,"angle",Number),O=g(p,"spread",Number),R=g(p,"startVelocity",Number),ve=g(p,"decay",Number),me=g(p,"gravity",Number),ge=g(p,"drift",Number),ue=g(p,"colors",B),_e=g(p,"ticks",Number),le=g(p,"shapes"),Me=g(p,"scalar"),ke=!!g(p,"flat"),he=J(p),fe=E,se=[],we=r.width*he.x,Ce=r.height*he.y;fe--;)se.push(ne({x:we,y:Ce,angle:A,spread:O,startVelocity:R,color:ue[fe%ue.length],shape:le[S(0,le.length)],ticks:_e,decay:ve,gravity:me,drift:ge,scalar:Me,flat:ke}));return y?y.addFettis(se):(y=oe(r,se,s,w,C),y.promise)}function M(p){var w=n||g(p,"disableForReducedMotion",Boolean),C=g(p,"zIndex",Number);if(w&&u)return $(function(R){R()});i&&y?r=y.canvas:i&&!r&&(r=Q(C),document.body.appendChild(r)),l&&!c&&s(r);var E={width:r.width,height:r.height};o&&!c&&o.init(r),c=!0,o&&(r.__confetti_initialized=!0);function A(){if(o){var R={getBoundingClientRect:function(){if(!i)return r.getBoundingClientRect()}};s(R),o.postMessage({resize:{width:R.width,height:R.height}});return}E.width=E.height=null}function O(){y=null,l&&(e=!1,m.removeEventListener("resize",A)),i&&r&&(document.body.contains(r)&&document.body.removeChild(r),r=null,c=!1)}return l&&!e&&(e=!0,m.addEventListener("resize",A,!1)),o?o.fire(p,E,O):d(p,E,O)}return M.reset=function(){o&&o.reset(),y&&y.reset()},M}var I;function ee(){return I||(I=V(null,{useWorker:!0,resize:!0})),I}function P(r,t,i,l,e,n,a){var o=new Path2D(r),s=new Path2D;s.addPath(o,new DOMMatrix(t));var c=new Path2D;return c.addPath(s,new DOMMatrix([Math.cos(a)*e,Math.sin(a)*e,-Math.sin(a)*n,Math.cos(a)*n,i,l])),c}function z(r){if(!j)throw new Error("path confetti are not supported in this browser");var t,i;typeof r=="string"?t=r:(t=r.path,i=r.matrix);var l=new Path2D(t),e=document.createElement("canvas"),n=e.getContext("2d");if(!i){for(var a=1e3,o=a,s=a,c=0,u=0,y,d,M=0;M<a;M+=2)for(var p=0;p<a;p+=2)n.isPointInPath(l,M,p,"nonzero")&&(o=Math.min(o,M),s=Math.min(s,p),c=Math.max(c,M),u=Math.max(u,p));y=c-o,d=u-s;var w=10,C=Math.min(w/y,w/d);i=[C,0,0,C,-Math.round(y/2+o)*C,-Math.round(d/2+s)*C]}return{type:"path",path:t,matrix:i}}function ae(r){var t,i=1,l="#000000",e='"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';typeof r=="string"?t=r:(t=r.text,i="scalar"in r?r.scalar:i,e="fontFamily"in r?r.fontFamily:e,l="color"in r?r.color:l);var n=10*i,a=""+n+"px "+e,o=new OffscreenCanvas(n,n),s=o.getContext("2d");s.font=a;var c=s.measureText(t),u=Math.ceil(c.actualBoundingBoxRight+c.actualBoundingBoxLeft),y=Math.ceil(c.actualBoundingBoxAscent+c.actualBoundingBoxDescent),d=2,M=c.actualBoundingBoxLeft+d,p=c.actualBoundingBoxAscent+d;u+=d+d,y+=d+d,o=new OffscreenCanvas(u,y),s=o.getContext("2d"),s.font=a,s.fillStyle=l,s.fillText(t,M,p);var w=1/i;return{type:"bitmap",bitmap:o.transferToImageBitmap(),matrix:[w,0,0,w,-u*w/2,-y*w/2]}}k.exports=function(){return ee().apply(this,arguments)},k.exports.reset=function(){ee().reset()},k.exports.create=V,k.exports.shapeFromPath=z,k.exports.shapeFromText=ae})((function(){return typeof window<"u"?window:typeof self<"u"?self:this||{}})(),ce,!1);const ir=ce.exports;ce.exports.create;export{Mt as A,Ut as B,Tt as C,Ot as D,jt as E,Lt as F,St as G,zt as H,Ht as I,xt as J,Kt as K,Bt as L,Dt as M,Yt as P,gt as R,Vt as S,Qt as T,rr as U,nr as V,ar as X,sr as Z,H as a,Pt as b,Jt as c,wt as d,$t as e,bt as f,Ee as g,Ft as h,Nt as i,er as j,Et as k,Ct as l,qt as m,or as n,tr as o,It as p,At as q,be as r,Xt as s,Gt as t,Rt as u,_t as v,ir as w,kt as x,Wt as y,Zt as z};
