//todo add header comments to all the functions
import { PrismaClient, Project, Section } from "../generated/prisma/index"
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
    mockedProject,
    mockedSection,
    prismaMock,
    mockCurried,
    mockCurriedError,
    mockFlat,
    mockFlatError
}