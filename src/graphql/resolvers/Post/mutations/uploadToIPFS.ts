import { db } from '@utils/prisma'
import { create } from 'ipfs-http-client'

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
})

/**
 * Upload a post to ipfs
 * @param id - Id of the post to be uploaded to IPFS
 */
export const uploadToIPFS = async (id: string) => {
  new Promise(async (resolve) => {
    const post = await db.post.findUnique({ where: { id } })
    const { path } = await client.add(
      JSON.stringify({
        post: post?.id,
        title: post?.title,
        body: post?.body,
        type: post?.type,
        user: post?.userId,
        parent: post?.parentId,
        product: post?.productId,
        community: post?.communityId,
        created_at: post?.createdAt
      })
    )

    await db.post.update({
      where: { id: post?.id },
      data: { ipfsHash: path }
    })
    resolve(path)
  })
}
