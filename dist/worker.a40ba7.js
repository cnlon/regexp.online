!function(e){function t(o){if(r[o])return r[o].exports;var n=r[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,t),n.l=!0,n.exports}var r={};t.m=e,t.c=r,t.d=function(e,r,o){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/",t(t.s=1)}([function(e,t,r){"use strict";t.__esModule=!0;t.MODE_NONE=null,t.MODE_LIST="l",t.MODE_REPLACE="r",t.PARSE="P",t.RESIZE="S",t.ERROR="E",t.READY="R",t.BOX_NONE=null,t.BOX_NAV="N",t.BOX_FLAGS="F",t.BOX_MODES="M"},function(e,t,r){"use strict";var o=r(0),n=r(2),i=function(e){return e&&e.__esModule?e:{default:e}}(n),a=new i.default({});onmessage=function(e){var t=e.data,r=t[0],n=t[1];switch(r){case o.PARSE:var i=a.parse(n),s=i.error;s?postMessage([o.ERROR,s]):postMessage([o.PARSE,i]);break;case o.RESIZE:a.resize(n)}},postMessage([o.READY])},function(e,t,r){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e){return e.replace(c,u)}t.__esModule=!0;var i=r(0),a=r(3),s=function(e){return e&&e.__esModule?e:{default:e}}(a),c=/\\n/g,u="\n",l=/\$[&0-9]/g,p=function(){function e(t){o(this,e),this.coordinates=new s.default(t),this._lastParams=null,this._lastExec=null}return e.prototype.resize=function(e){this.coordinates.resize(e)},e.prototype.parse=function(e){var t={matches:[],output:"",error:null},r=e.source,o=e.flags;if(!r)return t;var a=null;try{a=new RegExp(r,o)}catch(e){return t.error=e.message,t}if(!a)return t;var s=e.input;if(!s)return t;var c=e.mode;if(!c){var u=this._exec(a,s),p=u.matches;return t.matches=p,t}var h=n(e.resolve||"");if(c===i.MODE_LIST){var f=h.match(l);if(!f||f.length<1){var d=this._execAndJoinList(a,s,h),v=d.matches,_=d.output;return t.matches=v,t.output=_,t}for(var x,b,g,y=[],O=0,m=f.length;O<m;O++)x=f[O],b=x.substr(1,1),g="&"===b?0:Number(b),y[g]=x;var E=this._execAndReplaceList(a,s,h,y),R=E.matches,M=E.output;return t.matches=R,t.output=M,t}var w=this._execAndReplace(a,s,h),A=w.matches,P=w.output;return t.matches=A,t.output=P,t},e.prototype._exec=function(e,t){this.coordinates.hold(t);var r=[];if(e.global)for(var o=void 0,n=void 0,i=void 0;;){if(o=e.exec(t),!(i=o&&o[0]))break;n=this.coordinates.compute(o.index,i.length),r.push(Object.assign({value:i,subs:o.slice(1)},n))}else{var a=e.exec(t),s=a&&a[0];if(s){var c=this.coordinates.compute(a.index,s.length);r.push(Object.assign({value:s,subs:a.slice(1)},c))}}return{matches:r}},e.prototype._execAndJoinList=function(e,t,r){this.coordinates.hold(t);for(var o=[],n="",i=void 0,a=void 0,s=void 0;;){if(i=e.exec(t),!(s=i&&i[0]))break;a=this.coordinates.compute(i.index,s.length),o.push(Object.assign({value:s,subs:i.slice(1)},a)),n+=s+r}return{matches:o,output:n}},e.prototype._execAndReplaceList=function(e,t,r,o){this.coordinates.hold(t);for(var n=[],i="",a=void 0,s=void 0,c=void 0,u=void 0;;){if(!(a=e.exec(t))||!a[0])break;c=a[0],s=this.coordinates.compute(a.index,c.length),n.push(Object.assign({value:c,subs:a.slice(1)},s)),u=r,o.forEach(function(e,t){void 0!==a[t]&&(u=u.replace(e,a[t]))}),i+=u}return{matches:n,output:i}},e.prototype._execAndReplace=function(e,t,r){this.coordinates.hold(t);for(var o=[],n=void 0,i=void 0,a=void 0;;){if(n=e.exec(t),!(a=n&&n[0]))break;i=this.coordinates.compute(n.index,a.length),o.push(Object.assign({value:a,subs:n.slice(1)},i))}return{matches:o,output:t.replace(e,r)}},e}();t.default=p},function(e,t,r){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0;var a=/\n/g,s=function(e){function t(){var r,i,a;o(this,t);for(var s=arguments.length,c=Array(s),u=0;u<s;u++)c[u]=arguments[u];return r=i=n(this,e.call.apply(e,[this].concat(c))),i.options={},i._paraIndex=0,a=r,n(i,a)}return i(t,e),t.prototype.resize=function(e){var t=e.charWidth,r=e.paddingLeft,o=e.paddingRight,n=e.canvasWidth;e.charsPeerLine=Math.floor((n-r-o)/t),this.options=e},t.prototype.hold=function(e){if(this._clear(),e)for(var t=this.options.charsPeerLine,r=this[0],o=void 0,n=void 0,i=void 0,s=void 0,c=void 0;;){if(!(o=a.exec(e)))break;n=o.index,i=n-r.index,i<=1?(s=1,c=0):(s=Math.ceil((i-1)/t),0===(c=(i-1)%t)&&(c=t)),r={index:n,para:r.para+1,line:r.line+s,col:c},this.push(r)}},t.prototype.compute=function(e,t){for(var r=this.length-1,o=void 0;this._paraIndex<r&&(o=this[this._paraIndex+1],!(o.index>e));)this._paraIndex++;var n=this.options,i=n.charWidth,a=n.charHeight,s=n.charsPeerLine,c=this[this._paraIndex],u=e-c.index,l=Math.ceil(u/s),p=u%s;p=(0===p?s:p)-1;var h=c.para+1,f=c.line+l,d=void 0;if(p+t<s)d=[[i*p,a*f,i*t,a]];else{var v=s-p;d=[[i*p,a*f,i*v,a]];var _=t-v,x=Math.floor(_/s),b=f+1;x>0&&(d.push([0,a*b,i*s,a*x]),b+=x);var g=_%s;d.push([0,a*b,i*g,a])}return{index:e,para:h,line:f,col:p,xywhs:d}},t.prototype._clear=function(){this.splice(0,this.length,{index:-1,para:-1,col:-1,line:-1}),this._paraIndex=0},t}(function(e){function t(){e.apply(this,arguments)}return t.prototype=Object.create(e.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e,t}(Array));t.default=s}]);
//# sourceMappingURL=worker.a40ba7.js.map