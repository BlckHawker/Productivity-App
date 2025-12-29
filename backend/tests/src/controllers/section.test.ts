import * as projectController from "../../../src/controllers/project.ts";
import * as projectService from "../../../src/services/project.ts";
import * as sectionController from "../../../src/controllers/section.ts";
import * as sectionService from "../../../src/services/section.ts";
import {
	PrismaClient,
	Project,
	Section
} from "../../../generated/prisma/index";
jest.mock("../../../src/controllers/project");
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

const mockFlat = <T>(fn: jest.Mock, returnValue: T) => {
	fn.mockResolvedValueOnce(returnValue);
};

const mockFlatError = (fn: jest.Mock, error: Error) => {
	fn.mockRejectedValueOnce(error);
};

const project: Project = {
	id: 1,
	name: "Test Project",
	color: "#FFFFFF"
} as Project;

const section: Section = {
	id: 1,
	name: "Test Section",
} as Section;

describe("deleteSectionById", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	test("should return an error if the section doesn't exist", async () => {
		mockCurried(sectionService.getSectionById as jest.Mock, null);
		const response = await sectionController.deleteSectionById(prismaMock())(1);
		expect(response).toBeInstanceOf(Error);
		expect((response as Error).message).toMatch(
			/A section with the id .+ could not be found/
		);
	});

	test('should return an error if the section is named "Other"', async () => {
		const otherSection = { ...section, is_other: true };
		mockCurried(sectionService.getSectionById as jest.Mock, otherSection);
		mockCurried(sectionService.deleteSectionById as jest.Mock, otherSection);
		const response = await sectionController.deleteSectionById(prismaMock())(1);
		expect(response).toBeInstanceOf(Error);
		expect((response as Error).message).toMatch(
			/Section with the id .+ is named "Other". This cannot be deleted its corresponding project is deleted./
		);
	});

	test("should return an error if the service returns an error", async () => {
		mockCurried(sectionService.getSectionById as jest.Mock, section);
		(sectionService.getSectionById as jest.Mock).mockRejectedValueOnce(
			new Error()
		);
		const response = await sectionController.deleteSectionById(prismaMock())(1);
		expect(response).toBeInstanceOf(Error);
	});

	test("should return whatever deleteProjectById services returns", async () => {
		mockCurried(sectionService.getSectionById as jest.Mock, section);
		mockCurried(sectionService.deleteSectionById as jest.Mock, section);
		const response = await sectionController.deleteSectionById(prismaMock())(1);
		expect(response).toBe(section);
	});
});

describe("createSection", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	const createSection = async () =>
		await sectionController.createSection(prismaMock())(1, "");

	test("Returns an error if the project doesn't exist", async () => {
		mockCurried(projectController.getProjectById as jest.Mock, null);
		const response = await createSection();
		expect(response).toBeInstanceOf(Error);
	});

	test("Returns an error if the projectController returns an error", async () => {
		mockCurried(projectController.getProjectById as jest.Mock, new Error());
		const response = await createSection();
		expect(response).toBeInstanceOf(Error);
	});

	test("Returns an error if a section with the same name exists in a project", async () => {
		mockCurried(projectController.getProjectById as jest.Mock, project);
		mockCurried(sectionService.getSectionByName as jest.Mock, 1);
		const response = await createSection();
		expect(response).toBeInstanceOf(Error);
	});

	test("Returns an error if a project has reached section limit", async () => {
		mockCurried(projectController.getProjectById as jest.Mock, project);
		mockCurried(sectionService.getSectionByName as jest.Mock, null);
		mockCurried(
			sectionService.getNumberOfSectionInProject as jest.Mock,
			Number.MAX_SAFE_INTEGER
		);
		const response = await createSection();
		expect(response).toBeInstanceOf(Error);
	});

	test("Returns created section on success", async () => {
		mockCurried(projectController.getProjectById as jest.Mock, project);
		mockCurried(sectionService.getSectionByName as jest.Mock, null);
		mockCurried(sectionService.getNumberOfSectionInProject as jest.Mock, 0);
		mockCurried(sectionService.createSection as jest.Mock, section);
		const response = await createSection();
		expect(response).toBe(section);
	});

	test("Returns an error if one was thrown", async () => {
		mockCurriedError(projectController.getProjectById as jest.Mock, new Error());
		const response = await createSection();
		expect(response).toBeInstanceOf(Error);
	});
});

describe("getAllSectionsInProject", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	const getAllSectionsInProject = async () =>
		await sectionController.getAllSectionsInProject(prismaMock())(1);

	test("Returns an error if project doesn't exist", async () => {
		mockCurried(projectService.getProjectById as jest.Mock, null);
		const response = await getAllSectionsInProject();
		expect(response).toBeInstanceOf(Error);
	});

	test("Returns an array of all sections on success", async () => {
		mockCurried(projectService.getProjectById as jest.Mock, project);
		mockCurried(sectionService.getAllSectionsInProject as jest.Mock, section);
		const response = await getAllSectionsInProject();
		expect(response).toBe(section);
	});

	test("Returns an error if one was thrown", async () => {
		mockCurriedError(projectService.getProjectById as jest.Mock, new Error());
		const response = await getAllSectionsInProject();
		expect(response).toBeInstanceOf(Error);
	});
});

describe("getSectionById", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	const getSectionById = async () =>
		await sectionController.getSectionById(prismaMock())(1);

	test('Returns what section service\'s "getSectionById" provides', async () => {
		mockCurried(sectionService.getSectionById as jest.Mock, section);
		const response = await getSectionById();
		expect(response).toBe(section);
	});

	test("Returns an error if one was thrown", async () => {
		mockCurriedError(sectionService.getSectionById as jest.Mock, new Error());
		const response = await getSectionById();
		expect(response).toBeInstanceOf(Error);
	});
});

describe("getAllSections", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	const getAllSections = async () =>
		await sectionController.getAllSections(prismaMock());

	test('Returns what section service\'s "getAllSections" provides', async () => {
		mockFlat(sectionService.getAllSections as jest.Mock, section);
		const response = await getAllSections();
		expect(response).toBe(section);
	});

	test("Returns an error if one was thrown", async () => {
		mockFlatError(sectionService.getAllSections as jest.Mock, new Error());
		const response = await getAllSections();
		expect(response).toBeInstanceOf(Error);
	});
});

describe("changeSectionName", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	const id = 1;
	const newName = "name";
	const changeSectionName = async () =>
		await sectionController.changeSectionName(prismaMock())(id, newName);

	test("Returns an error if the getting the section by id returns an error", async () => {
		mockCurried(sectionService.getSectionById as jest.Mock, new Error());
		const response = await changeSectionName();
		expect(response).toBeInstanceOf(Error);
	})

	test("Returns an error if the getting the section by id returns null", async () => {
		mockCurried(sectionService.getSectionById as jest.Mock, null);
		const response = await changeSectionName();
		expect(response).toBeInstanceOf(Error);
	})

	test("If getting the current project returns an error, return that project as an error", async () => {
		mockCurried(sectionService.getSectionById as jest.Mock, section);
		mockCurried(projectController.getProjectById as jest.Mock, new Error());
		const response = await changeSectionName();
		expect(response).toBeInstanceOf(Error);
	})

	test("If getting the current project returns null, return an error", async () => {
		mockCurried(sectionService.getSectionById as jest.Mock, section);
		mockCurried(projectController.getProjectById as jest.Mock, null);
		const response = await changeSectionName();
		expect(response).toBeInstanceOf(Error);
		expect((response as Error).message).toBe(`Could not find a project connected to the section with an id of ${id}`)
	})

	test("If there is already a section with the new desired name, return an error", async () => {
		mockCurried(sectionService.getSectionById as jest.Mock, section);
		mockCurried(projectController.getProjectById as jest.Mock, project);
		mockCurried(sectionService.getSectionByName as jest.Mock, section);
		const response = await changeSectionName();
		expect(response).toBeInstanceOf(Error);
		expect((response as Error).message).toBe(`A section within the project named "${project.name}" (id: ${project.id}) already has a section named "${newName}". Cannot change the section named "${section.name}" (id: ${id}) to "${newName}"`)
	})

	test("If there are no conflicts, the name of the section should be changed and the update section object should be returned", async ()=> {
		mockCurried(sectionService.getSectionById as jest.Mock, section);
		mockCurried(projectController.getProjectById as jest.Mock, project);
		mockCurried(sectionService.getSectionByName as jest.Mock, null);
		mockCurried(sectionService.changeSectionName as jest.Mock, section);
		const response = await changeSectionName();
		expect(response).toBe(section);		
	})

	test("Returns an error if one was thrown", async () => {
		mockCurried(sectionService.getSectionById as jest.Mock, section);
		mockCurried(projectController.getProjectById as jest.Mock, project);
		mockCurriedError(projectController.getProjectById as jest.Mock, new Error());
		const response = await changeSectionName();
		expect(response).toBeInstanceOf(Error);
	});
})

describe("moveSectionToProject", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	const old_project: Project = {
		id: 1,
		name: "Project 1",
		color: "#FFFFFF"
	} as Project;

	const new_project: Project = {
		id: 2,
		name: "Project 2",
		color: "#FFFFFF"
	} as Project;

	const section: Section = {
		id: 1,
		name: "Test Section",
		project_id: 1,
	} as Section;

	const getErrorMessage = (section : Section, project: Project) => `Cannot move section "${section.name}" (id: ${section.id}) to project "${project.name}" (id: ${project.id}).`

	const moveSectionToProject = async (sectionId = section.id, newProjectId = new_project.id) =>
		await sectionController.moveSectionToProject(prismaMock())(sectionId, newProjectId);

	test("Returns an error if the getting the section by id returns an error", async () => {
		mockCurried(sectionService.getSectionById as jest.Mock, new Error())
		const response = await moveSectionToProject();
		expect(response).toBeInstanceOf(Error);
	})

	test("Returns an error if the getting the section by id returns null", async () => {
		mockCurried(sectionService.getSectionById as jest.Mock, null);
		const response = await moveSectionToProject();
		expect(response).toBeInstanceOf(Error);
	})

	test("If getting the current project returns an error, return that project as an error", async () => {
		mockCurried(sectionService.getSectionById as jest.Mock, section);
		mockCurried(projectController.getProjectById as jest.Mock, new Error());
		const response = await moveSectionToProject();
		expect(response).toBeInstanceOf(Error);
	})

	test("If getting the current project returns null, return an error", async () => {
		mockCurried(sectionService.getSectionById as jest.Mock, section);
		mockCurried(projectController.getProjectById as jest.Mock, null);
		const response = await moveSectionToProject();
		expect(response).toBeInstanceOf(Error);
		expect((response as Error).message).toBe(`A project with the id ${new_project.id} does not exist`)
	})

	test("verify the new project is not the same as the one section is currently is", async () => {
		mockCurried(sectionService.getSectionById as jest.Mock, section);
		mockCurried(projectController.getProjectById as jest.Mock, old_project);
		const response = await moveSectionToProject(section.id, old_project.id);
		expect(response).toBeInstanceOf(Error);

		expect((response as Error).message).toBe(`${getErrorMessage(section, old_project)} Section already exists in that project`)
	})

	test("verify the project doesn't currently have the max amount of projects", async () => {
		const sectionSize = sectionController.MAX_SECTIONS;
		mockCurried(sectionService.getSectionById as jest.Mock, section);
		mockCurried(projectController.getProjectById as jest.Mock, new_project);
		mockCurried(sectionService.getNumberOfSectionInProject as jest.Mock, sectionSize);
		const response = await moveSectionToProject();
		expect(response).toBeInstanceOf(Error);
		expect((response as Error).message).toBe(`${getErrorMessage(section, new_project)} Project already has max amount of sections (${sectionSize})`)
	})

	test("verify a section with the same name doesn't exists within that project", async () => {
		mockCurried(sectionService.getSectionById as jest.Mock, section);
		mockCurried(projectController.getProjectById as jest.Mock, new_project);
		mockCurried(sectionService.getNumberOfSectionInProject as jest.Mock, 0);
		mockCurried(sectionService.getSectionByName as jest.Mock, section);
		const response = await moveSectionToProject();
		expect(response).toBeInstanceOf(Error);
		expect((response as Error).message).toBe(`${getErrorMessage(section, new_project)} A section within that project already has that name.`)
	})

	test("move the section to the new project, and return the new section", async () => {
		mockCurried(sectionService.getSectionById as jest.Mock, section);
		mockCurried(projectController.getProjectById as jest.Mock, new_project);
		mockCurried(sectionService.getNumberOfSectionInProject as jest.Mock, 0);
		mockCurried(sectionService.getSectionByName as jest.Mock, null);
		mockCurried(sectionService.changeSectionProject as jest.Mock, section);
		const response = await moveSectionToProject();
		expect(response).toBe(section);
	})

	test("Returns an error if one was thrown", async () => {
		mockCurried(sectionService.getSectionById as jest.Mock, section);
		mockCurriedError(projectController.getProjectById as jest.Mock, new Error());
		const response = await moveSectionToProject();
		expect(response).toBeInstanceOf(Error);
	});
})