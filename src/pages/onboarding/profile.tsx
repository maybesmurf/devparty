import Profile from '@components/Onboarding/Profile'
import { authenticatedRoute } from '@utils/redirects'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return await authenticatedRoute(ctx, true)
}

export default Profile
