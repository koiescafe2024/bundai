import{M as r,g as d}from"./index.6b0f9209.js";import{M as n}from"./button.4dfe45c9.js";import{j as e,i,y as m,O as p,ac as o}from"./vendor.7463b913.js";import"./index.f3be6a93.js";import"./index.756ae0e1.js";import"./index.0cd9dfd3.js";import"./index.f19a21fe.js";import"./index.fd3a070e.js";import"./index.92ab708a.js";import"./index.c6b170cb.js";const{Item:a}=r.MySearch,b=[{title:"Tab-1",key:1},{title:"Tab-2",key:2},{title:"Tab-3",key:3}],N=[{label:"Tab-1",value:1},{label:"Tab-2",value:2},{label:"Tab-3",value:3}],y=[{title:"Name",children:[{title:"First Name",dataIndex:"firstName",key:"firstName"},{title:"Last Name",dataIndex:"lastName",key:"lastName"}]},{title:"Age",dataIndex:"age",key:"age"},{title:"Address",dataIndex:"address",key:"address"},{title:"Tags",dataIndex:"tags",key:"tags",render:(l,t)=>e(m,{children:t.tags.map(s=>e(p,{color:"blue",children:s},s))})},{title:"Action",key:"action",render:(l,t)=>i(o,{size:"middle",children:[i(n,{type:"text",children:["Invite ",t.lastName]}),e(n,{type:"text",children:"Delete"})]})}],T=()=>e(r,{pageApi:d,radioCardsData:N,asideData:b,asideKey:"key",searchRender:i(m,{children:[e(a,{label:"FirstName",name:"firstName",type:"input"}),e(a,{label:"FirstName",name:"firstName1",type:"input"}),e(a,{label:"FirstName",name:"firstName2",type:"input"}),e(a,{label:"FirstName",name:"firstName3",type:"input"}),e(a,{label:"FirstName",name:"firstName4",type:"input"}),e(a,{label:"FirstName",name:"firstName5",type:"input"}),e(a,{label:"FirstName",name:"firstName6",type:"input"}),e(a,{label:"FirstName",name:"firstName7",type:"input"}),e(a,{label:"FirstName",name:"firstName8",type:"input"}),e(a,{label:"FirstName",name:"firstName9",type:"input"}),e(a,{label:"FirstName",name:"firstName10",type:"input"})]}),tableOptions:y});export{T as default};
