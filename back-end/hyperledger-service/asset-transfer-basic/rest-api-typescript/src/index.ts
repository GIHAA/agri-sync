import * as config from './config';
import {
    createGateway,
    createWallet,
    getContracts,
    getNetwork,
} from './fabric';
import {
    initJobQueue,
    initJobQueueScheduler,
    initJobQueueWorker,
} from './jobs';
import { logger } from './logger';
import { createServer } from './server';
import { isMaxmemoryPolicyNoeviction } from './redis';
import { Queue, QueueScheduler, Worker } from 'bullmq';

let jobQueue: Queue | undefined;
let jobQueueWorker: Worker | undefined;
let jobQueueScheduler: QueueScheduler | undefined;

async function main() {
    logger.info('Checking Redis config');
    if (!(await isMaxmemoryPolicyNoeviction())) {
        throw new Error(
            'Invalid redis configuration: redis instance must have the setting maxmemory-policy=noeviction'
        );
    }

    logger.info('Creating REST server');
    const app = await createServer();

    logger.info('Connecting to Fabric network with org1 mspid');
    const wallet = await createWallet();

    const gatewayOrg1 = await createGateway(
        config.connectionProfileOrg1,
        config.mspIdOrg1,
        wallet
    );
    const networkOrg1 = await getNetwork(gatewayOrg1);
    const contractsOrg1 = await getContracts(networkOrg1);

    app.locals[config.mspIdOrg1] = contractsOrg1;

    logger.info('Connecting to Fabric network with org2 mspid');
    const gatewayOrg2 = await createGateway(
        config.connectionProfileOrg2,
        config.mspIdOrg2,
        wallet
    );
    const networkOrg2 = await getNetwork(gatewayOrg2);
    const contractsOrg2 = await getContracts(networkOrg2);

    app.locals[config.mspIdOrg2] = contractsOrg2;

    logger.info('Initialising submit job queue');
    jobQueue = initJobQueue();
    jobQueueWorker = initJobQueueWorker(app);
    if (config.submitJobQueueScheduler === true) {
        logger.info('Initialising submit job queue scheduler');
        jobQueueScheduler = initJobQueueScheduler();
    }
    app.locals.jobq = jobQueue;

    logger.info('Starting REST server');
    app.listen(config.port, () => {
        logger.info('REST server started on port: %d', config.port);
    });
}

main().catch(async (err) => {
    logger.error({ err }, 'Unxepected error');

    if (jobQueueScheduler != undefined) {
        logger.debug('Closing job queue scheduler');
        await jobQueueScheduler.close();
    }

    if (jobQueueWorker != undefined) {
        logger.debug('Closing job queue worker');
        await jobQueueWorker.close();
    }

    if (jobQueue != undefined) {
        logger.debug('Closing job queue');
        await jobQueue.close();
    }
});

// import * as config from './config';
// import {
//     createGateway,
//     createWallet,
//     getContracts,
//     getNetwork,
// } from './fabric';
// import { logger } from './logger';
// import { createServer } from './server';

// async function main() {
//     logger.info('Creating REST server');
//     const app = await createServer();

//     logger.info('Connecting to Fabric network with org1 mspid');
//     const wallet = await createWallet();

//     const gatewayOrg1 = await createGateway(
//         config.connectionProfileOrg1,
//         config.mspIdOrg1,
//         wallet
//     );
//     const networkOrg1 = await getNetwork(gatewayOrg1);
//     const contractsOrg1 = await getContracts(networkOrg1);

//     app.locals[config.mspIdOrg1] = contractsOrg1;

//     logger.info('Connecting to Fabric network with org2 mspid');
//     const gatewayOrg2 = await createGateway(
//         config.connectionProfileOrg2,
//         config.mspIdOrg2,
//         wallet
//     );
//     const networkOrg2 = await getNetwork(gatewayOrg2);
//     const contractsOrg2 = await getContracts(networkOrg2);

//     app.locals[config.mspIdOrg2] = contractsOrg2;

//     logger.info('Starting REST server');
//     app.listen(config.port, () => {
//         logger.info('REST server started on port: %d', config.port);
//     });
// }

// main().catch((err) => {
//     logger.error({ err }, 'Unexpected error occurred');
// });

// import * as config from './config';
// import {
//     createGateway,
//     createWallet,
//     getContracts,
//     getNetwork,
// } from './fabric';
// import {
//     initJobQueue,
//     initJobQueueScheduler,
//     initJobQueueWorker,
// } from './jobs';
// import { logger } from './logger';
// import { createServer } from './server';
// import { isMaxmemoryPolicyNoeviction } from './redis';
// import { Queue, QueueScheduler, Worker } from 'bullmq';

// let jobQueue: Queue | undefined;
// let jobQueueWorker: Worker | undefined;
// let jobQueueScheduler: QueueScheduler | undefined;

// import { Gateway } from 'fabric-network';

// let gatewayOrg1: Gateway | undefined;
// let gatewayOrg2: Gateway | undefined;

// async function main() {
//     logger.info('Starting application');

//     // Validate Redis configuration
//     logger.info('Checking Redis maxmemory-policy');
//     try {
//         if (!(await isMaxmemoryPolicyNoeviction())) {
//             throw new Error(
//                 'Invalid Redis configuration: maxmemory-policy must be set to noeviction'
//             );
//         }
//         logger.info('Redis configuration is valid');
//     } catch (err) {
//         logger.error({ err }, 'Redis validation failed');
//         throw err;
//     }

//     // Create REST server
//     logger.info('Creating REST server');
//     const app = await createServer();

//     // Connect to Hyperledger Fabric for org1
//     logger.info('Connecting to Fabric network with org1 MSP');
//     let gatewayOrg1, gatewayOrg2;
//     try {
//         const wallet = await createWallet();

//         gatewayOrg1 = await createGateway(
//             config.connectionProfileOrg1,
//             config.mspIdOrg1,
//             wallet
//         );
//         const networkOrg1 = await getNetwork(gatewayOrg1);
//         const contractsOrg1 = await getContracts(networkOrg1);
//         app.locals[config.mspIdOrg1] = contractsOrg1;
//         logger.info('Connected to Fabric network for org1');
//     } catch (err) {
//         logger.error({ err }, 'Failed to connect to Fabric network for org1');
//         throw err;
//     }

//     // Connect to Hyperledger Fabric for org2
//     logger.info('Connecting to Fabric network with org2 MSP');
//     try {
//         const wallet = await createWallet();

//         gatewayOrg2 = await createGateway(
//             config.connectionProfileOrg2,
//             config.mspIdOrg2,
//             wallet
//         );
//         const networkOrg2 = await getNetwork(gatewayOrg2);
//         const contractsOrg2 = await getContracts(networkOrg2);
//         app.locals[config.mspIdOrg2] = contractsOrg2;
//         logger.info('Connected to Fabric network for org2');
//     } catch (err) {
//         logger.error({ err }, 'Failed to connect to Fabric network for org2');
//         throw err;
//     }

//     // Initialize job queue
//     logger.info('Initializing job queue');
//     try {
//         jobQueue = initJobQueue();
//         jobQueueWorker = initJobQueueWorker(app);
//         if (config.submitJobQueueScheduler) {
//             jobQueueScheduler = initJobQueueScheduler();
//         }
//         app.locals.jobq = jobQueue;
//         logger.info('Job queue initialized successfully');
//     } catch (err) {
//         logger.error({ err }, 'Failed to initialize job queue');
//         throw err;
//     }

//     // Start REST server
//     logger.info('Starting REST server');
//     try {
//         app.listen(config.port, () => {
//             logger.info(`REST server started on port ${config.port}`);
//         });
//     } catch (err) {
//         logger.error({ err }, 'Failed to start REST server');
//         throw err;
//     }
// }

// async function shutdown() {
//     logger.info('Shutting down resources...');
//     try {
//         if (jobQueueScheduler) {
//             logger.debug('Closing job queue scheduler');
//             await jobQueueScheduler.close();
//         }

//         if (jobQueueWorker) {
//             logger.debug('Closing job queue worker');
//             await jobQueueWorker.close();
//         }

//         if (jobQueue) {
//             logger.debug('Closing job queue');
//             await jobQueue.close();
//         }

//         try {
//             // Safely disconnect gateways
//             if (gatewayOrg1) {
//                 gatewayOrg1.disconnect();
//                 logger.debug('Disconnecting gateway for org1');
//             }
//         } catch (err) {
//             logger.error({ err }, 'Error disconnecting gateway for org1');
//         }

//         try {
//             // Safely disconnect gateways
//             if (gatewayOrg2) {
//                 gatewayOrg2.disconnect();
//                 logger.debug('Disconnecting gateway for org2');
//             }
//         } catch (err) {
//             logger.error({ err }, 'Error disconnecting gateway for org2');
//         }

//         logger.info('All resources have been released');
//     } catch (err) {
//         logger.error({ err }, 'Error during shutdown');
//     }
// }

// // Listen for termination signals
// process.on('SIGINT', async () => {
//     logger.info('Received SIGINT, shutting down');
//     await shutdown();
//     process.exit(0);
// });

// process.on('SIGTERM', async () => {
//     logger.info('Received SIGTERM, shutting down');
//     await shutdown();
//     process.exit(0);
// });

// // Run the main function
// main().catch(async (err) => {
//     logger.error({ err }, 'Unexpected error occurred');
//     await shutdown();
//     process.exit(1);
// });
