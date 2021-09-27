export const getRandomCover = () => {
  const images = [
    '4-point-stars',
    'anchors-away',
    ' architect',
    ' autumn',
    ' aztec',
    ' bamboo',
    ' bank-note',
    ' bathroom-floor',
    ' bevel-circle',
    ' boxes',
    ' brick-wall',
    ' bubbles',
    ' cage',
    ' charlie-brown',
    ' church-on-sunday',
    ' circles-and-squares',
    ' circuit-board',
    ' connections',
    ' cork-screw',
    ' current',
    ' curtain',
    ' cutout',
    ' death-star',
    ' diagonal-lines',
    ' diagonal-stripes',
    ' dominos',
    ' endless-clouds',
    ' eyes',
    ' falling-triangles',
    ' fancy-rectangles',
    ' flipped-diamonds',
    ' floating-cogs',
    ' floor-tile',
    ' formal-invitation',
    ' glamorous',
    ' graph-paper',
    ' groovy',
    ' happy-intersection',
    ' heavy-rain',
    ' hexagons',
    ' hideout',
    ' houndstooth',
    ' i-like-food',
    ' intersecting-circles',
    ' jupiter',
    ' kiwi',
    ' leaf',
    ' line-in-motion',
    ' lips',
    ' lisbon',
    ' melt',
    ' moroccan',
    ' morphing-diamonds',
    ' overcast',
    ' overlapping-circles',
    ' overlapping-diamonds',
    ' overlapping-hexagons',
    ' parkay-floor',
    ' piano-man',
    ' pie-factory',
    ' pixel-dots',
    ' plus',
    ' polka-dots',
    ' rails',
    ' rain',
    ' random-shapes',
    ' rounded-plus-connected',
    ' signal',
    ' skulls',
    ' slanted-stars',
    ' squares-in-squares',
    ' squares',
    ' stamp-collection',
    ' steel-beams',
    ' stripes',
    ' temple',
    ' texture',
    ' tic-tac-toe',
    ' tiny-checkers',
    ' topography',
    ' volcano-lamp',
    ' wallpaper',
    ' wiggle',
    ' x-equals',
    ' yyy',
    ' zig-zag'
  ]

  const colors = [
    '6B7280',
    'EF4444',
    'F59E0B',
    '10B981',
    '3B82F6',
    '6366F1',
    '8B5CF6',
    'EC4899'
  ]

  return {
    image: `https://assets.devparty.io/images/heropatterns/${
      images[Math.floor(Math.random() * images.length)]
    }`,
    color: colors[Math.floor(Math.random() * colors.length)]
  }
}
