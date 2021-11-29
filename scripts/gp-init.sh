#!/bin/sh

yarn install --frozen-lockfile --silent --network-timeout 100000
cp .env.example .env
gp await-port 3306
npx hardhat compile
yarn prisma:migrate
yarn prisma:seed
yarn prisma:testseed
yarn prepare
