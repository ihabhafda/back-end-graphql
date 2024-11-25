const { Users } = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define a list of valid email endings, such as ".com"
const validEmailEndings = [
  'gmail.com',
  'outlook.com',
  'microsoft.com',
  'live.com',
  'msn.com',
  'office.com',
  'skype.com',
];

// Function to check if an email ends with any of the valid endings
const isValidEmail = (email) => {
  return validEmailEndings.some((ending) => email.endsWith(ending));
};

const resolvers = {
  Mutation: {
    // Mutation to create a new user
    createUser: async (parent, args, contextValue) => {
      // Extract variables from the operation inputs
      const {
        firstName,
        lastName,
        userName,
        email,
        phoneNumber,
        grade,
        schoolCode,
        role,
        usi,
        password,
        agreeToTerms,
      } = args.input;

      // Verify that the agreeToTerms variable contains a valid value (true or false)
      if (agreeToTerms !== true && agreeToTerms !== false) {
        throw new Error(
          'You must provide a valid value for agreeToTerms (true or false).',
        );
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Check if the email ends with a valid ending
      if (!isValidEmail(email)) {
        throw new Error(
          'Invalid email format. The email must end with ".com".',
        );
      }

      // Create a new user in the database
      const userCreated = await Users.create({
        firstName,
        lastName,
        userName,
        email,
        phoneNumber,
        grade,
        schoolCode,
        role,
        usi,
        password: hashedPassword,
        agreeToTerms,
      });

      // // التحقق من وجود قيمة usi في جدول آخر
      // const usiExistsInOtherTable = await OtherTable.findOne({
      //   where: { usi },
      // });

      // if (usiExistsInOtherTable) {
      //   // إرسال رسالة إلى الواجهة الأمامية توضح أن قيمة usi مستخدمة بالفعل في جدول آخر
      //   throw new Error('The provided USI is already in use in another table.');
      // }

      // // التحقق من نهاية البريد الإلكتروني لتحديد إذا كان مخصصًا لـ Google أو Microsoft
      // const emailEndsWith = email.toLowerCase().endsWith('.com');
      // const emailDomain = emailEndsWith
      //   ? email.toLowerCase().split('@')[1]
      //   : null;

      // if (emailDomain === 'gmail.com') {
      //   throw new Error('The email is designated for Google.');
      // } else if (emailDomain === 'microsoft.com') {
      //   throw new Error('The email is designated for Microsoft.');
      // }

      return userCreated;
    },
    // Mutation to log in a user
    userLogin: async (_, { userName, password }) => {
      // Find the user by their username
      const user = await Users.findOne({ where: { userName } });

      if (!user) {
        throw new Error('User not found');
      }

      // Verify the password's validity using bcrypt
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      // Create a JWT token for the user
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

      // Return user data along with the token as the response
      const userData = JSON.stringify({ token, user });

      return userData;
    },
  },
};

module.exports = resolvers;
