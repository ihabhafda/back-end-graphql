const typeDefs = `#graphql

  type PathwayResponse {
    message: String
  }

  enum Level {
    beginner
    intermediate
    advanced
  }
  type Pathway {
    id: ID!
    name: String! 
    description: String!
    level: Level!
  }
  input PathwayInput {
    name: String! 
    description: String!
    level: Level!
  }
  input EditPathwayInput {
    name: String! 
    description: String!
    level: Level!
  }


  type Query {
    # Query to get Pathway by student ID
    getPathwayById(id: ID!): [Pathway]!
    # Query to get Pathway archived by student ID
    listArchivedPathway(id: ID!): [Pathway]!
  },

  type Mutation {
    # Create a new Pathway and Consent for a student with the provided input
    createPathway(studentId: ID!, input: PathwayInput!): PathwayResponse!
    # Edit existing Pathway by Editor
    editPathway(id: ID!, input: EditPathwayInput!): PathwayResponse!
    # Delete Completely existing Pathway by ID
    deletePathway(id: ID!): PathwayResponse!
    # Delete existing Pathway by ID
    archivePathway(id: ID!): PathwayResponse!
    # Cancel soft deletion of record Pathway by record identifier (ID)
    unArchivePathway(id: ID!): PathwayResponse!
  },
`;

module.exports = typeDefs;
