import { PrismaClient, Project } from "../../../generated/prisma/index";
import * as projectController from "../../../src/controllers/project.ts"
import * as projectService from "../../../src/services/project.ts"

jest.mock("../../../src/services/project");

const prismaMock = (props: object = {}) => ({ ...props } as jest.Mocked<PrismaClient>);
jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

describe("Create Project Controller", () => {
    const projectData = {name: "name", color: "#f00"};

    const mockCurried = <T>(fn: jest.Mock, returnValue: T) => {
        fn.mockReturnValueOnce(jest.fn().mockResolvedValueOnce(returnValue));
    };

    const mockCurriedError = (fn: jest.Mock, error: Error) => {
    fn.mockReturnValueOnce(jest.fn().mockRejectedValueOnce(error));
    };

    const createProject = (name = projectData.name, color = projectData.color) =>
  projectController.createProject(prismaMock())(name, color);

    beforeEach(() => {
        jest.resetAllMocks();

    });

    test("returns an error if the project is created when the max amount of projects is registered in the database", async () => {
        (projectService.getProjectCount as jest.Mock).mockResolvedValueOnce(projectController.MAX_PROJECTS);
        const response = await createProject();
        expect(response).toBeInstanceOf(Error);
    })

    test("returns an error if a project is created with the same name of an existing project within the database", async () => {
        mockCurried(projectService.getProjectByName as jest.Mock, projectData);
        const response = await createProject();
        expect(response).toBeInstanceOf(Error);
    })

    test("If the service returns an error, it should return the error", async () => {
        mockCurriedError(projectService.createProject as jest.Mock, new Error("Error message"));
        const response = await createProject();
        expect(response).toBeInstanceOf(Error);
    })

    test("If service returns, then controller should return service value", async () => {
        (projectService.getProjectCount as jest.Mock).mockResolvedValueOnce(0);
        mockCurried(projectService.getProjectByName as jest.Mock, null);
        mockCurried(projectService.createProject as jest.Mock, projectData);
        const response = await createProject();
        expect(response).toEqual(projectData);
    })

    
})