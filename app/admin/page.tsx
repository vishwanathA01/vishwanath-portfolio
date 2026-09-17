 "use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

type Social = { github:string; linkedin:string; instagram:string; email:string; whatsapp:string };
type Project = { id:number; name:string; type:string; status:string; description:string; tech:string; github:string; demo:string; image:string; featured:boolean };
type Skill = { id:number; name:string; level:number; category:string };
type Experience = { id:number; role:string; company:string; period:string; description:string };
type Education = { id:number; degree:string; institution:string; period:string; description:string };
type Certificate = { id:number; name:string; issuer:string; year:string; url:string };
type Message = { id:number; name:string; email:string; subject:string; message:string; date:string; read:boolean };
type SiteSettings = { name:string; title:string; tagline:string; location:string; availability:string; theme:string };
type Seo = { title:string; description:string; keywords:string; ogImage:string };
type Github = { username:string; connected:boolean; lastSync:string };
type Security = { twoFactor:boolean; sessionHours:number };

const nav:[string,string][]=[
 ["Overview","⌂"],["Projects","▣"],["Profile Links","⌁"],["Skills","◇"],["Experience","◷"],["Education","▤"],
 ["Certificates","✦"],["Resume","▤"],["Messages","✉"],["Analytics","◒"],["GitHub","◉"],["AI Assistant","✧"],["SEO","⌕"],["Settings","⚙"],["Security","◇"]
];

const defaultSocial:Social={github:"https://github.com/",linkedin:"https://linkedin.com/",instagram:"https://instagram.com/",email:"your-email@example.com",whatsapp:"https://wa.me/"};
const defaultProjects:Project[]=[
 {id:1,name:"EduNexa",type:"Full Stack",status:"Published",description:"Advanced learning platform with courses, quizzes, dashboards and smart learning workflows.",tech:"Next.js · TypeScript · Node.js · MySQL",github:"https://github.com/",demo:"#",image:"/anime/project-sunset.jpg",featured:true},
 {id:2,name:"Online Shopping System",type:"Web",status:"Published",description:"Modern e-commerce experience focused on product discovery, wishlist and clean customer workflows.",tech:"PHP · MySQL · Bootstrap",github:"https://github.com/",demo:"#",image:"/anime/project-city.jpg",featured:true},
 {id:3,name:"AI Chat Assistant",type:"AI/ML",status:"Draft",description:"AI-powered assistant concept for portfolio and learning workflows.",tech:"Python · AI · APIs",github:"https://github.com/",demo:"#",image:"/anime/project-ai.jpg",featured:false}
];
const defaultSkills:Skill[]=["C++","Python","JavaScript","TypeScript","React","Next.js","Node.js","Express","PHP","MySQL","Git","AI/ML"].map((name,i)=>({id:i+1,name,level:70+(i%4)*7,category:i<4?"Languages":i<8?"Frontend":"Backend"}));
const defaultExp:Experience[]=[
 {id:1,role:"Full Stack Developer — Projects",company:"Independent",period:"2026 — Present",description:"Building EduNexa, portfolio systems and practical web applications."},
 {id:2,role:"Computer Science Student",company:"MRIIRS",period:"2024 — Present",description:"Developing software engineering, DSA, database and web development fundamentals."}
];
const defaultEdu:Education[]=[{id:1,degree:"B.Tech — Computer Science & Engineering",institution:"Manav Rachna International Institute of Research and Studies",period:"2024 — Present",description:"Computer Science and Engineering"}];
const defaultCert:Certificate[]=[
 {id:1,name:"Full Stack Cloud Development Certificate",issuer:"Manav Rachna",year:"2026",url:"#"},
 {id:2,name:"Python Certification",issuer:"Infosys",year:"2026",url:"#"},
 {id:3,name:"AI for All",issuer:"AI / Learning Program",year:"2026",url:"#"}
];
const defaultSettings:SiteSettings={name:"Vishwanath Thakur",title:"Aspiring Software Engineer",tagline:"Build · Learn · Create",location:"India",availability:"Available for internships",theme:"Anime Purple"};
const defaultSeo:Seo={title:"Vishwanath Thakur — Software Engineer",description:"Portfolio of Vishwanath Thakur — software engineering, full-stack development and problem solving.",keywords:"Vishwanath Thakur, software engineer, full stack, C++, React, Next.js",ogImage:"/anime/hero-anime.jpg"};
const defaultGithub:Github={username:"",connected:false,lastSync:"Never"};
const defaultSecurity:Security={twoFactor:false,sessionHours:8};

function read<T>(key:string,fallback:T):T{try{const x=localStorage.getItem(key);return x?JSON.parse(x):fallback}catch{return fallback}}
function write(key:string,value:any){localStorage.setItem(key,JSON.stringify(value))}

export default function Admin(){
 const [tab,setTab]=useState("Overview");
 const [palette,setPalette]=useState(false);
 const [notifyOpen,setNotifyOpen]=useState(false);
 const [activity,setActivity]=useState<string[]>([]);
 const [compact,setCompact]=useState(false);
 const [sidebar,setSidebar]=useState(true);
 const [toast,setToast]=useState("");
 const [social,setSocial]=useState<Social>(defaultSocial);
 const [projects,setProjects]=useState<Project[]>(defaultProjects);
 const [skills,setSkills]=useState<Skill[]>(defaultSkills);
 const [experience,setExperience]=useState<Experience[]>(defaultExp);
 const [education,setEducation]=useState<Education[]>(defaultEdu);
 const [certificates,setCertificates]=useState<Certificate[]>(defaultCert);
 const [messages,setMessages]=useState<Message[]>([]);
 const [settings,setSettings]=useState<SiteSettings>(defaultSettings);
 const [seo,setSeo]=useState<Seo>(defaultSeo);
 const [github,setGithub]=useState<Github>(defaultGithub);
 const [security,setSecurity]=useState<Security>(defaultSecurity);
 const [resumeName,setResumeName]=useState("Vishwanath-Thakur-Resume.pdf");
 const [search,setSearch]=useState("");

 useEffect(()=>{
   setSocial({...defaultSocial,...read("vt_profile",defaultSocial)});
   setProjects(read("vt_projects",defaultProjects));
   setSkills(read("vt_skills",defaultSkills));
   setExperience(read("vt_experience",defaultExp));
   setEducation(read("vt_education",defaultEdu));
   setCertificates(read("vt_certificates",defaultCert));
   setMessages(read("vt_messages",[]));
   setSettings(read("vt_settings",defaultSettings));
   setSeo(read("vt_seo",defaultSeo));
   setGithub(read("vt_github",defaultGithub));
   setSecurity(read("vt_security",defaultSecurity));
   setResumeName(localStorage.getItem("vt_resume_name")||"Vishwanath-Thakur-Resume.pdf");
 },[]);

 const notify=(msg:string)=>{setToast(msg);window.setTimeout(()=>setToast(""),2200)};
 const save=(key:string,value:any,msg:string)=>{write(key,value);notify(msg)};
 const saveAll=()=>{
   [["vt_profile",social],["vt_projects",projects],["vt_skills",skills],["vt_experience",experience],["vt_education",education],["vt_certificates",certificates],["vt_messages",messages],["vt_settings",settings],["vt_seo",seo],["vt_github",github],["vt_security",security]].forEach(([k,v])=>write(k as string,v));
   localStorage.setItem("vt_resume_name",resumeName); notify("Everything saved successfully");
 };
 const logout=async()=>{try{await fetch("/api/logout",{method:"POST"})}catch{} location.href="/login"};
 const unread=messages.filter(m=>!m.read).length;
 const log=(msg:string)=>{const a=[msg,...activity].slice(0,10);setActivity(a);localStorage.setItem("vt_activity",JSON.stringify(a));notify(msg)};
 const exportBackup=()=>{const payload={social,projects,skills,experience,education,certificates,messages,settings,seo,github,security,resumeName,exportedAt:new Date().toISOString()};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="vishwanath-portfolio-backup.json";a.click();URL.revokeObjectURL(url);log("Backup exported")};
 const importBackup=(e:React.ChangeEvent<HTMLInputElement>)=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(String(r.result));if(x.social)setSocial(x.social);if(x.projects)setProjects(x.projects);if(x.skills)setSkills(x.skills);if(x.experience)setExperience(x.experience);if(x.education)setEducation(x.education);if(x.certificates)setCertificates(x.certificates);if(x.messages)setMessages(x.messages);if(x.settings)setSettings(x.settings);if(x.seo)setSeo(x.seo);if(x.github)setGithub(x.github);if(x.security)setSecurity(x.security);if(x.resumeName)setResumeName(x.resumeName);notify("Backup imported — click Save All");}catch{notify("Invalid backup JSON")}};r.readAsText(f);e.currentTarget.value=""};
 useEffect(()=>{try{setActivity(JSON.parse(localStorage.getItem("vt_activity")||"[]"))}catch{}},[]);
 useEffect(()=>{const fn=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setPalette(true)}if(e.key==="Escape"){setPalette(false);setNotifyOpen(false)}};window.addEventListener("keydown",fn);return()=>window.removeEventListener("keydown",fn)},[]);

 return <div className={`adminV8 ${sidebar?"":"collapsed"} ${compact?"compact":""}`}>
  <aside className="v8Sidebar">
   <div className="v8Brand"><div className="v8Logo">VT</div>{sidebar&&<div><b>VISHWANTH</b><small>CREATOR OS</small></div>}</div>
   {sidebar&&<div className="v8User"><div>VT</div><span><b>Vishwanath Thakur</b><small>Super Admin</small></span><i>●</i></div>}
   <div className="v8Label">{sidebar?"WORKSPACE":""}</div>
   <div className="v8Nav">{nav.map(([n,ic])=><button key={n} className={tab===n?"active":""} onClick={()=>setTab(n)}><span>{ic}</span>{sidebar&&n}{sidebar&&n==="Messages"&&unread>0&&<em>{unread}</em>}</button>)}</div>
   <div className="v8Bottom"><a href="/">↗ {sidebar&&"View Portfolio"}</a><button onClick={()=>setSidebar(!sidebar)}>☰ {sidebar&&"Collapse"}</button><button onClick={logout}>⇥ {sidebar&&"Sign out"}</button></div>
  </aside>

  <main className="v8Main">
   <header className="v8Top"><div className="v8Crumb">VT / ADMIN <b>/</b> <strong>{tab}</strong></div><div className="v8TopRight"><span className="v8Live"><i/> LIVE</span><button className="v9Cmd" onClick={()=>setPalette(true)}>⌘K</button><button onClick={()=>{saveAll();log("All workspace data saved")}}>Save All</button><button className="v9Bell" onClick={()=>setNotifyOpen(!notifyOpen)}>♢{unread>0&&<em>{unread}</em>}</button><div className="v8MiniAvatar">VT</div></div></header>
   {toast&&<div className="v8Toast">✓ {toast}</div>}
   {notifyOpen&&<div className="v9Notify"><b>Notifications</b><button onClick={()=>setNotifyOpen(false)}>×</button><p>{unread?`You have ${unread} unread message${unread>1?"s":""}.`:"Everything is up to date."}</p><button onClick={()=>{setNotifyOpen(false);setTab("Messages")}}>Open inbox →</button></div>}
   {palette&&<CommandPalette close={()=>setPalette(false)} setTab={setTab} exportBackup={exportBackup}/>}

   {tab==="Overview"&&<Overview projects={projects} messages={messages} setTab={setTab} saveAll={saveAll} activity={activity} exportBackup={exportBackup} importBackup={importBackup}/>}
   {tab==="Projects"&&<Projects projects={projects} setProjects={setProjects} search={search} setSearch={setSearch} notify={notify}/>}
   {tab==="Profile Links"&&<ProfileLinks social={social} setSocial={setSocial} save={()=>save("vt_profile",social,"Profile links published")}/>}
   {tab==="Skills"&&<Skills skills={skills} setSkills={setSkills} notify={notify}/>}
   {tab==="Experience"&&<Experience data={experience} setData={setExperience} notify={notify}/>}
   {tab==="Education"&&<Education data={education} setData={setEducation} notify={notify}/>}
   {tab==="Certificates"&&<Certificates data={certificates} setData={setCertificates} notify={notify}/>}
   {tab==="Resume"&&<Resume name={resumeName} setName={setResumeName} notify={notify}/>}
   {tab==="Messages"&&<Messages data={messages} setData={setMessages} notify={notify}/>}
   {tab==="Analytics"&&<Analytics projects={projects} messages={messages}/>}
   {tab==="GitHub"&&<GithubEditor data={github} setData={setGithub} notify={notify}/>}
   {tab==="AI Assistant"&&<Assistant notify={notify}/>}
   {tab==="SEO"&&<SEO data={seo} setData={setSeo} save={()=>save("vt_seo",seo,"SEO settings saved")}/>}
   {tab==="Settings"&&<Settings data={settings} setData={setSettings} save={()=>save("vt_settings",settings,"Site settings saved")} compact={compact} setCompact={setCompact}/>}
   {tab==="Security"&&<SecurityEditor data={security} setData={setSecurity} save={()=>save("vt_security",security,"Security settings saved")}/>}
  </main>
 </div>
}

function Title({eyebrow,title,sub,action}:{eyebrow:string;title:string;sub:string;action?:ReactNode}){return <div className="v8Title"><div><span>{eyebrow}</span><h1>{title}</h1><p>{sub}</p></div>{action}</div>}
function Btn({children,onClick,soft=false}:{children:ReactNode;onClick?:()=>void;soft?:boolean}){return <button className={soft?"v8Soft":"v8Btn"} onClick={onClick}>{children}</button>}

function Overview({projects,messages,setTab,saveAll,activity,exportBackup,importBackup}:{projects:Project[];messages:Message[];setTab:(x:string)=>void;saveAll:()=>void;activity:string[];exportBackup:()=>void;importBackup:(e:React.ChangeEvent<HTMLInputElement>)=>void}){
 const unread=messages.filter(x=>!x.read).length;
 return <div className="v8Page"><div className="v8Welcome"><div><span>GOOD EVENING, VISHWANTH ✦</span><h1>Your portfolio <b>command center.</b></h1><p>Manage content, identity, projects, connections and recruiter-facing details from one place.</p><div className="v8Btns"><Btn onClick={()=>setTab("Projects")}>＋ New Project</Btn><Btn soft onClick={()=>setTab("Profile Links")}>⌁ Profile Links</Btn><Btn soft onClick={saveAll}>Save Everything</Btn></div></div><div className="v8Orb"><div/><b>VT</b><small>ONLINE</small></div></div>
 <div className="v8Metrics"><Metric icon="◉" title="Portfolio Views" value="1,284" trend="+18.4%"/><Metric icon="↓" title="Resume Downloads" value="86" trend="+12.1%"/><Metric icon="◇" title="Project Impressions" value="2,431" trend="+24.8%"/><Metric icon="✉" title="Unread Messages" value={String(unread)} trend={unread?"Needs attention":"All clear"}/></div>
 <div className="v8Grid2"><div className="v8Card"><Head tag="PERFORMANCE" title="Visitor activity"/><div className="v8Chart"><div className="gridlines"/><svg viewBox="0 0 700 220" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" x2="1"><stop stopColor="#9c52ff"/><stop offset=".5" stopColor="#e45cff"/><stop offset="1" stopColor="#53d8ff"/></linearGradient></defs><path d="M0 190 C70 180 90 150 145 160 S220 115 275 140 S350 95 410 110 S500 45 560 80 S640 40 700 25" fill="none" stroke="url(#g)" strokeWidth="4"/><path d="M0 190 C70 180 90 150 145 160 S220 115 275 140 S350 95 410 110 S500 45 560 80 S640 40 700 25 L700 220 L0 220Z" fill="url(#g)" opacity=".08"/></svg></div><div className="v8Days"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div>
 <div className="v8Card"><Head tag="HEALTH" title="System status"/><Health n="Admin authentication" d="Protected session"/><Health n="Portfolio CMS" d={`${projects.length} projects loaded`}/><Health n="Profile connectivity" d="Social links ready"/><Health n="Local persistence" d="Browser database active"/></div></div>
 <div className="v8Grid2"><div className="v8Card"><Head tag="RECENT WORK" title="Featured projects" action={<Btn soft onClick={()=>setTab("Projects")}>Manage →</Btn>}/>{projects.filter(p=>p.featured).slice(0,4).map(p=><div className="v8MiniRow" key={p.id}><img src={p.image}/><div><b>{p.name}</b><small>{p.type} · {p.status}</small></div><span>↗</span></div>)}</div><div className="v8Card"><Head tag="QUICK ACTIONS" title="Control center"/><div className="v8Quick"><button onClick={()=>setTab("Projects")}>▣ <b>Projects</b><small>Create & publish</small></button><button onClick={()=>setTab("Messages")}>✉ <b>Messages</b><small>Inbox & replies</small></button><button onClick={()=>setTab("GitHub")}>◉ <b>GitHub</b><small>Sync profile</small></button><button onClick={()=>setTab("Settings")}>⚙ <b>Settings</b><small>Site controls</small></button></div></div></div>
 <div className="v9Overview"><div className="v8Card"><Head tag="AUDIT TRAIL" title="Recent admin activity"/>{activity.length?activity.map((x,i)=><div className="v9Act" key={i}><span>•</span><b>{x}</b><small>{i===0?"Just now":`${i*5} min ago`}</small></div>):<p className="v8Muted">Admin actions will appear here.</p>}</div><div className="v8Card"><Head tag="DATA CONTROL" title="Backup & restore"/><p className="v8Muted">Export your portfolio CMS to JSON or restore a previous backup.</p><div className="v9Back"><Btn onClick={exportBackup}>↓ Export JSON</Btn><label className="v8Soft">↑ Import JSON<input type="file" accept=".json,application/json" onChange={importBackup}/></label></div><div className="v9Active">● Local CMS persistence <b>ACTIVE</b></div></div></div>
 </div>
}
function CommandPalette({close,setTab,exportBackup}:{close:()=>void;setTab:(x:string)=>void;exportBackup:()=>void}){const [q,setQ]=useState("");const items=nav.filter(x=>(x[0]+" "+x[1]).toLowerCase().includes(q.toLowerCase()));return <div className="v9Backdrop" onMouseDown={close}><div className="v9Palette" onMouseDown={e=>e.stopPropagation()}><div className="v9SearchTop">⌕<input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Jump to admin section..."/><kbd>ESC</kbd></div>{items.map(x=><button key={x[0]} onClick={()=>{setTab(x[0]);close()}}><span>{x[1]}</span><b>{x[0]}</b><small>Open workspace</small><kbd>↵</kbd></button>)}<button onClick={()=>{exportBackup();close()}}><span>↓</span><b>Export backup</b><small>Download all CMS data</small><kbd>↵</kbd></button></div></div>}
function Metric({icon,title,value,trend}:{icon:string;title:string;value:string;trend:string}){return <div className="v8Metric"><i>{icon}</i><div><small>{title}</small><strong>{value}</strong><span>{trend}</span></div><em>╱╲╱</em></div>}
function Head({tag,title,action}:{tag:string;title:string;action?:ReactNode}){return <div className="v8Head"><div><span>{tag}</span><h2>{title}</h2></div>{action}</div>}
function Health({n,d}:{n:string;d:string}){return <div className="v8Health"><i>✓</i><div><b>{n}</b><small>{d}</small></div><span>OK</span></div>}

function Projects({projects,setProjects,search,setSearch,notify}:{projects:Project[];setProjects:any;search:string;setSearch:(x:string)=>void;notify:(x:string)=>void}){
 const add=()=>{setProjects([...projects,{id:Date.now(),name:"New Project",type:"Web",status:"Draft",description:"Add project description.",tech:"Technology stack",github:"https://github.com/",demo:"#",image:"/anime/project-city.jpg",featured:false}]);notify("Project created — edit it below");};
 const update=(id:number,key:string,value:any)=>setProjects(projects.map(p=>p.id===id?{...p,[key]:value}:p));
 const remove=(id:number)=>{setProjects(projects.filter(p=>p.id!==id));notify("Project deleted")};
 const filtered=projects.filter(p=>(p.name+" "+p.type+" "+p.tech).toLowerCase().includes(search.toLowerCase()));
 return <div className="v8Page"><Title eyebrow="CONTENT STUDIO" title="Project library" sub="Create, edit, feature and publish the work recruiters see." action={<Btn onClick={add}>＋ Create Project</Btn>}/><div className="v8Toolbar"><div className="v8Search">⌕<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects..."/></div><span>{filtered.length} projects</span></div><div className="v8ProjectGrid">{filtered.map((p,i)=><article className="v8ProjectCard" key={p.id}><div className="v8ProjectImage"><img src={p.image}/><span>{p.type}</span><b>{p.status}</b></div><div className="v8ProjectBody"><div className="v8RowMeta"><small>0{i+1}</small><button onClick={()=>update(p.id,"featured",!p.featured)}>{p.featured?"★ FEATURED":"☆ FEATURE"}</button></div><label>Project name<input value={p.name} onChange={e=>update(p.id,"name",e.target.value)}/></label><label>Description<textarea value={p.description} onChange={e=>update(p.id,"description",e.target.value)}/></label><label>Technology stack<input value={p.tech} onChange={e=>update(p.id,"tech",e.target.value)}/></label><div className="v8TwoFields"><label>Type<input value={p.type} onChange={e=>update(p.id,"type",e.target.value)}/></label><label>Status<select value={p.status} onChange={e=>update(p.id,"status",e.target.value)}><option>Published</option><option>Draft</option><option>Archived</option></select></label></div><div className="v8TwoFields"><label>GitHub<input value={p.github} onChange={e=>update(p.id,"github",e.target.value)}/></label><label>Demo<input value={p.demo} onChange={e=>update(p.id,"demo",e.target.value)}/></label></div><div className="v8Actions"><button onClick={()=>notify("Project changes are in memory — use Save All")}>Preview</button><button onClick={()=>remove(p.id)}>Delete</button></div></div></article>)}</div></div>
}

function ProfileLinks({social,setSocial,save}:{social:Social;setSocial:(x:Social)=>void;save:()=>void}){
 const fields:[keyof Social,string,string][]=[["github","GitHub","https://github.com/username"],["linkedin","LinkedIn","https://linkedin.com/in/username"],["instagram","Instagram","https://instagram.com/username"],["email","Professional Email","you@example.com"],["whatsapp","WhatsApp","https://wa.me/91XXXXXXXXXX"]];
 return <div className="v8Page"><Title eyebrow="SMART CONNECTIVITY" title="Digital identity" sub="Control every public profile and contact channel from one screen." action={<Btn onClick={save}>✓ Save & Publish</Btn>}/><div className="v8Grid2"><div className="v8Card v8Identity"><div className="v8BigAvatar">VT</div><h2>Vishwanath Thakur</h2><p>Aspiring Software Engineer · Full Stack Developer</p><span>LIVE LINK PREVIEW</span>{fields.map(([k,l])=><a key={k} href={k==="email"?`mailto:${social[k]}`:social[k]||"#"} target="_blank"><i>{k==="github"?"◉":k==="linkedin"?"in":k==="instagram"?"◎":k==="email"?"✉":"◌"}</i>{l}<b>↗</b></a>)}</div><div className="v8Card"><Head tag="PROFILE CONFIGURATION" title="Social & contact links"/>{fields.map(([k,l,p])=><label className="v8Field" key={k}><span><b>{l}</b><small>{p}</small></span><input value={social[k]} placeholder={p} onChange={e=>setSocial({...social,[k]:e.target.value})}/></label>)}<Btn onClick={save}>Save changes →</Btn></div></div></div>
}

function Skills({skills,setSkills,notify}:{skills:Skill[];setSkills:any;notify:(x:string)=>void}){
 const add=()=>{setSkills([...skills,{id:Date.now(),name:"New Skill",level:75,category:"Other"}]);notify("Skill added")};
 return <div className="v8Page"><Title eyebrow="TECH STACK" title="Skills manager" sub="Keep your public technology stack current." action={<Btn onClick={add}>＋ Add Skill</Btn>}/><div className="v8Card"><div className="v8SkillTable"><div className="v8TableHead"><span>SKILL</span><span>CATEGORY</span><span>LEVEL</span><span>ACTION</span></div>{skills.map(s=><div className="v8TableRow" key={s.id}><input value={s.name} onChange={e=>setSkills(skills.map(x=>x.id===s.id?{...x,name:e.target.value}:x))}/><select value={s.category} onChange={e=>setSkills(skills.map(x=>x.id===s.id?{...x,category:e.target.value}:x))}><option>Languages</option><option>Frontend</option><option>Backend</option><option>Tools</option><option>Other</option></select><div className="range"><input type="range" min="0" max="100" value={s.level} onChange={e=>setSkills(skills.map(x=>x.id===s.id?{...x,level:+e.target.value}:x))}/><b>{s.level}%</b></div><button onClick={()=>{setSkills(skills.filter(x=>x.id!==s.id));notify("Skill removed")}}>Delete</button></div>)}</div><Btn onClick={()=>notify("Skills are saved with Save All")}>Save Skills</Btn></div></div>
}

function Experience({data,setData,notify}:{data:Experience[];setData:any;notify:(x:string)=>void}){return <ListEditor title="Experience" eyebrow="CAREER TIMELINE" sub="Manage roles, projects and professional milestones." data={data} setData={setData} notify={notify} fields={["role","company","period","description"]} labels={["Role / Position","Company","Period","Description"]} keyName="role"/>}
function Education({data,setData,notify}:{data:Education[];setData:any;notify:(x:string)=>void}){return <ListEditor title="Education" eyebrow="ACADEMIC JOURNEY" sub="Manage your academic background." data={data} setData={setData} notify={notify} fields={["degree","institution","period","description"]} labels={["Degree","Institution","Period","Description"]} keyName="degree"/>}
function ListEditor({title,eyebrow,sub,data,setData,notify,fields,labels,keyName}:{title:string;eyebrow:string;sub:string;data:any[];setData:any;notify:(x:string)=>void;fields:string[];labels:string[];keyName:string}){
 const add=()=>{const x:any={id:Date.now()};fields.forEach((f,i)=>x[f]=i===0?`New ${title}`:"");setData([...data,x]);notify(`${title} item added`)};
 return <div className="v8Page"><Title eyebrow={eyebrow} title={title} sub={sub} action={<Btn onClick={add}>＋ Add {title}</Btn>}/><div className="v8Stack">{data.map((item,i)=><div className="v8Card v8ListCard" key={item.id}><div className="v8ListTop"><span>0{i+1}</span><b>{item[keyName]||"Untitled"}</b><button onClick={()=>{setData(data.filter(x=>x.id!==item.id));notify(`${title} item deleted`)}}>Delete</button></div><div className="v8FormGrid">{fields.map((f,j)=><label key={f} className={f==="description"?"wide":""}>{labels[j]}{f==="description"?<textarea value={item[f]} onChange={e=>setData(data.map(x=>x.id===item.id?{...x,[f]:e.target.value}:x))}/>:<input value={item[f]} onChange={e=>setData(data.map(x=>x.id===item.id?{...x,[f]:e.target.value}:x))}/>}</label>)}</div></div>)}</div></div>
}

function Certificates({data,setData,notify}:{data:Certificate[];setData:any;notify:(x:string)=>void}){return <div className="v8Page"><Title eyebrow="ACHIEVEMENTS" title="Certificates" sub="Store certificate names, issuers, years and verification links." action={<Btn onClick={()=>{setData([...data,{id:Date.now(),name:"New Certificate",issuer:"Issuer",year:"2026",url:"#"}]);notify("Certificate added")}}>＋ Add Certificate</Btn>}/><div className="v8CertGrid">{data.map((c,i)=><div className="v8Cert" key={c.id}><span>✦ 0{i+1}</span><h3>{c.name}</h3><p>{c.issuer} · {c.year}</p><input value={c.name} onChange={e=>setData(data.map(x=>x.id===c.id?{...x,name:e.target.value}:x))}/><input value={c.issuer} onChange={e=>setData(data.map(x=>x.id===c.id?{...x,issuer:e.target.value}:x))}/><div className="v8TwoFields"><input value={c.year} onChange={e=>setData(data.map(x=>x.id===c.id?{...x,year:e.target.value}:x))}/><input value={c.url} onChange={e=>setData(data.map(x=>x.id===c.id?{...x,url:e.target.value}:x))}/></div><button onClick={()=>{setData(data.filter(x=>x.id!==c.id));notify("Certificate deleted")}}>Delete</button></div>)}</div></div>}

function Resume({name,setName,notify}:{name:string;setName:(x:string)=>void;notify:(x:string)=>void}){
 const [size,setSize]=useState(0);
 const upload=(e:React.ChangeEvent<HTMLInputElement>)=>{const f=e.target.files?.[0];if(!f)return;setName(f.name);setSize(f.size);localStorage.setItem("vt_resume_name",f.name);notify("Resume selected and saved locally")};
 return <div className="v8Page"><Title eyebrow="CAREER ASSET" title="Resume manager" sub="Upload your latest resume and keep its public filename organized."/><div className="v8Card v8Resume"><div className="resumeIcon">PDF</div><div><span>ACTIVE RESUME</span><h2>{name}</h2><p>{size?`${Math.round(size/1024)} KB · selected this session`:"No file size recorded in local storage"}</p></div><label className="v8Upload">Choose PDF<input type="file" accept=".pdf" onChange={upload}/></label></div><div className="v8Card"><h2>Resume display</h2><label className="v8Field"><span><b>Public filename</b><small>Shown to recruiters</small></span><input value={name} onChange={e=>setName(e.target.value)}/></label><Btn onClick={()=>{localStorage.setItem("vt_resume_name",name);notify("Resume settings saved")}}>Save Resume Settings</Btn></div></div>
}

function Messages({data,setData,notify}:{data:Message[];setData:any;notify:(x:string)=>void}){
 const sample=data.length?data:[{id:1,name:"Recruiter",email:"recruiter@example.com",subject:"Frontend opportunity",message:"I'd like to discuss a software engineering opportunity.",date:"Today",read:false}];
 const mark=(id:number)=>setData(sample.map(m=>m.id===id?{...m,read:true}:m));
 return <div className="v8Page"><Title eyebrow="INBOX" title="Messages" sub="Review contact enquiries and mark them as read." action={<Btn soft onClick={()=>{setData([]);notify("Inbox cleared")}}>Clear inbox</Btn>}/><div className="v8MessageList">{sample.map(m=><article className={m.read?"v8Message read":"v8Message"} key={m.id}><div className="msgAvatar">{m.name.slice(0,2).toUpperCase()}</div><div><div className="msgTop"><b>{m.name}</b><span>{m.date}</span></div><small>{m.email}</small><h3>{m.subject}</h3><p>{m.message}</p><div><a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: "+m.subject)}`}>Reply via email ↗</a><button onClick={()=>mark(m.id)}>Mark read</button></div></div></article>)}</div></div>
}

function Analytics({projects,messages}:{projects:Project[];messages:Message[]}){const published=projects.filter(p=>p.status==="Published").length;return <div className="v8Page"><Title eyebrow="INSIGHTS" title="Analytics" sub="A clean overview of your portfolio activity. Demo metrics are local until a real analytics provider is connected."/><div className="v8Metrics"><Metric icon="◉" title="Views" value="1,284" trend="+18.4%"/><Metric icon="▣" title="Published Projects" value={String(published)} trend="Live"/><Metric icon="✉" title="Messages" value={String(messages.length)} trend="Inbox"/><Metric icon="★" title="Featured Projects" value={String(projects.filter(p=>p.featured).length)} trend="Curated"/></div><div className="v8Card"><Head tag="EVENTS" title="Analytics connection"/><p className="v8Muted">For real visitor counts, connect Vercel Analytics, Google Analytics or another privacy-conscious analytics provider. The admin UI is ready for the integration.</p></div></div>}

function GithubEditor({data,setData,notify}:{data:Github;setData:any;notify:(x:string)=>void}){
 const sync=async()=>{if(!data.username){notify("Enter a GitHub username first");return}try{const r=await fetch(`https://api.github.com/users/${encodeURIComponent(data.username)}`);if(!r.ok)throw new Error();const x=await r.json();setData({...data,connected:true,lastSync:new Date().toLocaleString(),});localStorage.setItem("vt_github",JSON.stringify({...data,connected:true,lastSync:new Date().toLocaleString()}));notify(`Connected to ${x.login} — ${x.public_repos} public repositories`)}catch{notify("GitHub lookup failed — check the username or internet connection")}};
 return <div className="v8Page"><Title eyebrow="SMART INTEGRATION" title="GitHub connection" sub="Connect your public GitHub identity and test the live GitHub API." action={<Btn onClick={sync}>↻ Sync GitHub</Btn>}/><div className="v8Card"><div className="integrationHero"><div className="integrationIcon">◉</div><div><h2>{data.connected?"GitHub connected":"GitHub not connected"}</h2><p>{data.lastSync==="Never"?"Enter your username and sync.":`Last sync: ${data.lastSync}`}</p></div><span className={data.connected?"v8Ok":"v8Warn"}>{data.connected?"CONNECTED":"READY"}</span></div><label className="v8Field"><span><b>GitHub username</b><small>Example: octocat</small></span><input value={data.username} onChange={e=>setData({...data,username:e.target.value})}/></label><Btn onClick={sync}>Test & Sync →</Btn></div></div>
}

function Assistant({notify}:{notify:(x:string)=>void}){
 const [q,setQ]=useState("");const [chat,setChat]=useState<{q:string;a:string}[]>([]);
 const ask=()=>{if(!q.trim())return;const x=q.toLowerCase();let a="I can help you manage your portfolio. Try asking about projects, profile links, resume, GitHub or SEO.";if(x.includes("project"))a="Open Projects to create, edit, feature or publish project cards.";else if(x.includes("github"))a="Open GitHub to set your username and test a live public profile lookup.";else if(x.includes("social")||x.includes("linkedin")||x.includes("instagram"))a="Open Profile Links to update your public GitHub, LinkedIn, Instagram, email and WhatsApp links.";else if(x.includes("resume"))a="Open Resume to select a PDF and manage its public filename.";else if(x.includes("seo"))a="Open SEO to edit title, description, keywords and social preview image.";setChat([...chat,{q,a}]);setQ("");notify("Assistant replied")};
 return <div className="v8Page"><Title eyebrow="LOCAL AI ASSISTANT" title="Portfolio copilot" sub="A lightweight local assistant for navigating and managing this starter admin console."/><div className="v8Card v8Chat"><div className="chatMessages">{chat.length===0?<div className="chatEmpty">✧ Ask: “How do I add a project?”</div>:chat.map((c,i)=><div key={i}><div className="userBubble">{c.q}</div><div className="aiBubble">✦ {c.a}</div></div>)}</div><div className="chatInput"><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask()} placeholder="Ask the portfolio copilot..."/><Btn onClick={ask}>Send ↗</Btn></div></div></div>
}

function SEO({data,setData,save}:{data:Seo;setData:any;save:()=>void}){return <div className="v8Page"><Title eyebrow="DISCOVERABILITY" title="SEO studio" sub="Control the title, description, keywords and social preview metadata." action={<Btn onClick={save}>✓ Save SEO</Btn>}/><div className="v8Card"><div className="v8FormGrid"><label>Page title<input value={data.title} onChange={e=>setData({...data,title:e.target.value})}/></label><label>OG image<input value={data.ogImage} onChange={e=>setData({...data,ogImage:e.target.value})}/></label><label className="wide">Description<textarea value={data.description} onChange={e=>setData({...data,description:e.target.value})}/></label><label className="wide">Keywords<input value={data.keywords} onChange={e=>setData({...data,keywords:e.target.value})}/></label></div><div className="seoPreview"><small>SEARCH PREVIEW</small><h3>{data.title}</h3><span>vishwanath.dev</span><p>{data.description}</p></div></div></div>}

function Settings({data,setData,save,compact,setCompact}:{data:SiteSettings;setData:any;save:()=>void;compact:boolean;setCompact:(x:boolean)=>void}){return <div className="v8Page"><Title eyebrow="SITE CONTROL" title="Settings" sub="Manage the identity and public availability state of your portfolio." action={<Btn onClick={save}>✓ Save Settings</Btn>}/><div className="v8Card"><div className="v8FormGrid"><label>Name<input value={data.name} onChange={e=>setData({...data,name:e.target.value})}/></label><label>Professional title<input value={data.title} onChange={e=>setData({...data,title:e.target.value})}/></label><label>Tagline<input value={data.tagline} onChange={e=>setData({...data,tagline:e.target.value})}/></label><label>Location<input value={data.location} onChange={e=>setData({...data,location:e.target.value})}/></label><label>Availability<select value={data.availability} onChange={e=>setData({...data,availability:e.target.value})}><option>Available for internships</option><option>Open to opportunities</option><option>Currently unavailable</option></select></label><label>Theme<select value={data.theme} onChange={e=>setData({...data,theme:e.target.value})}><option>Anime Purple</option><option>Anime Cyan</option><option>Minimal Dark</option></select></label></div></div><div className="v8Card v9Pref"><Head tag="WORKSPACE" title="Advanced preferences"/><div className="v9PrefRow"><div><b>Compact admin density</b><small>Show more controls per screen.</small></div><button aria-label="Toggle compact admin density" className={compact?"toggle on":"toggle"} onClick={()=>{const next=!compact;setCompact(next);localStorage.setItem("vt_compact",String(next))}}><i/></button></div><div className="v9PrefRow"><div><b>Command palette</b><small>Press Ctrl+K or Cmd+K anywhere in admin.</small></div><span className="v9Badge">ENABLED</span></div></div></div>}

function SecurityEditor({data,setData,save}:{data:Security;setData:any;save:()=>void}){return <div className="v8Page"><Title eyebrow="PROTECTION" title="Security" sub="Control local session preferences and understand the starter's security boundary." action={<Btn onClick={save}>✓ Save Security</Btn>}/><div className="v8Card"><div className="securityRow"><div><b>Two-factor authentication</b><small>UI preference for the future production auth provider.</small></div><button className={data.twoFactor?"toggle on":"toggle"} onClick={()=>setData({...data,twoFactor:!data.twoFactor})}><i/></button></div><div className="securityRow"><div><b>Session duration</b><small>Production auth should enforce this server-side.</small></div><select value={data.sessionHours} onChange={e=>setData({...data,sessionHours:+e.target.value})}><option value={2}>2 hours</option><option value={8}>8 hours</option><option value={24}>24 hours</option></select></div><div className="securityNotice">⚠ This starter uses server-side signed HTTP-only cookies for login, while CMS content is stored in browser localStorage. For production, connect Supabase/Auth.js and a database before storing sensitive content.</div></div></div>}
