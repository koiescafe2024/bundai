import{$ as V,r as t,b,j as s}from"./index.8ea550b5.js";import{M as N}from"./index.188790cf.js";import{M as C}from"./index.ec04de20.js";import{M as k}from"./index.5dc48704.js";import{M as w}from"./index.78a796be.js";import{M as K}from"./index.5308cb84.js";const G=o=>V("get","/business/list",o);function B(o){const[m,i]=t.exports.useState(o);return[m,d=>i(l=>Object.assign({},l,d))]}const E=(o,m)=>{const{pageApi:i,pageParams:u,searchRender:d,tableOptions:l,tableRender:f,asideKey:g,asideData:r,asideValue:P,asideTreeItemRender:D,radioCardsData:h,radioCardsValue:j,tabsData:x,tabsValue:z}=o,[e,y]=B({pageSize:20,pageNum:1,total:0,data:[]}),[n,M]=t.exports.useState(P);t.exports.useEffect(()=>{r&&M(r[0].key)},[r]);const c=t.exports.useCallback(async(a={})=>{if(!(g&&!n)&&i){const p={...a,...u,pageSize:e.pageSize,pageNum:e.pageNum,[g]:n},S=await i(p);S.status&&y({total:S.result.total,data:S.result.data})}},[i,u,e.pageSize,e.pageNum,g,n]);t.exports.useEffect(()=>{c()},[c]);const A=a=>{c(a)},R=([a])=>{M(a)},T=(a,p)=>{y({pageNum:a}),p&&y({pageSize:p})};return t.exports.useImperativeHandle(m,()=>({setAsideCheckedKey:M,load:a=>c(a)})),b("div",{css:O,children:[x&&s(K,{className:"tabs",options:x,defaultValue:x[0].value||z}),b("div",{className:"tabs-main",children:[r&&s(C,{options:r,selectedKeys:n?[n]:void 0,titleRender:D,onSelect:R}),b("div",{className:"aside-main",children:[d&&s(w,{className:"search",onSearch:A,children:d}),h&&s(k,{options:h,defaultValue:j||h[0].value}),l&&s("div",{className:"table",children:s(N,{height:"100%",dataSource:e.data,columns:l,pagination:{current:e.pageNum,pageSize:e.pageSize,total:e.total,onChange:T},children:f==null?void 0:f(e.data)})})]})]})]})},I=t.exports.forwardRef(E),v=I;v.MySearch=w;v.MyTable=N;v.MyAside=C;const O={name:"1hurv70",styles:"display:flex;flex-direction:column;.tabs-main{flex:1;display:flex;overflow:hidden;}.search{margin-bottom:10px;}.aside-main{display:flex;flex:1;overflow:hidden;flex-direction:column;@media screen and (max-height: 800px){overflow:auto;}}.table{flex:1;overflow:hidden;@media screen and (max-height: 800px){overflow:auto;min-height:500px;}}"};export{v as M,G as g};
