#!/bin/sh

curl https://devparty.io/api/graphql?warmup=true
curl https://devparty.io/api/auth/github/callback?warmup=true
curl https://devparty.io/api/auth/github/index?warmup=true
curl https://devparty.io/api/auth/spotify/callback?warmup=true
curl https://devparty.io/api/auth/getNonce?warmup=true
curl https://devparty.io/api/masquerade/test?warmup=true
curl https://devparty.io/api/utils/getIssue?warmup=true
curl https://devparty.io/api/utils/getENS?warmup=true
curl https://devparty.io/api/export?warmup=true
curl https://devparty.io/api/oembed?warmup=true
curl https://devparty.io/api/logout?warmup=true
