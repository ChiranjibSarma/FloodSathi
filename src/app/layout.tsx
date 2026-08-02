import "./globals.css";
import Link from "next/link";
export const metadata={title:"FloodSathi Assam",description:"Assam flood relief coordination",manifest:"/manifest.webmanifest"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="as-IN"><body><a className="skip" href="#main">Skip to content</a><header className="header"><nav className="container nav" aria-label="Primary"><Link className="brand" href="/">FloodSathi Assam · বানপানী সাথী</Link><div className="actions"><Link href="/?lang=as">অসমীয়া</Link><Link href="/?lang=en">English</Link></div></nav></header><main id="main">{children}</main></body></html>}
