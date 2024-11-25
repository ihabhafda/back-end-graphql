const { Users, SelfReflections } = require('../../models');
const { Op } = require('sequelize');

const resolvers = {
  Mutation: {
    // Mutation to create a new self-reflection
    createSelfReflection: async (_, { studentId, input }) => {
      try {
        //this is not the right authenticating logic
        const student = await Users.findByPk(studentId);

        if (!student) {
          throw new Error(`Student with ID ${studentId} not found.`);
        }

        // Create the self-reflection record associated with the authenticated user
        const reflection = await SelfReflections.create({
          userId: studentId, // Associate the reflection with the authenticated student
          ...input,
        });

        if (!reflection) {
          throw new Error(`Self reflection with ID ${studentId} not found.`);
        }

        // // Check if there are reflection to create and associate them with the goal
        // if (input.upload && input.upload.length > 0) {
        //   // Use the `create` method to create and associate reflection with the goal
        //   await Promise.all(
        //     input.upload.map(async (selfInput) => {
        //       await UploadFileSelfs.create({
        //         selfId: reflection.id,
        //         ...selfInput,
        //       });
        //       return UploadFileSelfs;
        //     }),
        //   );
        // }

        return { message: 'Self Reflection was created successfully' };
      } catch (error) {
        throw new Error(`Error creating Self Reflection: ${error.message}`);
      }
    },
    // Mutation to edit a self-reflection
    editSelfReflection: async (parent, args, contextValue) => {
      try {
        const { id, input } = args;

        // Find the reflection record by ID
        const reflection = await SelfReflections.findByPk(id);

        if (!reflection) {
          throw new Error('Reflection not found');
        }

        // Update the reflection record with the new input values
        const updateSelf = await reflection.update(input);

        if (!updateSelf) {
          throw new Error('Failed to update Self Reflection');
        }

        // // Return the updated reflection record
        // if (input.upload && input.upload.length > 0) {
        //   for (const selfInput of input.upload) {
        //     const upload = await UploadFileSelfs.findByPk(selfInput.id);

        //     if (!upload) {
        //       throw new Error(`Reflection with ID ${selfInput.id} not found`);
        //     }

        //     await upload.update(selfInput);
        //   }
        // }

        // // Return the updated goal record with the associated task goals (if any)
        // const updatedSelfReflection = await SelfReflections.findByPk(id, {
        //   include: {
        //     model: UploadFileSelfs,
        //     as: 'upload',
        //   },
        // });

        return { message: 'Self reflection was updated successfully' };
      } catch (error) {
        throw new Error(`Error updating Self reflection : ${error.message}`);
      }
    },
    // Mutation to delete a self-reflection completely
    deleteSelfReflection: async (parent, args, contextValue) => {
      try {
        const { id } = args;

        // Find the reflection record by ID
        const reflection = await SelfReflections.findByPk(id);

        if (!reflection) {
          throw new Error('reflection not found');
        }

        // Delete the reflection record
        await reflection.destroy();

        // Return this sentence to indicate successful deletion
        return { message: 'Self Reflection deleted successfully' };
      } catch (error) {
        throw new Error(`Error Deleted Self Reflection: ${error.message}`);
      }
    },
    // Mutation to perform a soft delete on a self-reflection
    archiveSelfReflection: async (parent, args, contextValue) => {
      try {
        const { id } = args;

        // Find the Reflection record by ID
        const reflection = await SelfReflections.findByPk(id);

        if (!reflection) {
          throw new Error('Self-Reflection not found');
        }

        // Perform soft delete by updating the deletedAt field
        await reflection.update({ deletedAt: new Date() });

        // Return true to indicate successful soft deletion
        return { message: 'Archived successfully' };
      } catch (error) {
        // Handle errors, such as database errors or failed soft deletions
        throw new Error(`Error archiving Self Reflection: ${error.message}`);
      }
    },
    // Mutation to undeleted a self-reflection
    undeletedSelfReflection: async (parent, args, contextValue) => {
      try {
        const { id } = args;

        // Find the soft deleted record using its ID
        const reflection = await SelfReflections.findByPk(id);

        if (!reflection) {
          throw new Error(
            'Self-Reflection does not exist or has been permanently deleted',
          );
        }

        // Remove the delete date and time (deletedAt) to cancel the soft deletion
        await reflection.update({ deletedAt: null });

        return { message: 'Unarchive successfully' };
      } catch (error) {
        // Handle errors, such as database errors or failed soft deletions
        throw new Error(`Error undeleted Self Reflection: ${error.message}`);
      }
    },
  },
  Query: {
    // Query to get self-reflections by student ID
    getSelfReflectionsById: async (parent, args, contextValue) => {
      const { id } = args;

      try {
        // Find the Self-Reflections records by user ID and not deleted
        const selfReflections = await SelfReflections.findAll({
          where: {
            userId: id,
            deletedAt: null,
          },
        });

        return selfReflections;
      } catch (error) {
        throw new Error(`Error fetching Self-Reflections: ${error.message}`);
      }
    },
    // Query to retrieve archived self-reflections by student ID
    listArchivedSelfReflection: async (parent, args, contextValue) => {
      const { id } = args;

      try {
        // Find archived self-reflections associated with the student
        const archivedSelfReflection = await SelfReflections.findAll({
          where: {
            userId: id,
            deletedAt: {
              [Op.ne]: null, // Include only archived self-reflections
            },
          },
        });

        return archivedSelfReflection;
      } catch (error) {
        throw new Error(
          `Error in listing archived Self Reflections: ${error.message}`,
        );
      }
    },
  },
};

module.exports = resolvers;
