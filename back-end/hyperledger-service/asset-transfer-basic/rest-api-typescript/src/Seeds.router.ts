

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Contract } from 'fabric-network';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { Queue } from 'bullmq';
import { SeedNotFoundError } from './errors';
import { evatuateTransaction } from './fabric';
import { addSubmitTransactionJob } from './jobs';
import { logger } from './logger';

const { ACCEPTED, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } =
    StatusCodes;

export const SeedsRouter = express.Router();

SeedsRouter.get('/', async (req: Request, res: Response) => {
    logger.debug('Get all Seeds request received');
    try {
        const mspId = req.user as string;
        const contract = req.app.locals[mspId]?.SeedContract as Contract;

        const data = await evatuateTransaction(contract, 'GetAllSeeds');
        let Seeds = [];
        if (data.length > 0) {
            Seeds = JSON.parse(data.toString());
        }

        return res.status(OK).json(Seeds);
    } catch (err) {
        logger.error({ err }, 'Error processing get all Seeds request');
        return res.status(INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(INTERNAL_SERVER_ERROR),
            timestamp: new Date().toISOString(),
        });
    }
});

SeedsRouter.post(
    '/',
    body().isObject().withMessage('body must contain an Seed object'),
    body('farmerId', 'must be a string').notEmpty(),
    body('SeedType', 'must be a string').notEmpty(),
    body('quantity', 'must be a number').isNumeric(),
    body('pricePerUnit', 'must be a string').notEmpty(),
    body('location', 'must be a number').isNumeric(),
    async (req: Request, res: Response) => {
        logger.debug(req.body, 'Create Seed request received');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({
                status: getReasonPhrase(BAD_REQUEST),
                reason: 'VALIDATION_ERROR',
                message: 'Invalid request body',
                timestamp: new Date().toISOString(),
                errors: errors.array(),
            });
        }

        const mspId = req.user as string;
        const SeedId = req.body.ID;

        try {
            const submitQueue = req.app.locals.jobq as Queue;
            const jobId = await addSubmitTransactionJob(
                submitQueue,
                mspId,
                'CreateSeed',
                SeedId,
                req.body.SeedType,
                req.body.quantity,
                req.body.pricePerUnit,
                req.body.location
            );

            return res.status(ACCEPTED).json({
                status: getReasonPhrase(ACCEPTED),
                jobId: jobId,
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            logger.error(
                { err },
                'Error processing create Seed request for Seed ID %s',
                SeedId
            );

            return res.status(INTERNAL_SERVER_ERROR).json({
                status: getReasonPhrase(INTERNAL_SERVER_ERROR),
                timestamp: new Date().toISOString(),
            });
        }
    }
);

SeedsRouter.options('/:SeedId', async (req: Request, res: Response) => {
    const SeedId = req.params.SeedId;
    logger.debug('Seed options request received for Seed ID %s', SeedId);

    try {
        const mspId = req.user as string;
        const contract = req.app.locals[mspId]?.SeedContract as Contract;

        const data = await evatuateTransaction(
            contract,
            'SeedExists',
            SeedId
        );
        const exists = data.toString() === 'true';

        if (exists) {
            return res
                .status(OK)
                .set({
                    Allow: 'DELETE,GET,OPTIONS,PATCH,PUT',
                })
                .json({
                    status: getReasonPhrase(OK),
                    timestamp: new Date().toISOString(),
                });
        } else {
            return res.status(NOT_FOUND).json({
                status: getReasonPhrase(NOT_FOUND),
                timestamp: new Date().toISOString(),
            });
        }
    } catch (err) {
        logger.error(
            { err },
            'Error processing Seed options request for Seed ID %s',
            SeedId
        );
        return res.status(INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(INTERNAL_SERVER_ERROR),
            timestamp: new Date().toISOString(),
        });
    }
});

SeedsRouter.get('/:SeedId', async (req: Request, res: Response) => {
    const SeedId = req.params.SeedId;
    logger.debug('Read Seed request received for Seed ID %s', SeedId);

    try {
        const mspId = req.user as string;
        const contract = req.app.locals[mspId]?.SeedContract as Contract;

        const data = await evatuateTransaction(contract, 'ReadSeed', SeedId);
        const Seed = JSON.parse(data.toString());

        return res.status(OK).json(Seed);
    } catch (err) {
        logger.error(
            { err },
            'Error processing read Seed request for Seed ID %s',
            SeedId
        );

        if (err instanceof SeedNotFoundError) {
            return res.status(NOT_FOUND).json({
                status: getReasonPhrase(NOT_FOUND),
                timestamp: new Date().toISOString(),
            });
        }

        return res.status(INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(INTERNAL_SERVER_ERROR),
            timestamp: new Date().toISOString(),
        });
    }
});

SeedsRouter.put(
    '/:SeedId',
    body().isObject().withMessage('body must contain an Seed object'),
    body('ID', 'must be a string').notEmpty(),
    body('Color', 'must be a string').notEmpty(),
    body('Size', 'must be a number').isNumeric(),
    body('Owner', 'must be a string').notEmpty(),
    body('AppraisedValue', 'must be a number').isNumeric(),
    async (req: Request, res: Response) => {
        logger.debug(req.body, 'Update Seed request received');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({
                status: getReasonPhrase(BAD_REQUEST),
                reason: 'VALIDATION_ERROR',
                message: 'Invalid request body',
                timestamp: new Date().toISOString(),
                errors: errors.array(),
            });
        }

        if (req.params.SeedId != req.body.ID) {
            return res.status(BAD_REQUEST).json({
                status: getReasonPhrase(BAD_REQUEST),
                reason: 'Seed_ID_MISMATCH',
                message: 'Seed IDs must match',
                timestamp: new Date().toISOString(),
            });
        }

        const mspId = req.user as string;
        const SeedId = req.params.SeedId;

        try {
            const submitQueue = req.app.locals.jobq as Queue;
            const jobId = await addSubmitTransactionJob(
                submitQueue,
                mspId,
                'UpdateSeed',
                SeedId,
                req.body.color,
                req.body.size,
                req.body.owner,
                req.body.appraisedValue
            );

            return res.status(ACCEPTED).json({
                status: getReasonPhrase(ACCEPTED),
                jobId: jobId,
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            logger.error(
                { err },
                'Error processing update Seed request for Seed ID %s',
                SeedId
            );

            return res.status(INTERNAL_SERVER_ERROR).json({
                status: getReasonPhrase(INTERNAL_SERVER_ERROR),
                timestamp: new Date().toISOString(),
            });
        }
    }
);

SeedsRouter.patch(
    '/:SeedId',
    body()
        .isArray({
            min: 1,
            max: 1,
        })
        .withMessage(
            'body must contain an array with a single patch operation'
        ),
    body('*.op', "operation must be 'replace'").equals('replace'),
    body('*.path', "path must be '/Owner'").equals('/Owner'),
    body('*.value', 'must be a string').isString(),
    async (req: Request, res: Response) => {
        logger.debug(req.body, 'Transfer Seed request received');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({
                status: getReasonPhrase(BAD_REQUEST),
                reason: 'VALIDATION_ERROR',
                message: 'Invalid request body',
                timestamp: new Date().toISOString(),
                errors: errors.array(),
            });
        }

        const mspId = req.user as string;
        const SeedId = req.params.SeedId;
        const newOwner = req.body[0].value;

        try {
            const submitQueue = req.app.locals.jobq as Queue;
            const jobId = await addSubmitTransactionJob(
                submitQueue,
                mspId,
                'TransferSeed',
                SeedId,
                newOwner
            );

            return res.status(ACCEPTED).json({
                status: getReasonPhrase(ACCEPTED),
                jobId: jobId,
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            logger.error(
                { err },
                'Error processing update Seed request for Seed ID %s',
                req.params.SeedId
            );

            return res.status(INTERNAL_SERVER_ERROR).json({
                status: getReasonPhrase(INTERNAL_SERVER_ERROR),
                timestamp: new Date().toISOString(),
            });
        }
    }
);

SeedsRouter.delete('/:SeedId', async (req: Request, res: Response) => {
    logger.debug(req.body, 'Delete Seed request received');

    const mspId = req.user as string;
    const SeedId = req.params.SeedId;

    try {
        const submitQueue = req.app.locals.jobq as Queue;
        const jobId = await addSubmitTransactionJob(
            submitQueue,
            mspId,
            'DeleteSeed',
            SeedId
        );

        return res.status(ACCEPTED).json({
            status: getReasonPhrase(ACCEPTED),
            jobId: jobId,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        logger.error(
            { err },
            'Error processing delete Seed request for Seed ID %s',
            SeedId
        );

        return res.status(INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(INTERNAL_SERVER_ERROR),
            timestamp: new Date().toISOString(),
        });
    }
});
