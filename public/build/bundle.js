var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function c(t){return"function"==typeof t}function i(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function l(t,e){t.appendChild(e)}function u(t,e,n){t.insertBefore(e,n||null)}function s(t){t.parentNode.removeChild(t)}function r(t){return document.createElement(t)}function f(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function a(t){return document.createTextNode(t)}function h(){return a(" ")}function d(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function p(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function g(t,e){t.value=null==e?"":e}let $;function m(t){$=t}function v(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach((t=>t.call(this,e)))}const b=[],x=[],k=[],w=[],y=Promise.resolve();let _=!1;function z(t){k.push(t)}function E(t){w.push(t)}const L=new Set;let C=0;function M(){const t=$;do{for(;C<b.length;){const t=b[C];C++,m(t),q(t.$$)}for(m(null),b.length=0,C=0;x.length;)x.pop()();for(let t=0;t<k.length;t+=1){const e=k[t];L.has(e)||(L.add(e),e())}k.length=0}while(b.length);for(;w.length;)w.pop()();_=!1,L.clear(),m(t)}function q(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(z)}}const A=new Set;let V;function H(){V={r:0,c:[],p:V}}function I(){V.r||o(V.c),V=V.p}function N(t,e){t&&t.i&&(A.delete(t),t.i(e))}function S(t,e,n,o){if(t&&t.o){if(A.has(t))return;A.add(t),V.c.push((()=>{A.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}function j(t,e,n){const o=t.$$.props[e];void 0!==o&&(t.$$.bound[o]=n,n(t.$$.ctx[o]))}function B(t){t&&t.c()}function O(t,n,i,l){const{fragment:u,on_mount:s,on_destroy:r,after_update:f}=t.$$;u&&u.m(n,i),l||z((()=>{const n=s.map(e).filter(c);r?r.push(...n):o(n),t.$$.on_mount=[]})),f.forEach(z)}function T(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function P(t,e){-1===t.$$.dirty[0]&&(b.push(t),_||(_=!0,y.then(M)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Q(e,c,i,l,u,r,f,a=[-1]){const h=$;m(e);const d=e.$$={fragment:null,ctx:null,props:r,update:t,not_equal:u,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(c.context||(h?h.$$.context:[])),callbacks:n(),dirty:a,skip_bound:!1,root:c.target||h.$$.root};f&&f(d.root);let p=!1;if(d.ctx=i?i(e,c.props||{},((t,n,...o)=>{const c=o.length?o[0]:n;return d.ctx&&u(d.ctx[t],d.ctx[t]=c)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](c),p&&P(e,t)),n})):[],d.update(),p=!0,o(d.before_update),d.fragment=!!l&&l(d.ctx),c.target){if(c.hydrate){const t=function(t){return Array.from(t.childNodes)}(c.target);d.fragment&&d.fragment.l(t),t.forEach(s)}else d.fragment&&d.fragment.c();c.intro&&N(e.$$.fragment),O(e,c.target,c.anchor,c.customElement),M()}m(h)}class W{$destroy(){T(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function Y(e){let n,o;return{c(){n=f("svg"),o=f("path"),p(o,"d","M341,128V99c0-19.1-14.5-35-34.5-35H205.4C185.5,64,171,79.9,171,99v29H80v32h9.2c0,0,5.4,0.6,8.2,3.4c2.8,2.8,3.9,9,3.9,9  l19,241.7c1.5,29.4,1.5,33.9,36,33.9h199.4c34.5,0,34.5-4.4,36-33.8l19-241.6c0,0,1.1-6.3,3.9-9.1c2.8-2.8,8.2-3.4,8.2-3.4h9.2v-32  h-91V128z M192,99c0-9.6,7.8-15,17.7-15h91.7c9.9,0,18.6,5.5,18.6,15v29H192V99z M183.5,384l-10.3-192h20.3L204,384H183.5z   M267.1,384h-22V192h22V384z M328.7,384h-20.4l10.5-192h20.3L328.7,384z"),p(o,"fill",e[0]),p(n,"height",e[2]),p(n,"width",e[1]),p(n,"id","Layer_1"),p(n,"version","1.1"),p(n,"viewBox","0 0 512 512"),p(n,"xml:space","preserve"),p(n,"xmlns","http://www.w3.org/2000/svg"),p(n,"xmlns:xlink","http://www.w3.org/1999/xlink")},m(t,e){u(t,n,e),l(n,o)},p(t,[e]){1&e&&p(o,"fill",t[0]),4&e&&p(n,"height",t[2]),2&e&&p(n,"width",t[1])},i:t,o:t,d(t){t&&s(n)}}}function D(t,e,n){let{fill:o="ddddd"}=e,{width:c="30px"}=e,{height:i="30px"}=e;return t.$$set=t=>{"fill"in t&&n(0,o=t.fill),"width"in t&&n(1,c=t.width),"height"in t&&n(2,i=t.height)},[o,c,i]}class F extends W{constructor(t){super(),Q(this,t,D,Y,i,{fill:0,width:1,height:2})}}function G(t){let e,n,c,i,f,g,$,m,v,b,x,k,w,y=t[1].name+"";return b=new F({}),{c(){e=r("li"),n=r("div"),c=r("input"),i=h(),f=r("span"),g=a(y),m=h(),v=r("button"),B(b.$$.fragment),p(c,"type","checkbox"),p(c,"class","svelte-1xeauuf"),p(f,"class",$="text "+(t[1].bought&&"checked")+" svelte-1xeauuf"),p(n,"class","svelte-1xeauuf"),p(v,"class","svelte-1xeauuf"),p(e,"class","item svelte-1xeauuf")},m(o,s){u(o,e,s),l(e,n),l(n,c),c.checked=t[0],l(n,i),l(n,f),l(f,g),l(e,m),l(e,v),O(b,v,null),x=!0,k||(w=[d(c,"change",t[4]),d(c,"change",t[3]),d(v,"click",t[2])],k=!0)},p(t,[e]){1&e&&(c.checked=t[0]),(!x||2&e)&&y!==(y=t[1].name+"")&&function(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}(g,y),(!x||2&e&&$!==($="text "+(t[1].bought&&"checked")+" svelte-1xeauuf"))&&p(f,"class",$)},i(t){x||(N(b.$$.fragment,t),x=!0)},o(t){S(b.$$.fragment,t),x=!1},d(t){t&&s(e),T(b),k=!1,o(w)}}}function J(t,e,n){let{checked:o}=e,{item:c}=e;return t.$$set=t=>{"checked"in t&&n(0,o=t.checked),"item"in t&&n(1,c=t.item)},[o,c,function(e){v.call(this,t,e)},function(e){v.call(this,t,e)},function(){o=this.checked,n(0,o)}]}class K extends W{constructor(t){super(),Q(this,t,J,G,i,{checked:0,item:1})}}function R(e){let n,c,i,f,$,m,v,b;return{c(){n=r("div"),c=r("input"),i=h(),f=r("button"),$=a("Add"),p(c,"class","input svelte-zq5rk"),p(c,"type","text"),p(c,"placeholder","eg. apples"),f.disabled=m=!e[0],p(f,"class","svelte-zq5rk"),p(n,"class","form svelte-zq5rk")},m(t,o){u(t,n,o),l(n,c),g(c,e[0]),l(n,i),l(n,f),l(f,$),v||(b=[d(c,"input",e[2]),d(f,"click",e[1])],v=!0)},p(t,[e]){1&e&&c.value!==t[0]&&g(c,t[0]),1&e&&m!==(m=!t[0])&&(f.disabled=m)},i:t,o:t,d(t){t&&s(n),v=!1,o(b)}}}function U(t,e,n){let{value:o}=e;return t.$$set=t=>{"value"in t&&n(0,o=t.value)},[o,function(e){v.call(this,t,e)},function(){o=this.value,n(0,o)}]}class X extends W{constructor(t){super(),Q(this,t,U,R,i,{value:0})}}function Z(t,e,n){const o=t.slice();return o[9]=e[n],o[10]=e,o[11]=n,o}function tt(t){let e,n,o=t[1],c=[];for(let e=0;e<o.length;e+=1)c[e]=nt(Z(t,o,e));const i=t=>S(c[t],1,1,(()=>{c[t]=null}));return{c(){e=r("ul");for(let t=0;t<c.length;t+=1)c[t].c();p(e,"class","list svelte-1v5ok7z")},m(t,o){u(t,e,o);for(let t=0;t<c.length;t+=1)c[t].m(e,null);n=!0},p(t,n){if(26&n){let l;for(o=t[1],l=0;l<o.length;l+=1){const i=Z(t,o,l);c[l]?(c[l].p(i,n),N(c[l],1)):(c[l]=nt(i),c[l].c(),N(c[l],1),c[l].m(e,null))}for(H(),l=o.length;l<c.length;l+=1)i(l);I()}},i(t){if(!n){for(let t=0;t<o.length;t+=1)N(c[t]);n=!0}},o(t){c=c.filter(Boolean);for(let t=0;t<c.length;t+=1)S(c[t]);n=!1},d(t){t&&s(e),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(c,t)}}}function et(e){let n;return{c(){n=r("p"),n.textContent="Your shopping list is empty!"},m(t,e){u(t,n,e)},p:t,i:t,o:t,d(t){t&&s(n)}}}function nt(t){let e,n,o;function c(e){t[6](e,t[9])}let i={item:t[9]};return void 0!==t[9].bought&&(i.checked=t[9].bought),e=new K({props:i}),x.push((()=>j(e,"checked",c))),e.$on("click",(function(){return t[7](t[11])})),e.$on("change",(function(){return t[8](t[11])})),{c(){B(e.$$.fragment)},m(t,n){O(e,t,n),o=!0},p(o,c){t=o;const i={};2&c&&(i.item=t[9]),!n&&2&c&&(n=!0,i.checked=t[9].bought,E((()=>n=!1))),e.$set(i)},i(t){o||(N(e.$$.fragment,t),o=!0)},o(t){S(e.$$.fragment,t),o=!1},d(t){T(e,t)}}}function ot(t){let e,n,o,c,i,f,a,d,g,$;function m(e){t[5](e)}let v={};void 0!==t[0]&&(v.value=t[0]),i=new X({props:v}),x.push((()=>j(i,"value",m))),i.$on("click",t[2]);const b=[et,tt],k=[];function w(t,e){return 0===t[1].length?0:1}return d=w(t),g=k[d]=b[d](t),{c(){e=r("main"),n=r("div"),o=r("h1"),o.textContent="Shopping List",c=h(),B(i.$$.fragment),a=h(),g.c(),p(o,"class","svelte-1v5ok7z"),p(n,"class","list-container svelte-1v5ok7z"),p(e,"class","svelte-1v5ok7z")},m(t,s){u(t,e,s),l(e,n),l(n,o),l(n,c),O(i,n,null),l(n,a),k[d].m(n,null),$=!0},p(t,[e]){const o={};!f&&1&e&&(f=!0,o.value=t[0],E((()=>f=!1))),i.$set(o);let c=d;d=w(t),d===c?k[d].p(t,e):(H(),S(k[c],1,1,(()=>{k[c]=null})),I(),g=k[d],g?g.p(t,e):(g=k[d]=b[d](t),g.c()),N(g,1),g.m(n,null))},i(t){$||(N(i.$$.fragment,t),N(g),$=!0)},o(t){S(i.$$.fragment,t),S(g),$=!1},d(t){t&&s(e),T(i),k[d].d()}}}function ct(t,e,n){let{newItem:o}=e,{shoppingList:c=[{name:"Watermelon",bought:!1},{name:"Chocolate",bought:!1},{name:"Quinoa",bought:!0}]}=e;function i(t){const e=[...c],o=e.splice(t,1)[0];o.bought?e.splice(e.length,0,o):e.splice(0,0,o),n(1,c=e)}function l(t){const e=[...c];e.splice(t,1),n(1,c=e)}return t.$$set=t=>{"newItem"in t&&n(0,o=t.newItem),"shoppingList"in t&&n(1,c=t.shoppingList)},[o,c,function(){const t=[{name:o,bought:!1},...c];n(1,c=t),n(0,o="")},i,l,function(t){o=t,n(0,o)},function(e,o){t.$$.not_equal(o.bought,e)&&(o.bought=e,n(1,c))},t=>l(t),t=>i(t)]}return new class extends W{constructor(t){super(),Q(this,t,ct,ot,i,{newItem:0,shoppingList:1})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
