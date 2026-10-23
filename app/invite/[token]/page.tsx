import Wedding from '@/components/Wedding';import db,{Guest} from '@/lib/db';import {notFound} from 'next/navigation';
export const dynamic='force-dynamic';
export default async function Invite({params}:{params:Promise<{token:string}>}){const {token}=await params;const guest=db.prepare('SELECT * FROM guests WHERE token=?').get(token) as Guest|undefined;if(!guest)notFound();return <Wedding guest={{name:guest.name,token:guest.token,seats:guest.seats,status:guest.status,attending_count:guest.attending_count}}/>}
