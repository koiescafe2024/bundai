import{g as r,M as n}from"./index.8ca4fc46.js";import{M as s}from"./button.1ca27f03.js";import{j as e,O as m,y as o,i,ac as l}from"./vendor.a66b3477.js";import"./index.aa118ebd.js";import"./index.b9e7697f.js";import"./index.acdb14ea.js";import"./index.d8801c7a.js";import"./index.e18404d0.js";import"./index.229fec52.js";import"./index.bf768794.js";const c=[{title:"Name",children:[{title:"First Name",dataIndex:"firstName",key:"firstName"},{title:"Last Name",dataIndex:"lastName",key:"lastName"}]},{title:"Age",dataIndex:"age",key:"age"},{title:"Address",dataIndex:"address",key:"address"},{title:"Tags",dataIndex:"tags",key:"tags",render:(d,t)=>e(o,{children:t.tags.map(a=>e(m,{color:"blue",children:a},a))})},{title:"Action",key:"action",render:(d,t)=>i(l,{size:"middle",children:[i(s,{type:"text",children:["Invite ",t.lastName]}),e(s,{type:"text",children:"Delete"})]})}],k=()=>e(n,{pageApi:r,tableOptions:c});export{k as default};
