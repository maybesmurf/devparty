/**
 * Extract unique topics/hashtags from the given post body
 * @param postBody - Body of the Post
 * @returns array of topics
 */
export const getTopics = (postBody: string) => {
  var regexp = /\B#\w\w+\b/g
  var result = postBody.match(regexp)
  if (result) {
    var arr = result.filter(function (item, index, inputArray) {
      return inputArray.indexOf(item) === index
    })

    var processedArr = arr.map((item) => {
      return item.replace('#', '')
    })

    return processedArr
  } else {
    return []
  }
}
