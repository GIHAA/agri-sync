import { Application } from 'express';
import { Contract, Transaction } from 'fabric-network';
//import * as config from './config';
import { getRetryAction, RetryAction } from './errors';
import { submitTransaction } from './fabric';
import { logger } from './logger';

export type JobData = {
    status: string;
    mspid: string;
    transactionName: string;
    transactionArgs: string[];
    transactionState?: Buffer;
    transactionIds: string[];
};

export type JobResult = {
    transactionPayload?: Buffer;
    transactionError?: string;
};

export type JobSummary = {
    jobId: string;
    transactionIds: string[];
    transactionPayload?: string;
    transactionError?: string;
};

export class JobNotFoundError extends Error {
    jobId: string;

    constructor(message: string, jobId: string) {
        super(message);
        Object.setPrototypeOf(this, JobNotFoundError.prototype);

        this.name = 'JobNotFoundError';
        this.jobId = jobId;
    }
}

/**
 * Add a new job to Fabric state database
 */
export const addSubmitTransactionJob = async (
    contract: Contract,
    jobId: string,
    mspid: string,
    transactionName: string,
    ...transactionArgs: string[]
): Promise<void> => {
    const jobData: JobData = {
        mspid,
        transactionName,
        transactionArgs,
        transactionIds: [],
        status: '',
    };

    await contract.submitTransaction(
        'CreateJob',
        jobId,
        JSON.stringify(jobData)
    );
};

/**
 * Helper to update the data for an existing job
 */
export const updateJobData = async (
    contract: Contract,
    jobId: string,
    transaction: Transaction | undefined
): Promise<void> => {
    const jobDataJSON = await contract.evaluateTransaction('GetJob', jobId);
    const jobData = JSON.parse(jobDataJSON.toString()) as JobData;

    if (transaction) {
        jobData.transactionIds.push(transaction.getTransactionId());
        jobData.transactionState = transaction.serialize();
    } else {
        jobData.transactionState = undefined;
    }

    await contract.submitTransaction(
        'UpdateJob',
        jobId,
        JSON.stringify(jobData)
    );
};

/**
 * Process a job from Fabric state database
 */
export const processSubmitTransactionJob = async (
    app: Application,
    contract: Contract,
    jobId: string
): Promise<JobResult> => {
    logger.debug({ jobId }, 'Processing job');

    const jobDataJSON = await contract.evaluateTransaction('GetJob', jobId);
    const jobData = JSON.parse(jobDataJSON.toString()) as JobData;

    const fabricContract = app.locals[jobData.mspid]?.SeedContract as Contract;
    if (!fabricContract) {
        throw new Error(`Contract not found for MSP ID ${jobData.mspid}`);
    }

    const args = jobData.transactionArgs;
    let transaction: Transaction;

    if (jobData.transactionState) {
        transaction = fabricContract.deserializeTransaction(
            jobData.transactionState
        );
    } else {
        transaction = fabricContract.createTransaction(jobData.transactionName);
        await updateJobData(contract, jobId, transaction);
    }

    try {
        const payload = await submitTransaction(transaction, ...args);

        await contract.submitTransaction(
            'UpdateJobStatus',
            jobId,
            'completed',
            payload.toString(),
            ''
        );

        return {
            transactionError: undefined,
            transactionPayload: payload,
        };
    } catch (err) {
        const retryAction = getRetryAction(err);

        if (retryAction === RetryAction.None) {
            const errorMessage =
                err instanceof Error ? err.toString() : String(err);
            await contract.submitTransaction(
                'UpdateJobStatus',
                jobId,
                'failed',
                '',
                errorMessage
            );
            return {
                transactionError: `${err}`,
                transactionPayload: undefined,
            };
        }

        if (retryAction === RetryAction.WithNewTransactionId) {
            await updateJobData(contract, jobId, undefined);
        }

        throw err;
    }
};

/**
 * Get job summary from Fabric state database
 */
export const getJobSummary = async (
    contract: Contract,
    jobId: string
): Promise<JobSummary> => {
    const jobDataJSON = await contract.evaluateTransaction('GetJob', jobId);
    const jobData = JSON.parse(jobDataJSON.toString()) as JobData;

    return {
        jobId,
        transactionIds: jobData.transactionIds,
        transactionPayload: jobData.transactionState?.toString(),
        transactionError: undefined, // Will need status tracking in the contract
    };
};

/**
 * Get all jobs summary
 */
export const getJobCounts = async (
    contract: Contract
): Promise<{ [index: string]: number }> => {
    const jobsJSON = await contract.evaluateTransaction('GetAllJobs');
    const jobs = JSON.parse(jobsJSON.toString());

    const counts = {
        active: jobs.filter((job: JobData) => job.status === 'active').length,
        completed: jobs.filter((job: JobData) => job.status === 'completed')
            .length,
        failed: jobs.filter((job: JobData) => job.status === 'failed').length,
    };

    logger.debug({ counts }, 'Current job counts');
    return counts;
};
