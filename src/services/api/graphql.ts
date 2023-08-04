// graphql.ts

import { request } from 'graphql-request'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

export const graphqlRequest = async (query: string, variables?: any) => {
  const data = await request(API_URL, query, variables)
  return data
}
