import * as bodyParser from 'body-parser';
import cookieParser = require('cookie-parser');
import * as debug from 'debug';
import * as express from 'express';
import * as passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';

import config from './configuration';
import { middleware } from './security';
import { requestLog } from './utils';
import { GitHubRoutes } from './routes/github';

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        passport.serializeUser((user, done) => {
            return done(null, user);
        });
        passport.deserializeUser((user, done) => {
            return done(null, user);
        });
        passport.use(this.github());
        this.middleware();
        this.express.use('/', this.routes());
    }

    // Configure Express middleware.
    private middleware() {
        this.express.use(requestLog);
        this.express.use(bodyParser.json());
        this.express.use(cookieParser());
        this.express.use(middleware());
        this.express.use(passport.initialize());
        this.express.use(passport.session());
    }

    // Configure Passport to authenticate using GitHub.
    private github() {
        const options = {
            callbackURL: '/auth/github/callback',
            clientID: config.githubClientId,
            clientSecret: config.githubSecret,
        };
        const callback = (accessToken: string, refreshToken: string, profile: passport.Profile, done: Function) => {
            debug('auth')('Processing incoming OAuth 2 tokens');
            const user = {
                accessToken: accessToken,
                displayName: profile.displayName,
                id: profile.id,
                username: profile.username,
            };
            return done(null, user);
        };
        return new GitHubStrategy(options, callback);
    } 

    // Configure API endpoints.
    private routes() {
        const router = express.Router();

        GitHubRoutes.create(router);

        // placeholder route handler
        router.get('/', (req, res, next) => {
            const { user } = req;
            const { displayName, username } = user;
            res.json({ message: 'Hello World!', user: { displayName, username } });
        });

        return router;
    }

}

export default new App().express;