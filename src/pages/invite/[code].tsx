import InviteSignup from '@components/Auth/Invite'
import { unauthenticatedRoute } from '@utils/redirects'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = unauthenticatedRoute

export default InviteSignup
