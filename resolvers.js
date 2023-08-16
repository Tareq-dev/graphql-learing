import { users, quotes } from "./fakeDb.js";
import { randomBytes } from "crypto";
const resolvers = {
  Query: {
    users: () => users,
    //for single user queries by id
    user: (_, { id }) => users.find((u) => u.id == id),

    quotes: () => quotes,

    iquote: (_, { by }) => quotes.filter((q) => q.by == by),
  },
  User: {
    quotes: (ur) => quotes.filter((qt) => qt.by == ur.id),
  },

  Mutation: {
    signUpUser: (_, { userNew }) => {
      const id = randomBytes(5).toString("hex");
      users.push({
        id,
        ...userNew,
      });
      return users.find((user) => user.id == id);
    },
  },
};

export default resolvers;
