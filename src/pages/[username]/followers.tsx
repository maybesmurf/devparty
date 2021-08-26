import Followers, {
  USER_FOLLOWERS_QUERY as query
} from '~/components/User/Followers'
import { preloadQuery } from '~/utils/apollo'

export const getServerSideProps = async (ctx: any) => {
  if (ctx.params!.username.startsWith('@')) {
    const username = ctx.params!.username.slice(1)
    return preloadQuery(ctx, {
      query,
      variables: { username }
    })
  } else {
    return {
      notFound: true
    }
  }
}

export default Followers