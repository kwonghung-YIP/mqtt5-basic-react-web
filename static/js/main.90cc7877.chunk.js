(this["webpackJsonpmqtt5-basic-react-web"]=this["webpackJsonpmqtt5-basic-react-web"]||[]).push([[0],{43:function(e,n,t){},50:function(e,n){},52:function(e,n){},89:function(e,n){},90:function(e,n){},96:function(e,n,t){"use strict";t.r(n);var c=t(10),a=t(38),o=t.n(a),s=(t(43),t(18)),l=t(1),i=t(0),r=t(45),p=function(e,n){var t=Object(l.a)({},e);if("change/brokerUrl"===n.type)t=Object(l.a)(Object(l.a)({},e),{},{brokerUrl:n.payload.target.value});else if("change/username"===n.type)t=Object(l.a)(Object(l.a)({},e),{},{username:n.payload.target.value});else if("change/password"===n.type)t=Object(l.a)(Object(l.a)({},e),{},{password:n.payload.target.value});else if("change/publishTopic"===n.type)t=Object(l.a)(Object(l.a)({},e),{},{publishTopic:n.payload.target.value});else if("change/responseTopic"===n.type)t=Object(l.a)(Object(l.a)({},e),{},{responseTopic:n.payload.target.value});else if("change/message"===n.type)t=Object(l.a)(Object(l.a)({},e),{},{message:n.payload.target.value});else if("client/init"===n.type)t=Object(l.a)(Object(l.a)({},e),{},{mqttClient:n.payload});else if("client/connect"===n.type)t=Object(l.a)(Object(l.a)({},e),{},{connected:!0});else if("client/end"===n.type)t=Object(l.a)(Object(l.a)({},e),{},{mqttClient:null,connected:!1});else if("message/received"===n.type){var c=n.payload,a=c.message,o=c.topic;console.log("message received from topic [".concat(o,"] : [").concat(a,"]"))}else if("packet/sent"===n.type){var s=n.payload;console.log("package sent to topic [".concat(s.topic,"] : messageId [").concat(s.messageId,"]"))}else if("packet/received"===n.type){var i=n.payload;console.log("package received from topic [".concat(i.topic,"] : messageId [").concat(i.messageId,"]"))}return t},d=function(e){return Object(i.jsxs)("div",{className:"mt-2 row",children:[Object(i.jsx)("label",{htmlFor:e.id,className:"col-sm-2 col-form-label",children:e.label}),Object(i.jsx)("div",{className:"col-sm-10",children:Object(i.jsx)("input",{id:e.id,className:"form-control",readOnly:e.readOnly,value:e.value,onChange:e.onChange})})]})},u=function(e){var n="webclient_".concat(Math.random().toString(16).substr(2,8)),t={clientId:n,brokerUrl:e.url,username:e.username,password:e.password,publishTopic:"request/echo",responseTopic:"response/".concat(n,"/echo"),message:"GoGoGo!",mqttClient:null,connected:!1},a=Object(c.useReducer)(p,t),o=Object(s.a)(a,2),l=o[0],u=o[1],b=Object(c.useState)([]),m=Object(s.a)(b,2),g=m[0],j=m[1],y=function(e){g.push({ts:new Date,msg:e}),j(g)};return Object(i.jsxs)("div",{className:"container my-3",children:[Object(i.jsx)("h2",{children:"MQTT.js Test Client"}),Object(i.jsx)(d,{id:"clientId",label:"Client ID",readOnly:!0,value:l.clientId,onChange:function(e){return u({type:"change/clientId",payload:e})}}),Object(i.jsx)(d,{id:"brokerUrl",label:"Broker URL",readOnly:l.connected,value:l.brokerUrl,onChange:function(e){return u({type:"change/brokerUrl",payload:e})}}),Object(i.jsx)(d,{id:"usename",label:"Username",readOnly:l.connected,value:l.username,onChange:function(e){return u({type:"change/username",payload:e})}}),Object(i.jsx)(d,{id:"password",label:"Password",readOnly:l.connected,value:l.password,onChange:function(e){return u({type:"change/password",payload:e})}}),Object(i.jsx)(d,{id:"publishTopic",label:"Publish Topic",value:l.publishTopic,onChange:function(e){return u({type:"change/publishTopic",payload:e})}}),Object(i.jsx)(d,{id:"responseTopic",label:"Response Topic",value:l.responseTopic,onChange:function(e){return u({type:"change/responseTopic",payload:e})}}),Object(i.jsx)(d,{id:"message",label:"Message",value:l.message,onChange:function(e){return u({type:"change/message",payload:e})}}),Object(i.jsxs)("div",{className:"mt-2",children:[Object(i.jsx)("button",{className:"btn btn-primary ms-2",disabled:l.connected,onClick:function(){var e=l.clientId,n=l.username,t=l.password;if(null==l.mqttClient){var c=r.connect(l.brokerUrl,{clientId:e,reconnectPeriod:0,protocolVersion:5,username:n,password:t});c.on("error",(function(e){console.error(e)})),c.on("connect",(function(e){u({type:"client/connect",payload:e}),y("client connected: ".concat(JSON.stringify(e)));var n=l.responseTopic;c.subscribe(n,{},(function(e,n){}))})),c.on("message",(function(e,n,t){y("message received : topic - [".concat(e,"], message - [").concat(n,"]")),u({type:"message/received",payload:{topic:e,message:n,packet:t}})})),c.on("packetsend",(function(e){u({type:"packet/sent",payload:e}),y("packet sent: ".concat(JSON.stringify(e)))})),c.on("packetreceive",(function(e){u({type:"packet/received",payload:e}),y("packet received: ".concat(JSON.stringify(e)))})),c.on("disconnect",(function(e){console.log("client disconnect")})),c.on("offline",(function(){console.log("client offline")})),c.on("reconnect",(function(){console.log("client reconnect")})),c.on("close",(function(){console.log("client close")})),c.on("end",(function(){u({type:"client/end",payload:c})})),u({type:"client/init",payload:c}),y("client connecting to [".concat(l.brokerUrl,"]..."))}},children:"Connect"}),Object(i.jsx)("button",{className:"btn btn-primary mx-2",disabled:!l.connected,onClick:function(){var e=l.mqttClient;null!=e&&e.end()},children:"Disconnect"}),Object(i.jsx)("button",{className:"btn btn-secondary me-2",disabled:!l.connected,onClick:function(){var e=l.mqttClient,n=l.publishTopic,t=l.responseTopic,c=l.message,a={retain:!0,properties:{responseTopic:t,correlationData:"".concat(Math.random().toString(16)),payloadFormatIndicator:!0,contentType:"text/plain"}};e.publish(n,c,a,(function(){console.log("message published!")}))},children:"Send message"})]}),Object(i.jsxs)("div",{className:"mt-2",children:[Object(i.jsx)("label",{htmlFor:"logs",className:"form-label",children:"Logs"}),Object(i.jsx)("textarea",{id:"logs",className:"form-control",rows:"10",readOnly:!0,value:g.reduce((function(e,n){return e+="- [".concat(n.ts.toTimeString(),"]\n").concat(n.msg,"\n")}),"")})]})]})},b=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,97)).then((function(n){var t=n.getCLS,c=n.getFID,a=n.getFCP,o=n.getLCP,s=n.getTTFB;t(e),c(e),a(e),o(e),s(e)}))};o.a.render(Object(i.jsx)(u,{url:"wss://localhost:8001/mqtt",username:"user1",password:"hm93bqCj6xR562U"}),document.getElementById("root")),b()}},[[96,1,2]]]);
//# sourceMappingURL=main.90cc7877.chunk.js.map