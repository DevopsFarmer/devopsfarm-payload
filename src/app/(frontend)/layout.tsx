import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
// import { Footer } from '@/Footer/Component'
// import { Header } from '@/Header/Component'
import Footer1 from './footer/Footer'
// import Navbar from './components/Navbar'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import NavbarClient from './navabar/Navbar'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  const payload = await getPayload({ config })

  // Fetch Navbar data
  const findResult = await payload.find({ collection: 'navbar' })

  // Sort items by 'order' field
  const sortedNavItems = findResult?.docs?.sort((a, b) => a.order - b.order) || []

  const payload1 = await getPayload({ config });

  const { docs } = await payload1.find({ collection: "footer1" });

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          {/* <NavbarClient navItems={sortedNavItems} /> */}
          {children}
          {/* <Footer1 footerItems={docs} /> */}
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
