/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Job, Queue } from 'bullmq';
import { Application } from 'express';
import { Contract, Transaction } from 'fabric-network';
import * as fabricProtos from 'fabric-protos';
import { mock, MockProxy } from 'jest-mock-extended';
import { jest } from '@jest/globals';
import request from 'supertest';
import * as config from '../config';
import { createServer } from '../server';

jest.mock('../config');
jest.mock('bullmq');

const mockSeed1 = {
    ID: 'Seed1',
    Color: 'blue',
    Size: 5,
    Owner: 'Tomoko',
    AppraisedValue: 300,
};
const mockSeed1Buffer = Buffer.from(JSON.stringify(mockSeed1));

const mockSeed2 = {
    ID: 'Seed2',
    Color: 'red',
    Size: 5,
    Owner: 'Brad',
    AppraisedValue: 400,
};

const mockAllSeedsBuffer = Buffer.from(
    JSON.stringify([mockSeed1, mockSeed2])
);

// TODO add tests for server errors
describe('Seed Transfer Besic REST API', () => {
    let app: Application;
    let mockJobQueue: MockProxy<Queue>;

    beforeEach(async () => {
        app = await createServer();

        const mockJob = mock<Job>();
        mockJob.id = '1';
        mockJobQueue = mock<Queue>();
        mockJobQueue.add.mockResolvedValue(mockJob);
        app.locals.jobq = mockJobQueue;
    });

    describe('/ready', () => {
        it('GET should respond with 200 OK json', async () => {
            const response = await request(app).get('/ready');
            expect(response.statusCode).toEqual(200);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                status: 'OK',
                timestamp: expect.any(String),
            });
        });
    });

    describe('/live', () => {
        it('GET should respond with 200 OK json', async () => {
            const mockBlockchainInfoProto =
                fabricProtos.common.BlockchainInfo.create();
            mockBlockchainInfoProto.height = 42;
            const mockBlockchainInfoBuffer = Buffer.from(
                fabricProtos.common.BlockchainInfo.encode(
                    mockBlockchainInfoProto
                ).finish()
            );

            const mockOrg1QsccContract = mock<Contract>();
            mockOrg1QsccContract.evaluateTransaction
                .calledWith('GetChainInfo')
                .mockResolvedValue(mockBlockchainInfoBuffer);
            app.locals[config.mspIdOrg1] = {
                qsccContract: mockOrg1QsccContract,
            };

            const mockOrg2QsccContract = mock<Contract>();
            mockOrg2QsccContract.evaluateTransaction
                .calledWith('GetChainInfo')
                .mockResolvedValue(mockBlockchainInfoBuffer);
            app.locals[config.mspIdOrg2] = {
                qsccContract: mockOrg2QsccContract,
            };

            const response = await request(app).get('/live');
            expect(response.statusCode).toEqual(200);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                status: 'OK',
                timestamp: expect.any(String),
            });
        });
    });

    describe('/api/Seeds', () => {
        let mockGetAllSeedsTransaction: MockProxy<Transaction>;

        beforeEach(() => {
            mockGetAllSeedsTransaction = mock<Transaction>();
            const mockBasicContract = mock<Contract>();
            mockBasicContract.createTransaction
                .calledWith('GetAllSeeds')
                .mockReturnValue(mockGetAllSeedsTransaction);
            app.locals[config.mspIdOrg1] = {
                SeedContract: mockBasicContract,
            };
        });

        it('GET should respond with 401 unauthorized json when an invalid API key is specified', async () => {
            const response = await request(app)
                .get('/api/Seeds')
                .set('X-Api-Key', 'NOTTHERIGHTAPIKEY');
            expect(response.statusCode).toEqual(401);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                reason: 'NO_VALID_APIKEY',
                status: 'Unauthorized',
                timestamp: expect.any(String),
            });
        });

        it('GET should respond with an empty json array when there are no Seeds', async () => {
            mockGetAllSeedsTransaction.evaluate.mockResolvedValue(
                Buffer.from('')
            );

            const response = await request(app)
                .get('/api/Seeds')
                .set('X-Api-Key', 'ORG1MOCKAPIKEY');
            expect(response.statusCode).toEqual(200);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual([]);
        });

        it('GET should respond with json array of Seeds', async () => {
            mockGetAllSeedsTransaction.evaluate.mockResolvedValue(
                mockAllSeedsBuffer
            );

            const response = await request(app)
                .get('/api/Seeds')
                .set('X-Api-Key', 'ORG1MOCKAPIKEY');
            expect(response.statusCode).toEqual(200);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual([
                {
                    ID: 'Seed1',
                    Color: 'blue',
                    Size: 5,
                    Owner: 'Tomoko',
                    AppraisedValue: 300,
                },
                {
                    ID: 'Seed2',
                    Color: 'red',
                    Size: 5,
                    Owner: 'Brad',
                    AppraisedValue: 400,
                },
            ]);
        });

        it('POST should respond with 401 unauthorized json when an invalid API key is specified', async () => {
            const response = await request(app)
                .post('/api/Seeds')
                .send({
                    ID: 'Seed6',
                    Color: 'white',
                    Size: 15,
                    Owner: 'Michel',
                    AppraisedValue: 800,
                })
                .set('X-Api-Key', 'NOTTHERIGHTAPIKEY');
            expect(response.statusCode).toEqual(401);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                reason: 'NO_VALID_APIKEY',
                status: 'Unauthorized',
                timestamp: expect.any(String),
            });
        });

        it('POST should respond with 400 bad request json for invalid Seed json', async () => {
            const response = await request(app)
                .post('/api/Seeds')
                .send({
                    wrongidfield: 'Seed3',
                    Color: 'red',
                    Size: 5,
                    Owner: 'Brad',
                    AppraisedValue: 400,
                })
                .set('X-Api-Key', 'ORG1MOCKAPIKEY');
            expect(response.statusCode).toEqual(400);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                status: 'Bad Request',
                reason: 'VALIDATION_ERROR',
                errors: [
                    {
                        location: 'body',
                        msg: 'must be a string',
                        param: 'ID',
                    },
                ],
                message: 'Invalid request body',
                timestamp: expect.any(String),
            });
        });

        it('POST should respond with 202 accepted json', async () => {
            const response = await request(app)
                .post('/api/Seeds')
                .send({
                    ID: 'Seed3',
                    Color: 'red',
                    Size: 5,
                    Owner: 'Brad',
                    AppraisedValue: 400,
                })
                .set('X-Api-Key', 'ORG1MOCKAPIKEY');
            expect(response.statusCode).toEqual(202);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                status: 'Accepted',
                jobId: '1',
                timestamp: expect.any(String),
            });
        });
    });

    describe('/api/Seeds/:id', () => {
        let mockSeedExistsTransaction: MockProxy<Transaction>;
        let mockReadSeedTransaction: MockProxy<Transaction>;

        beforeEach(() => {
            const mockBasicContract = mock<Contract>();

            mockSeedExistsTransaction = mock<Transaction>();
            mockBasicContract.createTransaction
                .calledWith('SeedExists')
                .mockReturnValue(mockSeedExistsTransaction);

            mockReadSeedTransaction = mock<Transaction>();
            mockBasicContract.createTransaction
                .calledWith('ReadSeed')
                .mockReturnValue(mockReadSeedTransaction);

            app.locals[config.mspIdOrg1] = {
                SeedContract: mockBasicContract,
            };
        });

        it('OPTIONS should respond with 401 unauthorized json when an invalid API key is specified', async () => {
            const response = await request(app)
                .options('/api/Seeds/Seed1')
                .set('X-Api-Key', 'NOTTHERIGHTAPIKEY');
            expect(response.statusCode).toEqual(401);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                reason: 'NO_VALID_APIKEY',
                status: 'Unauthorized',
                timestamp: expect.any(String),
            });
        });

        it('OPTIONS should respond with 404 not found json without the allow header when there is no Seed with the specified ID', async () => {
            mockSeedExistsTransaction.evaluate
                .calledWith('Seed3')
                .mockResolvedValue(Buffer.from('false'));

            const response = await request(app)
                .options('/api/Seeds/Seed3')
                .set('X-Api-Key', 'ORG1MOCKAPIKEY');
            expect(response.statusCode).toEqual(404);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.header).not.toHaveProperty('allow');
            expect(response.body).toEqual({
                status: 'Not Found',
                timestamp: expect.any(String),
            });
        });

        it('OPTIONS should respond with 200 OK json with the allow header', async () => {
            mockSeedExistsTransaction.evaluate
                .calledWith('Seed1')
                .mockResolvedValue(Buffer.from('true'));

            const response = await request(app)
                .options('/api/Seeds/Seed1')
                .set('X-Api-Key', 'ORG1MOCKAPIKEY');
            expect(response.statusCode).toEqual(200);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.header).toHaveProperty(
                'allow',
                'DELETE,GET,OPTIONS,PATCH,PUT'
            );
            expect(response.body).toEqual({
                status: 'OK',
                timestamp: expect.any(String),
            });
        });

        it('GET should respond with 401 unauthorized json when an invalid API key is specified', async () => {
            const response = await request(app)
                .get('/api/Seeds/Seed1')
                .set('X-Api-Key', 'NOTTHERIGHTAPIKEY');
            expect(response.statusCode).toEqual(401);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                reason: 'NO_VALID_APIKEY',
                status: 'Unauthorized',
                timestamp: expect.any(String),
            });
        });

        it('GET should respond with 404 not found json when there is no Seed with the specified ID', async () => {
            mockReadSeedTransaction.evaluate
                .calledWith('Seed3')
                .mockRejectedValue(
                    new Error('the Seed Seed3 does not exist')
                );

            const response = await request(app)
                .get('/api/Seeds/Seed3')
                .set('X-Api-Key', 'ORG1MOCKAPIKEY');
            expect(response.statusCode).toEqual(404);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                status: 'Not Found',
                timestamp: expect.any(String),
            });
        });

        it('GET should respond with the Seed json when the Seed exists', async () => {
            mockReadSeedTransaction.evaluate
                .calledWith('Seed1')
                .mockResolvedValue(mockSeed1Buffer);

            const response = await request(app)
                .get('/api/Seeds/Seed1')
                .set('X-Api-Key', 'ORG1MOCKAPIKEY');
            expect(response.statusCode).toEqual(200);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                ID: 'Seed1',
                Color: 'blue',
                Size: 5,
                Owner: 'Tomoko',
                AppraisedValue: 300,
            });
        });

        it('PUT should respond with 401 unauthorized json when an invalid API key is specified', async () => {
            const response = await request(app)
                .put('/api/Seeds/Seed1')
                .send({
                    ID: 'Seed3',
                    Color: 'red',
                    Size: 5,
                    Owner: 'Brad',
                    AppraisedValue: 400,
                })
                .set('X-Api-Key', 'NOTTHERIGHTAPIKEY');
            expect(response.statusCode).toEqual(401);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                reason: 'NO_VALID_APIKEY',
                status: 'Unauthorized',
                timestamp: expect.any(String),
            });
        });

        it('PUT should respond with 400 bad request json when IDs do not match', async () => {
            const response = await request(app)
                .put('/api/Seeds/Seed1')
                .send({
                    ID: 'Seed2',
                    Color: 'red',
                    Size: 5,
                    Owner: 'Brad',
                    AppraisedValue: 400,
                })
                .set('X-Api-Key', 'ORG1MOCKAPIKEY');
            expect(response.statusCode).toEqual(400);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                status: 'Bad Request',
                reason: 'Seed_ID_MISMATCH',
                message: 'Seed IDs must match',
                timestamp: expect.any(String),
            });
        });

        it('PUT should respond with 400 bad request json for invalid Seed json', async () => {
            const response = await request(app)
                .put('/api/Seeds/Seed1')
                .send({
                    wrongID: 'Seed1',
                    Color: 'red',
                    Size: 5,
                    Owner: 'Brad',
                    AppraisedValue: 400,
                })
                .set('X-Api-Key', 'ORG1MOCKAPIKEY');
            expect(response.statusCode).toEqual(400);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                status: 'Bad Request',
                reason: 'VALIDATION_ERROR',
                errors: [
                    {
                        location: 'body',
                        msg: 'must be a string',
                        param: 'ID',
                    },
                ],
                message: 'Invalid request body',
                timestamp: expect.any(String),
            });
        });

        it('PUT should respond with 202 accepted json', async () => {
            const response = await request(app)
                .put('/api/Seeds/Seed1')
                .send({
                    ID: 'Seed1',
                    Color: 'red',
                    Size: 5,
                    Owner: 'Brad',
                    AppraisedValue: 400,
                })
                .set('X-Api-Key', 'ORG1MOCKAPIKEY');
            expect(response.statusCode).toEqual(202);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                status: 'Accepted',
                jobId: '1',
                timestamp: expect.any(String),
            });
        });

        it('PATCH should respond with 401 unauthorized json when an invalid API key is specified', async () => {
            const response = await request(app)
                .patch('/api/Seeds/Seed1')
                .send([{ op: 'replace', path: '/Owner', value: 'Ashleigh' }])
                .set('X-Api-Key', 'NOTTHERIGHTAPIKEY');
            expect(response.statusCode).toEqual(401);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                reason: 'NO_VALID_APIKEY',
                status: 'Unauthorized',
                timestamp: expect.any(String),
            });
        });

        it('PATCH should respond with 400 bad request json for invalid patch op/path', async () => {
            const response = await request(app)
                .patch('/api/Seeds/Seed1')
                .send([{ op: 'replace', path: '/color', value: 'orange' }])
                .set('X-Api-Key', 'ORG1MOCKAPIKEY');
            expect(response.statusCode).toEqual(400);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                status: 'Bad Request',
                reason: 'VALIDATION_ERROR',
                errors: [
                    {
                        location: 'body',
                        msg: "path must be '/Owner'",
                        param: '[0].path',
                        value: '/color',
                    },
                ],
                message: 'Invalid request body',
                timestamp: expect.any(String),
            });
        });

        it('PATCH should respond with 202 accepted json', async () => {
            const response = await request(app)
                .patch('/api/Seeds/Seed1')
                .send([{ op: 'replace', path: '/Owner', value: 'Ashleigh' }])
                .set('X-Api-Key', 'ORG1MOCKAPIKEY');
            expect(response.statusCode).toEqual(202);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                status: 'Accepted',
                jobId: '1',
                timestamp: expect.any(String),
            });
        });

        it('DELETE should respond with 401 unauthorized json when an invalid API key is specified', async () => {
            const response = await request(app)
                .delete('/api/Seeds/Seed1')
                .set('X-Api-Key', 'NOTTHERIGHTAPIKEY');
            expect(response.statusCode).toEqual(401);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                reason: 'NO_VALID_APIKEY',
                status: 'Unauthorized',
                timestamp: expect.any(String),
            });
        });

        it('DELETE should respond with 202 accepted json', async () => {
            const response = await request(app)
                .delete('/api/Seeds/Seed1')
                .set('X-Api-Key', 'ORG1MOCKAPIKEY');
            expect(response.statusCode).toEqual(202);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                status: 'Accepted',
                jobId: '1',
                timestamp: expect.any(String),
            });
        });
    });

    describe('/api/jobs/:id', () => {
        it('GET should respond with 401 unauthorized json when an invalid API key is specified', async () => {
            const response = await request(app)
                .get('/api/jobs/1')
                .set('X-Api-Key', 'NOTTHERIGHTAPIKEY');
            expect(response.statusCode).toEqual(401);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                reason: 'NO_VALID_APIKEY',
                status: 'Unauthorized',
                timestamp: expect.any(String),
            });
        });

        it('GET should respond with 404 not found json when there is no job with the specified ID', async () => {
            jest.mocked(Job.fromId).mockResolvedValue(undefined);

            const response = await request(app)
                .get('/api/jobs/3')
                .set('X-Api-Key', 'ORG1MOCKAPIKEY');
            expect(response.statusCode).toEqual(404);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                status: 'Not Found',
                timestamp: expect.any(String),
            });
        });

        it('GET should respond with json details for the specified job ID', async () => {
            const mockJob = mock<Job>();
            mockJob.id = '2';
            mockJob.data = {
                transactionIds: ['txn1', 'txn2'],
            };
            mockJob.returnvalue = {
                transactionError: 'Mock error',
                transactionPayload: Buffer.from('Mock payload'),
            };
            mockJobQueue.getJob.calledWith('2').mockResolvedValue(mockJob);

            const response = await request(app)
                .get('/api/jobs/2')
                .set('X-Api-Key', 'ORG1MOCKAPIKEY');
            expect(response.statusCode).toEqual(200);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                jobId: '2',
                transactionIds: ['txn1', 'txn2'],
                transactionError: 'Mock error',
                transactionPayload: 'Mock payload',
            });
        });
    });

    describe('/api/transactions/:id', () => {
        let mockGetTransactionByIDTransaction: MockProxy<Transaction>;

        beforeEach(() => {
            mockGetTransactionByIDTransaction = mock<Transaction>();
            const mockQsccContract = mock<Contract>();
            mockQsccContract.createTransaction
                .calledWith('GetTransactionByID')
                .mockReturnValue(mockGetTransactionByIDTransaction);
            app.locals[config.mspIdOrg1] = {
                qsccContract: mockQsccContract,
            };
        });

        it('GET should respond with 401 unauthorized json when an invalid API key is specified', async () => {
            const response = await request(app)
                .get('/api/transactions/txn1')
                .set('X-Api-Key', 'NOTTHERIGHTAPIKEY');
            expect(response.statusCode).toEqual(401);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                reason: 'NO_VALID_APIKEY',
                status: 'Unauthorized',
                timestamp: expect.any(String),
            });
        });

        it('GET should respond with 404 not found json when there is no transaction with the specified ID', async () => {
            mockGetTransactionByIDTransaction.evaluate
                .calledWith('mychannel', 'txn3')
                .mockRejectedValue(
                    new Error(
                        'Failed to get transaction with id txn3, error Entry not found in index'
                    )
                );

            const response = await request(app)
                .get('/api/transactions/txn3')
                .set('X-Api-Key', 'ORG1MOCKAPIKEY');
            expect(response.statusCode).toEqual(404);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                status: 'Not Found',
                timestamp: expect.any(String),
            });
        });

        it('GET should respond with json details for the specified transaction ID', async () => {
            const processedTransactionProto =
                fabricProtos.protos.ProcessedTransaction.create();
            processedTransactionProto.validationCode =
                fabricProtos.protos.TxValidationCode.VALID;
            const processedTransactionBuffer = Buffer.from(
                fabricProtos.protos.ProcessedTransaction.encode(
                    processedTransactionProto
                ).finish()
            );
            mockGetTransactionByIDTransaction.evaluate
                .calledWith('mychannel', 'txn2')
                .mockResolvedValue(processedTransactionBuffer);

            const response = await request(app)
                .get('/api/transactions/txn2')
                .set('X-Api-Key', 'ORG1MOCKAPIKEY');
            expect(response.statusCode).toEqual(200);
            expect(response.header).toHaveProperty(
                'content-type',
                'application/json; charset=utf-8'
            );
            expect(response.body).toEqual({
                transactionId: 'txn2',
                validationCode: 'VALID',
            });
        });
    });
});
