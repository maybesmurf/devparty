import { Session } from '@prisma/client'
import { db } from '@utils/prisma'
import { createSession, resolveSession, sessionOptions } from '@utils/sessions'
import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSession } from 'next-iron-session'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

interface NextApiRequestWithSession extends NextApiRequest {
  session: Session
}

const handler = async (
  req: NextApiRequestWithSession,
  res: NextApiResponse
) => {
  const { warmup } = req.query

  if (warmup) return res.status(200).json({ status: 'Warmed up!' })

  try {
    const session = await resolveSession({ req, res })

    if (req.query.id) {
      if (session?.isStaff) {
        const user = await db.user.findFirst({
          where: { id: req.query.id as string }
        })

        await createSession(req, user as any, true)
      } else {
        return res.redirect('/home')
      }
    } else {
      return res.redirect('/home')
    }

    return res.redirect('/home')
  } catch (error: any) {
    return IS_PRODUCTION
      ? res.redirect('/500')
      : res.json({
          status: 'error',
          message: IS_PRODUCTION ? ERROR_MESSAGE : error.message
        })
  }
}

export default withIronSession(handler, sessionOptions)
