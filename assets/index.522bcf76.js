import{g as d,M as l}from"./index.d806473d.js";import{M as s}from"./button.980a98d6.js";import{j as e,O as m,N as n,b as i,P as o}from"./index.8ea550b5.js";import"./index.188790cf.js";import"./index.ec04de20.js";import"./index.5dc48704.js";import"./index.78a796be.js";import"./index.eeb551cf.js";import"./index.5308cb84.js";const p=[{title:"Name",children:[{title:"First Name",dataIndex:"firstName",key:"firstName"},{title:"Last Name",dataIndex:"lastName",key:"lastName"}]},{title:"Age",dataIndex:"age",key:"age"},{title:"Address",dataIndex:"address",key:"address"},{title:"Tags",dataIndex:"tags",key:"tags",render:(r,t)=>e(n,{children:t.tags.map(a=>e(m,{color:"blue",children:a},a))})},{title:"Action",key:"action",render:(r,t)=>i(o,{size:"middle",children:[i(s,{type:"text",children:["Invite ",t.lastName]}),e(s,{type:"text",children:"Delete"})]})}],I=()=>e(l,{pageApi:d,tableOptions:p});export{I as default};
