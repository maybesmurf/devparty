import { Post } from '@graphql/types.generated'
import { db } from '@utils/prisma'
import { create } from 'ipfs-http-client'

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
})

/**
 * Upload a post to ipfs
 * @param post - Post to be uploaded to IPFS
 */
export const storeToIPFS = async (post: Post) => {
  new Promise(async (resolve) => {
    const { path } = await client.add(
      JSON.stringify({
        post: post?.id,
        title: post?.title,
        body: post?.body,
        type: post?.type,
        created_at: post?.createdAt
      })
    )

    await db.post.update({
      where: { id: post?.id },
      data: { ipfsHash: path }
    })
    console.log(path)
    resolve(path)
  })
}
