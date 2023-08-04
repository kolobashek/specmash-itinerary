const Queries = {
  isActive: `#graphql
    query isActive {
        isActive(userId: "")
    }
    `,
  getRoles: `#graphql
    query getRoles {
        roles {
            id
            name
        }
    }
    `,
  createUser: `#graphql
    mutation createUser() {
        createUser(input: {name: "", phone: "", password: ""})
    }
    `,
}
export default Queries