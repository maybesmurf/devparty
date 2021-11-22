import { Checkbox } from '@components/UI/Checkbox'
import { Post } from '@graphql/types.generated'
import { useState } from 'react'

interface Props {
  post: Post
}

const MintPreview: React.FC<Props> = ({ post }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light')

  return (
    <div className="space-y-5">
      <div className="relative group w-60 h-60">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        <img
          className="relative rounded-lg"
          src={`https://nft.devparty.io/${post?.body}?avatar=${post?.user?.profile?.avatar}&theme=${theme}`}
          alt={post?.body}
        />
      </div>
      <div className="flex items-center space-x-3">
        <Checkbox
          id="darkBg"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        />
        <label htmlFor="darkBg">Use Dark Background</label>
      </div>
    </div>
  )
}

export default MintPreview
