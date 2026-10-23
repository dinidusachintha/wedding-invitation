import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
const key = () => new TextEncoder().encode(process.env.SESSION_SECRET || '');
export function safeMatch(a:string,b:string){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)}
export async function isAdmin(){const secret=process.env.SESSION_SECRET;if(!secret||secret.length<32)return false;const token=(await cookies()).get('admin_session')?.value;if(!token)return false;try{const result=await jwtVerify(token,key());return result.payload.role==='admin'}catch{return false}}
export async function issueSession(){return new SignJWT({role:'admin'}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('12h').sign(key())}
export async function requireAdmin(){if(!(await isAdmin()))return NextResponse.json({error:'Unauthorized'},{status:401});return null}
