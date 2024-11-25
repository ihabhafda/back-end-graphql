const { Users, Skills } = require('../../models');

const { Op } = require('sequelize');

const resolvers = {
  Mutation: {
    // Mutation to create a new skill
    createSkill: async (_, { studentId, input }) => {
      try {
        //this is not the right authenticating logic
        const student = await Users.findByPk(studentId);

        if (!student) {
          throw new Error(`Student with ID ${studentId} not found.`);
        }

        // Create the Skill record associated with the authenticated user
        const skill = await Skills.create({
          userId: studentId, // Associate the skill with the authenticated student
          ...input,
        });

        if (!skill) {
          throw new Error(`Skill with ID ${studentId} not found.`);
        }

        // // Check if there are mapSkill to create and associate them with the skill
        // if (input.mapSkill && input.mapSkill.length > 0) {
        //   // Use the `create` method to create and associate mapSkill with the skill
        //   await Promise.all(
        //     input.mapSkill.map(async (skillInput) => {
        //       await MapSkills.create({
        //         skillId: skill.id,
        //         ...skillInput,
        //       });
        //     }),
        //   );
        // }

        return {
          message: 'Skill was created successfully',
        };
      } catch (error) {
        throw new Error(`Error creating skill: ${error.message}`);
      }
    },
    // Mutation to edit a skill
    editSkill: async (parent, args, contextValue) => {
      try {
        const { id, input } = args;

        // Find the skill record by ID
        const skill = await Skills.findByPk(id);

        if (!skill) {
          throw new Error('skill not found');
        }

        // Update the skill record with the new input values
        const updateSkill = await skill.update(input);

        if (!updateSkill) {
          throw new Error('Failed to update Skill');
        }

        // // Return the updated skill record
        // if (input.mapSkill && input.mapSkill.length > 0) {
        //   for (const skillInput of input.mapSkill) {
        //     const mapSkill = await MapSkills.findByPk(skillInput.id);

        //     if (!mapSkill) {
        //       throw new Error(`Skill with ID ${skillInput.id} not found`);
        //     }

        //     await mapSkill.update(skillInput);
        //   }
        // }

        // // Return the updated goal record with the associated task goals (if any)
        // const updatedSkill = await Skills.findByPk(id, {
        //   include: {
        //     model: MapSkills,
        //     as: 'mapSkill',
        //   },
        // });

        return {
          message: 'Skill was updated successfully',
        };
      } catch (error) {
        throw new Error(`Error updating Skill: ${error.message}`);
      }
    },
    // Mutation to delete a skill completely
    deleteSkill: async (parent, args, contextValue) => {
      try {
        const { id } = args;

        // Find the skill record by ID
        const skill = await Skills.findByPk(id);

        if (!skill) {
          throw new Error('Skill not found');
        }

        // Delete the skill record
        await skill.destroy();

        // Return this sentence to indicate successful deletion
        return { message: 'Skill deleted successfully' };
      } catch (error) {
        throw new Error(`Error Deleted Skill: ${error.message}`);
      }
    },
    // Mutation to perform a soft delete on a skill
    archiveSkill: async (parent, args, contextValue) => {
      try {
        const { id } = args;

        // Find the skill record by ID
        const skill = await Skills.findByPk(id);

        if (!skill) {
          throw new Error('skill not found');
        }

        // Perform soft delete by updating the deletedAt field
        await skill.update({ deletedAt: new Date() });

        // Return true to indicate successful soft deletion
        return { message: 'Archived successfully' };
      } catch (error) {
        throw new Error(`Error archiving Skill: ${error.message}`);
      }
    },
    // Mutation to undeleted a skill
    undeletedSkill: async (parent, args, contextValue) => {
      try {
        const { id } = args;

        // Find the soft deleted record using its ID
        const skill = await Skills.findByPk(id);

        if (!skill) {
          throw new Error(
            'Skill does not exist or has been permanently deleted',
          );
        }

        // Remove the delete date and time (deletedAt) to cancel the soft deletion
        await skill.update({ deletedAt: null });

        return { message: 'Unarchive successfully' };
      } catch (error) {
        // Handle errors, such as database errors or failed soft deletions
        throw new Error(`Error undeleted Skill: ${error.message}`);
      }
    },
  },
  Query: {
    // Query to get skills by student ID
    listSkillsById: async (parent, args, contextValue) => {
      const { id } = args;

      try {
        // Find the skill record by ID
        const skill = await Skills.findAll({
          where: { userId: id, deletedAt: null },
        });

        return skill;
      } catch (error) {
        throw new Error(`Error fetching skills: ${error.message}`);
      }
    },
    // Query to retrieve archived skills by student ID
    listArchivedSkillsById: async (parent, args, contextValue) => {
      const { id } = args;

      try {
        // Find archived skills associated with the student
        const archivedSkills = await Skills.findAll({
          where: {
            userId: id,
            deletedAt: {
              [Op.ne]: null, // Include only archived skills
            },
          },
        });

        return archivedSkills;
      } catch (error) {
        throw new Error(
          `Error in listing archived Self Skill: ${error.message}`,
        );
      }
    },
  },
};

module.exports = resolvers;
