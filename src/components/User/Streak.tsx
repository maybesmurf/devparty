import { Card, CardBody } from '@components/UI/Card'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { STATIC_ASSETS } from 'src/constants'
import { useStreak } from 'use-streak'

const Day = ({ day }: { day: number }) => (
  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
    <img className="h-10" src={`${STATIC_ASSETS}/streak/${day}.png`} />
  </motion.button>
)

const Streak = () => {
  const today = new Date()
  const [streak, setStreak] = useState<number>()

  useEffect(() => {
    const streak = useStreak(localStorage, today)
    setStreak(streak.currentCount)
  }, [])

  if ((streak as number) > 5) return null

  return (
    <Card className="mb-4">
      <CardBody className="space-y-2 flex items-center justify-between">
        <div>
          <div>You're on a</div>
          <div className="text-xl">{streak} day streak ⚡️</div>
        </div>
        <div>
          <Day day={streak as number} />
        </div>
      </CardBody>
    </Card>
  )
}

export default Streak
