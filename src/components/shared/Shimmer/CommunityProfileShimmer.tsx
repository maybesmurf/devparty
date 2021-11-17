const CommunityProfileShimmer: React.FC = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-3 items-center">
        <div className="shimmer h-12 w-12 rounded-lg" />
        <div className="space-y-2">
          <div className="shimmer h-3 w-40 rounded-md" />
          <div className="shimmer h-3 w-20 rounded-md" />
        </div>
      </div>
      <div className="shimmer h-8 w-8 rounded-full" />
    </div>
  )
}

export default CommunityProfileShimmer
