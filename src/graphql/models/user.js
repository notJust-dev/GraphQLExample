import { ObjectId } from 'mongodb';

export const typeDef = /* GraphQL */ `
  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(user: NewUserInput!): User
    deleteUser(id: ID!): Boolean
    updateUser(id: ID!, update: UpdateUserInput): User
  }

  input NewUserInput {
    name: String!
    email: String!
  }

  input UpdateUserInput {
    name: String!
  }

  type User {
    id: ID!
    name: String
    email: String

    comments: [Comment]
  }
`;

export const resolvers = {
  Query: {
    users: (obj, args, { mongo }) => {
      return mongo.users.find().limit(20).toArray();
    },

    user: async (obj, { id }, { mongo }) => {
      return mongo.users.findOne({ _id: new ObjectId(id) });
    },
  },

  Mutation: {
    createUser: async (_, { user }, { mongo }) => {
      const response = await mongo.users.insertOne(user);
      return {
        id: response.insertedId,
        ...user,
      };
    },
    deleteUser: async (obj, { id }, { mongo }) => {
      await mongo.users.deleteOne({ _id: new ObjectId(id) });
      return true;
    },
    updateUser: async (obj, { id, update }, { mongo }) => {
      console.log(update);
      const response = await mongo.users.updateOne(
        { _id: new ObjectId(id) },
        { $set: { name: update.name } }
      );
      return mongo.users.findOne({ _id: new ObjectId(id) });
    },
  },

  User: {
    id: ({ id, _id }) => _id || id,
    name: (obj) => {
      return obj.name.trim().toUpperCase();
    },
    comments: ({ email }, args, { mongo }) => {
      return mongo.comments.find({ email }).limit(20).toArray();
    },
  },
};
