import { useLazyQuery } from '@apollo/client'
import { Card } from '@components/UI/Card'
import { Spinner } from '@components/UI/Spinner'
import useOnClickOutside from '@components/utils/hooks/useOnClickOutside'
import { imagekitURL } from '@components/utils/imagekitURL'
import { SearchUsersQuery, User } from '@graphql/types.generated'
import React, { useRef, useState } from 'react'

import { SEARCH_USERS_QUERY } from './Navbar/Search'
import Slug from './Slug'

interface Props {
  placeholder?: string
  // eslint-disable-next-line no-unused-vars
  onClick: (user: User) => void
}

const SearchUsers: React.FC<Props> = ({ placeholder, onClick }) => {
  const [searchText, setSearchText] = useState<string>('')
  const dropdownRef = useRef(null)

  useOnClickOutside(dropdownRef, () => setSearchText(''))

  const [searchUsers, { data: searchUsersData, loading: searchUsersLoading }] =
    useLazyQuery<SearchUsersQuery>(SEARCH_USERS_QUERY)

  const handleSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
    let keyword = evt.target.value
    setSearchText(keyword)
    searchUsers({ variables: { keyword } })
  }

  return (
    <>
      <input
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-400 outline-none rounded-lg shadow-sm w-full py-1.5"
        type="text"
        placeholder={placeholder}
        value={searchText}
        onChange={handleSearch}
      />
      {searchText.length > 0 && (
        <div
          className="flex flex-col w-full sm:max-w-md absolute mt-2 z-10"
          ref={dropdownRef}
        >
          <Card className="py-2 max-h-[80vh] overflow-y-auto">
            {searchUsersLoading ? (
              <div className="px-4 py-2 font-bold text-center space-y-2 text-sm">
                <Spinner size="sm" className="mx-auto" />
                <div>Searching users</div>
              </div>
            ) : (
              <div>
                {searchUsersData?.searchUsers?.edges?.map((user: any) => (
                  <div
                    key={user?.node?.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 flex items-center text-sm space-x-2 cursor-pointer"
                    onClick={() => {
                      onClick(user?.node)
                      setSearchText('')
                    }}
                  >
                    <img
                      src={imagekitURL(
                        user?.node?.profile?.avatar as string,
                        50,
                        50
                      )}
                      className="h-6 w-6 rounded-full bg-gray-200"
                      alt={`@${user?.node?.username}`}
                    />
                    <div>{user?.node?.profile?.name}</div>
                    <Slug slug={user?.node?.username} prefix="@" />
                  </div>
                ))}
                {searchUsersData?.searchUsers?.edges?.length === 0 && (
                  <div className="px-4 py-2">No matching users</div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  )
}

export default SearchUsers
