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
    const post = await db.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        body: true,
        type: true,
        parentId: true,
        createdAt: true,
        user: {
          select: {
            username: true,
            profile: { select: { name: true, avatar: true } }
          }
        },
        product: { select: { slug: true, name: true, avatar: true } },
        community: { select: { slug: true, name: true, avatar: true } }
      }
    })
    const { path } = await client.add(
      JSON.stringify({
        post: post?.id,
        title: post?.title,
        body: post?.body,
        type: post?.type,
        parent: post?.parentId,
        created_at: post?.createdAt,
        user: {
          username: post?.user?.username,
          name: post?.user?.profile?.name,
          avatar: post?.user?.profile?.avatar
        },
        product: post?.product
          ? {
              slug: post?.product?.slug,
              name: post?.product?.name,
              avatar: post?.product?.avatar
            }
          : null,
        community: post?.community
          ? {
              slug: post?.community?.slug,
              name: post?.community?.name,
              avatar: post?.community?.avatar
            }
          : null
      })
    )

    await db.post.update({
      where: { id: post?.id },
      data: { ipfsHash: path }
    })
    resolve(path)
  })
}
