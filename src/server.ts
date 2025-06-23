import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import authUsersRouter from '@expressRoutes/users/users.route'
import clientsRouter from '@expressRoutes/clients/clients.route'
import doctorsRouter from '@expressRoutes/doctors/doctors.route'
import medicinesRouter from '@expressRoutes/medicines/medicines.route'
import express from 'express';
import { join } from 'node:path';
import {authMiddleware} from '@expressMiddleware/auth/auth.middleware';

const browserDistFolder = join(import.meta.dirname, '../public');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api', authUsersRouter );
app.use('/api/clients', authMiddleware, clientsRouter);
app.use('/api/doctors', authMiddleware, doctorsRouter);
app.use('/api/medicines', authMiddleware, medicinesRouter);


/**
 * Serve static files from /public
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
