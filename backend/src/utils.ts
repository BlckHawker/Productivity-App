import { Request, Response } from 'express';
import { StatusCode } from 'status-code-enum'

//todo put header comment
const assertArguments = (
    args: { [key: string]: any },
    predicate: (value: any) => boolean,
    message: string
): { success: boolean, message?: string } => {

    // collect a list of error messages for invalid arguments
    const messages: string[] = [];
    Object.entries(args).forEach((entry) => {
        if (!predicate(entry[1])) messages.push(`Invalid ${entry[0]}${message ? ': ' + message : ''}`);
    });
    if (messages.length > 0) return {
        success: false,
        message: messages.join('. ')
    };
    return { success: true };
};

//todo put header comment
const assertArgumentsDefined = (args : object) =>{
    const validArgs = assertArguments(
        args,
        a => a != undefined,
        'cannot be undefined'
    );
    return validArgs;
};

//todo put header comment
const assertArgumentsNumber = (args: object) => {
    const validArgs = assertArguments(
        args,
        a => !isNaN(a),
        'must be a valid number'
    );
    return validArgs;
};

//todo put header comment
const assertArgumentsString = (args: object) => {
    const validArgs = assertArguments(
        args,
        arg => arg !== '',
        'must be typeof string'
    );
    return validArgs;
};

//todo put header comment
const assertArgumentsHexCode = (args: object) => {
    const validArgs = assertArguments(
        args,
        arg => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(arg),
        'must be a valid hex color (e.g. #000 or #000000)'
    );
    return validArgs;
};

/**
 * Combines the results of multiple validation checks into a single result object.
 * - If all results are successful, returns `{ success: true }`.
 * - If any validations fail, returns `{ success: false, message: string }` where
 *   `message` is a newline-separated list of error messages.
 *
 * @param results At least one validation result objects with `{ success, message? }`.
 * @returns A single merged validation result.
 */
function mergeResults(...results: { success: boolean; message?: string }[]) {
    const failed = results.filter(r => !r.success);
    return {
        success: failed.length === 0,
        message: failed.map(r => r.message).join(" \n")
    };
}

/**
 * Parses a database response as an express response, creating the correct HTTP status codes.<br>
 * - [] | undefined | null => 404
 * - Error => 500
 * - ... => 200
 * @returns 
 */
const sanitizeResponse = (response : any, expressResponse: Response, message404 : string = '404 not found')=>{
    if (response == null || response instanceof Array && response.length === 0) return expressResponse.status(StatusCode.ClientErrorNotFound).json({ message: `${message404}` });
    if (response instanceof Error) {

        // if error message includes 'not found', it's probably a 404 error
        if ('does not exist|not found'.split('|').some(msg => response.message.includes(msg)))
            return expressResponse.status(StatusCode.ClientErrorNotFound).json({ message: response.message ?? 'Not found' });

        // otherwise, assume it's an internal error
        return expressResponse.status(StatusCode.ServerErrorInternal).json({ message: response.message ?? 'Internal server error.' });
    }
    return expressResponse.status(StatusCode.SuccessOK).json(response);
};

//todo put header comment
const notFound = (req: Request, res: Response): Response => {
    return res.status(StatusCode.ClientErrorNotFound).json({ message: `'${req.method} ${req.originalUrl}' is not a valid request` });
};


export {
    sanitizeResponse,
    assertArguments,
    assertArgumentsDefined,
    assertArgumentsNumber,
    assertArgumentsString,
    assertArgumentsHexCode,
    mergeResults,
    notFound
}