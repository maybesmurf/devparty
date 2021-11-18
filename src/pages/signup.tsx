import Signup from '@components/Auth/Signup'
import { unauthenticatedRoute } from '@utils/redirects'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = unauthenticatedRoute

export default Signup
