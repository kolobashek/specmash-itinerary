const Queries = {
  isActive: /* GraphQL */ `
    query isActive($userId: ID!) {
      isActive(userId: $userId)
    }
  `,

  getRoles: /* GraphQL */ `
    query getRoles {
      roles {
        id
        name
      }
    }
  `,

  register: /* GraphQL */ `
    mutation createUser($input: CreateUserInput!) {
      createUser(input: $input)
    }
  `,

  login: /* GraphQL */ `
    mutation Login($phone: String!, $password: String!) {
      login(phone: $phone, password: $password) {
        token
      }
    }
  `,
}

export default Queries
