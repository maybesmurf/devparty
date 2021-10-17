export const linkifyOptions = {
  formatHref: function (href: string, type: any): string {
    if (type === 'hashtag') {
      href = '/topics/' + href.slice(1)
    }
    if (type === 'mention') {
      href = '/u/' + href.slice(1)
    }
    return href
  }
}
