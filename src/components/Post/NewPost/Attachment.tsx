import { Spinner } from '@components/UI/Spinner'
import { Tooltip } from '@components/UI/Tooltip'
import { uploadToIPFS } from '@components/utils/uploadToIPFS'
import { PhotographIcon } from '@heroicons/react/outline'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface Props {
  attachments: string[]
  setAttachments: React.Dispatch<any>
}

const Attachment: React.FC<Props> = ({ attachments, setAttachments }) => {
  const [loading, setLoading] = useState<boolean>(false)

  const handleAttachment = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    setLoading(true)

    try {
      // @ts-ignore
      const attachment = await uploadToIPFS(evt.target.files[0])
      setAttachments([...attachments, attachment])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <motion.button
        whileTap={{ scale: 0.9 }}
        type="button"
        className="tab-focus-ring"
      >
        <label className="flex items-center gap-1 cursor-pointer">
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <Tooltip content="Media">
              <PhotographIcon className="h-5 w-5 text-brand-500" />
            </Tooltip>
          )}
          <input
            type="file"
            accept="image/*, video/mp4"
            className="hidden"
            onChange={handleAttachment}
            disabled={attachments.length >= 4}
          />
        </label>
      </motion.button>
    </div>
  )
}

export default Attachment
