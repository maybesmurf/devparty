import { Post } from '@graphql/types.generated'
import { BASE_URL } from 'src/constants'

const getNFTData = (
  nsfw: boolean,
  post: Post,
  nft: string
): { description: string; image: string; attributes: any } => {
  const attributes: any = [
    {
      trait_type: 'User',
      value: `@${post?.user?.username}`
    },
    {
      trait_type: 'Type',
      value: post?.type
    },
    {
      display_type: 'date',
      trait_type: 'Posted at',
      value: parseInt((new Date(post?.createdAt).getTime() / 1000).toFixed(0))
    }
  ]
  if (nsfw) attributes.push({ value: 'NSFW' })

  return {
    description: `${post?.body}\n\nLink to post: ${BASE_URL}/posts/${post?.id}`,
    image: post?.attachments.length > 0 ? post?.attachments[0].url : nft,
    attributes
  }
}

export default getNFTData
