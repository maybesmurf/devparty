import SecuritySettings from '@components/User/Settings/Security'
import { authenticatedRoute } from '@utils/redirects'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = authenticatedRoute

export default SecuritySettings
