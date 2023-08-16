import { users, quotes } from "./fakeDb.js";
import { db } from "./config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

      // CHECK FOR EXISTING USER
      const q = "SELECT * FROM registration WHERE email = ?";

      db.query(q, [userNew.email], (error, data) => {
        if (data.length) {
          console.log("User already exists!");
        } else {
          // Hash the password and create a user
          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(userNew.password, salt);

          //Not Exist then store to the database

          const q =
            "INSERT INTO registration (id, email, name, password) VALUES (?)";
          const values = [id, userNew.email, userNew.name, hashedPassword];
          db.query(q, [values], (error, data) => {
            if (error) {
              throw new Error({ error });
            }
            if (data) {
              console.log("User created successfully");
            }

            // const query = "SELECT * FROM registration WHERE id = ?";

            // db.query(query, [data.insertedId], (error, signInData) => {
            //   if (error) {
            //     console.error("Error occurred:", error);
            //   }
            //   console.log('sign',signInData);
            //   // const token = jwt.sign({ id: signInData[0].id }, "jwtkey");
            //   // const { password, ...rest } = signInData[0];
            // });
          });
        }
      });
      // users.push({
      //   id,
      //   ...userNew,
      // });
      // return users.find((user) => user.id == id);
    },
    signInUser: async (_, { userSignIn }) => {
      const q = "SELECT * FROM registration WHERE email = ?";

      try {
        const [rows] = await db.promise().query(q, [userSignIn.email]);

        if (rows.length === 0) {
          console.log("User does not exist");
          return null;
        }

        const user = rows[0];
        const doMatch = bcrypt.compareSync(userSignIn.password, user.password); 
        

        if (!doMatch) {
          console.log("Invalid email and password");
          return null;
        }

        const token = jwt.sign({ userId: user.id }, process.env.jwtSecret);
        return { token };
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },
  },
};

export default resolvers;
