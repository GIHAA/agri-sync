

import * as env from 'env-var';

export const ORG1 = 'Org1';
export const ORG2 = 'Org2';

export const JOB_QUEUE_NAME = 'submit';


export const logLevel = env
    .get('LOG_LEVEL')
    .default('info')
    .asEnum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']);

export const port = env
    .get('PORT')
    .default('3000')
    .example('3000')
    .asPortNumber();


export const submitJobBackoffType = env
    .get('SUBMIT_JOB_BACKOFF_TYPE')
    .default('fixed')
    .asEnum(['fixed', 'exponential']);


export const submitJobBackoffDelay = env
    .get('SUBMIT_JOB_BACKOFF_DELAY')
    .default('3000')
    .example('3000')
    .asIntPositive();


export const submitJobAttempts = env
    .get('SUBMIT_JOB_ATTEMPTS')
    .default('5')
    .example('5')
    .asIntPositive();


export const submitJobConcurrency = env
    .get('SUBMIT_JOB_CONCURRENCY')
    .default('5')
    .example('5')
    .asIntPositive();


export const maxCompletedSubmitJobs = env
    .get('MAX_COMPLETED_SUBMIT_JOBS')
    .default('1000')
    .example('1000')
    .asIntPositive();


export const maxFailedSubmitJobs = env
    .get('MAX_FAILED_SUBMIT_JOBS')
    .default('1000')
    .example('1000')
    .asIntPositive();


export const submitJobQueueScheduler = env
    .get('SUBMIT_JOB_QUEUE_SCHEDULER')
    .default('true')
    .example('true')
    .asBoolStrict();


export const asLocalhost = env
    .get('AS_LOCAL_HOST')
    .default('true')
    .example('true')
    .asBoolStrict();

/**
 * The Org1 MSP ID
 */
export const mspIdOrg1 = env
    .get('HLF_MSP_ID_ORG1')
    .default(`${ORG1}MSP`)
    .example(`${ORG1}MSP`)
    .asString();

/**
 * The Org2 MSP ID
 */
export const mspIdOrg2 = env
    .get('HLF_MSP_ID_ORG2')
    .default(`${ORG2}MSP`)
    .example(`${ORG2}MSP`)
    .asString();


export const channelName = env
    .get('HLF_CHANNEL_NAME')
    .default('mychannel')
    .example('mychannel')
    .asString();


export const chaincodeName = env
    .get('HLF_CHAINCODE_NAME')
    .default('basic')
    .example('basic')
    .asString();


export const commitTimeout = env
    .get('HLF_COMMIT_TIMEOUT')
    .default('300')
    .example('300')
    .asIntPositive();


export const endorseTimeout = env
    .get('HLF_ENDORSE_TIMEOUT')
    .default('30')
    .example('30')
    .asIntPositive();

/**
 * The transaction query timeout in seconds
 */
export const queryTimeout = env
    .get('HLF_QUERY_TIMEOUT')
    .default('3')
    .example('3')
    .asIntPositive();

/**
 * The Org1 connection profile JSON
 */
export const connectionProfileOrg1 = env
    .get('HLF_CONNECTION_PROFILE_ORG1')
    .required()
    .example(
        '{"name":"test-network-org1","version":"1.0.0","client":{"organization":"Org1" ... }'
    )
    .asJsonObject() as Record<string, unknown>;

/**
 * Certificate for an Org1 identity to evaluate and submit transactions
 */
export const certificateOrg1 = env
    .get('HLF_CERTIFICATE_ORG1')
    .required()
    .example(
        '"-----BEGIN CERTIFICATE-----\\n...\\n-----END CERTIFICATE-----\\n"'
    )
    .asString();

/**
 * Private key for an Org1 identity to evaluate and submit transactions
 */
export const privateKeyOrg1 = env
    .get('HLF_PRIVATE_KEY_ORG1')
    .required()
    .example(
        '"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"'
    )
    .asString();

/**
 * The Org2 connection profile JSON
 */
export const connectionProfileOrg2 = env
    .get('HLF_CONNECTION_PROFILE_ORG2')
    .required()
    .example(
        '{"name":"test-network-org2","version":"1.0.0","client":{"organization":"Org2" ... }'
    )
    .asJsonObject() as Record<string, unknown>;

/**
 * Certificate for an Org2 identity to evaluate and submit transactions
 */
export const certificateOrg2 = env
    .get('HLF_CERTIFICATE_ORG2')
    .required()
    .example(
        '"-----BEGIN CERTIFICATE-----\\n...\\n-----END CERTIFICATE-----\\n"'
    )
    .asString();

/**
 * Private key for an Org2 identity to evaluate and submit transactions
 */
export const privateKeyOrg2 = env
    .get('HLF_PRIVATE_KEY_ORG2')
    .required()
    .example(
        '"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"'
    )
    .asString();

/**
 * The host the Redis server is running on
 */
export const redisHost = env
    .get('REDIS_HOST')
    .default('localhost')
    .example('localhost')
    .asString();

/**
 * The port the Redis server is running on
 */
export const redisPort = env
    .get('REDIS_PORT')
    .default('6379')
    .example('6379')
    .asPortNumber();

/**
 * Username for the Redis server
 */
export const redisUsername = env
    .get('REDIS_USERNAME')
    .example('fabric')
    .asString();

/**
 * Password for the Redis server
 */
export const redisPassword = env.get('REDIS_PASSWORD').asString();


export const org1ApiKey = env
    .get('ORG1_APIKEY')
    .required()
    .example('123')
    .asString();


export const org2ApiKey = env
    .get('ORG2_APIKEY')
    .required()
    .example('456')
    .asString();
