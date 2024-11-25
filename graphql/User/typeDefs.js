const typeDefs = `#graphql

  type User {
    firstName: String!
    lastName: String!
    userName: String!
    email: String!
    password: String!
    phoneNumber: String!
    grade: String!
    schoolCode: String!
    usi: String!
    role: String!
    agreeToTerms: Boolean!
  }

  input UserInput {
    firstName: String!
    lastName: String!
    userName: String!
    email: String!
    password: String!
    phoneNumber: String!
    grade: String!
    schoolCode: String!
    usi: String!
    role: String!
    agreeToTerms: Boolean!
  }


  type Mutation {
    # Create a new user with the provided input
    createUser(input: UserInput): User!
    # Authenticate a user with a username and password, returning a token
    userLogin(userName: String!, password: String!): String!
  },
`;

module.exports = typeDefs;
