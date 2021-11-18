import SocialSettings from '@components/Product/Settings/Social'
import { authenticatedRoute } from '@utils/redirects'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = authenticatedRoute

export default SocialSettings
