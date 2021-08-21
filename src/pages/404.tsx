import Link from 'next/link'
import { NextSeo } from 'next-seo'

import { GridLayout } from '~/components/GridLayout'

export default function Custom404() {
  return (
    <GridLayout>
      <NextSeo title="Page Not Found" />
      <div className="mb-2">This page could not be found.</div>
      <Link href="/">Go home.</Link>
    </GridLayout>
  )
}
