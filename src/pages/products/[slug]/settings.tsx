import Settings, {
  PRODUCT_SETTINGS_QUERY as query
} from '~/components/Product/Settings'
import { preloadQuery } from '~/utils/apollo'
import { authenticatedRoute } from '~/utils/redirects'

export const getServerSideProps = async (ctx: any) => {
  const auth = await authenticatedRoute(ctx)
  if ('redirect' in auth) {
    return auth
  }

  return preloadQuery(ctx, { query })
}

export default Settings