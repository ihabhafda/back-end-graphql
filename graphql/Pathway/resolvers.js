const { Users, Pathways } = require('../../models');
const { Op } = require('sequelize');

const resolvers = {
  Mutation: {
    // Mutation to create a new Pathway
    createPathway: async (_, { studentId, input }) => {
      try {
        // Authenticate the student using
        const student = await Users.findByPk(studentId);

        if (!student) {
          throw new Error(`Student with ID ${studentId} not found.`);
        }

        // Create the Pathway record associated with the authenticated user
        const pathway = await Pathways.create({
          userId: studentId, // Associate the Pathway with the authenticated student
          ...input,
        });

        if (!pathway) {
          throw new Error(`Pathway with ID ${studentId} not found.`);
        }

        return { message: 'Pathway was created successfully' };
      } catch (error) {
        throw new Error(`Error creating Pathway: ${error.message}`);
      }
    },
    // Mutation to edit a Pathway
    editPathway: async (parent, args, contextValue) => {
      try {
        const { id, input } = args;

        // Find the pathway record by ID
        const pathway = await Pathways.findByPk(id);

        if (!pathway) {
          throw new Error('Pathway not found');
        }

        // Update the Pathway record with the new input values
        const updatePathway = await pathway.update(input);

        if (!updatePathway) {
          throw new Error('Failed to update Pathway');
        }

        return { message: 'Pathway was updated successfully' };
      } catch (error) {
        throw new Error(`Error updating Pathway : ${error.message}`);
      }
    },
    // Mutation to delete a Pathway completely
    deletePathway: async (parent, args, contextValue) => {
      try {
        const { id } = args;

        // Find the Pathway record by ID
        const getPathway = await Pathways.findByPk(id);

        if (!getPathway) {
          throw new Error('Pathway not found');
        }

        // Delete the Pathway record
        await getPathway.destroy();

        // Return this sentence to indicate successful deletion
        return { message: 'Pathway deleted successfully' };
      } catch (error) {
        throw new Error(`Error Deleted Pathway: ${error.message}`);
      }
    },
    // Mutation to perform a soft delete on a Pathway
    archivePathway: async (parent, args, contextValue) => {
      try {
        const { id } = args;

        // Find the Pathway record by ID
        const getPathway = await Pathways.findByPk(id);

        if (!getPathway) {
          throw new Error('Pathway not found');
        }

        // Perform soft delete by updating the deletedAt field with the current date
        await getPathway.update({ deletedAt: new Date() });

        // Return true to indicate successful soft deletion
        return { message: 'Archived successfully' };
      } catch (error) {
        // Handle errors, such as database errors or failed soft deletions
        throw new Error(`Error archiving Pathway: ${error.message}`);
      }
    },
    // Mutation to undeleted a Pathway
    unArchivePathway: async (parent, args, contextValue) => {
      try {
        const { id } = args;

        // Find the soft deleted record using its ID
        const pathway = await Pathways.findByPk(id);

        if (!pathway) {
          throw new Error(
            'Pathway does not exist or has been permanently deleted',
          );
        }

        // Remove the delete date and time (deletedAt) to cancel the soft deletion
        await pathway.update({ deletedAt: null });

        return { message: 'Unarchive successfully' };
      } catch (error) {
        // Handle errors, such as database errors or failed soft deletions
        throw new Error(`Error archiving Pathway: ${error.message}`);
      }
    },
  },
  Query: {
    // Query to get Pathway by student ID
    getPathwayById: async (parent, args, contextValue) => {
      const { id } = args;

      try {
        // Find the Pathway record by ID
        const pathway = await Pathways.findAll({
          where: { userId: id, deletedAt: null },
        });

        return pathway;
      } catch (error) {
        throw new Error(`Error fetching Pathway: ${error.message}`);
      }
    },
    // Query to retrieve archived Pathway by student ID
    listArchivedPathway: async (parent, args, contextValue) => {
      const { id } = args;

      try {
        // Find archived Pathway associated with the student
        const archivedPathway = await Pathways.findAll({
          where: {
            userId: id,
            deletedAt: {
              [Op.ne]: null, // Include only archived Pathway
            },
          },
        });

        return archivedPathway;
      } catch (error) {
        throw new Error(`Error in listing archived Pathway: ${error.message}`);
      }
    },
  },
};

module.exports = resolvers;
