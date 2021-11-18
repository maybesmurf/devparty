import Login from '@components/Auth/Login'
import { unauthenticatedRoute } from '@utils/redirects'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = unauthenticatedRoute

export default Login
