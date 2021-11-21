import { gql, useMutation } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import { SuccessMessage } from '@components/UI/SuccessMessage'
import { TextArea } from '@components/UI/TextArea'
import { uploadToIPFS } from '@components/utils/uploadToIPFS'
import {
  EditProductProfileMutation,
  EditProductProfileMutationVariables,
  Product
} from '@graphql/types.generated'
import { CheckCircleIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { object, string } from 'zod'

import Sidebar from '../Sidebar'

const editProductSchema = object({
  slug: string()
    .min(2, { message: '🚀 Slug should be atleast 2 characters' })
    .max(50, { message: '🚀 Slug should not exceed 100 characters' })
    .regex(/^[a-z0-9_\.]+$/, { message: '🚀 Invalid slug' }),
  name: string()
    .min(2, { message: '🍀 Name should be atleast 2 characters' })
    .max(50, { message: '🍀 Name should not exceed 100 characters' }),
  description: string()
    .max(190, { message: '🚀 Description should not exceed 190 characters' })
    .nullable()
})

interface Props {
  product: Product
}

const SUCCESS_MESSAGE = 'Product successfully updated!'

const ProductSettingsForm: React.FC<Props> = ({ product }) => {
  const [avatar, setAvatar] = useState<string>()
  const [editProduct, editProductResult] = useMutation<
    EditProductProfileMutation,
    EditProductProfileMutationVariables
  >(
    gql`
      mutation EditProductProfile($input: EditProductProfileInput!) {
        editProductProfile(input: $input) {
          id
          slug
          name
          description
        }
      }
    `,
    {
      onCompleted() {
        toast.success(SUCCESS_MESSAGE)
      }
    }
  )

  useEffect(() => {
    if (product?.avatar) setAvatar(product?.avatar)
  }, [product])

  const handleUpload = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    // setLoading({ type, status: true })

    try {
      // @ts-ignore
      const attachment = await uploadToIPFS(evt.target.files[0])
      setAvatar(attachment.url)
    } finally {
      // setLoading({ type, status: false })
    }
  }

  const form = useZodForm({
    schema: editProductSchema,
    defaultValues: {
      slug: product?.slug,
      name: product?.name,
      description: product?.description
    }
  })

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar slug={product?.slug as string} />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardBody>
            <Form
              form={form}
              className="space-y-4"
              onSubmit={({ slug, name, description }) =>
                editProduct({
                  variables: {
                    input: {
                      id: product?.id,
                      slug,
                      name,
                      description,
                      avatar: avatar as string
                    }
                  }
                })
              }
            >
              <ErrorMessage
                title="Error updating profile"
                error={editProductResult.error}
              />
              {editProductResult.data && (
                <SuccessMessage>{SUCCESS_MESSAGE}</SuccessMessage>
              )}
              <Input label="ID" type="text" value={product?.id} disabled />
              <Input
                label="Slug"
                type="text"
                placeholder="minecraft"
                prefix="https://devparty.io/products/"
                {...form.register('slug')}
              />
              <Input
                label="Name"
                type="text"
                placeholder="John Doe"
                {...form.register('name')}
              />
              <TextArea
                label="Description"
                placeholder="Tell us about the product!"
                {...form.register('description')}
              />
              <div className="space-y-1.5">
                <label>Avatar</label>
                <div className="flex items-center gap-3">
                  <img
                    className="rounded-full h-24 w-24"
                    src={avatar}
                    alt={avatar}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(evt) => handleUpload(evt)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-3">
                <Link href="/settings/password" passHref>
                  Change password?
                </Link>
                <Button
                  type="submit"
                  icon={
                    form.formState.isSubmitting ? (
                      <Spinner size="xs" />
                    ) : (
                      <CheckCircleIcon className="h-4 w-4" />
                    )
                  }
                >
                  Save
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default ProductSettingsForm
