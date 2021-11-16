import Redis from 'ioredis'
import { NextApiRequest, NextApiResponse } from 'next'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

const redis = new Redis(process.env.REDIS_URL)

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address, warmup } = req.query

  if (warmup) return res.status(200).json({ status: 'Warmed up!' })

  if (address) {
    try {
      const cacheKey = `ens-${address}`
      let cache: any = await redis.get(cacheKey)
      cache = JSON.parse(cache)
      if (cache) {
        res.setHeader('Cache-Control', 'max-age=0, s-maxage=864000')
        return res.status(200).json(cache)
      } else {
        const response = await fetch(
          `https://api.thegraph.com/subgraphs/name/ensdomains/${
            IS_PRODUCTION ? 'ensrinkeby' : 'ensrinkeby'
          }`,
          {
            body: JSON.stringify({
              operationName: 'getNamesFromSubgraph',
              query: `
                query getNamesFromSubgraph($address: String!) {
                  domains(first: 1, where: {resolvedAddress: $address}) {
                    name
                  }
                }
              `,
              variables: { address: address.toString().toLowerCase() }
            }),
            method: 'POST'
          }
        )
        const ens = await response.json()
        redis.set(
          cacheKey,
          JSON.stringify(ens?.data?.domains[0]),
          'EX',
          IS_PRODUCTION ? 864000 : 5
        )

        res.setHeader('Cache-Control', 'max-age=0, s-maxage=864000')
        return res.status(200).json(ens?.data?.domains[0])
      }
    } catch (error: any) {
      return res.status(500).send({
        status: 'error',
        message: ERROR_MESSAGE
      })
    }
  } else {
    return res.status(500).send({
      status: 'error',
      message: 'Eth Address is required'
    })
  }
}

export default handler
