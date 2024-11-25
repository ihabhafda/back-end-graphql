const typeDefs = `#graphql

  type SkillResponse {
    message: String
  }

  enum CompetencyLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }  
  enum Category {
    TECHNICAL_SKILLS
    MANAGEMENT_SKILLS
    LIFE_SKILLS
  }
  enum Map {
    EDUCATION
    EXPERIENCE
    PORTFOLIO
  }
 
  type Skill {
    id: ID!
    skillName: String!
    competencyLevel: CompetencyLevel!
    category: Category!
    description: String!
    map: Map!
  }
  input SkillInput {
    skillName: String!
    competencyLevel: CompetencyLevel!
    category: Category!
    description: String!
    map: Map!
  }
  input EditSkillInput {
    skillName: String!
    competencyLevel: CompetencyLevel!
    category: Category!
    description: String!
    map: Map!
  }


  type Query {
    # Query to get Skills by student ID
    listSkillsById(id: ID!): [Skill]!
    # Query to get Skills Archived by student ID
    listArchivedSkillsById(id: ID!): [Skill]!
  },

  type Mutation {
    # Create a new skill with the provided input
    createSkill(studentId: ID!, input: SkillInput): SkillResponse!
    # Edit existing skill by ID
    editSkill(id: ID!, input: EditSkillInput): SkillResponse!
    # Delete Completely existing skill by ID
    deleteSkill(id: ID!): String!
    # Delete existing skill by ID
    archiveSkill(id: ID!): String!
    # Cancel soft deletion of record skill by record identifier (ID)
    undeletedSkill(id: ID!): String!
  },
`;

module.exports = typeDefs;
