import { gql, useQuery } from '@apollo/client'
import React from 'react'
import { ErrorMessage } from '../ui/ErrorMessage'
import { GridLayout } from '../ui/GridLayout'
import { Shimmer } from '../ui/Shimmer'
import { ProfileForm } from './ProfileForm'
import { EditProfileQuery } from './__generated__/index.generated'

export const EditProfile: React.FC = () => {
  const { data, loading, error } = useQuery<EditProfileQuery>(gql`
    query EditProfileQuery {
      me {
        id
        username
      }
    }
  `)

  return (
    <GridLayout>
      {loading && <Shimmer />}

      {error && (
        <ErrorMessage title="Failed to load your profile" error={error} />
      )}

      {data && data.me && <ProfileForm user={data.me} />}
    </GridLayout>
  )
}
