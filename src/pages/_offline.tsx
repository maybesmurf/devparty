import DevpartySEO from '@components/shared/SEO'
import { Button } from '@components/ui/Button'
import { RefreshIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { STATIC_ASSETS } from 'src/constants'

export default function Offline() {
  return (
    <>
      <DevpartySEO title="Offline · Devparty" />
      <div className="flex flex-col h-full justify-start pt-10 items-center">
        <img
          src={`${STATIC_ASSETS}/gifs/nyan-cat.gif`}
          alt="Nyan Cat"
          className="h-60"
        />
        <div className="py-10 text-center">
          <h1 className="text-3xl mb-4 font-bold">You are offline!</h1>
          <div className="mb-4">
            Please check your internet connection and reload.
          </div>
          <Link href="/home">
            <a href="/home">
              <Button
                className="flex item-center mx-auto"
                size="lg"
                icon={<RefreshIcon className="w-4 h-4" />}
              >
                <div>Reload</div>
              </Button>
            </a>
          </Link>
        </div>
      </div>
    </>
  )
}
