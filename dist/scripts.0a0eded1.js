parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"imtx":[function(require,module,exports) {
function e(e,t,n,r,o,a,c){try{var i=e[a](c),u=i.value}catch(s){return void n(s)}i.done?t(u):Promise.resolve(u).then(r,o)}function t(t){return function(){var n=this,r=arguments;return new Promise(function(o,a){var c=t.apply(n,r);function i(t){e(c,o,a,i,u,"next",t)}function u(t){e(c,o,a,i,u,"throw",t)}i(void 0)})}}var n=document.getElementById("record"),r=document.getElementById("buttons"),o=document.getElementById("Welcome"),a=document.getElementById("stop"),c=document.getElementById("audio-filters"),i=document.getElementById("end"),u=[],s={audio:!0},d=function(){var e=t(regeneratorRuntime.mark(function e(r){var o,c,i,s,d,p,g,b,h,w,x,k,B;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:k=function(){return(k=t(regeneratorRuntime.mark(function e(){var t,n,r;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=o.createConvolver(),new FileReader,n=y(),e.next=5,v(n);case 5:return r=e.sent,e.next=8,o.decodeAudioData(r);case 8:return t.buffer=e.sent,e.abrupt("return",t);case 10:case"end":return e.stop()}},e)}))).apply(this,arguments)},x=function(){return k.apply(this,arguments)},w=function(){p.connect(d),d.curve=function(e){for(var t,n="number"==typeof e?e:60,r=new Float32Array(44100),o=Math.PI/180,a=0;a<44100;++a)t=2*a/44100-1,r[a]=(3+n)*t*20*o/(Math.PI+n*Math.abs(t));return r}(800),d.oversample="4x",d.connect(c)},h=function(){p.connect(g),g.type="highpass",g.frequency.setValueAtTime(6e3,o.currentTime),g.connect(b),b.type="peaking",b.frequency.setValueAtTime(7e3,o.currentTime),b.Q=20,b.gain.setValueAtTime(30,o.currentTime),b.connect(c)},o=new(window.AudioContext||window.webkitAudioContext),c=o.createMediaStreamDestination(),i=new MediaRecorder(c.stream),s=function(){i.start(),a.disabled=!1,n.disabled=!0;var e=l(n,"#b61827","white");console.log("result",e)},n.onclick=s,i.ondataavailable=function(e){u.push(e.data)},a.onclick=function(){i.stop(),l(n,"rgb(255, 134,124, .4)","black"),a.disabled=!0,n.disabled=!1},i.onstop=function(e){var t=new Blob(u,{type:"audio/ogg; codecs=opus"});u=[],f(window.URL.createObjectURL(t)),m()},d=o.createWaveShaper(),p=o.createMediaStreamSource(r),g=o.createBiquadFilter(),b=o.createBiquadFilter(),B=document.getElementById("audio-filters"),w(),B.addEventListener("change",t(regeneratorRuntime.mark(function e(){var t,n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if("distordus"!==(t=B.options[B.selectedIndex].value)){e.next=6;break}b.disconnect(),w(),e.next=19;break;case 6:if("HighPass"!==t){e.next=11;break}d.disconnect(),h(),e.next=19;break;case 11:if("reverb"!==t){e.next=19;break}return e.next=14,x();case 14:n=e.sent,d.disconnect(),b.disconnect(),p.connect(n),n.connect(c);case 19:case"end":return e.stop()}},e)})));case 19:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}();function l(e,t,n){return e.style.backgroundColor=t,e.style.color=n,"poute"}function f(e){var t=document.createElement("audio");t.setAttribute("controls",!0),t.src=e,t.className="audio-display-style",document.body.insertBefore(t,i)}function m(){var e=document.createTextNode("mon titre audio"),t=document.createElement("div");t.appendChild(e),document.body.insertBefore(t,i)}var p=function(e){console.log("The following error occured: "+e)};function v(e){return g.apply(this,arguments)}function g(){return(g=t(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise(function(e){var n=new FileReader;n.onload=function(t){e(t.target.result)},n.readAsArrayBuffer(t)}));case 1:case"end":return e.stop()}},e)}))).apply(this,arguments)}function y(){return document.getElementById("reverb-file").files[0]}var b=function(e){d(e)};navigator.mediaDevices.getUserMedia(s).then(b,p);
},{}]},{},["imtx"], null)
//# sourceMappingURL=/scripts.0a0eded1.js.map