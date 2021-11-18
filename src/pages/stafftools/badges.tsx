import StaffToolsBadges from '@components/StaffTools/Badges'
import { staffRoute } from '@utils/redirects'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = staffRoute

export default StaffToolsBadges
