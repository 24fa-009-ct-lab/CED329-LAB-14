
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');

const app = express();

app.use(cors());

// Sample Product Data
let products = [
  { id: 1, name: 'Laptop', price: 120000 },
  { id: 2, name: 'Mouse', price: 1500 },
  { id: 3, name: 'Keyboard', price: 3500 }
];

// GraphQL Schema
const schema = buildSchema(`
  type Product {
    id: Int
    name: String
    price: Float
  }

  type Query {
    products: [Product]
  }

  type Mutation {
    addProduct(name: String, price: Float): Product
  }
`);

// Resolvers
const root = {
  products: () => products,

  addProduct: ({ name, price }) => {
    const newProduct = {
      id: products.length + 1,
      name,
      price
    };

    products.push(newProduct);
    return newProduct;
  }
};

// GraphQL Server
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

// Start Server
app.listen(5000, () => {
  console.log('GraphQL API running on http://localhost:5000/graphql');
});
