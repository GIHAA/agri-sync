import express, { Request, Response } from 'express';
import { Contract } from 'fabric-network';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { getBlockHeight } from './fabric';
import { getJobCounts } from './JobsCouchDB';
import { logger } from './logger';
import * as config from './config';

const { SERVICE_UNAVAILABLE, OK } = StatusCodes;

export const healthCouchDBRouter = express.Router();

/**
 * Readiness endpoint: Always returns 200 OK.
 */
healthCouchDBRouter.get('/ready', (_req, res: Response) =>
    res.status(OK).json({
        status: getReasonPhrase(OK),
        timestamp: new Date().toISOString(),
    })
);

/**
 * Liveness endpoint: Checks the health of Fabric and CouchDB.
 */
healthCouchDBRouter.get('/live', async (req: Request, res: Response) => {
    logger.debug(req.body, 'Liveness request received');

    try {
        const qsccOrg1 = req.app.locals[config.mspIdOrg1]
            ?.qsccContract as Contract;
        const qsccOrg2 = req.app.locals[config.mspIdOrg2]
            ?.qsccContract as Contract;
        const SeedContract = req.app.locals.SeedContract as Contract;

        if (!qsccOrg1 || !qsccOrg2 || !SeedContract) {
            throw new Error(
                'Required contracts not available in application locals'
            );
        }

        // Check block height for both organizations and job counts from CouchDB.
        await Promise.all([
            getBlockHeight(qsccOrg1),
            getBlockHeight(qsccOrg2),
            getJobCounts(SeedContract),
        ]);
    } catch (err) {
        logger.error({ err }, 'Error processing liveness request');

        return res.status(SERVICE_UNAVAILABLE).json({
            status: getReasonPhrase(SERVICE_UNAVAILABLE),
            timestamp: new Date().toISOString(),
        });
    }

    return res.status(OK).json({
        status: getReasonPhrase(OK),
        timestamp: new Date().toISOString(),
    });
});
