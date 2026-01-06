import { Router } from "express";

import { contentRouter } from "./contentRoutes.js";
import { themeRouter } from "./themeRoutes.js";
import { agentRouter } from "./agentRoutes.js";
import { chatRouter } from "./chatRoutes.js";
import { sceneRouter } from "./sceneRoutes.js";
import { worldRouter } from "./worldRoutes.js";

export const apiRouter = Router();

apiRouter.use(contentRouter);
apiRouter.use(themeRouter);
apiRouter.use(agentRouter);
apiRouter.use(chatRouter);
apiRouter.use(sceneRouter);
apiRouter.use(worldRouter);
