import { builder } from '@graphql/builder'

builder.prismaObject('NFT', {
  findUnique: (nft) => ({ id: nft.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    address: t.exposeString('address'),
    tokenId: t.exposeString('tokenId'),
    network: t.exposeString('network')
  })
})
