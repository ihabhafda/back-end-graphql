const { Users, IDPSelectors } = require('../../models');

const resolvers = {
  Mutation: {
    // Mutation to create a new IDP Selector
    createSelector: async (_, { studentId, input }) => {
      try {
        // Authenticate the student using
        const student = await Users.findByPk(studentId);

        if (!student) {
          throw new Error(`Student with ID ${studentId} not found.`);
        }

        // Create the IDP Selector record associated with the authenticated user
        const selector = await IDPSelectors.create({
          userId: studentId, // Associate the IDP Selector with the authenticated student
          ...input,
        });

        return selector;
      } catch (error) {
        throw new Error(`Error creating IDP Selector: ${error.message}`);
      }
    },
  },
};

module.exports = resolvers;
