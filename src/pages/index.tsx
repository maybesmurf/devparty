import Landing from '@components/Landing'
import { unauthenticatedRoute } from '@utils/redirects'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = unauthenticatedRoute

export default Landing
