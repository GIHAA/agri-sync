import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import passport from 'passport';
import pinoMiddleware from 'pino-http';
import { SeedsRouter } from './Seeds.router';
import { authenticateApiKey, fabricAPIKeyStrategy } from './auth';
import { healthRouter } from './health.router';
import { jobsRouter } from './jobs.router';
import { logger } from './logger';
import { transactionsRouter } from './transactions.router';
import cors from 'cors';

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = StatusCodes;

// export const createServer = async (): Promise<Application> => {
//     const app = express();

//     app.use(
//         pinoMiddleware({
//             logger,
//             customLogLevel: function customLogLevel(res, err) {
//                 if (
//                     res.statusCode >= BAD_REQUEST &&
//                     res.statusCode < INTERNAL_SERVER_ERROR
//                 ) {
//                     return 'warn';
//                 }

//                 if (res.statusCode >= INTERNAL_SERVER_ERROR || err) {
//                     return 'error';
//                 }

//                 return 'debug';
//             },
//         })
//     );

//     app.use(express.json());
//     app.use(express.urlencoded({ extended: true }));

//     // define passport startegy
//     passport.use(fabricAPIKeyStrategy);

//     // initialize passport js
//     app.use(passport.initialize());

//     app.use(cors({
//         origin: 'http://localhost:5173',
//         methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//         allowedHeaders: ['Content-Type', 'Authorization', 'X-Api-Key'],
//     }));

//     app.options('*', cors());

//     if (process.env.NODE_ENV === 'test') {
//         // TBC
//     }

//     if (process.env.NODE_ENV === 'production') {
//         app.use(helmet());
//     }

//     app.use('/', healthRouter);
//     app.use('/api/Seeds', authenticateApiKey, SeedsRouter);
//     app.use('/api/jobs', authenticateApiKey, jobsRouter);
//     app.use('/api/transactions', authenticateApiKey, transactionsRouter);

//     // For everything else
//     app.use((_req, res) =>
//         res.status(NOT_FOUND).json({
//             status: getReasonPhrase(NOT_FOUND),
//             timestamp: new Date().toISOString(),
//         })
//     );

//     // Print API errors
//     app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
//         logger.error(err);
//         return res.status(INTERNAL_SERVER_ERROR).json({
//             status: getReasonPhrase(INTERNAL_SERVER_ERROR),
//             timestamp: new Date().toISOString(),
//         });
//     });

//     return app;
// };


// export const createServer = async (): Promise<Application> => {
//     const app = express();

//     app.use(
//         pinoMiddleware({
//             logger,
//             customLogLevel: function customLogLevel(res, err) {
//                 if (
//                     res.statusCode >= BAD_REQUEST &&
//                     res.statusCode < INTERNAL_SERVER_ERROR
//                 ) {
//                     return 'warn';
//                 }

//                 if (res.statusCode >= INTERNAL_SERVER_ERROR || err) {
//                     return 'error';
//                 }

//                 return 'debug';
//             },
//         })
//     );

//     app.use(express.json());
//     app.use(express.urlencoded({ extended: true }));

//     passport.use(fabricAPIKeyStrategy);

//     app.use(passport.initialize());

//     const allowedOrigins = ['http://localhost:5173'];
//     app.use(cors({
//         origin: (origin, callback) => {
//             if (!origin || allowedOrigins.includes(origin)) {
//                 callback(null, true);
//             } else {
//                 callback(new Error('Not allowed by CORS'));
//             }
//         },
//         methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//         allowedHeaders: ['Content-Type'],
//     }));

//     app.options('*', cors());

//     if (process.env.NODE_ENV === 'production') {
//         app.use(helmet());
//     }

//     app.use('/', healthRouter);
//     app.use('/api/seeds', SeedsRouter);
//     app.use('/api/jobs', authenticateApiKey, jobsRouter);
//     app.use('/api/transactions', authenticateApiKey, transactionsRouter);

//     // Handle 404 errors
//     app.use((_req, res) =>
//         res.status(NOT_FOUND).json({
//             status: getReasonPhrase(NOT_FOUND),
//             timestamp: new Date().toISOString(),
//         })
//     );

//     // Custom error handler
//     app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//         res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
//         res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//         res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Api-Key');

//         logger.error(err);
//         res.status(INTERNAL_SERVER_ERROR).json({
//             status: getReasonPhrase(INTERNAL_SERVER_ERROR),
//             timestamp: new Date().toISOString(),
//             message: err.message,
//         });
//     });

//     return app;
// };



export const createServer = async (): Promise<Application> => {
    const app = express();

    app.use(
        pinoMiddleware({
            logger,
            customLogLevel: function customLogLevel(res, err) {
                if (
                    res.statusCode >= BAD_REQUEST &&
                    res.statusCode < INTERNAL_SERVER_ERROR
                ) {
                    return 'warn';
                }
                if (res.statusCode >= INTERNAL_SERVER_ERROR || err) {
                    return 'error';
                }
                return 'debug';
            },
        })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    passport.use(fabricAPIKeyStrategy);
    app.use(passport.initialize());

    const allowedOrigins = ['http://localhost:5173'];
    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type'],
    }));


    app.options('*', cors());

    if (process.env.NODE_ENV === 'production') {
        app.use(helmet());
    }

    app.use('/', healthRouter);
    app.use('/api/seeds', SeedsRouter);
    app.use('/api/jobs', authenticateApiKey, jobsRouter);
    app.use('/api/transactions', authenticateApiKey, transactionsRouter);

    app.use((_req, res) =>
        res.status(NOT_FOUND).json({
            status: getReasonPhrase(NOT_FOUND),
            timestamp: new Date().toISOString(),
        })
    );

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Api-Key');

        logger.error(err);

        res.status(INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(INTERNAL_SERVER_ERROR),
            timestamp: new Date().toISOString(),
            message: err.message,
        });
    });

    return app;
};
