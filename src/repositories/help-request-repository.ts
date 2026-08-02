import type {HelpRequestInput} from "@/domain/request";
export interface CreatedRequest{id:string;reference:string;status:"NEW";accessCode:string}
export interface HelpRequestRepository{create(input:HelpRequestInput):Promise<CreatedRequest>}
export class PersistenceUnavailableError extends Error{constructor(){super("Request persistence is not configured")}}
