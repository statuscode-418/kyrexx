import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { cors } from 'hono/cors'
import { client, graphql } from "ponder";

const app = new Hono();

app.use('*', cors({
  origin: ['localhost:3000', '127.0.0.1:3000', 'http://localhost:3000', 'http://127.0.0.1:3000'],
  allowMethods: ['HEAD', 'GET', 'POST', 'OPTIONS'], // GraphQL typically only needs GET and POST
  allowHeaders: [
    'Content-Type',
    'Authorization',
    'Apollo-Require-Preflight', // Required for Apollo Client
    'Accept',
    'graphql-introspection' // For schema introspection queries
  ],
  exposeHeaders: ['Apollo-Server-Version'], // Expose GraphQL-specific headers
  credentials: true,
  maxAge: 3600 // Cache preflight requests for 1 hour
}));

app.use("/sql/*", client({ db, schema }));

app.use("/", graphql({ db, schema }));
app.use("/graphql", graphql({ db, schema }));

export default app;
