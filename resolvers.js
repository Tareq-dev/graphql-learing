import { db } from "./config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { v4 } from "uuid";

const resolvers = {
  Query: {
    // GET USER DATA
    users: async () => {
      const [rows] = await db.promise().query("SELECT * FROM registration");
      return rows;
    },

    // GET ENROLLED STUDENT DATA
    enrolledStudent: async () => {
      const [rows] = await db.promise().query("SELECT * FROM enrolledstudent");
      return rows;
    },
    //for single user queries by id
    student: async (_, { id }) => {
      const [rows] = await db.promise().query("SELECT * FROM enrolledstudent");
      const student = rows.find((student) => student.id == id);
      return student;
    },
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
    enrollStudentData: (_, { enroll }, { userId }) => {
      // CHECK FOR EXISTING USER
      if (!userId) {
        throw new Error("You must be logged in");
      }
      const q = "SELECT * FROM registration WHERE email = ?";
      const enrolled_q = "SELECT * FROM enrolledstudent WHERE email = ?";

      db.query(enrolled_q, [enroll.email], (error, data) => {
        // Check Already enrolled ??

        if (data.length) {
          throw new Error("Already Enrolled");
        } else {
          // New? User can enrolled

          db.query(q, [enroll.email], (error, data) => {
            //Get id to match

            const id = data[0].id;

            const q =
              "INSERT INTO enrolledstudent (id, email, name, phone_no, payment_fee ,payment_date,transaction_id) VALUES (?)";
            const values = [
              id,
              enroll?.email,
              enroll?.name,
              enroll.phone_no,
              enroll.payment_fee,
              enroll.payment_date,
              enroll.transaction_id,
            ];
            db.query(q, [values], (error, data) => {
              if (error) {
                throw new Error({ error });
              }
              if (data) {
                const newRole = "student";

                const updateQuery =
                  "UPDATE registration SET role = ? WHERE email = ?";
                db.query(
                  updateQuery,
                  [newRole, enroll.email],
                  (updateResult) => {
                    console.log("Role updated successfully");
                    console.log("Enrolled successfully");
                  }
                );
              }
            });
          });
        }
      });
    },
    releaseAssignmentData: (_, { release }) => {
      console.log(release);
    },
  },
};

export default resolvers;
