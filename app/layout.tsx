import { Geist, Geist_Mono, Public_Sans } from "next/font/google"

import "./globals.css"
import { AppProviders } from "@/providers/central/app-providers"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeConfigProvider } from "@/providers/theme-config-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";

const publicSans = Public_Sans({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", publicSans.variable)}
    >
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var c=JSON.parse(localStorage.getItem("app-theme-config")||"{}");if(c.themeColor){document.documentElement.dataset.themeColor=c.themeColor}}catch(e){}})()`,
          }}
        />
        <AppProviders>
          <ThemeProvider>
            <ThemeConfigProvider>
              <TooltipProvider>
                {children}
                <Toaster richColors closeButton />
              </TooltipProvider>
            </ThemeConfigProvider>
          </ThemeProvider>
        </AppProviders>
      </body>
    </html>
  )
}
