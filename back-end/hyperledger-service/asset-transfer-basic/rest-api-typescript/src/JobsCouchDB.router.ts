import express, { Request, Response } from 'express';
import { Contract } from 'fabric-network';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { getJobSummary, JobNotFoundError } from './JobsCouchDB';
import { logger } from './logger';

const { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } = StatusCodes;

export const JobsCouchDBRouter = express.Router();

JobsCouchDBRouter.get('/:jobId', async (req: Request, res: Response) => {
    const jobId = req.params.jobId;
    logger.debug('Read request received for job ID %s', jobId);

    try {
        const contract = req.app.locals.SeedContract as Contract;

        if (!contract) {
            throw new Error('Contract not found in application locals');
        }

        const jobSummary = await getJobSummary(contract, jobId);

        return res.status(OK).json(jobSummary);
    } catch (err) {
        logger.error(
            { err },
            'Error processing read request for job ID %s',
            jobId
        );

        if (err instanceof JobNotFoundError) {
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
