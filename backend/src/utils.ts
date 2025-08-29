import { NextFunction, Request, Response } from 'express';

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

/**
 * Parses a database response as an express response, creating the correct HTTP status codes.<br>
 * - [] | undefined | null => 404
 * - Error => 500
 * - ... => 200
 * @returns 
 */
//todo put header comment
const sanitizeResponse = (response : any, expressResponse: Response, message404 : string = '404 not found')=>{
    if (response == null || response instanceof Array && response.length === 0) return expressResponse.status(404).json({ message: `${message404}` });
    if (response instanceof Error) {

        // if error message includes 'not found', it's probably a 404 error
        if ('does not exist|not found'.split('|').some(msg => response.message.includes(msg)))
            return expressResponse.status(404).json({ message: response.message ?? 'Not found' });

        // otherwise, assume it's an internal error
        return expressResponse.status(500).json({ message: response.message ?? 'Internal server error.' });
    }
    return expressResponse.status(200).json(response);
};

//todo put header comment
const notFound = (req: Request, res: Response): Response => {
    return res.status(404).json({ message: `'${req.method} ${req.originalUrl}' is not a valid request` });
};


export {
    sanitizeResponse,
    assertArguments,
    assertArgumentsDefined,
    assertArgumentsNumber,
    assertArgumentsString,
    notFound
}