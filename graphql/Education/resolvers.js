const { Users, Qualifications } = require('../../models');
const { Op } = require('sequelize');
// async function isImageSafe(chooseFile) {
//   try {
//     const response = await fetch('http://127.0.0.1:5000/classify', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(chooseFile),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
//     }

//     const result = await response.json();

//     console.log(result.message);
//     if (result.message === true) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (error) {
//     // Handle the error and provide more context
//     console.error(`Error classifying the image: ${error.message}`);
//     throw new Error('Error classifying the image');
//   }
// }

const resolvers = {
  Mutation: {
    // Mutation to create a new qualification
    createQualification: async (_, { studentId, input }) => {
      try {
        //this is not the right authenticating logic
        const student = await Users.findByPk(studentId);

        if (!student) {
          throw new Error(`Student with ID ${studentId} not found.`);
        }

        // Create the Goal record associated with the authenticated user
        const qualification = await Qualifications.create({
          userId: studentId, // Associate the Qualification with the authenticated student
          ...input,
        });

        if (!qualification) {
          throw new Error(`Qualification with ID ${studentId} not found.`);
        }

        // // Check if there are QualificationFiles to create and associate them with the qualification
        // if (input.photos && input.photos.length > 0) {
        //   //  Use the `create` method to create and associate QualificationFiles with the qualification
        //   await Promise.all(
        //     input.photos.map(async (qualifyInput) => {
        //       await QualificationFiles.create({
        //         qualifyId: qualify.id,
        //         ...qualifyInput,
        //       });
        //     }),
        //   );
        // }

        // If the code gets here without errors, return a success message
        return {
          message: 'Qualification was created successfully',
        };
        // If any errors occur, the error should be raised with an error message
      } catch (error) {
        throw new Error(`Error creating Qualification: ${error.message}`);
      }
    },
    // Mutation to edit a qualification
    editQualification: async (parent, args, contextValue) => {
      try {
        const { id, input } = args;

        // Find the Qualification record by ID
        const qualification = await Qualifications.findByPk(id);

        if (!qualification) {
          throw new Error('Qualification not found');
        }

        // Update the Qualification record with the new input values
        const updateResult = await qualification.update(input);

        if (!updateResult) {
          throw new Error('Failed to Update Qualification');
        }

        return {
          message: 'Qualification was updated successfully',
        };
      } catch (error) {
        // Handle errors, such as database errors or failed updates
        throw new Error(`Error updating Qualification: ${error.message}`);
      }
    },
    // Mutation to delete a qualification completely
    deleteQualification: async (parent, args, contextValue) => {
      try {
        const { id } = args;

        // Find the qualification record by ID
        const qualification = await Qualifications.findByPk(id);

        if (!qualification) {
          throw new Error('Qualification not found');
        }

        // Delete the qualification record
        await qualification.destroy();

        // Return thi sentence to indicate successful deletion
        return { message: 'Qualification deleted successfully' };
      } catch (error) {
        // Handle errors, such as database errors or failed deletions
        throw new Error(`Error deleting qualification: ${error.message}`);
      }
    },
    // Mutation to perform a soft delete on a qualification
    archiveQualification: async (parent, args, contextValue) => {
      try {
        const { id } = args;

        // Find the qualification record by ID
        const qualification = await Qualifications.findByPk(id);

        if (!qualification) {
          throw new Error('Qualification not found');
        }

        // Perform soft delete by updating the deletedAt field
        await qualification.update({ deletedAt: new Date() });

        // Return a success message to indicate successful soft deletion
        return { message: 'Archived successfully' };
      } catch (error) {
        // Return an error message in case of any errors during the soft deletion
        throw new Error(`Error archiving qualification: ${error.message}`);
      }
    },
    // Mutation to undeleted a qualification
    unArchiveQualification: async (parent, args, contextValue) => {
      try {
        const { id } = args;

        // Find the soft deleted record using its ID
        const qualification = await Qualifications.findByPk(id);

        if (!qualification) {
          throw new Error(
            'Qualification does not exist or has been permanently deleted',
          );
        }

        // Remove the delete date and time (deletedAt) to cancel the soft deletion
        await qualification.update({ deletedAt: null });

        return { message: 'Unarchived successfully' };
      } catch (error) {
        // Return an error message in case of any errors during the undeletion
        throw new Error(`Error unarchiving qualification: ${error.message}`);
      }
    },
  },
  Query: {
    // Query to get qualifications by student ID
    getQualificationByStudent: async (parent, args, contextValue) => {
      const { id } = args;

      try {
        // Find the qualification records by user ID
        const getQualifications = await Qualifications.findAll({
          where: { userId: id, deletedAt: null },
        });

        // Convert the date to "YYYY-MM" format on return with incremented month
        const formattedQualifications = getQualifications.map(
          (qualification) => {
            const startDateUnixTimestamp = qualification.startDate;
            const endDateUnixTimestamp = qualification.endDate;

            const formatDate = (dateString) => {
              if (dateString && typeof dateString === 'string') {
                const [year, month] = dateString.split('-');
                const incrementedMonth = parseInt(month, 10) + 1;
                return `${year}-${String(incrementedMonth).padStart(2, '0')}`;
              }
              return null; // Handle other cases if needed
            };

            const formattedStartDate = startDateUnixTimestamp
              ? formatDate(
                  new Date(startDateUnixTimestamp).toISOString().slice(0, 7),
                )
              : null;

            const formattedEndDate = endDateUnixTimestamp
              ? formatDate(
                  new Date(endDateUnixTimestamp).toISOString().slice(0, 7),
                )
              : null;

            return {
              ...qualification.toJSON(),
              startDate: formattedStartDate,
              endDate: formattedEndDate,
            };
          },
        );

        return formattedQualifications;
      } catch (error) {
        throw new Error(`Error fetching Qualifications: ${error.message}`);
      }
    },
    // Query to retrieve archived qualifications by student ID
    listArchivedQualifications: async (parent, args, contextValue) => {
      const { id } = args;

      try {
        // Find archived qualifications associated with the student
        const archivedQualifications = await Qualifications.findAll({
          where: {
            userId: id,
            deletedAt: {
              [Op.ne]: null, // Include only archived qualifications
            },
          },
        });

        // Convert dates to "YYYY-MM" format when returning, adding 1 to the month value
        const formattedArchivedQualifications = archivedQualifications.map(
          (qualification) => {
            const startDateUnixTimestamp = qualification.startDate;
            const endDateUnixTimestamp = qualification.endDate;

            const formatMonth = (unixTimestamp) => {
              if (unixTimestamp) {
                const date = new Date(unixTimestamp);
                date.setMonth(date.getMonth() + 1);
                return date.toISOString().slice(0, 7);
              }
              return null;
            };

            const formattedStartDate = formatMonth(startDateUnixTimestamp);
            const formattedEndDate = formatMonth(endDateUnixTimestamp);

            return {
              ...qualification.toJSON(),
              startDate: formattedStartDate,
              endDate: formattedEndDate,
            };
          },
        );

        return formattedArchivedQualifications;
      } catch (error) {
        throw new Error(
          `Error in listing archived Qualifications: ${error.message}`,
        );
      }
    },
  },
};

module.exports = resolvers;
