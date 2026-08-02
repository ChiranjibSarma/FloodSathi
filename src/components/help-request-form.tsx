"use client";
import { useEffect, useState } from "react";
import { LocationPicker } from "@/components/location-picker";
import { districts } from "@/domain/districts";
const DRAFT = "floodsathi-help-draft-v1";
const categories = ["RESCUE_EVACUATION", "MEDICAL_ASSISTANCE", "FOOD", "DRINKING_WATER", "SHELTER", "ESSENTIAL_MEDICINE", "VULNERABLE_SUPPORT", "SANITATION", "LIVESTOCK_RESCUE", "ANIMAL_FEED", "TRANSPORT", "OTHER_URGENT"] as const;
type Category = typeof categories[number];
type FormLanguage = "as-IN" | "en-IN";
const categoryLabels: Record<FormLanguage, Record<Category, string>> = {
    "as-IN": { RESCUE_EVACUATION: "উদ্ধাৰ বা স্থানান্তৰ", MEDICAL_ASSISTANCE: "চিকিৎসা সহায়", FOOD: "খাদ্য", DRINKING_WATER: "খোৱাপানী", SHELTER: "আশ্ৰয়", ESSENTIAL_MEDICINE: "অত্যাৱশ্যকীয় ঔষধ", VULNERABLE_SUPPORT: "দুৰ্বল ব্যক্তিৰ সহায়", SANITATION: "অনাময় ব্যৱস্থা", LIVESTOCK_RESCUE: "পশুধন উদ্ধাৰ", ANIMAL_FEED: "পশুখাদ্য", TRANSPORT: "যাতায়াত", OTHER_URGENT: "অন্যান্য জৰুৰী সহায়" },
    "en-IN": { RESCUE_EVACUATION: "Rescue or evacuation", MEDICAL_ASSISTANCE: "Medical assistance", FOOD: "Food", DRINKING_WATER: "Drinking water", SHELTER: "Shelter", ESSENTIAL_MEDICINE: "Essential medicine", VULNERABLE_SUPPORT: "Vulnerable-person support", SANITATION: "Sanitation", LIVESTOCK_RESCUE: "Livestock rescue", ANIMAL_FEED: "Animal feed", TRANSPORT: "Transport", OTHER_URGENT: "Other urgent assistance" }
};
type Result = {
    ok: boolean;
    reference?: string;
    error?: string;
};
export function HelpRequestForm() { const [result, setResult] = useState<Result>(); const [busy, setBusy] = useState(false); const [online, setOnline] = useState(true); const [language, setLanguage] = useState<FormLanguage>("as-IN"); useEffect(() => { setOnline(navigator.onLine); const sync = () => setOnline(navigator.onLine); addEventListener("online", sync); addEventListener("offline", sync); const saved = localStorage.getItem(DRAFT); if (saved) {
    const values = JSON.parse(saved) as Record<string, string>;
    if (values.language === "as-IN" || values.language === "en-IN")
        setLanguage(values.language);
    for (const [key, value] of Object.entries(values)) {
        if (key === "language")
            continue;
        const element = document.querySelector(`[name="${key}"]`) as HTMLInputElement | null;
        if (element && element.type !== "checkbox" && element.type !== "hidden")
            element.value = value;
    }
} return () => { removeEventListener("online", sync); removeEventListener("offline", sync); }; }, []); function save(form: HTMLFormElement) { const data = new FormData(form); localStorage.setItem(DRAFT, JSON.stringify(Object.fromEntries(data.entries()))); } async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const form = event.currentTarget; save(form); if (!online) {
    setResult({ ok: false, error: "No network. Draft saved; retry when connected." });
    return;
} setBusy(true); const raw = Object.fromEntries(new FormData(form)); const latitude = raw.latitude ? Number(raw.latitude) : undefined; const longitude = raw.longitude ? Number(raw.longitude) : undefined; const payload = { ...raw, latitude, longitude, locationAccuracyMetres: raw.locationAccuracyMetres ? Number(raw.locationAccuracyMetres) : undefined, locationConsent: raw.locationConsent === "on", affectedPeople: Number(raw.affectedPeople), children: Number(raw.children), elderly: Number(raw.elderly), medicalEmergency: raw.medicalEmergency === "on", immediateDanger: raw.immediateDanger === "on", evacuationRequired: raw.evacuationRequired === "on", consent: raw.consent === "on", idempotencyKey: crypto.randomUUID() }; try {
    const response = await fetch("/api/requests", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json() as Result;
    setResult(data);
    if (response.ok)
        localStorage.removeItem(DRAFT);
}
catch {
    setResult({ ok: false, error: "Submission failed. Your draft remains safely on this device." });
}
finally {
    setBusy(false);
} } if (result?.ok)
    return <section className="card stack" role="status"><h2>আবেদন গ্ৰহণ কৰা হৈছে · Request received</h2><p>Public reference: <strong>{result.reference}</strong></p><p>Your private details will not appear on tracking pages.</p><a className="button" href={`/track/${result.reference}`}>Track status</a></section>; return <form className="card stack" onSubmit={submit} onChange={e => save(e.currentTarget)}><p className="status" aria-live="polite">{online ? "Online" : "Offline — draft only"}</p><div className="grid"><label>Preferred language<select name="language" value={language} onChange={e => setLanguage(e.target.value as FormLanguage)}><option value="as-IN">অসমীয়া</option><option value="en-IN">English</option></select></label><label>{language === "as-IN" ? "সহায়ৰ শ্ৰেণী" : "Help category"}<select name="category" required>{categories.map(c => <option key={c} value={c}>{categoryLabels[language][c]}</option>)}</select></label><label>Name<input name="name" required minLength={2} autoComplete="name"/></label><label>Mobile number<input name="mobile" required inputMode="tel" autoComplete="tel" pattern="\+?[0-9]{10,15}"/></label><label>{language === "as-IN" ? "জিলা" : "District"}<select name="district" required defaultValue=""><option value="" disabled>{language === "as-IN" ? "জিলা বাছনি কৰক" : "Select district"}</option>{districts.map(d => <option key={d.en} value={d.en}>{language === "as-IN" ? d.as : d.en}</option>)}</select></label><label>Village / locality<input name="locality" required/></label><label>Nearby landmark<input name="landmark"/></label><label>People affected<input name="affectedPeople" type="number" min="1" defaultValue="1" required/></label><label>Children<input name="children" type="number" min="0" defaultValue="0" required/></label><label>Elderly people<input name="elderly" type="number" min="0" defaultValue="0" required/></label></div><LocationPicker language={language}/><fieldset><legend>Urgency</legend><label><input name="immediateDanger" type="checkbox"/> Immediate danger</label><label><input name="medicalEmergency" type="checkbox"/> Medical emergency</label><label><input name="evacuationRequired" type="checkbox"/> Evacuation required</label></fieldset><label>বিৱৰণ · Description<textarea name="description" required minLength={10}/></label><label style={{ position: "absolute", left: "-10000px" }} aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label><label><input name="consent" type="checkbox" required/> I consent to processing this information for flood-relief coordination.</label>{result?.error && <p className="error" role="alert">{result.error}</p>}<button className="button" disabled={busy}>{busy ? "Submitting…" : "আবেদন জমা দিয়ক · Submit request"}</button><p className="muted">Drafts are stored only on this device until submission succeeds.</p></form>; }
