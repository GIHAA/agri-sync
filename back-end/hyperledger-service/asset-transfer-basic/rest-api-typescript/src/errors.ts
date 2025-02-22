import { TimeoutError, TransactionError } from 'fabric-network';
import { logger } from './logger';

export class ContractError extends Error {
    transactionId: string;

    constructor(message: string, transactionId: string) {
        super(message);
        Object.setPrototypeOf(this, ContractError.prototype);

        this.name = 'TransactionError';
        this.transactionId = transactionId;
    }
}

export class TransactionNotFoundError extends ContractError {
    constructor(message: string, transactionId: string) {
        super(message, transactionId);
        Object.setPrototypeOf(this, TransactionNotFoundError.prototype);

        this.name = 'TransactionNotFoundError';
    }
}

export class SeedExistsError extends ContractError {
    constructor(message: string, transactionId: string) {
        super(message, transactionId);
        Object.setPrototypeOf(this, SeedExistsError.prototype);

        this.name = 'SeedExistsError';
    }
}

export class SeedNotFoundError extends ContractError {
    constructor(message: string, transactionId: string) {
        super(message, transactionId);
        Object.setPrototypeOf(this, SeedNotFoundError.prototype);

        this.name = 'SeedNotFoundError';
    }
}

export enum RetryAction {
    WithExistingTransactionId,

    WithNewTransactionId,

    None,
}

export const getRetryAction = (err: unknown): RetryAction => {
    if (isDuplicateTransactionError(err) || err instanceof ContractError) {
        return RetryAction.None;
    } else if (err instanceof TimeoutError) {
        return RetryAction.WithExistingTransactionId;
    }

    return RetryAction.WithNewTransactionId;
};

/**
 * Type guard to make catching unknown errors easier
 */
export const isErrorLike = (err: unknown): err is Error => {
    return (
        err != undefined &&
        err != null &&
        typeof (err as Error).name === 'string' &&
        typeof (err as Error).message === 'string' &&
        ((err as Error).stack === undefined ||
            typeof (err as Error).stack === 'string')
    );
};

/**
 * Checks whether an error was caused by a duplicate transaction.
 *
 * This is ...painful.
 */
export const isDuplicateTransactionError = (err: unknown): boolean => {
    logger.debug({ err }, 'Checking for duplicate transaction error');

    if (err === undefined || err === null) return false;

    let isDuplicate;
    if (typeof (err as TransactionError).transactionCode === 'string') {
        // Checking whether a commit failure is caused by a duplicate transaction
        // is straightforward because the transaction code should be available
        isDuplicate =
            (err as TransactionError).transactionCode === 'DUPLICATE_TXID';
    } else {
        // Checking whether an endorsement failure is caused by a duplicate
        // transaction is only possible by processing error strings, which is not ideal.
        const endorsementError = err as {
            errors: { endorsements: { details: string }[] }[];
        };

        isDuplicate = endorsementError?.errors?.some((err) =>
            err?.endorsements?.some((endorsement) =>
                endorsement?.details?.startsWith('duplicate transaction found')
            )
        );
    }

    return isDuplicate === true;
};

const matchSeedAlreadyExistsMessage = (message: string): string | null => {
    const SeedAlreadyExistsRegex = /([tT]he )?[aA]sset \w* already exists/g;
    const SeedAlreadyExistsMatch = message.match(SeedAlreadyExistsRegex);
    logger.debug(
        { message: message, result: SeedAlreadyExistsMatch },
        'Checking for Seed already exists message'
    );

    if (SeedAlreadyExistsMatch !== null) {
        return SeedAlreadyExistsMatch[0];
    }

    return null;
};

const matchSeedDoesNotExistMessage = (message: string): string | null => {
    const SeedDoesNotExistRegex = /([tT]he )?[aA]sset \w* does not exist/g;
    const SeedDoesNotExistMatch = message.match(SeedDoesNotExistRegex);
    logger.debug(
        { message: message, result: SeedDoesNotExistMatch },
        'Checking for Seed does not exist message'
    );

    if (SeedDoesNotExistMatch !== null) {
        return SeedDoesNotExistMatch[0];
    }

    return null;
};

const matchTransactionDoesNotExistMessage = (
    message: string
): string | null => {
    const transactionDoesNotExistRegex =
        /Failed to get transaction with id [^,]*, error (?:(?:Entry not found)|(?:no such transaction ID \[[^\]]*\])) in index/g;
    const transactionDoesNotExistMatch = message.match(
        transactionDoesNotExistRegex
    );
    logger.debug(
        { message: message, result: transactionDoesNotExistMatch },
        'Checking for transaction does not exist message'
    );

    if (transactionDoesNotExistMatch !== null) {
        return transactionDoesNotExistMatch[0];
    }

    return null;
};

export const handleError = (
    transactionId: string,
    err: unknown
): Error | unknown => {
    logger.debug({ transactionId: transactionId, err }, 'Processing error');

    if (isErrorLike(err)) {
        const SeedAlreadyExistsMatch = matchSeedAlreadyExistsMessage(
            err.message
        );
        if (SeedAlreadyExistsMatch !== null) {
            return new SeedExistsError(SeedAlreadyExistsMatch, transactionId);
        }

        const SeedDoesNotExistMatch = matchSeedDoesNotExistMessage(err.message);
        if (SeedDoesNotExistMatch !== null) {
            return new SeedNotFoundError(SeedDoesNotExistMatch, transactionId);
        }

        const transactionDoesNotExistMatch =
            matchTransactionDoesNotExistMessage(err.message);
        if (transactionDoesNotExistMatch !== null) {
            return new TransactionNotFoundError(
                transactionDoesNotExistMatch,
                transactionId
            );
        }
    }

    return err;
};
