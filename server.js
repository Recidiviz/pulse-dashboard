require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const morgan = require('morgan');
const helmet = require('helmet');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const devAuthConfig = require('./src/auth_config_dev.json');
const productionAuthConfig = require('./src/auth_config_production.json');
const api = require('./server/routes/api');

const app = express();

app.use(cors());

const port = process.env.PORT || 3001;
app.set('port', port);

const authEnv = process.env.AUTH_ENV;
let authConfig = null;
if (authEnv === 'production') {
  authConfig = productionAuthConfig;
} else {
  authConfig = devAuthConfig;
}

if (!authConfig.domain || !authConfig.audience) {
  throw new Error(
    'Please make sure that auth_config.json is in place and populated',
  );
}

app.use(morgan('dev'));
app.use(helmet());

if (app.get('env') === 'production') {
  // This is required to avoid "Unable to verify authorization request state" with Auth0
  app.set('trust proxy', true);
}

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ['RS256'],
});

app.get('/api/programEval', checkJwt, api.programEval);
app.get('/api/reincarcerations', checkJwt, api.reincarcerations);
app.get('/api/revocations', checkJwt, api.revocations);
app.get('/api/snapshots', checkJwt, api.snapshots);

const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}

server.listen(port, () => console.log(`Server listening on port ${port}`));
server.on('error', onError);
server.on('listening', onListening);
