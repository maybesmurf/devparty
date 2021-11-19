import { Button } from '@components/UI/Button'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { TextArea } from '@components/UI/TextArea'
import { PlusCircleIcon } from '@heroicons/react/outline'
import React from 'react'
import { object, string } from 'zod'

const newBadgeSchema = object({
  name: string().min(0).max(255),
  url: string().url(),
  description: string()
})

const NewBadge: React.FC = () => {
  const form = useZodForm({
    schema: newBadgeSchema
  })

  return (
    <Form form={form} onSubmit={() => {}}>
      <div className="px-5 py-3.5 space-y-5">
        <div>
          <Input
            label="Title"
            placeholder="1 Year Club Badge"
            {...form.register('name')}
          />
        </div>
        <div>
          <Input
            label="URL"
            placeholder="https://assets.devparty.io/badges/1.png"
            {...form.register('url')}
          />
        </div>
        <div>
          <TextArea
            label="Description"
            placeholder="Tell somethin' about the badge"
            {...form.register('description')}
          />
        </div>
      </div>
      <div className="p-5 border-t dark:border-gray-800">
        <Button icon={<PlusCircleIcon className="h-5 w-4" />}>Create</Button>
      </div>
    </Form>
  )
}

export default NewBadge
