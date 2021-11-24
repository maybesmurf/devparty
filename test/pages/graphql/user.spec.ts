import { expect, test } from '@playwright/test'

test('get single user', async ({ request }) => {
  const response = await request.post('/api/graphql', {
    data: {
      query: `{
        user(username: "yoginth") {
          username
        }
      }`
    }
  })
  const result = await response.json()
  const user = result.data.user

  expect(user.username).toBe('yoginth')
})

test('get multiple users', async ({ request }) => {
  const response = await request.post('/api/graphql', {
    data: {
      query: `{
        users {
          edges {
            node {
              username
            }
          }
        }
      }`
    }
  })
  const result = await response.json()

  expect(result.data.users.edges.length).toBe(20)
})

test('user should have profile', async ({ request }) => {
  const response = await request.post('/api/graphql', {
    data: {
      query: `{
        user(username: "yoginth") {
          profile {
            name
          }
        }
      }`
    }
  })
  const result = await response.json()
  const user = result.data.user

  expect(user.profile.name).toBe('Yoginth')
})

test('user should have social profile', async ({ request }) => {
  const response = await request.post('/api/graphql', {
    data: {
      query: `{
        user(username: "yoginth") {
          profile {
            twitter
            github
            discord
            website
          }
        }
      }`
    }
  })
  const result = await response.json()
  const profile = result.data.user.profile

  expect(profile.twitter).toBe('yogicodes')
  expect(profile.github).toBe('yoginth')
  expect(profile.discord).toBe('Yogi#1111')
  expect(profile.website).toBe('https://yogi.codes')
})

test('user should have tips', async ({ request }) => {
  const response = await request.post('/api/graphql', {
    data: {
      query: `{
        user(username: "yoginth") {
          tip {
            bitcoin
            buymeacoffee
            cash
            ethereum
            github
            paypal
          }
        }
      }`
    }
  })
  const result = await response.json()
  const tip = result.data.user.tip

  expect(tip.bitcoin).toBe('3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy')
  expect(tip.buymeacoffee).toBe('yoginth')
  expect(tip.cash).toBe('yoginth')
  expect(tip.ethereum).toBe('0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF')
  expect(tip.github).toBe('yoginth')
  expect(tip.paypal).toBe('yoginth')
})

test('connection should have count', async ({ request }) => {
  const response = await request.post('/api/graphql', {
    data: {
      query: `{
        user(username: "yoginth") {
          posts {
            totalCount
          }
          ownedProducts {
            totalCount
          }
          communities {
            totalCount
          }
          followers {
            totalCount
          }
          following {
            totalCount
          }
          bookmarks {
            totalCount
          }
          badges {
            totalCount
          }
          topics {
            totalCount
          }
        }
      }`
    }
  })
  const result = await response.json()
  const user = result.data.user

  expect(typeof user.posts.totalCount).toBe('number')
  expect(typeof user.ownedProducts.totalCount).toBe('number')
  expect(typeof user.communities.totalCount).toBe('number')
  expect(typeof user.followers.totalCount).toBe('number')
  expect(typeof user.following.totalCount).toBe('number')
  expect(typeof user.bookmarks.totalCount).toBe('number')
  expect(typeof user.badges.totalCount).toBe('number')
  expect(typeof user.topics.totalCount).toBe('number')
})

test('flags should return boolean', async ({ request }) => {
  const response = await request.post('/api/graphql', {
    data: {
      query: `{
        user(username: "yoginth") {
          hasFollowed
          isFollowing
          inWaitlist
          isStaff
          isVerified
          spammy
          hasSpotifyIntegration
          hasWakatimeIntegration
        }
      }`
    }
  })
  const result = await response.json()
  const user = result.data.user

  expect(typeof user.hasFollowed).toBe('boolean')
  expect(typeof user.isFollowing).toBe('boolean')
  expect(typeof user.inWaitlist).toBe('boolean')
  expect(typeof user.isStaff).toBe('boolean')
  expect(typeof user.isVerified).toBe('boolean')
  expect(typeof user.spammy).toBe('boolean')
  expect(typeof user.hasSpotifyIntegration).toBe('boolean')
  expect(typeof user.hasWakatimeIntegration).toBe('boolean')
})

//TODO: user should have status
