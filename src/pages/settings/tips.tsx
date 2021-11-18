import TipsSettings from '@components/User/Settings/Tips'
import { authenticatedRoute } from '@utils/redirects'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = authenticatedRoute

export default TipsSettings
