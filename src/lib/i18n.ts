import as from "../../locales/as.json";
import en from "../../locales/en.json";
export type Locale="as-IN"|"en-IN";
export type TranslationKey=keyof typeof en;
const messages:Record<Locale,Record<TranslationKey,string>>={"as-IN":as,"en-IN":en};
export function t(locale:Locale,key:TranslationKey){return messages[locale][key]}
export function localeFrom(value?:string|null):Locale{return value?.startsWith("en")?"en-IN":"as-IN"}
export {messages};
