const typeDefs = `#graphql

  type Response {
    message: String
  }
  type Qualifications {
    id: ID!
    qualificationName: String!
    type: String!
    institutionUniversity: String!
    status: String!
    subjectCompleted: [String]!
    subjectInProgress: [String]!
    grade: String!
    startDate: String
    endDate: String
    badgeUrl: String!
    attachments: [String!]!
    # skill: [Skill]
  }
  input CreateQualification {
    qualificationName: String!
    type: String!
    institutionUniversity: String!
    status: String!
    subjectCompleted: [String!]!
    subjectInProgress: [String!]!
    grade: String!
    startDate: String
    endDate: String
    badgeUrl: String!
    attachments: [String!]!
  }
  input EditQualifications {
    qualificationName: String!
    type: String!
    institutionUniversity: String!
    status: String!
    subjectCompleted: [String!]
    subjectInProgress: [String!]
    grade: String!
    startDate: String
    endDate: String
    badgeUrl: String!
    attachments: [String!]!
  }

  type Query {
    # Query to get qualifications by student ID
    getQualificationByStudent(id: ID!): [Qualifications]!
    # Query to get qualifications Archived by student ID 
    listArchivedQualifications(id: ID!): [Qualifications]!
  },

  type Mutation {
    # Create a new education with the provided input
    createQualification(studentId: ID!, input: CreateQualification): Response!
    # Edit existing education by ID
    editQualification(id: ID!, input: EditQualifications): Response!
    # Delete Completely existing education by ID
    deleteQualification(id: ID!): Response!
    # Delete existing education by ID
    archiveQualification(id: ID!): Response!
    # Cancel soft deletion of record qualifier by record identifier (ID)
    unArchiveQualification(id: ID!): Response!
  },
`;

module.exports = typeDefs;
