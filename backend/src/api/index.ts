import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { cors } from 'hono/cors'
import { client, graphql } from "ponder";

const app = new Hono();

app.use('*', cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://localhost:3000',
    'https://127.0.0.1:3000'
  ],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: [
    'Content-Type',
    'Authorization',
    'Apollo-Require-Preflight',
    'Accept',
    'apollo-require-preflight',
    'Apollo-Federation-Include-Trace',
    'graphql-introspection',
    'X-Apollo-Operation-Name',
    'X-Apollo-Operation-Id'
  ],
  exposeHeaders: [
    'Apollo-Server-Version',
    'Apollo-Federation-Include-Trace'
  ],
  credentials: true,
  maxAge: 86400,
}));

app.use("/sql/*", client({ db, schema }));

app.use("/", graphql({ db, schema }));
app.use("/graphql", graphql({ db, schema }));

export default app;
