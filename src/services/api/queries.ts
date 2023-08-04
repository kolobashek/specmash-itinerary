import { gql } from 'graphql-request'

const Queries = {
  isActive: gql`
    query isActive($userId: ID!) {
      isActive(userId: $userId)
    }
  `,

  getRoles: gql`
    query getRoles {
      roles {
        id
        name
      }
    }
  `,

  register: gql`
    mutation createUser($input: CreateUserInput!) {
      createUser(input: $input)
    }
  `,

  login: gql`
    mutation Login($phone: String!, $password: String!) {
      login(phone: $phone, password: $password) {
        token
      }
    }
  `,
}

export default Queries
