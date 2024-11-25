const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cookieSession = require('cookie-session');
const passport = require('passport');
require('dotenv').config();

const resolversGoals = require('./graphql/Goal/resolvers');
const typeDefsGoals = require('./graphql/Goal/typeDefs');
const resolversEducation = require('./graphql/Education/resolvers');
const typeDefsEducation = require('./graphql/Education/typeDefs');
const resolversSkill = require('./graphql/Skill/resolvers');
const typeDefsSkill = require('./graphql/Skill/typeDefs');
const resolversUser = require('./graphql/User/resolvers');
const typeDefsUser = require('./graphql/User/typeDefs');
const resolversReflection = require('./graphql/Self-Reflection/resolvers');
const typeDefsReflection = require('./graphql/Self-Reflection/typeDefs');
const resolversPermission = require('./graphql/PermissionConsent/resolvers');
const typeDefsPermission = require('./graphql/PermissionConsent/typeDefs');
const resolversPortfolio = require('./graphql/Portfolio/resolvers');
const typeDefsPortfolio = require('./graphql/Portfolio/typeDefs');
const resolversPathway = require('./graphql/Pathway/resolvers');
const typeDefsPathway = require('./graphql/Pathway/typeDefs');
const resolversIDPSelector = require('./graphql/IDPSelector/resolvers');
const typeDefsIDPSelector = require('./graphql/IDPSelector/typeDefs');

const app = express();
const api = require('./api');
const db = require('./models');
require('./auth/loginWithGoogle');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie session
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  }),
);

// calling passport initialization
app.use(passport.initialize());
app.use(passport.session());

// initialize sequelize
db.sequelize.authenticate({ force: false }).then(() => {
  console.log('connected to db');
});

app.use('/api/v1', api);

let apolloServer;
// graphQL
async function startServer() {
  // Combine resolver objects from different files
  const resolvers = [
    resolversReflection,
    resolversGoals,
    resolversEducation,
    resolversSkill,
    resolversUser,
    resolversPermission,
    resolversPortfolio,
    resolversPathway,
    resolversIDPSelector,
  ];

  // Combine type definitions from different files
  const typeDefs = [
    typeDefsReflection,
    typeDefsGoals,
    typeDefsEducation,
    typeDefsSkill,
    typeDefsUser,
    typeDefsPermission,
    typeDefsPortfolio,
    typeDefsPathway,
    typeDefsIDPSelector,
  ];

  apolloServer = new ApolloServer({
    resolvers,
    typeDefs,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}

startServer();

// express server
const port = 5000;

app.listen(port, () => {
  console.log(`Server is Running on Port ${port}`);
});
