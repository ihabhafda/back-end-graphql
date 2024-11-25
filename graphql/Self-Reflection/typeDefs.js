const typeDefs = `#graphql

  type SelfReflectionResponse {
    message: String
  }

  type SelfReflectionInput {
    id: ID!
    reflectionTitle: String!
    description: String!
    chooseFile: String!
  }
  input CreateSelfReflectionInput {
    reflectionTitle: String!
    description: String!
    chooseFile: String!
  }
  input EditSelfReflectionInput {
    reflectionTitle: String!
    description: String!
    chooseFile: String!  
  }


  type Query {
    # Query to get self-reflection by student ID
    getSelfReflectionsById(id: ID!): [SelfReflectionInput]!
    # Query to get self-reflection Archived by student ID
    listArchivedSelfReflection(id: ID!): [SelfReflectionInput]!
  },

  type Mutation {
    # Create a new self-reflection with the provided input
    createSelfReflection(studentId: ID!, input: CreateSelfReflectionInput): SelfReflectionResponse!
    # # Edit existing self-reflection by ID
    editSelfReflection(id: ID!, input: EditSelfReflectionInput): SelfReflectionResponse!
    # # Delete Completely existing self-reflection by ID
    deleteSelfReflection(id: ID!): String!
    # # Delete existing self-reflection by ID
    archiveSelfReflection(id: ID!): String!
    # # Cancel soft deletion of record self-reflection by its identifier (ID)
    undeletedSelfReflection(id: ID!): String!
  },
`;

module.exports = typeDefs;
