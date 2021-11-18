import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ProgressBar } from '@components/UI/ProgressBar'
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const Finish: React.FC = () => {
  const router = useRouter()

  const handleContinue = () => {
    router.push('/home')
  }

  return (
    <div className="onboarding-bg page-center">
      <Card className="w-full sm:max-w-xl border-2 shadow-lg">
        <CardBody className="linkify">
          <div className="flex items-center mb-5 space-x-5">
            <Link href="/onboarding/follow" passHref>
              <Button
                className="mx-auto rounded-full"
                size="lg"
                variant="secondary"
                icon={<ArrowLeftIcon className="h-4 w-4" />}
                outline
              />
            </Link>
            <ProgressBar percentage={100} />
            <Button
              className="mx-auto"
              icon={<CheckCircleIcon className="h-4 w-4" />}
              onClick={handleContinue}
            >
              Finish
            </Button>
          </div>
          <div className="space-y-1 text-center">
            <div className="text-2xl font-bold">
              Hangout with the community!
            </div>
            <p className="text-gray-500 max-w-md mx-auto">
              Join our community of builders across the internet and stay
              updated with new features and releases.
            </p>
          </div>
          <div>
            <img
              alt="Welcome"
              className="h-52 mx-auto"
              src="https://assets.devparty.io/images/illustrations/yay.png"
            />
          </div>
          <div className="mt-5 grid sm:flex justify-center items-center space-x-0 sm:space-x-2 space-y-2 sm:space-y-0">
            <div>
              <a
                href="https://discord.gg/zxHM7uwDmk"
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  className="!border-[#5865F2] !bg-[#5865F2] opacity-90 hover:opacity-100 text-white focus:!ring-[#5865F2] focus:!ring-opacity-50"
                  icon={
                    <img
                      className="h-5 w-5 mr-1"
                      src="https://assets.devparty.io/images/brands/discord-white.svg"
                      alt="Discord"
                    />
                  }
                >
                  Join our Discord
                </Button>
              </a>
            </div>
            <div>
              <a
                href="https://twitter.com/devpartyio?ref_src=twsrc%5Etfw"
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  className="!border-[#1d9cf0] !bg-[#1d9cf0] opacity-90 hover:opacity-100 text-white focus:!ring-[#1d9cf0] focus:!ring-opacity-50"
                  icon={
                    <img
                      className="h-3 mr-1"
                      src="https://assets.devparty.io/images/brands/twitter-dark.svg"
                      alt="Twitter"
                    />
                  }
                >
                  Follow on Twitter
                </Button>
              </a>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default Finish
