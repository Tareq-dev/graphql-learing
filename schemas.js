import { gql } from "apollo-server-core";

const typeDefs = gql`
  type Query {
    users: [User]
    student(id: ID!): Student
    enrolledStudent: [EnrolledStudent]

    ################## ADMIM ######################

    releaseAssignment: [ReleasingAssigment]
  }

  type User {
    id: ID!
    name: String
    email: String
    role: String
  }

  type Token {
    token: String
  }

  type Student {
    id: ID!
    name: String!
    email: String!
    phone_no: String!
  }
  type EnrolledStudent {
    id: ID!
    name: String!
    email: String!
    phone_no: String!
    payment_fee: String!
    payment_date: String!
    transaction_id: String!
  }
  ################## ADMIM ######################

  type ReleasingAssigment {
    title: String
    requirement: String
    note: String
  }

  type Mutation {
    signUpUser(userNew: UserInput): User
    signInUser(userSignIn: UserSignInInput!): Token
    enrollStudentData(enroll: StudentInput!): EnrolledStudent

    ################## ADMIM ######################
    releaseAssignmentData(release: ReleaseInputAssigment): ReleasingAssigment
  }

  ################## ADMIM ######################

  input ReleaseInputAssigment {
    title: String
    requirement: String
    note: String
  }
  input StudentInput {
    name: String!
    email: String!
    phone_no: String!
    payment_fee: String!
    payment_date: String!
    transaction_id: String!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
  }
  input UserSignInInput {
    email: String!
    password: String!
  }
`;

export default typeDefs;
