import { NextRequest, NextResponse } from "next/server";
import { createSession, verifyAdmin } from "@/lib/auth";
export async function POST(req:NextRequest){
  try{const {email,password}=await req.json();if(typeof email!=="string"||typeof password!=="string"||email.length>160||password.length>200)return NextResponse.json({error:"Invalid credentials."},{status:400});
  if(!await verifyAdmin(email,password))return NextResponse.json({error:"Invalid credentials."},{status:401});
  await createSession();return NextResponse.json({ok:true});}
  catch{return NextResponse.json({error:"Authentication is not configured."},{status:503});}
}
