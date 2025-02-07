import loginRoute from "./loginRoutes.js";
import refreshTokenRoute from "./refreshTokenRoutes.js";
import registerRoutes from "./registerRoutes.js";
import jobRoutes from "./jobRoutes.js";
import userRoutes from "./userRoutes.js";
import checkUsernameRoutes from "./checkUsernameRoutes.js";
import feedbackRoutes from "./feedbackRoutes.js";
import forgotPasswordRoutes from "./forgotPasswordRoutes.js";
import scheduleRoutes from "./scheduleRoutes.js";

function routes(app) {
  app.use("/login", loginRoute);
  app.use("/refresh-token", refreshTokenRoute);
  app.use("/register", registerRoutes);
  app.use("/job", jobRoutes);
  app.use("/me", userRoutes);
  app.use("/check-username", checkUsernameRoutes);
  app.use("/feedback", feedbackRoutes);
  app.use("/forgot-password", forgotPasswordRoutes);
  app.use("/schedule", scheduleRoutes);
}

export default routes;
