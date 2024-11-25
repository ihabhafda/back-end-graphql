const typeDefs = `#graphql

  type GoalResponse {
    message: String
  }

  type Goals {
    id: ID!
    goalName: String!
    categories: Categories!
    description: String!
    tags: [String!]
    relatedGoal: ID!
    deadline: String!
    portfolioItem: ID!
    priority: Priority!
    keepReminding: Boolean!
    taskName: String!
    taskDescription: String!
    taskTime: String!
  }
  input CreateGoalInput {
    goalName: String!
    categories: Categories!
    description: String!
    tags: [String!]
    relatedGoal: ID!
    deadline: String!
    portfolioItem: String!
    priority: Priority!
    keepReminding: Boolean!
    taskName: String!
    taskDescription: String!
    taskTime: String!
  }

  enum Categories {
    PERSONAL
    PROFESSIONAL
    ACADEMIC
  }

  enum Priority {
    LOW
    MEDIUM
    HIGH
  }

  input EditGoal {
    goalName: String!
    categories: Categories!
    description: String!
    tags: [String!]
    relatedGoal: ID!
    deadline: String!
    portfolioItem: String!
    priority: Priority!
    keepReminding: Boolean!
    taskName: String!
    taskDescription: String!
    taskTime: String!
  }

  type GoalsWithTags {
    goals: [Goals]!
    uniqueTags: [String]!
  }


  type Query {
    # Query to get goals Unarchived by student ID
    listGoalsWithAllTags(studentId: ID!): GoalsWithTags!
    # Query to get goals Archived by student ID 
    listArchivedGoalWithAllTags(studentId: ID!): GoalsWithTags!
  },

  type Mutation {
    # Create a new goal for a student with the provided input
    createGoal(studentId: ID!, input: CreateGoalInput!): GoalResponse!
    # Edit existing goal by ID
    editGoal(id: ID!, input: EditGoal): GoalResponse!
    # Delete Completely existing goal by ID
    deleteGoal(id: ID!): GoalResponse!
    # Delete existing goal by ID
    archiveGoal(id: ID!): GoalResponse!
    # Cancel soft deletion of record goal by record identifier (ID)
    undeletedGoal(id: ID!): GoalResponse!
  },
`;

module.exports = typeDefs;
