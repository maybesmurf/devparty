import { db } from '@utils/prisma'
import crypto from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address, warmup } = req.query

  if (warmup) return res.status(200).json({ status: 'Warmed up!' })

  if (address) {
    const user = await db.user.findFirst({
      where: { integrations: { ethAddress: address as string } }
    })

    const nonce = crypto.randomInt(111111, 999999)
    if (user) {
      const updatedIntegration = await db.integration.update({
        where: { userId: user.id },
        data: { ethNonce: nonce.toString() }
      })

      return res.json({ nonce: updatedIntegration?.ethNonce })
    } else {
      return res.json({ nonce })
    }
  } else {
    return res.json({
      status: 'error',
      message: 'No address provided'
    })
  }
}

export default handler
