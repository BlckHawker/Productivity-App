import { Request, Response } from 'express';
import * as projectController from "../../../src/controllers/project.ts";
import * as utils from '../../../src/utils.ts';
import { getProjectById } from '../../../src/requestHandlers/project.ts';
import { StatusCode } from 'status-code-enum'

jest.mock("../../../src/controllers/project.ts");
jest.mock('../../../src/utils.ts');

let req: Partial<Request> & { prisma?: any };
let res: jest.Mocked<Response>;

const resetTests = () => {
    req = { prisma: {}, body: {} };
    const resPartial: Partial<jest.Mocked<Response>> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    };

    res = resPartial as jest.Mocked<Response>;

    jest.clearAllMocks();
}

const mockCurried = <T>(fn: jest.Mock, returnValue: T) => {
        fn.mockReturnValueOnce(jest.fn().mockResolvedValueOnce(returnValue));
    };

    const mockCurriedError = (fn: jest.Mock, error: Error) => {
    fn.mockReturnValueOnce(jest.fn().mockRejectedValueOnce(error));
    };

describe("Get project by id", () => {
    beforeEach(() => {
        resetTests();
    });

    test("400s if id is not a number", async () => {
        (req as any).params = { id: "abc" };
        const obj = { success: false, message: 'invalid' };
        (utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
        await getProjectById(req as Request, res)
        expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorBadRequest);
        expect(res.json).toHaveBeenCalledWith(obj);
        expect(projectController.getProjectById).not.toHaveBeenCalled();
    })

    test("404s if a project with the given id is not found", async () => {
        const id = 1;
        (req as any).params = { id };
        const obj = { success: true };
        (utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
        mockCurried(projectController.getProjectById as jest.Mock, null);
        const notFoundMessage = `A project with the id "${id}" could not be found.`;
        jest.spyOn(utils, "sanitizeResponse").mockImplementation(
            (_response, res, message) => {
                res.status(StatusCode.ClientErrorNotFound).json({ message });
                return res;
        });
        await getProjectById(req as Request, res)
        expect(projectController.getProjectById).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorNotFound);
        expect(res.json).toHaveBeenCalledWith({ message: notFoundMessage });
    })

    test("200s and returns the found project", async () => {
        const id = 1;
        const project = { id, name: "name" };
        (req as any).params = { id };
        const obj = { success: true };
        (utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
        mockCurried(projectController.getProjectById as jest.Mock, project);
        jest.spyOn(utils, "sanitizeResponse").mockImplementation(
            (_response, res) => {
                res.status(StatusCode.SuccessOK).json(project);
                return res;
        });
        await getProjectById(req as Request, res)
        expect(projectController.getProjectById).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
        expect(res.json).toHaveBeenCalledWith(project);
    })
})