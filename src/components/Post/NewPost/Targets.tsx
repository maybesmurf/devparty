import { gql, useQuery } from '@apollo/client'
import { Spinner } from '@components/UI/Spinner'
import { humanize } from '@components/utils/humanize'
import { Community, GetTargetsQuery, Product } from '@graphql/types.generated'
import { GlobeIcon } from '@heroicons/react/outline'

export const GET_TARGETS_QUERY = gql`
  query GetTargets {
    me {
      ownedProducts {
        edges {
          node {
            id
            name
            avatar
            subscribers {
              totalCount
            }
          }
        }
      }
      communities {
        edges {
          node {
            id
            name
            avatar
            members {
              totalCount
            }
          }
        }
      }
    }
  }
`

interface Props {
  setSelectedTarget: React.Dispatch<React.SetStateAction<any>>
  setSelected: React.Dispatch<React.SetStateAction<any>>
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

const Targets: React.FC<Props> = ({
  setSelectedTarget,
  setSelected,
  setShowModal
}) => {
  const { data, loading } = useQuery<GetTargetsQuery>(GET_TARGETS_QUERY)

  const products = data?.me?.ownedProducts?.edges?.map((edge) => edge?.node)
  const communities = data?.me?.communities?.edges?.map((edge) => edge?.node)

  const handleSelectTarget = (
    target: Product | Community | null,
    type: 'Product' | 'Community' | 'Everywhere'
  ) => {
    setSelected(target)
    setSelectedTarget({
      targetId: target ? target?.id : '',
      targetType: target ? type : ''
    })
    setShowModal(false)
  }

  if (loading)
    return (
      <div className="px-5 py-3.5 font-bold text-center space-y-2">
        <Spinner size="md" className="mx-auto" />
        <div>Loading your communities and products</div>
      </div>
    )

  return (
    <div className="divide-y dark:divide-gray-700">
      <button
        type="button"
        className="flex items-center space-x-2 font-bold px-5 py-3.5"
        onClick={() => handleSelectTarget(null, 'Everywhere')}
      >
        <GlobeIcon className="h-5 w-5 text-brand-500" />
        <div className="flex items-center space-x-2">
          <div>Everywhere</div>
          <div className="text-sm text-gray-500">-</div>
          <div className="text-sm text-gray-500 font-light">All Devparty</div>
        </div>
      </button>
      <div className="space-y-2 px-5 py-3.5">
        <div className="font-bold text-gray-700 dark:text-gray-300">
          My Products
        </div>
        <div className="space-y-2">
          {products?.length === 0 && (
            <div className="text-gray-500">You dont have any products!</div>
          )}
          {products?.map((product: any) => (
            <div key={product?.name}>
              <button
                type="button"
                className="flex items-center space-x-2"
                onClick={() => handleSelectTarget(product, 'Product')}
              >
                <img
                  className="h-8 w-8 rounded"
                  src={product?.avatar}
                  alt={`#${product?.name}'`}
                />
                <div className="text-left">
                  <div className="font-bold">{product?.name}</div>
                  <div className="text-sm">
                    <b>{humanize(product?.subscribers?.totalCount)}</b>{' '}
                    subscribers
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2 px-5 py-3.5">
        <div className="font-bold text-gray-700 dark:text-gray-300">
          My Communities
        </div>
        <div className="space-y-2">
          {communities?.length === 0 && (
            <div className="text-gray-500">You dont have any communities!</div>
          )}
          {communities?.map((community: any) => (
            <div key={community?.name}>
              <button
                type="button"
                className="flex items-center space-x-2"
                onClick={() => handleSelectTarget(community, 'Community')}
              >
                <img
                  className="h-8 w-8 rounded"
                  src={community?.avatar}
                  alt={`${community?.name}'`}
                />
                <div className="text-left">
                  <div className="font-bold">{community?.name}</div>
                  <div className="text-sm">
                    <b>{humanize(community?.members?.totalCount)}</b> members
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Targets
