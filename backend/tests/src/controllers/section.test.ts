import * as projectController from "../../../src/controllers/project.ts";
import * as projectService from "../../../src/services/project.ts";
import * as sectionService from "../../../src/services/section.ts";

import * as sectionController from "../../../src/controllers/section.ts";
import { PrismaClient, Project, Section } from "../../../generated/prisma/index";

jest.mock("../../../src/services/section");
jest.mock("../../../src/services/project");

const prismaMock = (props: object = {}) =>
    ({ ...props }) as jest.Mocked<PrismaClient>;
jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));

const mockCurried = <T>(fn: jest.Mock, returnValue: T) => {
	fn.mockReturnValueOnce(jest.fn().mockResolvedValueOnce(returnValue));
};

const mockCurriedError = (fn: jest.Mock, error: Error) => {
	fn.mockReturnValueOnce(jest.fn().mockRejectedValueOnce(error));
};

describe("createSection", () => {

    const project: Project = {
        id: 1,
        name: "Test Project",
        color: "#FFFFFF"
    } as Project;

    const section: Section = {
        id: 1,
        name: "Test Section"
    } as Section;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("Returns an error if the project doesn't exist",  async () => {
        mockCurried(projectService.getProjectById as jest.Mock, null);
        const response = await sectionController.createSection(prismaMock())(1, "")
        expect(response).toBeInstanceOf(Error);
    })

    test("Returns an error if the projectServices returns an error",  async () => {
        mockCurriedError(projectService.getProjectById as jest.Mock, new Error());
        const response = await sectionController.createSection(prismaMock())(1, "")
        expect(response).toBeInstanceOf(Error);
    })

    test("Returns an error if a section with the same name exists in a project", async () => {
        mockCurried(projectService.getProjectById as jest.Mock, project);
        mockCurried(sectionService.getSectionByName as jest.Mock, 1);
        const response = await sectionController.createSection(prismaMock())(1, "")
        expect(response).toBeInstanceOf(Error);
    })

    test("Returns an error if a project has reached section limit", async () => {
        mockCurried(projectService.getProjectById as jest.Mock, project);
        mockCurried(sectionService.getSectionByName as jest.Mock, null);
        mockCurried(sectionService.getNumberOfSectionInProject as jest.Mock, Number.MAX_SAFE_INTEGER);
        const response = await sectionController.createSection(prismaMock())(1, "")
        expect(response).toBeInstanceOf(Error);
    })

    test("Returns created section on success", async () => {
        mockCurried(projectService.getProjectById as jest.Mock, project);
        mockCurried(sectionService.getSectionByName as jest.Mock, null);
        mockCurried(sectionService.getNumberOfSectionInProject as jest.Mock, 0);
        mockCurried(sectionService.createSection as jest.Mock, section);
        const response = await sectionController.createSection(prismaMock())(1, "")
        expect(response).toBe(section);
    })
});