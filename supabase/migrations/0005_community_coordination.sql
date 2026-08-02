alter table public.help_requests add column if not exists requester_access_hash text;
alter table public.help_requests add column if not exists contact_share_consent boolean not null default false;
create table if not exists public.responder_offers(
  id uuid primary key default gen_random_uuid(), request_id uuid not null references public.help_requests on delete cascade,
  public_reference text not null unique default ('FSO-'||upper(encode(gen_random_bytes(6),'hex'))),
  responder_name_encrypted text not null, phone_encrypted text not null, help_description_encrypted text not null,
  eta_minutes int not null check(eta_minutes between 1 and 1440), people_coming int not null default 1 check(people_coming between 1 and 100),
  has_vehicle boolean not null default false, contact_share_consent boolean not null default false,
  responder_access_hash text not null, status text not null default 'OFFERED' check(status in ('OFFERED','ACCEPTED','DECLINED','WITHDRAWN','COMPLETED')),
  created_at timestamptz not null default now(), accepted_at timestamptz
);
create unique index if not exists one_accepted_offer_per_request on public.responder_offers(request_id) where status='ACCEPTED';
alter table public.responder_offers enable row level security;
grant select,insert,update on table public.responder_offers to service_role;
create or replace function public.submit_help_request(payload jsonb) returns table(id uuid,public_reference text) language plpgsql security definer set search_path=public as $$
declare v_request_id uuid; v_request_reference text;
begin
  if payload->>'idempotency_key' is null then raise exception 'idempotency key required'; end if;
  select h.id,h.public_reference into v_request_id,v_request_reference from public.help_requests h where h.idempotency_key=(payload->>'idempotency_key')::uuid;
  if v_request_id is not null then return query select v_request_id,v_request_reference; return; end if;
  insert into public.help_requests(district_id,category,original_language,requester_name_encrypted,phone_hash,phone_encrypted,description_encrypted,requester_access_hash,contact_share_consent,affected_people,consented_at,idempotency_key)
  values((payload->>'district_id')::uuid,payload->>'category',payload->>'original_language',payload->>'requester_name_encrypted',payload->>'phone_hash',payload->>'phone_encrypted',payload->>'description_encrypted',payload->>'requester_access_hash',coalesce((payload->>'contact_share_consent')::boolean,false),(payload->>'affected_people')::int,(payload->>'consented_at')::timestamptz,(payload->>'idempotency_key')::uuid)
  returning help_requests.id,help_requests.public_reference into v_request_id,v_request_reference;
  insert into public.request_people(request_id,children,elderly) values(v_request_id,coalesce((payload->>'children')::int,0),coalesce((payload->>'elderly')::int,0));
  insert into public.request_locations(request_id,exact_location,location_source,accuracy_metres,locality,landmark,consent_at) values(v_request_id,case when payload->>'latitude' is not null and payload->>'longitude' is not null then ST_SetSRID(ST_MakePoint((payload->>'longitude')::double precision,(payload->>'latitude')::double precision),4326)::geography else null end,coalesce(payload->>'location_source','TEXT_ONLY'),nullif(payload->>'location_accuracy_metres','')::numeric,payload->>'locality',payload->>'landmark',nullif(payload->>'location_consent_at','')::timestamptz);
  insert into public.request_vulnerabilities(request_id,kind) select v_request_id,kind from (values ('MEDICAL_EMERGENCY',coalesce((payload->>'medical_emergency')::boolean,false)),('IMMEDIATE_DANGER',coalesce((payload->>'immediate_danger')::boolean,false)),('EVACUATION_REQUIRED',coalesce((payload->>'evacuation_required')::boolean,false))) flags(kind,active) where active;
  insert into public.request_status_history(request_id,to_status,reason) values(v_request_id,'NEW','Public intake accepted');
  return query select v_request_id,v_request_reference;
end$$;
revoke all on function public.submit_help_request(jsonb) from public,anon,authenticated;
grant execute on function public.submit_help_request(jsonb) to service_role;
create or replace function public.accept_community_offer(p_request_reference text,p_offer_reference text,p_access_hash text) returns boolean language plpgsql security definer set search_path=public as $$
declare v_request_id uuid; v_offer_id uuid;
begin
  select id into v_request_id from public.help_requests where public_reference=p_request_reference and requester_access_hash=p_access_hash for update;
  if v_request_id is null then return false; end if;
  select id into v_offer_id from public.responder_offers where request_id=v_request_id and public_reference=p_offer_reference and status='OFFERED' for update;
  if v_offer_id is null then return false; end if;
  update public.responder_offers set status='DECLINED' where request_id=v_request_id and status='OFFERED' and id<>v_offer_id;
  update public.responder_offers set status='ACCEPTED',accepted_at=now() where id=v_offer_id;
  update public.help_requests set status='ACCEPTED',updated_at=now() where id=v_request_id;
  insert into public.request_status_history(request_id,from_status,to_status,reason) values(v_request_id,'NEW','ACCEPTED','Requester accepted a community responder offer');
  return true;
end$$;
revoke all on function public.accept_community_offer(text,text,text) from public,anon,authenticated;
grant execute on function public.accept_community_offer(text,text,text) to service_role;
