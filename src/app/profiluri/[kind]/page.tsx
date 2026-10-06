import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProfileVariant, type ProfileVariantKind } from "@/components/profile-variant";
const kinds=["gradinita","scoala-gimnaziala","clubul-copiilor","centru-suport"] as const;
export const dynamicParams=false;
export function generateStaticParams(){return kinds.map(kind=>({kind}))}
export async function generateMetadata({params}:{params:Promise<{kind:string}>}):Promise<Metadata>{const kind=(await params).kind;if(!kinds.includes(kind as ProfileVariantKind))return{title:"Profil negăsit"};return{title:`Profil ${kind.replaceAll("-"," ")} — Top Edu`,description:"Profil educațional cu date publice și surse verificabile în Top Edu."}}
export default async function VariantPage({params}:{params:Promise<{kind:string}>}){const kind=(await params).kind as ProfileVariantKind;if(!kinds.includes(kind))notFound();return <ProfileVariant kind={kind}/>} 
