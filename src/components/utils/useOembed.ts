import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

/**
 * Create oembed for the given URL
 * @param url - URL in which need to create oembed
 * @returns the oembed object
 */
export const useOembed = (url: string | null | undefined) => {
  const { data, error } = useSWR(`/api/oembed?url=${url}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  return {
    oembed: data,
    isLoading: !error && !data,
    isError: error || data?.status === 'error' || !data?.title
  }
}
