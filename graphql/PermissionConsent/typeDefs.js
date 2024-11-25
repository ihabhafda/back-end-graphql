const typeDefs = `#graphql

  enum AccessPermission {
    FULL_CONTROL
    BROWSING_ONLY
  }
  type Permission {
    editor: ID! 
    access: AccessPermission!
    specifyTime: String!
  }
  input PermissionInput {
    editor: ID!
    access: AccessPermission!
    specifyTime: String!
  }






  enum Map {
    EDUCATION
    EXPERIENCE
    PORTFOLIO
  }
  input EditSkill {
    skillName: String!
    competencyLevel: CompetencyLevel!
    category: Category!
    description: String!
    map: Map!
  }
  type Skill {
    id: ID!
    skillName: String!
    competencyLevel: CompetencyLevel!
    category: Category!
    description: String!
    map: Map!
  }






  enum Status {
    IN_PROGRESS
    COMPLETED
  }
  input EditQualification {
    qualificationName: String!
    type: String!
    institutionUniversity: String!
    selectOne: Status!
    subjectCompleted: String!
    subjectInProgress: String!
    grade: String!
    startDate: String
    endDate: String
    badgeUrl: String!
    photos: [EditUploadInput]
  }
  input EditUploadInput {
    id: ID!
    chooseFile: String!
    takeAPhoto: String!
  }
  type Qualification {
    id: ID!
    qualificationName: String!
    type: String!
    institutionUniversity: String!
    selectOne: Status!
    subjectCompleted: String!
    subjectInProgress: String!
    grade: String!
    startDate: String
    endDate: String
    badgeUrl: String!
    photos: [File]
  }
  type File {
    id: ID!
    qualifyId: ID!
    chooseFile: String!
    takeAPhoto: String!
  }
 




  type Goal {
    id: ID!
    goalName: String!
    categories: Categories!
    description: String!
    tag: String!
    relatedGoals: String!
    deadline: String!
    portfolioItem: String!
    priority: Priority!
    keepReminding: Boolean!
    taskGoal: [GoalTask]
  }
  type GoalTask {
    id: ID!
    goalsId: ID!
    taskName: String!
    taskDescription: String!
    taskTime: String
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
  input EditGoalInput {
    goalName: String!
    categories: Categories!
    description: String!
    tag: String!
    relatedGoals: String!
    deadline: String
    portfolioItem: String!
    priority: Priority!
    keepReminding: Boolean!
    taskGoal: [EditGoalTaskInput]
  }
  input EditGoalTaskInput {
    id: ID!
    taskName: String!
    taskDescription: String!
    taskTime: String!
  }


  type Mutation {
    # Create a new Permission and Consent for a student with the provided input
    createPermission(studentId: ID!, input: PermissionInput!): String!
    # Edit existing skill by Editor
    editAnotherSkill(id: ID!, editorId: ID!, input: EditSkill!): Skill!
    # Edit existing education by Editor
    editAnotherQualification(id: ID!, editorId: ID!, input: EditQualification!): Qualification!
    # Edit existing goal by ID
    editAnotherGoal(id: ID!, editorId: ID!, input: EditGoalInput): Goal!
  },
`;

module.exports = typeDefs;
