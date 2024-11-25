const { Users, PortfolioFolders, PortfolioProjects } = require('../../models');
const { Op } = require('sequelize');

const resolvers = {
  Mutation: {
    // ! PORTFOLIO FOLDER
    // Mutation to create a new portfolio folder
    createFolder: async (_, { studentId, projectId, input }) => {
      try {
        // Authenticate the student using
        const student = await Users.findByPk(studentId);

        if (!student) {
          throw new Error(`Student with ID ${studentId} not found.`);
        }

        // Create the folder record associated with the authenticated student
        const folder = await PortfolioFolders.create({
          userId: studentId, // Associate the portfolio with the authenticated student
          ...input,
        });

        // Check if projectId are valid
        if (!Array.isArray(projectId) || projectId.length === 0) {
          throw new Error('Invalid or empty projectId array');
        }

        const projects = await PortfolioProjects.findAll({
          where: {
            id: projectId,
          },
        });

        if (!projects || projects.length === 0) {
          throw new Error('No valid project found');
        }

        // Map projects to the folder
        await folder.addProject(projects);

        // If the code gets here without errors, return a success message
        return {
          message: 'Folder successfully created',
        };
      } catch (error) {
        throw new Error(`Error creating Folder: ${error.message}`);
      }
    },
    // Mutation to edit a portfolio folder
    editFolder: async (_, { id, projectId, input }) => {
      try {
        // Find the portfolio folder record by ID
        const folder = await PortfolioFolders.findByPk(id);

        if (!folder) {
          throw new Error(`Folder with ID ${id} not found.`);
        }

        // Check if projectId are valid
        if (!Array.isArray(projectId) || projectId.length === 0) {
          throw new Error('Invalid or empty projectId array');
        }

        // Find the projects associated with the given projectId
        const projects = await PortfolioProjects.findAll({
          where: {
            id: projectId,
          },
        });

        if (!projects || projects.length === 0) {
          throw new Error('No valid project found');
        }

        // Update the portfolio folder record with the new input values
        await folder.update(input);

        // Remove existing project associations
        await folder.removeProject(await folder.getProject());

        // Associate the folder with the specified projects
        await folder.addProject(projects);

        // If the code gets here without errors, return the updated folder
        return {
          message: 'Folder was updated successfully',
        };
      } catch (error) {
        throw new Error(`Error editing Folder: ${error.message}`);
      }
    },
    // Mutation to delete a portfolio folder completely
    deleteFolder: async (parent, args, contextValue) => {
      const { id } = args;

      try {
        // Find the folder record by ID
        const deleteFolder = await PortfolioFolders.findByPk(id);

        if (!deleteFolder) {
          throw new Error('Folder not found');
        }

        // Get associated projects
        const associatedProjects = await deleteFolder.getProject();

        // Remove associations from the join table (ProjectFolders)
        await deleteFolder.removeProject(associatedProjects);

        // Delete the folder record
        await deleteFolder.destroy();

        // Return true to indicate successful deletion
        return 'Successful deletion';
      } catch (error) {
        throw new Error(`Error deleting Folder: ${error.message}`);
      }
    },
    // Mutation to perform a soft delete on a portfolio folder
    archiveFolder: async (parent, args, contextValue) => {
      const { id } = args;

      // Find the folder record by its identifier
      const archivePortfolio = await PortfolioFolders.findByPk(id);

      if (!archivePortfolio) {
        throw new Error('Folder not found');
      }

      // Perform soft delete by updating the "deletedAt" field to indicate the deletion time
      await archivePortfolio.update({ deletedAt: new Date() });

      // Return true to indicate a successful soft deletion
      return 'Archived successfully';
    },
    // Mutation to undeleted a portfolio folder
    unarchiveFolder: async (parent, args, contextValue) => {
      const { id } = args;

      try {
        // Find the soft deleted record using its ID
        const folder = await PortfolioFolders.findByPk(id);

        if (!folder) {
          throw new Error(`Folder with ID ${id} not found.`);
        }

        // Remove the delete date and time (deletedAt) to cancel the soft deletion
        await folder.update({ deletedAt: null });

        return {
          message: `Folder with ID ${id} unarchived.`,
        };
      } catch (error) {
        return {
          message: `Error unarchiving folder: ${error.message}`,
        };
      }
    },

    // ! PORTFOLIO PROJECT
    // Mutation to create a new portfolio project
    createProject: async (_, { studentId, input }) => {
      try {
        //this is not the right authenticating logic
        const student = await Users.findByPk(studentId);

        if (!student) {
          throw new Error(`Student with ID ${studentId} not found.`);
        }

        // Create the project record associated with the authenticated user
        const project = await PortfolioProjects.create({
          userId: studentId, // Associate the portfolio with the authenticated student
          ...input,
        });

        if (!project) {
          throw new Error(`Project with ID ${studentId} not found.`);
        }

        return {
          message: 'Project was created successfully',
        };
      } catch (error) {
        throw new Error(`Error creating Project: ${error.message}`);
      }
    },
    // Mutation to edit a portfolio project
    editProject: async (parent, args, contextValue) => {
      try {
        const { id, input } = args;

        // Find the project record by ID
        const portfolio = await PortfolioProjects.findByPk(id);

        if (!portfolio) {
          throw new Error('Project not found');
        }

        // Update the project record with the new input values
        const updateProject = await portfolio.update(input);

        if (!updateProject) {
          throw new Error('Failed to update Project');
        }

        return { message: 'Project was updated successfully' };
      } catch (error) {
        // Handle errors, such as database errors or failed updates
        throw new Error(`Error updating Project: ${error.message}`);
      }
    },
    // Mutation to edit another Editor a portfolio project
    editAnotherEditor: async (parent, args, contextValue) => {
      try {
        const { id, input, editorId } = args;

        // Find the project record by ID
        const project = await PortfolioProjects.findByPk(id);

        if (!project) {
          throw new Error('Project not found');
        }

        // Find the editor (user) by editorId
        const editor = await Users.findByPk(editorId);

        if (!editor) {
          throw new Error(`Editor with ID ${editorId} not found`);
        }

        const userPortfolio = await PortfolioProjects.findOne({
          where: {
            editMyProject: editorId,
            userId: project.userId,
          },
        });

        if (!userPortfolio) {
          throw new Error('User is not authorized to edit this project');
        }

        if (
          userPortfolio.visibility === 'Members_ONLY' &&
          !input.editMyProject
        ) {
          throw new Error(
            'You must provide the Edit Project field when visibility is Members ONlY',
          );
        }

        // Update the portfolio record with the new input values
        const updatePortfolio = await userPortfolio.update(input);

        if (!updatePortfolio) {
          throw new Error(
            `Failed to update Project with ID ${projectInput.id}`,
          );
        }
        return { message: 'Project was updated successfully' };
      } catch (error) {
        // Handle errors, such as database errors or failed updates
        throw new Error(`Error updating Project: ${error.message}`);
      }
    },
    // Mutation to delete a portfolio project completely
    deleteProject: async (parent, args, contextValue) => {
      try {
        const { id } = args;

        // Find the project record by ID
        const deletePortfolio = await PortfolioProjects.findByPk(id);

        if (!deletePortfolio) {
          throw new Error('Project not found');
        }

        // Delete the project record
        await deletePortfolio.destroy();

        // Return a message to indicate successful deletion
        return {
          message: 'Project deleted successfully',
        };
      } catch (error) {
        // Handle errors, such as database errors or failed deletions
        throw new Error(`Error Deleted Project: ${error.message}`);
      }
    },
    // Mutation to perform a soft delete on a portfolio project
    archiveProject: async (parent, args, contextValue) => {
      try {
        const { id } = args;

        // Find the project record by ID
        const archivePortfolio = await PortfolioProjects.findByPk(id);

        if (!archivePortfolio) {
          throw new Error('project not found');
        }

        // Perform soft delete by updating the deletedAt field
        await archivePortfolio.update({ deletedAt: new Date() });

        // Return true to indicate successful soft deletion
        return { message: 'Archived successfully' };
      } catch (error) {
        // Handle errors, such as database errors or failed soft deletions
        throw new Error(`Error archiving project: ${error.message}`);
      }
    },
    // Mutation to Undeleted a portfolio project
    unarchiveProject: async (parent, args, contextValue) => {
      try {
        const { id } = args;

        // Find the soft deleted record using its ID
        const portfolio = await PortfolioProjects.findByPk(id);

        if (!portfolio) {
          throw new Error(
            'project does not exist or has been permanently deleted',
          );
        }

        // Remove the delete date and time (deletedAt) to cancel the soft deletion
        await portfolio.update({ deletedAt: null });

        return { message: 'Unarchive successfully' };
      } catch (error) {
        // Handle errors, such as database errors or failed soft deletions
        throw new Error(`Error undeleted project: ${error.message}`);
      }
    },
    // Mutation to add a project to a folder
    addProjectToFolder: async (_, { folderId, projectId }) => {
      try {
        // Find the folder and project
        const folder = await PortfolioFolders.findByPk(folderId);
        const project = await PortfolioProjects.findByPk(projectId);

        if (!folder || !project) {
          throw new Error('Folder or Project not found.');
        }

        // Add the project to the folder if it doesn't exist in the association
        const addedProject = await folder.addProject(project);

        console.log(addedProject);
        if (!addedProject) {
          throw new Error(
            `Project ${projectId} is already associated with the folder ${folderId}.`,
          );
        }

        return {
          message: `Project ${projectId} added to Folder ${folderId} successfully.`,
        };
      } catch (error) {
        throw new Error(`Error adding project to folder: ${error.message}`);
      }
    },
    // Mutation to remove a project from a folder
    removeProjectFromFolder: async (_, { folderId, projectId }) => {
      try {
        // Find the folder and project
        const folder = await PortfolioFolders.findByPk(folderId);
        const project = await PortfolioProjects.findByPk(projectId);

        if (!folder || !project) {
          throw new Error('Folder or Project not found.');
        }

        // Remove the project from the folder
        const removedProjectCount = await folder.removeProject(project);

        if (removedProjectCount === 0) {
          throw new Error(
            `Project ${projectId} is not associated with the folder ${folderId}.`,
          );
        }

        return {
          message: `Project ${projectId} removed from Folder ${folderId} successfully.`,
        };
      } catch (error) {
        throw new Error(`Error removing project from folder: ${error.message}`);
      }
    },
  },
  Query: {
    // ! PORTFOLIO FOLDER
    // Query to get projects by student ID
    getFoldersWithProjectsByStudent: async (parent, args, contextValue) => {
      const { studentId } = args;
      try {
        // Find the folder record by student ID
        const folder = await PortfolioFolders.findAll({
          where: { userId: studentId, deletedAt: null },
          include: ['project'],
        });

        return folder;
      } catch (error) {
        throw new Error(`Error fetching folders: ${error.message}`);
      }
    },
    // Query to retrieve archived folders by student ID
    listArchivedFoldersWithProjects: async (parent, args, contextValue) => {
      const { studentId } = args;
      try {
        // Find archived folders associated with the student ID
        const archivedFolders = await PortfolioFolders.findAll({
          where: {
            userId: studentId,
            deletedAt: {
              [Op.ne]: null,
            }, // Find where deletedAt is not null (archived)
          },
          include: [
            {
              model: PortfolioProjects,
              through: { attributes: [] }, // Avoid attributes from the joining table
              as: 'project', // Custom alias for projects
            },
          ],
        });

        return archivedFolders;
      } catch (error) {
        throw new Error(
          `Error fetching archived folders with projects: ${error.message}`,
        );
      }
    },
    // ! PORTFOLIO PROJECT
    // Query to get projects by student ID with All Tags
    getProjectsByStudent: async (parent, args, contextValue) => {
      const { studentId } = args;
      try {
        // Find the portfolio record by ID
        const project = await PortfolioProjects.findAll({
          where: { userId: studentId, deletedAt: null },
        });

        // Extract all tags from the goal into one array
        const allTags = project.flatMap((exp) => exp.tags);

        // Filter to get unique tags
        const uniqueTags = [...new Set(allTags)];

        return { project, uniqueTags };
      } catch (error) {
        throw new Error(`Error fetching project: ${error.message}`);
      }
    },
    // Query to retrieve archived projects by student ID
    listArchivedProjects: async (parent, args, contextValue) => {
      const { studentId } = args;

      try {
        // Find archived portfolios associated with the student
        const archivedProjects = await PortfolioProjects.findAll({
          where: {
            userId: studentId,
            deletedAt: {
              [Op.ne]: null, // Include only archived portfolios
            },
          },
        });

        return archivedProjects;
      } catch (error) {
        throw new Error(`Error fetching archived projects: ${error.message}`);
      }
    },
  },
};

module.exports = resolvers;
