const {
  Users,
  PermissionConsents,
  Skills,
  MapSkills,
  Qualifications,
  QualificationFiles,
  Goals,
  TaskGoals,
} = require('../../models');

const { isBefore, parseISO } = require('date-fns');
const { Sequelize } = require('sequelize');

const resolvers = {
  Mutation: {
    // Mutation to create a new permission and Task
    createPermission: async (_, { studentId, input }) => {
      try {
        const currentTime = new Date();
        const userPermission = await PermissionConsents.findOne({
          where: {
            specifyTime: {
              [Sequelize.Op.gt]: currentTime,
            },
            editor: input.editor,
            userId: studentId,
          },
        });

        if (userPermission) {
          throw new Error('Permission already exist');
        }

        //this is not the right authenticating logic
        const student = await Users.findByPk(studentId);
        if (!student) {
          throw new Error(`Student with ID ${studentId} not found.`);
        }
        // Create the permission consents record associated with the authenticated user
        await PermissionConsents.create({
          userId: studentId, // Associate the permission consents with the authenticated student
          ...input,
        });

        return 'You have successfully granted permissions to the selected users';
      } catch (error) {
        throw new Error(`Error creating Permission Consent: ${error.message}`);
      }
    },
    // Mutation to edit a skill
    editAnotherSkill: async (parent, args, contextValue) => {
      const { id, input, editorId } = args;

      // Find the skill record by ID
      const skill = await Skills.findByPk(id);

      if (!skill) {
        throw new Error('skill not found');
      }

      // Find the editor (user) by editorId
      const editor = await Users.findByPk(editorId);

      if (!editor) {
        throw new Error(`Editor with ID ${editorId} not found`);
      }

      const currentTime = new Date();
      const userPermission = await PermissionConsents.findOne({
        where: {
          specifyTime: {
            [Sequelize.Op.gt]: currentTime,
          },
          editor: editorId,
          userId: skill.userId,
        },
      });

      if (!userPermission) {
        throw new Error('Permission not found');
      }

      if (userPermission.access !== 'FULL_CONTROL') {
        throw new Error('You do not have FULL_CONTROL access');
      }

      // Update the skill record with the new input values
      await skill.update(input);

      // Return the updated skill record
      if (input.mapSkill && input.mapSkill.length > 0) {
        for (const skillInput of input.mapSkill) {
          const mapSkill = await MapSkills.findByPk(skillInput.id);

          if (!mapSkill) {
            throw new Error(`Skill with ID ${skillInput.id} not found`);
          }

          await mapSkill.update(skillInput);
        }
      }

      // Return the updated goal record with the associated task goals (if any)
      const updatedSkill = await Skills.findByPk(id, {
        include: {
          model: MapSkills,
          as: 'mapSkill',
        },
      });

      return updatedSkill;
    },
    // Mutation to edit a qualification
    editAnotherQualification: async (parent, args, contextValue) => {
      const { id, input, editorId } = args;

      // Find the Qualification record by ID
      const qualify = await Qualifications.findByPk(id);

      if (!qualify) {
        throw new Error('Qualification not found');
      }

      // Find the editor (user) by editorId
      const editor = await Users.findByPk(editorId);

      if (!editor) {
        throw new Error(`Editor with ID ${editorId} not found`);
      }

      const currentTime = new Date();
      const userPermission = await PermissionConsents.findOne({
        where: {
          specifyTime: {
            [Sequelize.Op.gt]: currentTime,
          },
          editor: editorId,
          userId: qualify.userId,
        },
      });

      if (!userPermission) {
        throw new Error('Permission not found');
      }

      if (userPermission.access !== 'FULL_CONTROL') {
        throw new Error('You do not have FULL_CONTROL access');
      }

      // Update the Qualification record with the new input values
      await qualify.update(input);

      // Return the updated reflection record
      if (input.photos && input.photos.length > 0) {
        for (const qualifyInput of input.photos) {
          const upload = await QualificationFiles.findByPk(qualifyInput.id);

          if (!upload) {
            throw new Error(
              `Qualification with ID ${qualifyInput.id} not found`,
            );
          }

          await upload.update(qualifyInput);
        }
      }

      // Return the updated goal record with the associated task goals (if any)
      const updatedGQualify = await Qualifications.findByPk(id, {
        include: {
          model: QualificationFiles,
          as: 'photos',
        },
      });

      return updatedGQualify;
    },
    // Mutation to edit a goal
    editAnotherGoal: async (parent, args, contextValue) => {
      const { id, input, editorId } = args;

      // Find the goal record by ID
      const goal = await Goals.findByPk(id);

      if (!goal) {
        throw new Error('Goal not found');
      }

      // Find the editor (user) by editorId
      const editor = await Users.findByPk(editorId);

      if (!editor) {
        throw new Error(`Editor with ID ${editorId} not found`);
      }

      const currentTime = new Date();
      const userPermission = await PermissionConsents.findOne({
        where: {
          specifyTime: {
            [Sequelize.Op.gt]: currentTime,
          },
          editor: editorId,
          userId: goal.userId,
        },
      });

      if (!userPermission) {
        throw new Error('Permission not found');
      }

      if (userPermission.access !== 'FULL_CONTROL') {
        throw new Error('You do not have FULL_CONTROL access');
      }

      // Update the goal record with the provided input data
      await goal.update(input);

      // Update associated taskGoal records
      if (input.taskGoal && input.taskGoal.length > 0) {
        for (const taskInput of input.taskGoal) {
          const taskGoal = await TaskGoals.findByPk(taskInput.id);

          if (!taskGoal) {
            throw new Error(`Task goal with ID ${taskInput.id} not found`);
          }

          await taskGoal.update(taskInput);
        }
      }

      // Return the updated goal record with the associated task goals (if any)
      const updatedGoal = await Goals.findByPk(id, {
        include: {
          model: TaskGoals,
          as: 'taskGoal',
        },
      });

      return updatedGoal;
    },
  },
};

module.exports = resolvers;
