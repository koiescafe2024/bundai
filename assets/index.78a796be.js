import{M as n}from"./button.980a98d6.js";import{M as e}from"./index.eeb551cf.js";import{a as p,j as t,b as a}from"./index.8ea550b5.js";const h=c=>{const{children:i,onSearch:m,...l}=c,[s]=e.useForm(),{formatMessage:o}=p(),d=async()=>{const r=await s.validateFields();r&&m(r)};return t("div",{css:y,children:a(e,{...l,form:s,layout:"inline",children:[i,a(e.Item,{children:[t(n,{type:"primary",onClick:d,children:o({id:"component.search.request"})}),t(n,{onClick:()=>s.resetFields(),children:o({id:"component.search.reset"})})]})]})})},x=Object.assign(h,{Item:e.Item}),y={name:"ry8pmf",styles:"padding:20px;.ant-form-item{margin-bottom:20px;}"};export{x as M};
