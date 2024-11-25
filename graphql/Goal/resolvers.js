const { Users, Goals } = require('../../models');
const { Op } = require('sequelize');

const resolvers = {
  Mutation: {
    // Mutation to create a new goal and Task
    createGoal: async (_, { studentId, input }) => {
      try {
        // this is not the right authenticating logic
        const student = await Users.findByPk(studentId);

        if (!student) {
          throw new Error(`Student with ID ${studentId} not found.`);
        }

        // Create the Goal record associated with the authenticated user
        const goal = await Goals.create({
          userId: studentId, // Associate the goal with the authenticated student
          ...input,
        });

        if (!goal) {
          throw new Error(`Goal with ID ${studentId} not found.`);
        }

        // // Check if there are taskGoal to create and associate them with the goal
        // if (input.taskGoal && input.taskGoal.length > 0) {
        //   // Use the `create` method to create and associate taskGoal with the goal
        //   await Promise.all(
        //     input.taskGoal.map(async (taskInput) => {
        //       await TaskGoals.create({
        //         goalsId: goal.id,
        //         ...taskInput,
        //       });
        //     }),
        //   );
        // }

        return {
          message: 'Goal was created successfully',
        };
      } catch (error) {
        throw new Error(`Error creating Goal: ${error.message}`);
      }
    },
    // Mutation to edit a goal
    editGoal: async (parent, args, contextValue) => {
      try {
        const { id, input } = args;

        // Find the goal record by ID
        const goal = await Goals.findByPk(id);

        if (!goal) {
          throw new Error('Goal not found');
        }

        // Update the goal record with the provided input data
        const updateGoal = await goal.update(input);

        if (!updateGoal) {
          throw new Error('Failed to update Goal');
        }

        // // Update associated taskGoal records
        // if (input.taskGoal && input.taskGoal.length > 0) {
        //   for (const taskInput of input.taskGoal) {
        //     const taskGoal = await TaskGoals.findByPk(taskInput.id);

        //     if (!taskGoal) {
        //       throw new Error(`Task goal with ID ${taskInput.id} not found`);
        //     }

        //     // Update the taskGoal record with the new input values
        //     const updateTaskGoal = await taskGoal.update(taskInput);

        //     if (!updateTaskGoal) {
        //       throw new Error('Failed to update qualificationFile');
        //     }
        //   }
        // }

        return { message: 'Goal was updated successfully' };
      } catch (error) {
        // Handle errors, such as database errors or failed updates
        throw new Error(`Error updating Goal: ${error.message}`);
      }
    },
    // Mutation to delete a goal completely
    deleteGoal: async (parent, args, contextValue) => {
      const { id } = args;
      try {
        // Find the qualification record by ID
        const goal = await Goals.findByPk(id);

        if (!goal) {
          throw new Error('Goal not found');
        }

        // Delete the qualification record
        await goal.destroy();

        // Return this sentence to indicate successful deletion
        return { message: 'Goal deleted successfully' };
      } catch (error) {
        throw new Error(`Error deleting Goal: ${error.message}`);
      }
    },
    // Mutation to perform a soft delete on a goal
    archiveGoal: async (parent, args, contextValue) => {
      try {
        const { id } = args;

        // Find the qualification record by ID
        const goal = await Goals.findByPk(id);

        if (!goal) {
          throw new Error('Goal not found');
        }

        // Perform soft delete by updating the deletedAt field
        await goal.update({ deletedAt: new Date() });

        // Return true to indicate successful soft deletion
        return { message: 'Archived successfully' };
      } catch (error) {
        // Return an error message in case of any errors during the soft deletion
        throw new Error(`Error archiving Goal: ${error.message}`);
      }
    },
    // Mutation to undeleted a goal
    undeletedGoal: async (parent, args, contextValue) => {
      try {
        const { id } = args;

        // Find the soft deleted record using its ID
        const goal = await Goals.findByPk(id);

        if (!goal) {
          throw new Error(
            'Goal does not exist or has been permanently deleted',
          );
        }

        // Remove the delete date and time (deletedAt) to cancel the soft deletion
        await goal.update({ deletedAt: null });

        return { message: 'Unarchive successfully' };
      } catch (error) {
        // Return an error message in case of any errors during the undeletion
        throw new Error(`Error undeleting Goal: ${error.message}`);
      }
    },
  },
  Query: {
    // Query to retrieve unarchived goals by student ID
    listGoalsWithAllTags: async (parent, args, contextValue) => {
      const { studentId } = args;

      try {
        // Find unarchived goal associated with the student
        const goals = await Goals.findAll({
          where: {
            userId: studentId,
            deletedAt: null, // Include only unarchived goal
          },
        });

        // Extract all tags from the goal into one array
        const allTags = goals.flatMap((exp) => exp.tags);

        // Filter to get unique tags
        const uniqueTags = [...new Set(allTags)];

        return {
          goals,
          uniqueTags,
        };
      } catch (error) {
        throw new Error(`Error in listing goal: ${error.message}`);
      }
    },
    // Query to retrieve archived goals by student ID
    listArchivedGoalWithAllTags: async (parent, args, contextValue) => {
      const { studentId } = args;

      try {
        // Find archived Goals associated with the student
        const goals = await Goals.findAll({
          where: {
            userId: studentId,
            deletedAt: {
              [Op.ne]: null, // Include only archived Goal
            },
          },
        });

        // Extract all tags from the goal into one array
        const allTags = goals.flatMap((exp) => exp.tags);

        // Filter to get unique tags
        const uniqueTags = [...new Set(allTags)];

        return { goals, uniqueTags };
      } catch (error) {
        throw new Error(`Error in listing archived Goal: ${error.message}`);
      }
    },
  },
};

module.exports = resolvers;
