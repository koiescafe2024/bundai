import{M as d}from"./button.4816c82b.js";import{M as o}from"./index.42a1126b.js";import{j as a,i as r,y as i,O as n,ac as m}from"./vendor.1df1cb6a.js";const{Column:t,ColumnGroup:c}=o,l=[{key:"1",firstName:"John",lastName:"Brown",age:32,address:"New York No. 1 Lake Park",tags:["nice","developer"]},{key:"2",firstName:"Jim",lastName:"Green",age:42,address:"London No. 1 Lake Park",tags:["loser"]},{key:"3",firstName:"Joe",lastName:"Black",age:32,address:"Sidney No. 1 Lake Park",tags:["cool","teacher"]}];new Array(30).fill(void 0).forEach((s,e)=>{l.push({key:e+4+"",firstName:"Joe"+e,lastName:"Black"+e,age:32+e,address:"Sidney No. 1 Lake Park"+e,tags:["cool","teacher"]})});const h=()=>a("div",{className:"aaa",children:r(o,{dataSource:l,rowKey:s=>s.key,height:"100%",children:[r(c,{title:"Name",children:[a(t,{title:"First Name",dataIndex:"firstName"},"firstName"),a(t,{title:"Last Name",dataIndex:"lastName"},"lastName")]}),a(t,{title:"Age",dataIndex:"age"},"age"),a(t,{title:"Address",dataIndex:"address"},"address"),a(t,{title:"Tags",dataIndex:"tags",render:s=>a(i,{children:s.map(e=>a(n,{color:"blue",children:e},e))})},"tags"),a(t,{title:"Action",render:(s,e)=>r(m,{size:"middle",children:[r(d,{type:"text",children:["Invite ",e.lastName]}),a(d,{type:"text",children:"Delete"})]})},"action")]})});export{h as default};
