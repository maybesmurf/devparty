import { useQuery } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ProgressBar } from '@components/UI/ProgressBar'
import { Spinner } from '@components/UI/Spinner'
import { GET_PROFILE_SETTINGS_QUERY } from '@components/User/Settings/Profile'
import { GetProfileSettingsQuery, User } from '@graphql/types.generated'
import { ArrowCircleRightIcon, ArrowLeftIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React, { useState } from 'react'

import ProfileForm from './ProfileForm'

const Profile: React.FC = () => {
  const [showSkip, setShowSkip] = useState<boolean>(true)
  const { data, loading } = useQuery<GetProfileSettingsQuery>(
    GET_PROFILE_SETTINGS_QUERY
  )
  const currentUser = data?.me

  return (
    <div className="onboarding-bg page-center">
      <Card className="w-full sm:max-w-xl border-2 shadow-lg">
        <CardBody className="linkify space-y-2">
          <div className="flex items-center mb-5 space-x-5">
            <Link href="/onboarding/topics" passHref>
              <Button
                className="mx-auto rounded-full"
                size="lg"
                variant="secondary"
                icon={<ArrowLeftIcon className="h-4 w-4" />}
                outline
              />
            </Link>
            <ProgressBar percentage={50} />
            <Link href="/onboarding/follow" passHref>
              <Button
                className="mx-auto"
                icon={<ArrowCircleRightIcon className="h-4 w-4" />}
              >
                {showSkip ? 'Skip' : 'Continue'}
              </Button>
            </Link>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">Build your profile</div>
            <div className="text-gray-500">
              Tell us a little bit about yourself — this is how others will see
              you on Devparty. You’ll always be able to edit this later in your
              Settings.
            </div>
          </div>
          <div className="pt-5">
            {loading && !currentUser ? (
              <div className="p-3 font-bold text-center space-y-2">
                <Spinner size="md" className="mx-auto" />
                <div>Get ready to build your profile!</div>
              </div>
            ) : (
              <ProfileForm
                currentUser={currentUser as User}
                setShowSkip={setShowSkip}
              />
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default Profile
