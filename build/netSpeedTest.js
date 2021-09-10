!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.netSpeedTest=e():t.netSpeedTest=e()}(self,(function(){return t={592:t=>{function e(t,e){return new CustomEvent(t,{detail:e,bubbles:!0,cancelable:!1})}t.exports={customEvent:e,dispatchEvent:function(t,n){document.dispatchEvent(e(t,n))}}},138:(t,e,n)=>{const o=n(555),s=n(592);function i(){return!!window.navigator.onLine}function r(t){this.options=t??{},this.times=this.options.times??5,this.timeout=this.options.timeout??6e4,this.defaultSize=90,this.defaultImg="https://static.uskid.com/web/garden/kr35hcx9_pM2BhLrQaH59M6LoeHY3kjme.jpeg",this.speedIntervalTimer=null,this.networkIntervalTimer=null,this.speedStatus=null,this.speed=0,this.speedInterval=this.options.speedInterval??5e3,this.reconnectCount=0,this.maxReconnectCount=this.timeout/this.speedInterval,this.onChange=()=>{console.log(this.speed)}}r.prototype.startMonitor=function(){this.initRealTimeMonitor(),this.startSpeed()},r.prototype.endSpeed=function(){clearInterval(this.speedIntervalTimer),this.speedIntervalTimer=null},r.prototype.endNetMonitor=function(){clearInterval(this.networkIntervalTimer),this.networkIntervalTimer=null},r.prototype.disconnect=function(){s.dispatchEvent("disconnect"),console.log("reconnectCount: ",this.reconnectCount),this.reconnectCount+=1,this.startSpeed(),this.reconnectCount>this.maxReconnectCount&&(this.endSpeed(),this.endNetMonitor())},r.prototype.startSpeed=function(){console.log("startSpeed: ",startSpeed),this.endSpeed(),i()&&(this.speedIntervalTimer=setInterval((()=>{i()&&this.testWithAjax()}),this.speedInterval))},r.prototype.initRealTimeMonitor=function(){s.dispatchEvent("init-monitor"),this.networkIntervalTimer=setInterval((()=>{i()||(console.log("断网重连接"),this.disconnect())}),2*this.speedInterval)},r.prototype.setNetSpeed=function(t,e){this.speed=e,this.setNetSpeedStatus(e),this.onChange(e),s.dispatchEvent("change-net-speed",this.speed),s.dispatchEvent("change-net-speed-status",this.speedStatus)},r.prototype.setNetSpeedStatus=function(t){return this.speedStatus=t>300?5:t>200&&t<=300?4:t>100&&t<=200?3:t>50&&t<=100?2:t>0&&t<=50?1:0,this.speedStatus},r.prototype.testWithImage=function(t,e){const n=e??this.defaultSize;return new Promise(((e,s)=>{let i=null,r=null,c=document.createElement("img");i=(new Date).getTime(),c.onload=t=>{r=(new Date).getTime();const s=o.calculateSpeed(n,i,r);this.setNetSpeed("image",s),e(s)},c.src=t??o.getNewUrl(this.defaultImg)})).catch((t=>{throw t}))},r.prototype.testWithAjax=function(t){return new Promise(((e,n)=>{let s=null,i=null,r=0;s=(new Date).getTime();const c=new XMLHttpRequest;c.onreadystatechange=()=>{if(4===c.readyState){i=(new Date).getTime(),r=c.getResponseHeader("Content-Length");const t=o.calculateSpeed(o.convertBytesToKb(r),s,i);this.setNetSpeed("ajax",t),e(t)}},c.open("GET",t??o.getNewUrl(this.defaultImg)),c.send()})).catch((t=>{throw t}))},r.prototype.testWithDownlink=function(){const t=window.navigator.connection;let e=0;return t&&t.downlink&&(e=o.convertMbpsToKb(t.downlink)),this.setNetSpeed("downlink",e),e},r.prototype.netSpeed=function(){const t=[];for(let e=0;e<this.times;e++)t.push(this.testWithAjax());return Promise.all(t).then((t=>{console.log("speeds: ",t);let e=0;return t.forEach((t=>{e+=t})),this.setNetSpeed("net",e/this.times),e/this.times}))},t.exports=r},555:t=>{const e=console.log.bind(console);function n(t){return t/1e3}t.exports={convertBytesToMbps:function(t){return t/1e3/1e3*8},convertMbpsToKb:function(t){return 1024*t/8},convertBytes:function(t){return t},calculateSpeed:function(t,o,s){return e("calculateSpeed: ",t,s-o),Math.floor(t/n(s-o))},convertMillisecondToSecond:n,convertBytesToKb:function(t){return t/1e3},getNewUrl:function(t){return`${t}?t=${(new Date).getTime()}`}}}},e={},function n(o){var s=e[o];if(void 0!==s)return s.exports;var i=e[o]={exports:{}};return t[o](i,i.exports,n),i.exports}(138);var t,e}));