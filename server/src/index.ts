// import 'reflect-metadata';
// import express from 'express';
// import { ApolloServer } from 'apollo-server-express';
// import { buildSchema } from 'type-graphql';
// import { connectDB } from './utils/db';
// import { ProductResolver } from './resolvers/ProductResolver';
// import cors from 'cors';
// import s3Routes from './routes/s3';
// import { AuthResolver } from './resolvers/AuthResolver';
// import { PaymentResolver } from './resolvers/PaymentResolver';
// import { OrderResolver } from './resolvers/OrderResolver';
// import { CartResolver } from './resolvers/CartResolver';
// import jwt from 'jsonwebtoken';
// import { fileURLToPath } from "url";
// import path from "path";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// async function bootstrap() {
//     await connectDB();

//     const schema = await buildSchema({
//         resolvers: [AuthResolver, ProductResolver, CartResolver, PaymentResolver, OrderResolver],
//     });

//     const server = new ApolloServer({
//         schema,
//         context: ({ req, res }) => {
//             const authHeader = req.headers.authorization || "";
//             let user = null;

//             if (authHeader.startsWith("Bearer ")) {
//                 const token = authHeader.split(" ")[1];
//                 try {
//                     const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
//                     user = { userId: decoded.userId };
//                 } catch (err) {
//                     console.error("JWT verification failed:", err);
//                 }
//             }

//             return { req, res, user }; // ✅ now ctx.user is available
//         },
//     });
//     await server.start();

//     const app = express();
//     app.use(cors());
//     app.use(express.json()); // Needed for JSON parsing
//     app.use(s3Routes); // Handle S3 presigned requests

//     server.applyMiddleware({ app }); // 👈 Integrate Apollo with Express
//     // Serve React frontend
//     app.use(express.static(path.join(__dirname, "ecommerce-app", "dist")));
//     app.get("*", (_, res) => {
//         res.sendFile(path.join(__dirname, "ecommerce-app", "dist", "index.html"));
//     });
//     const PORT = process.env.PORT || 8080;
//     app.listen(PORT, () => {
//         console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
//     });
// }

// export default bootstrap();

import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { connectDB } from './utils/db.js';
import { ProductResolver } from './resolvers/ProductResolver.js';
import { AuthResolver } from './resolvers/AuthResolver.js';
import { PaymentResolver } from './resolvers/PaymentResolver.js';
import { OrderResolver } from './resolvers/OrderResolver.js';
import { CartResolver } from './resolvers/CartResolver.js';
import cors from 'cors';
import s3Routes from './routes/s3.js';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bootstrap() {
    // Connect to MongoDB
    await connectDB();

    // Build GraphQL schema
    const schema = await buildSchema({
        resolvers: [
            AuthResolver,
            ProductResolver,
            CartResolver,
            PaymentResolver,
            OrderResolver
        ],
    });

    // Create Apollo Server
    const server = new ApolloServer({
        schema,
        context: ({ req, res }) => {
            const authHeader = req.headers.authorization || '';
            let user = null;

            if (authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                try {
                    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
                    user = { userId: decoded.userId };
                } catch (err) {
                    console.error('JWT verification failed:', err);
                }
            }

            return { req, res, user };
        },
    });

    await server.start();

    // Create Express app
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(s3Routes);

    server.applyMiddleware({ app });

    // Serve React frontend
    app.use(express.static(path.join(__dirname, '../ecommerce-app/dist')));
    app.get('*', (_, res) => {
        res.sendFile(path.join(__dirname, '../ecommerce-app/dist/index.html'));
    });

    // Start server
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
}

// Run server
bootstrap().catch(err => {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
});

