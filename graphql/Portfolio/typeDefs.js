const typeDefs = `#graphql

  type FolderResponse {
    message: String
  }

  type Folder {
    id: ID!
    folderName: String!
    addCover: String!
    project: [Project]!
  }
  input FolderInput {
    folderName: String!
    addCover: String!
  }
  input EditFolderInput {
    folderName: String!
    addCover: String!
  }

                             ################################


  type ProjectResponse {
    message: String
  }

  enum CategoryProject {
    Personal
    Professional
    Academic
  }
  enum Visibility {
    Public
    Private
    Members_ONLY
  }

  type Project {
    id: ID!
    projectName: String!
    description: String!
    dateCreated: String!
    tags: [String!]!
    keywords: String!
    category: CategoryProject!
    visibility: Visibility!
    editMyProject: ID!
    uploadMedia: String!
    requestReferences: String!
    url: String!
  }
  input ProjectInput {
    projectName: String!
    description: String!
    dateCreated: String!
    tags: [String!]
    keywords: String!
    category: CategoryProject!
    visibility: Visibility!
    editMyProject: [ID!]
    uploadMedia: String!
    requestReferences: String!
    url: String!
  }
  input EditProjectInput {
    projectName: String!
    description: String!
    dateCreated: String!
    tags: [String!]
    keywords: String!
    category: CategoryProject!
    visibility: Visibility!
    editMyProject: [ID!]
    uploadMedia: String!
    requestReferences: String!
    url: String!
  }

  type ProjectsWithTags {
    project: [Project]!
    uniqueTags: [String]!
  }


  type Query {
    # Query to get Portfolio Folders by student ID  
    getFoldersWithProjectsByStudent(studentId: ID!): [Folder]!
    # Query to get Portfolio Folders archived by student ID  
    listArchivedFoldersWithProjects(studentId: ID!): [Folder]!
    # Query to get Portfolio Projects archived by student ID  
    getProjectsByStudent(studentId: ID!): ProjectsWithTags!
    # Query to get Portfolio archived Projects by student ID  
    listArchivedProjects(studentId: ID!): [Project]!
  },

  type Mutation {
    # Create a new portfolio Folders with the provided input
    createFolder(studentId: ID!, projectId: [ID!], input: FolderInput): FolderResponse!
    # Edit existing portfolio Folders by ID
    editFolder(id: ID!, projectId: [ID!], input: EditFolderInput): FolderResponse!
    # Delete Completely existing Portfolio Folders by ID
    deleteFolder(id: ID!): String!
    # Delete existing Portfolio Folders by ID
    archiveFolder(id: ID!): String!
    # Cancel soft deletion of record Portfolio Folders by record identifier (ID)
    unarchiveFolder(id: ID!): String!
    # Add a project to a Portfolio Folder
    addProjectToFolder(folderId:ID!, projectId:ID! ): FolderResponse!
    # Remove a project from a Portfolio Folder
    removeProjectFromFolder(folderId:ID!, projectId:ID! ): FolderResponse!
 
 
    # Create a new portfolio Projects with the provided input
    createProject(studentId: ID!, input: ProjectInput): ProjectResponse!
    # Edit existing portfolio Projects by ID
    editProject(id: ID!, input: EditProjectInput): ProjectResponse!
    # Edit existing portfolio Projects by editorId
    editAnotherEditor(id: ID!, editorId: ID!, input: EditProjectInput): ProjectResponse!
    # Delete Completely existing Portfolio Projects by ID
    deleteProject(id: ID!): String!
    # Delete existing Portfolio Projects by ID
    archiveProject(id: ID!): String!
    # Cancel soft deletion of record Portfolio Projects by record identifier (ID)
    unarchiveProject(id: ID!): String!
  },
`;

module.exports = typeDefs;
