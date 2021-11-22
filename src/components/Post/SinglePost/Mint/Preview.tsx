import { Post } from '@graphql/types.generated'

interface Props {
  post: Post
}

const MintPreview: React.FC<Props> = ({ post }) => {
  return (
    <div className="grid gap-8 items-start justify-center">
      <div className="relative group w-60 h-60">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        <img
          className="relative rounded-lg border bg-gray-200 dark:bg-gray-700 ring-gray-50 dark:ring-black"
          src={`https://nft.devparty.io/${post?.body}?avatar=${post?.user?.profile?.avatar}`}
          alt={post?.body}
        />
      </div>
    </div>
  )
}

export default MintPreview
