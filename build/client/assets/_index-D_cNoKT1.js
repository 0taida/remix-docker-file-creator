import{r as u,d as K,j as l}from"./components-CWk_E0by.js";let ee={data:""},te=e=>typeof window=="object"?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||ee,oe=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,re=/\/\*[^]*?\*\/|  +/g,J=/\n+/g,j=(e,t)=>{let o="",a="",s="";for(let r in e){let n=e[r];r[0]=="@"?r[1]=="i"?o=r+" "+n+";":a+=r[1]=="f"?j(n,r):r+"{"+j(n,r[1]=="k"?"":t)+"}":typeof n=="object"?a+=j(n,t?t.replace(/([^,])+/g,i=>r.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,d=>/&/.test(d)?d.replace(/&/g,i):i?i+" "+d:d)):r):n!=null&&(r=/^--/.test(r)?r:r.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=j.p?j.p(r,n):r+":"+n+";")}return o+(t&&s?t+"{"+s+"}":s)+a},b={},W=e=>{if(typeof e=="object"){let t="";for(let o in e)t+=o+W(e[o]);return t}return e},ae=(e,t,o,a,s)=>{let r=W(e),n=b[r]||(b[r]=(d=>{let c=0,f=11;for(;c<d.length;)f=101*f+d.charCodeAt(c++)>>>0;return"go"+f})(r));if(!b[n]){let d=r!==e?e:(c=>{let f,m,g=[{}];for(;f=oe.exec(c.replace(re,""));)f[4]?g.shift():f[3]?(m=f[3].replace(J," ").trim(),g.unshift(g[0][m]=g[0][m]||{})):g[0][f[1]]=f[2].replace(J," ").trim();return g[0]})(e);b[n]=j(s?{["@keyframes "+n]:d}:d,o?"":"."+n)}let i=o&&b.g?b.g:null;return o&&(b.g=b[n]),((d,c,f,m)=>{m?c.data=c.data.replace(m,d):c.data.indexOf(d)===-1&&(c.data=f?d+c.data:c.data+d)})(b[n],t,a,i),n},se=(e,t,o)=>e.reduce((a,s,r)=>{let n=t[r];if(n&&n.call){let i=n(o),d=i&&i.props&&i.props.className||/^go/.test(i)&&i;n=d?"."+d:i&&typeof i=="object"?i.props?"":j(i,""):i===!1?"":i}return a+s+(n??"")},"");function P(e){let t=this||{},o=e.call?e(t.p):e;return ae(o.unshift?o.raw?se(o,[].slice.call(arguments,1),t.p):o.reduce((a,s)=>Object.assign(a,s&&s.call?s(t.p):s),{}):o,te(t.target),t.g,t.o,t.k)}let _,D,B;P.bind({g:1});let v=P.bind({k:1});function ne(e,t,o,a){j.p=t,_=e,D=o,B=a}function w(e,t){let o=this||{};return function(){let a=arguments;function s(r,n){let i=Object.assign({},r),d=i.className||s.className;o.p=Object.assign({theme:D&&D()},i),o.o=/ *go\d+/.test(d),i.className=P.apply(o,a)+(d?" "+d:"");let c=e;return e[0]&&(c=i.as||e,delete i.as),B&&c[0]&&B(i),_(c,i)}return s}}var ie=e=>typeof e=="function",I=(e,t)=>ie(e)?e(t):e,le=(()=>{let e=0;return()=>(++e).toString()})(),V=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),de=20,$=new Map,ce=1e3,U=e=>{if($.has(e))return;let t=setTimeout(()=>{$.delete(e),E({type:4,toastId:e})},ce);$.set(e,t)},pe=e=>{let t=$.get(e);t&&clearTimeout(t)},H=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,de)};case 1:return t.toast.id&&pe(t.toast.id),{...e,toasts:e.toasts.map(r=>r.id===t.toast.id?{...r,...t.toast}:r)};case 2:let{toast:o}=t;return e.toasts.find(r=>r.id===o.id)?H(e,{type:1,toast:o}):H(e,{type:0,toast:o});case 3:let{toastId:a}=t;return a?U(a):e.toasts.forEach(r=>{U(r.id)}),{...e,toasts:e.toasts.map(r=>r.id===a||a===void 0?{...r,visible:!1}:r)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(r=>r.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let s=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(r=>({...r,pauseDuration:r.pauseDuration+s}))}}},z=[],M={toasts:[],pausedAt:void 0},E=e=>{M=H(M,e),z.forEach(t=>{t(M)})},ue={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},fe=(e={})=>{let[t,o]=u.useState(M);u.useEffect(()=>(z.push(o),()=>{let s=z.indexOf(o);s>-1&&z.splice(s,1)}),[t]);let a=t.toasts.map(s=>{var r,n;return{...e,...e[s.type],...s,duration:s.duration||((r=e[s.type])==null?void 0:r.duration)||(e==null?void 0:e.duration)||ue[s.type],style:{...e.style,...(n=e[s.type])==null?void 0:n.style,...s.style}}});return{...t,toasts:a}},xe=(e,t="blank",o)=>({createdAt:Date.now(),visible:!0,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...o,id:(o==null?void 0:o.id)||le()}),O=e=>(t,o)=>{let a=xe(t,e,o);return E({type:2,toast:a}),a.id},x=(e,t)=>O("blank")(e,t);x.error=O("error");x.success=O("success");x.loading=O("loading");x.custom=O("custom");x.dismiss=e=>{E({type:3,toastId:e})};x.remove=e=>E({type:4,toastId:e});x.promise=(e,t,o)=>{let a=x.loading(t.loading,{...o,...o==null?void 0:o.loading});return e.then(s=>(x.success(I(t.success,s),{id:a,...o,...o==null?void 0:o.success}),s)).catch(s=>{x.error(I(t.error,s),{id:a,...o,...o==null?void 0:o.error})}),e};var ge=(e,t)=>{E({type:1,toast:{id:e,height:t}})},me=()=>{E({type:5,time:Date.now()})},he=e=>{let{toasts:t,pausedAt:o}=fe(e);u.useEffect(()=>{if(o)return;let r=Date.now(),n=t.map(i=>{if(i.duration===1/0)return;let d=(i.duration||0)+i.pauseDuration-(r-i.createdAt);if(d<0){i.visible&&x.dismiss(i.id);return}return setTimeout(()=>x.dismiss(i.id),d)});return()=>{n.forEach(i=>i&&clearTimeout(i))}},[t,o]);let a=u.useCallback(()=>{o&&E({type:6,time:Date.now()})},[o]),s=u.useCallback((r,n)=>{let{reverseOrder:i=!1,gutter:d=8,defaultPosition:c}=n||{},f=t.filter(h=>(h.position||c)===(r.position||c)&&h.height),m=f.findIndex(h=>h.id===r.id),g=f.filter((h,y)=>y<m&&h.visible).length;return f.filter(h=>h.visible).slice(...i?[g+1]:[0,g]).reduce((h,y)=>h+(y.height||0)+d,0)},[t]);return{toasts:t,handlers:{updateHeight:ge,startPause:me,endPause:a,calculateOffset:s}}},ye=v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,be=v`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ve=v`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Ce=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ye} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${be} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${ve} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,je=v`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,we=w("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${je} 1s linear infinite;
`,ke=v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Ee=v`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Se=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ke} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Ee} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Fe=w("div")`
  position: absolute;
`,Te=w("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Oe=v`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Ne=w("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Oe} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,$e=({toast:e})=>{let{icon:t,type:o,iconTheme:a}=e;return t!==void 0?typeof t=="string"?u.createElement(Ne,null,t):t:o==="blank"?null:u.createElement(Te,null,u.createElement(we,{...a}),o!=="loading"&&u.createElement(Fe,null,o==="error"?u.createElement(Ce,{...a}):u.createElement(Se,{...a})))},ze=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,Me=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,Ie="0%{opacity:0;} 100%{opacity:1;}",Pe="0%{opacity:1;} 100%{opacity:0;}",Re=w("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Ae=w("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,De=(e,t)=>{let o=e.includes("top")?1:-1,[a,s]=V()?[Ie,Pe]:[ze(o),Me(o)];return{animation:t?`${v(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${v(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},Be=u.memo(({toast:e,position:t,style:o,children:a})=>{let s=e.height?De(e.position||t||"top-center",e.visible):{opacity:0},r=u.createElement($e,{toast:e}),n=u.createElement(Ae,{...e.ariaProps},I(e.message,e));return u.createElement(Re,{className:e.className,style:{...s,...o,...e.style}},typeof a=="function"?a({icon:r,message:n}):u.createElement(u.Fragment,null,r,n))});ne(u.createElement);var He=({id:e,className:t,style:o,onHeightUpdate:a,children:s})=>{let r=u.useCallback(n=>{if(n){let i=()=>{let d=n.getBoundingClientRect().height;a(e,d)};i(),new MutationObserver(i).observe(n,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return u.createElement("div",{ref:r,className:t,style:o},s)},Le=(e,t)=>{let o=e.includes("top"),a=o?{top:0}:{bottom:0},s=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:V()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(o?1:-1)}px)`,...a,...s}},Je=P`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,N=16,Ue=({reverseOrder:e,position:t="top-center",toastOptions:o,gutter:a,children:s,containerStyle:r,containerClassName:n})=>{let{toasts:i,handlers:d}=he(o);return u.createElement("div",{style:{position:"fixed",zIndex:9999,top:N,left:N,right:N,bottom:N,pointerEvents:"none",...r},className:n,onMouseEnter:d.startPause,onMouseLeave:d.endPause},i.map(c=>{let f=c.position||t,m=d.calculateOffset(c,{reverseOrder:e,gutter:a,defaultPosition:t}),g=Le(f,m);return u.createElement(He,{id:c.id,key:c.id,onHeightUpdate:d.updateHeight,className:c.visible?Je:"",style:g},c.type==="custom"?I(c.message,c):s?s(c):u.createElement(Be,{toast:c,position:f}))}))};const We=e=>{const t=[],o=new Map;return e.forEach(a=>{const s=a.path.split("/").filter(d=>d),r=s.pop()||a.name;let n="";const i={...a,name:r,children:a.type==="folder"?[]:void 0};if(o.set(a.path,i),s.length===0)t.push(i);else{n="/"+s.join("/");const d=o.get(n);d&&d.children&&d.children.push(i)}}),t},Y=({item:e,depth:t=0,onEdit:o,onDelete:a})=>{const[s,r]=u.useState(!0);return l.jsxs("div",{style:{marginLeft:`${t*20}px`},children:[l.jsxs("div",{style:{display:"flex",alignItems:"center",padding:"8px",borderRadius:"6px",backgroundColor:"#222",marginBottom:"4px",transition:"all 0.2s ease"},onMouseOver:n=>{n.currentTarget.style.backgroundColor="#2a2a2a"},onMouseOut:n=>{n.currentTarget.style.backgroundColor="#222"},children:[e.type==="folder"&&l.jsx("button",{onClick:()=>r(!s),style:{background:"none",border:"none",color:"#fff",cursor:"pointer",padding:"0 8px",fontSize:"1.2em"},children:s?"📂":"📁"}),e.type==="file"&&l.jsx("span",{style:{padding:"0 8px"},children:"📄"}),l.jsx("span",{style:{flex:1,color:"#fff"},children:e.name}),l.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.type==="file"&&l.jsx("button",{onClick:()=>o(e),style:{padding:"4px 8px",borderRadius:"4px",border:"none",backgroundColor:"#2563eb",color:"white",cursor:"pointer",fontSize:"12px"},children:"Edit"}),l.jsx("button",{onClick:()=>a(e.name,e.type),style:{padding:"4px 8px",borderRadius:"4px",border:"none",backgroundColor:"#dc2626",color:"white",cursor:"pointer",fontSize:"12px"},children:"Delete"})]})]}),e.children&&s&&l.jsx("div",{children:e.children.map(n=>l.jsx(Y,{item:n,depth:t+1,onEdit:o,onDelete:a},n.path))})]})};function Ve(){const{apiEndpoint:e,contents:t}=K(),[o,a]=u.useState(!1),[s,r]=u.useState(!1),[n,i]=u.useState(""),[d,c]=u.useState(""),[f,m]=u.useState(""),[g,h]=u.useState(""),[y,S]=u.useState(null),Z=async()=>{const k=await(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({folderName:n,fileName:"",fileType:"",fileContent:""})})).json();x.success(k.message),i(""),r(!1)},q=async()=>{const k=await(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({folderName:"",fileName:d,fileType:f,fileContent:g})})).json();x.success(k.message),c(""),m(""),h(""),a(!1)},G=async(p,k)=>{const F=await fetch("/delete-item",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:p,type:k})}),T=await F.json();F.ok?x.success(T.message):x.error(T.message)},Q=async(p,k)=>{const F=await fetch("/edit-file",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:p,content:k})}),T=await F.json();F.ok?(x.success(T.message),S(null)):x.error(T.message)},R={position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0, 0, 0, 0.8)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:1e3},A={backgroundColor:"#1a1a1a",padding:"20px",borderRadius:"12px",width:"90%",maxWidth:"500px",position:"relative",border:"1px solid #333",boxShadow:"0 8px 32px rgba(0, 0, 0, 0.4)"},C={padding:"10px 20px",borderRadius:"8px",border:"none",backgroundColor:"#2563eb",color:"white",cursor:"pointer",fontWeight:"bold",transition:"all 0.2s ease"},L=We(t),X=()=>y?l.jsx("div",{style:R,onClick:()=>S(null),children:l.jsxs("div",{style:A,onClick:p=>p.stopPropagation(),children:[l.jsxs("h2",{style:{color:"#2563eb",marginBottom:"20px",fontSize:"1.5rem",textShadow:"0 2px 8px rgba(37, 99, 235, 0.2)"},children:["Edit File: ",y.name]}),l.jsx("textarea",{value:y.content,onChange:p=>S({...y,content:p.target.value}),style:{padding:"12px",borderRadius:"8px",border:"1px solid #333",backgroundColor:"#222",color:"#fff",minHeight:"300px",width:"100%",marginBottom:"20px",outline:"none",resize:"vertical",fontFamily:"monospace"}}),l.jsxs("div",{style:{display:"flex",gap:"10px",justifyContent:"flex-end"},children:[l.jsx("button",{onClick:()=>S(null),style:{...C,backgroundColor:"#666"},children:"Cancel"}),l.jsx("button",{onClick:()=>Q(y.name,y.content||""),style:C,children:"Save Changes"})]})]})}):null;return l.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"15px",maxWidth:"900px",margin:"auto",padding:"20px",backgroundColor:"#111",minHeight:"100vh",color:"#fff"},children:[l.jsx(Ue,{position:"top-right",toastOptions:{duration:3e3,style:{background:"#333",color:"#fff"}}}),l.jsx("h1",{style:{textAlign:"center",color:"#2563eb",fontSize:"2.5rem",textShadow:"0 2px 10px rgba(37, 99, 235, 0.3)",marginBottom:"20px"},children:"Remix Folder Creator"}),l.jsxs("div",{style:{display:"flex",gap:"15px",marginBottom:"20px"},children:[l.jsx("button",{onClick:()=>r(!0),style:C,onMouseOver:p=>p.currentTarget.style.backgroundColor="#1d4ed8",onMouseOut:p=>p.currentTarget.style.backgroundColor="#2563eb",children:"Create Folder"}),l.jsx("button",{onClick:()=>a(!0),style:C,onMouseOver:p=>p.currentTarget.style.backgroundColor="#1d4ed8",onMouseOut:p=>p.currentTarget.style.backgroundColor="#2563eb",children:"Create File"})]}),s&&l.jsx("div",{style:R,onClick:()=>r(!1),children:l.jsxs("div",{style:A,onClick:p=>p.stopPropagation(),children:[l.jsx("h2",{style:{color:"#4A90E2",marginBottom:"15px"},children:"Create New Folder"}),l.jsx("input",{type:"text",placeholder:"Folder Name",value:n,onChange:p=>i(p.target.value),style:{padding:"12px",borderRadius:"8px",border:"1px solid #333",backgroundColor:"#222",color:"#fff",marginBottom:"12px",width:"100%",outline:"none"}}),l.jsxs("div",{style:{display:"flex",gap:"10px",justifyContent:"flex-end"},children:[l.jsx("button",{onClick:()=>r(!1),style:{...C,backgroundColor:"#666"},children:"Cancel"}),l.jsx("button",{onClick:Z,style:C,children:"Create"})]})]})}),o&&l.jsx("div",{style:R,onClick:()=>a(!1),children:l.jsxs("div",{style:A,onClick:p=>p.stopPropagation(),children:[l.jsx("h2",{style:{color:"#4A90E2",marginBottom:"15px"},children:"Create New File"}),l.jsx("input",{type:"text",placeholder:"File Name",value:d,onChange:p=>c(p.target.value),style:{padding:"12px",borderRadius:"8px",border:"1px solid #333",backgroundColor:"#222",color:"#fff",marginBottom:"12px",width:"100%",outline:"none"}}),l.jsx("input",{type:"text",placeholder:"File Type (e.g., txt, js, py)",value:f,onChange:p=>m(p.target.value),style:{padding:"12px",borderRadius:"8px",border:"1px solid #333",backgroundColor:"#222",color:"#fff",marginBottom:"12px",width:"100%",outline:"none"}}),l.jsx("textarea",{placeholder:"File Content",value:g,onChange:p=>h(p.target.value),style:{padding:"12px",borderRadius:"8px",border:"1px solid #333",backgroundColor:"#222",color:"#fff",minHeight:"150px",width:"100%",marginBottom:"12px",outline:"none",resize:"vertical"}}),l.jsxs("div",{style:{display:"flex",gap:"10px",justifyContent:"flex-end"},children:[l.jsx("button",{onClick:()=>a(!1),style:{...C,backgroundColor:"#666"},children:"Cancel"}),l.jsx("button",{onClick:q,style:C,children:"Create"})]})]})}),l.jsx(X,{}),l.jsxs("div",{style:{border:"1px solid #333",padding:"25px",borderRadius:"12px",backgroundColor:"#1a1a1a",boxShadow:"0 4px 20px rgba(0, 0, 0, 0.2)"},children:[l.jsx("h2",{style:{color:"#2563eb",marginBottom:"20px",fontSize:"1.8rem",textShadow:"0 2px 8px rgba(37, 99, 235, 0.2)"},children:"Volume Contents"}),l.jsx("div",{children:L.length>0?L.map(p=>l.jsx(Y,{item:p,onEdit:S,onDelete:G},p.path)):l.jsx("div",{style:{color:"#666",textAlign:"center",padding:"30px",backgroundColor:"#222",borderRadius:"8px",border:"1px solid #333"},children:"No files or folders found"})})]})]})}export{Ve as default};
