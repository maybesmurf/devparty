/* eslint-disable no-unused-vars */
import { builder } from '~/graphql/builder'

export enum Result {
  SUCCESS = 'SUCCESS'
}

builder.enumType(Result, { name: 'Result' })
