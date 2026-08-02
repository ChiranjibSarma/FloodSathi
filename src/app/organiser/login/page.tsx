import {redirect} from "next/navigation";
import {isOrganiserAuthenticated} from "@/lib/organiser-auth";
import {login} from "@/app/organiser/actions";

export default async function OrganiserLogin({searchParams}:{searchParams:Promise<{error?:string}>}){if(await isOrganiserAuthenticated())redirect("/organiser");const {error}=await searchParams;return <div className="container responder-login"><section className="card stack"><p className="eyebrow">Responder access</p><h1>সংগঠক লগইন · Organiser login</h1><p>Only authorised relief coordinators may access requester contact details and exact locations.</p>{error&&<p className="error" role="alert">Incorrect access key.</p>}<form action={login} className="stack"><label>Organiser access key<input name="accessKey" type="password" required minLength={24} autoComplete="current-password"/></label><button className="button">Open responder dashboard</button></form></section></div>}
