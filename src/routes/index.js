import loginRoute from "./loginRoutes.js";
import refreshTokenRoute from "./refreshTokenRoutes.js";
import registerRoutes from "./registerRoutes.js";
import jobRoutes from "./jobRoutes.js";
import userRoutes from "./userRoutes.js";

function routes(app) {
  app.use("/login", loginRoute);
  app.use("/refresh_token", refreshTokenRoute);
  app.use("/register", registerRoutes);
  app.use("/job", jobRoutes);
  app.use("/me", userRoutes);
}

export default routes;
