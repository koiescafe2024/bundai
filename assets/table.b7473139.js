import{M as d}from"./button.980a98d6.js";import{M as l}from"./index.188790cf.js";import{j as a,b as r,N as i,O as n,P as m}from"./index.8ea550b5.js";const{Column:t,ColumnGroup:c}=l,o=[{key:"1",firstName:"John",lastName:"Brown",age:32,address:"New York No. 1 Lake Park",tags:["nice","developer"]},{key:"2",firstName:"Jim",lastName:"Green",age:42,address:"London No. 1 Lake Park",tags:["loser"]},{key:"3",firstName:"Joe",lastName:"Black",age:32,address:"Sidney No. 1 Lake Park",tags:["cool","teacher"]}];new Array(30).fill(void 0).forEach((s,e)=>{o.push({key:e+4+"",firstName:"Joe"+e,lastName:"Black"+e,age:32+e,address:"Sidney No. 1 Lake Park"+e,tags:["cool","teacher"]})});const h=()=>a("div",{className:"aaa",children:r(l,{dataSource:o,rowKey:s=>s.key,height:"100%",children:[r(c,{title:"Name",children:[a(t,{title:"First Name",dataIndex:"firstName"},"firstName"),a(t,{title:"Last Name",dataIndex:"lastName"},"lastName")]}),a(t,{title:"Age",dataIndex:"age"},"age"),a(t,{title:"Address",dataIndex:"address"},"address"),a(t,{title:"Tags",dataIndex:"tags",render:s=>a(i,{children:s.map(e=>a(n,{color:"blue",children:e},e))})},"tags"),a(t,{title:"Action",render:(s,e)=>r(m,{size:"middle",children:[r(d,{type:"text",children:["Invite ",e.lastName]}),a(d,{type:"text",children:"Delete"})]})},"action")]})});export{h as default};
