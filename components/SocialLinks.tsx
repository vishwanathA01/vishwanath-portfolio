"use client";
import { useEffect, useState } from "react";
import { siteConfig } from "../data/site";
export default function SocialLinks(){
 const [s,setS]=useState(siteConfig);
 useEffect(()=>{try{const x=localStorage.getItem("vt_social");if(x)setS({...siteConfig,...JSON.parse(x)})}catch{}} ,[]);
 return <div className="socialRow"><a href={s.github} target="_blank">GitHub ↗</a><a href={s.linkedin} target="_blank">LinkedIn ↗</a><a href={s.instagram} target="_blank">Instagram ↗</a><a href={`mailto:${s.email}`}>Email ↗</a></div>
}
