import { Post } from '@graphql/types.generated'

interface Props {
  post: Post
}

const MintPreview: React.FC<Props> = ({ post }) => {
  return (
    <div>
      <img
        className="w-72 rounded-lg border-2"
        src={`https://nft.devparty.io/${post?.body}`}
        alt={post?.body}
      />
    </div>
  )
}

export default MintPreview
