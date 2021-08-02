import { gql, useQuery } from '@apollo/client'
import { NextSeo } from 'next-seo'
import { Container } from '../ui/Container'
import { ErrorMessage } from '../ui/ErrorMessage'
import { Shimmer } from '../ui/Shimmer'
import { ProfileForm, ProfileFormFragment } from './ProfileForm'
import { EditProfileQuery } from './__generated__/index.generated'

export function EditProfile() {
  const { data, loading, error } = useQuery<EditProfileQuery>(gql`
    query EditProfileQuery {
      me {
        ...ProfileForm_user
      }
    }

    ${ProfileFormFragment}
  `)

  return (
    <Container title="Edit Profile">
      {loading && <Shimmer />}

      {error && (
        <ErrorMessage title="Failed to load your profile" error={error} />
      )}

      {data && data.me && <ProfileForm user={data.me} />}
    </Container>
  )
}
