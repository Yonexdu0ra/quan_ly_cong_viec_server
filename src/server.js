import express from "express";
import cors from "cors";
import sequelize from "./config/database.js";


import routes from "./routes/index.js";

const port = process.env.PORT || 3002;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
routes(app);


(async () => {
  try {
    await sequelize.authenticate();
    console.log("Ket noi toi database thanh cong");

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    })

  } catch (error) {
    console.log(error);
    return
    
  }
})()

// const httpServer = http.createServer(app);

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
//   formatError: (err) => {
//     return {
//       status: "error",
//       data: null,
//       message: err.message || "Internal Server Error",
//     };
//   },
//   // formatResponse: (response, { context }) => {
//   //   // Định dạng phản hồi thành công
//   //   return {
//   //     status: "success",
//   //     data: response.data || null,
//   //     message: "Request processed successfully",
//   //   };
//   // }
// });

// (async function () {
//   try {
//     await sequelize.authenticate();

//     console.log("connect db successfully");
//     // await sequelize.sync({ force: true });
//     // console.log("Reset all tables successfully");
//     // const newUsers = await User.create({
//     //   fullname: "admin",
//     // });

//     // const newAccount = await Account.create({
//     //   username: "admin",
//     //   userId: newUsers.id,
//     //   password: "123456",

//     // });
//     // console.log(newAccount.dataValues);
//     await server.start();

//     app.use(authentication);
//     app.use(
//       "/graphql",
//       expressMiddleware(server, {
//         context: async ({ req }) => {
//           return {
//             userId: req.userId,
//           };
//         },
//       })
//     );

//     httpServer.listen({ port }, () => {
//       console.log(`Server ready at http://localhost:${port}`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// })();
