//todo add header comments to all the functions
import StatusCode from "status-code-enum";
import { PrismaClient, Project, Section } from "../generated/prisma/index"
import { Request, Response } from "express";
import * as utils from "../src/utils";
const prismaMock = (props: object = {}) =>
    ({ ...props }) as jest.Mocked<PrismaClient>;
jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));

const mockCurried = <T>(fn: jest.Mock, returnValue: T) => {
	fn.mockReturnValueOnce(jest.fn().mockResolvedValueOnce(returnValue));
};

const mockCurriedError = (fn: jest.Mock, error: Error = new Error("Error message")) => {
	fn.mockReturnValueOnce(jest.fn().mockRejectedValueOnce(error));
};

const mockFlat = <T>(fn: jest.Mock, returnValue: T) => {
	fn.mockResolvedValueOnce(returnValue);
};

const mockFlatError = (fn: jest.Mock, error: Error = new Error("Error message")) => {
	fn.mockRejectedValueOnce(error);
};

const resetRequestHandlerTests = () => {
    req = { prisma: {}, body: {}, query: {} };
    const resPartial: Partial<jest.Mocked<Response>> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
    res = resPartial as jest.Mocked<Response>;
    jest.clearAllMocks();
};

const mockSanitizeResponseBase = <T>(
  status: StatusCode,
  payload: (message?: string) => T
) => {
  return jest
    .spyOn(utils, "sanitizeResponse")
    .mockImplementation((_response, expressRes: Response, message?: string) => {
      expressRes.status(status).json(payload(message));
      return expressRes;
    });
};


const mockSanitizeResponseWithMessage = <T>(
  status: StatusCode,
  payload: (message: string) => T
) => {
  return mockSanitizeResponseBase(status, (message?: string) => {
    if (message === undefined) {
      throw new Error("sanitizeResponse was called without a message");
    }
    return payload(message);
  });
};


const mockSanitizeResponseNoMessage = <T>(
  status: StatusCode,
  payload: () => T
) => {
  return mockSanitizeResponseBase(status, () => payload());
};

type MockPrisma = Partial<PrismaClient>;
let req: Partial<Request> & { prisma?: MockPrisma };
let res: jest.Mocked<Response>;

const mockedProject: Project = {
	id: 1,
	name: "Test Project",
	color: "#FFFFFF"
} as Project;

const mockedSection: Section = {
    id: 1,
    name: "Test Section",
} as Section;



export {
    MockPrisma,
    mockedProject,
    mockedSection,
    req,
    res,
    mockSanitizeResponseWithMessage,
    mockSanitizeResponseNoMessage,
    resetRequestHandlerTests,
    prismaMock,
    mockCurried,
    mockCurriedError,
    mockFlat,
    mockFlatError
}