import "server-only";
import {createHmac,timingSafeEqual} from "node:crypto";
import {cookies} from "next/headers";
import {serverEnv} from "@/lib/env";

export const ORGANISER_COOKIE="fs-organiser";
const message="floodsathi-organiser-session-v1";
function signature(key:string){return createHmac("sha256",key).update(message).digest("hex")}
export function validAccessKey(candidate:string){const key=serverEnv().ORGANISER_ACCESS_KEY;if(!key)return false;const a=Buffer.from(candidate),b=Buffer.from(key);return a.length===b.length&&timingSafeEqual(a,b)}
export function sessionValue(){const key=serverEnv().ORGANISER_ACCESS_KEY;if(!key)throw new Error("Organiser access is not configured");return signature(key)}
export async function isOrganiserAuthenticated(){const key=serverEnv().ORGANISER_ACCESS_KEY;if(!key)return false;const supplied=(await cookies()).get(ORGANISER_COOKIE)?.value;if(!supplied)return false;const expected=signature(key);const a=Buffer.from(supplied),b=Buffer.from(expected);return a.length===b.length&&timingSafeEqual(a,b)}
