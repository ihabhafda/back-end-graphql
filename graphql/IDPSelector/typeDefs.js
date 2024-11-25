const typeDefs = `#graphql

  type Selector {
    id: ID!
    school: String! 
    studentName: String!
    studentIdNumber: ID!
  }
  input SelectorInput {
    school: String! 
    studentName: String!
    studentIdNumber: ID!
  }


  type Mutation {
    # Create a new IDP Selector and Consent for a student with the provided input
    createSelector(studentId: ID!, input: SelectorInput!): Selector!
  },
`;

module.exports = typeDefs;
