import * as sectionController from "../../../src/controllers/section";
import * as utils from "../../../src/utils";
import { Request, Response } from "express";
import {
	changeSectionName,
	createSection,
	deleteSectionById,
	getAllSections,
	getAllSectionsInProject,
	getSectionById,
	moveSectionToProject,
} from "../../../src/requestHandlers/section";
import { PrismaClient } from "../../../generated/prisma";
import { StatusCode } from "status-code-enum";
import * as testUtils from "../../utils.ts"

jest.mock("../../../src/controllers/section");
jest.mock("../../../src/utils");

describe("deleteSectionById", () => {
	beforeEach(() => {
		testUtils.resetRequestHandlerTests();
	});

	test("400s if id is not a number", async () => {
		(testUtils.req as Request).params = { id: "abc" };
		const obj = { success: false, message: "invalid" };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
		await deleteSectionById(testUtils.req as Request, testUtils.res);
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.ClientErrorBadRequest);
		expect(testUtils.res.json).toHaveBeenCalledWith(obj);
		expect(sectionController.deleteSectionById).not.toHaveBeenCalled();
	});

	test("404s if a section with the given id is not found", async () => {
		const section = testUtils.mockedSection;
		(testUtils.req as Request).params = { id: String(section.id) };
		const obj = { success: true };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
		testUtils.mockCurried(sectionController.deleteSectionById as jest.Mock, null);
		const notFoundMessage = `A section with the id "${section.id}" could not be found.`;
		testUtils.mockSanitizeResponseWithMessage(StatusCode.ClientErrorNotFound, (message: string) => ({ message }));
		await deleteSectionById(testUtils.req as Request, testUtils.res);
		expect(sectionController.deleteSectionById).toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.ClientErrorNotFound);
		expect(testUtils.res.json).toHaveBeenCalledWith({ message: notFoundMessage });
	});

	test("200s and returns the deleted section", async () => {
		const section = testUtils.mockedSection;
		(testUtils.req as Request).params = { id: String(section.id) };
		const obj = { success: true };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
		testUtils.mockCurried(sectionController.deleteSectionById as jest.Mock, section);
		testUtils.mockSanitizeResponseNoMessage(StatusCode.SuccessOK, () => section);
		await deleteSectionById(testUtils.req as Request, testUtils.res);
		expect(sectionController.deleteSectionById).toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(testUtils.res.json).toHaveBeenCalledWith(section);
	});
});

describe("createSection", () => {
	beforeEach(() => testUtils.resetRequestHandlerTests());
	test("400s when given invalid data", async () => {
		(utils.mergeResults as jest.Mock).mockReturnValue({ success: false });
		await createSection(testUtils.req as Request, testUtils.res);
		expect(sectionController.createSection).not.toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.ClientErrorBadRequest);
	});

	describe("409s", () => {
		test("when a section already exists within the project", async () => {
			const message =
				'A section with the name "Math" already exists within the project "Work"';
			testUtils.req.body = { project_id: 1, name: "Math" };
			(utils.mergeResults as jest.Mock).mockReturnValue({ success: true });
			testUtils.mockCurried(
				sectionController.createSection as jest.Mock,
				new Error(message)
			);
			await createSection(testUtils.req as Request, testUtils.res);
			expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.ClientErrorConflict);
			expect(testUtils.res.json).toHaveBeenCalledWith({ message });
		});

		test("when max sections threshold is reached", async () => {
			const message =
				'Reached maximum amount of sections (100) for the project "Other"';
			testUtils.req.body = { project_id: 1, name: "Other" };
			(utils.mergeResults as jest.Mock).mockReturnValue({ success: true });
			testUtils.mockCurried(
				sectionController.createSection as jest.Mock,
				new Error(message)
			);
			await createSection(testUtils.req as Request, testUtils.res);
			expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.ClientErrorConflict);
			expect(testUtils.res.json).toHaveBeenCalledWith({ message });
		});
	});

	test("200s and returns the section on success", async () => {
		const section = { id: 1, project_id: 2, name: "Math" };
		testUtils.req.body = { project_id: 2, name: "Math " }; // padded name to test trim
		(utils.mergeResults as jest.Mock).mockReturnValue({ success: true });
		testUtils.mockCurried(sectionController.createSection as jest.Mock, section);
		testUtils.mockSanitizeResponseNoMessage(StatusCode.SuccessOK, () => section);
		await createSection(testUtils.req as Request, testUtils.res);
		expect(sectionController.createSection).toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(testUtils.res.json).toHaveBeenCalledWith(section);
	});
});

describe("getSectionById", () => {
	beforeEach(() => testUtils.resetRequestHandlerTests());

	test("400s if id is invalid", async () => {
		(testUtils.req as Request).params = { id: "abc" };
		const obj = { success: false, message: "invalid" };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
		await getSectionById(testUtils.req as Request, testUtils.res);
		expect(sectionController.getSectionById).not.toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.ClientErrorBadRequest);
		expect(testUtils.res.json).toHaveBeenCalledWith(obj);
	});

	test("404s if section not found", async () => {
		const id = 1;
		(testUtils.req as Request).params = { id: String(id) };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue({
			success: true
		});
		testUtils.mockCurried(sectionController.getSectionById as jest.Mock, null);
		const notFound = `A section with the id "${id}" could not be found.`;
		testUtils.mockSanitizeResponseWithMessage(StatusCode.ClientErrorNotFound, (message: string) => ({ message }));
		await getSectionById(testUtils.req as Request, testUtils.res);
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.ClientErrorNotFound);
		expect(testUtils.res.json).toHaveBeenCalledWith({ message: notFound });
	});

	test("200s and returns section", async () => {
		const id = 1;
		const section = { id, name: "Math" };
		(testUtils.req as Request).params = { id: String(id) };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue({
			success: true
		});
		testUtils.mockCurried(sectionController.getSectionById as jest.Mock, section);
		testUtils.mockSanitizeResponseNoMessage(StatusCode.SuccessOK, () => section)
		await getSectionById(testUtils.req as Request, testUtils.res);
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(testUtils.res.json).toHaveBeenCalledWith(section);
	});
});

describe("getAllSectionsInProject", () => {
	beforeEach(() => testUtils.resetRequestHandlerTests());

	test("400s if id is invalid", async () => {
		(testUtils.req as Request).params = { id: "bad" };
		const obj = { success: false, message: "invalid" };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
		await getAllSectionsInProject(testUtils.req as Request, testUtils.res);
		expect(sectionController.getAllSectionsInProject).not.toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.ClientErrorBadRequest);
		expect(testUtils.res.json).toHaveBeenCalledWith(obj);
	});

	test("404s if no sections found", async () => {
		const id = 1;
		(testUtils.req as Request).params = { id: String(id) };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue({
			success: true
		});
		testUtils.mockCurried(sectionController.getAllSectionsInProject as jest.Mock, []);
		const message = `No sections were found in the project with the id of ${id}`;
		testUtils.mockSanitizeResponseWithMessage(StatusCode.ClientErrorNotFound, (message: string) => ({ message }));
		await getAllSectionsInProject(testUtils.req as Request, testUtils.res);
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.ClientErrorNotFound);
		expect(testUtils.res.json).toHaveBeenCalledWith({ message });
	});

	test("200s and returns all sections in project", async () => {
		const id = 1;
		const sections = [{ id: 1, name: "Other" }];
		(testUtils.req as Request).params = { id: String(id) };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue({
			success: true
		});
		testUtils.mockCurried(
			sectionController.getAllSectionsInProject as jest.Mock,
			sections
		);
		testUtils.mockSanitizeResponseNoMessage(StatusCode.SuccessOK, () => sections);
		await getAllSectionsInProject(testUtils.req as Request, testUtils.res);
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(testUtils.res.json).toHaveBeenCalledWith(sections);
	});
});

describe("getAllSections", () => {
	beforeEach(() => testUtils.resetRequestHandlerTests());

	test("404s if no sections found", async () => {
		testUtils.mockCurried(sectionController.getAllSections as jest.Mock, []);
		const msg = "No sections were found";
		testUtils.mockSanitizeResponseWithMessage(StatusCode.ClientErrorNotFound, (message: string) => ({ message }));
		await getAllSections(testUtils.req as Request, testUtils.res);
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.ClientErrorNotFound);
		expect(testUtils.res.json).toHaveBeenCalledWith({ message: msg });
	});

	test("200s and returns all sections", async () => {
		const sections = [{ id: 1, name: "Movies" }];
		testUtils.mockCurried(sectionController.getAllSections as jest.Mock, sections);
		testUtils.mockSanitizeResponseNoMessage(StatusCode.SuccessOK, () => sections);
		await getAllSections(testUtils.req as Request, testUtils.res);
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(testUtils.res.json).toHaveBeenCalledWith(sections);
	});
});

describe("moveSectionToProject", () => {
	beforeEach(() => testUtils.resetRequestHandlerTests());

	test("400s when given invalid data", async () => {
		(utils.mergeResults as jest.Mock).mockReturnValue({ success: false });
		await moveSectionToProject(testUtils.req as Request, testUtils.res);
		expect(sectionController.moveSectionToProject).not.toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.ClientErrorBadRequest);
	});


	describe("404s", () => {
	const baseMessage = "Cannot move section \"Section Name\" (id: 1) to project \"Project Name\" (id: 2). "
    const conflictErrors = [
        `A section with the id 1 does not exist`,
        `A project with the id 1 does not exist`,
    ];

    test.each(conflictErrors)(
        "returns 404 when not found error occurs: %s",
        async (reason) => {
			const errorMessage = baseMessage + reason;
            (utils.mergeResults as jest.Mock).mockReturnValue({ success: true });
            testUtils.mockCurried(
                sectionController.moveSectionToProject as jest.Mock,
                new Error(errorMessage)
            );

            await moveSectionToProject(testUtils.req as Request, testUtils.res);

            expect(sectionController.moveSectionToProject).toHaveBeenCalled();
            expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.ClientErrorNotFound);
            expect(testUtils.res.json).toHaveBeenCalledWith({ message: errorMessage });
        }
    );
});

	describe("409s", () => {
	const baseMessage = "Cannot move section \"Section Name\" (id: 1) to project \"Project Name\" (id: 2). "
    const conflictErrors = [
        `Section already exists in that project.`,
        `Project already has max amount of sections (100)`,
        `A section within that project already has that name.`,
    ];

    test.each(conflictErrors)(
        "returns 409 when conflict error occurs: %s",
        async (reason) => {
			const errorMessage = baseMessage + reason;
            (utils.mergeResults as jest.Mock).mockReturnValue({ success: true });
            testUtils.mockCurried(
                sectionController.moveSectionToProject as jest.Mock,
                new Error(errorMessage)
            );

            await moveSectionToProject(testUtils.req as Request, testUtils.res);

            expect(sectionController.moveSectionToProject).toHaveBeenCalled();
            expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.ClientErrorConflict);
            expect(testUtils.res.json).toHaveBeenCalledWith({ message: errorMessage });
        }
    );
});


test("200s and returns moved section with updated data", async () => {
	testUtils.req.body = { section_id: 1, project_id: 2 };
	const section = { id: 1, name: "Movies" };
	(utils.mergeResults as jest.Mock).mockReturnValue({ success: true });
	testUtils.mockCurried(sectionController.moveSectionToProject as jest.Mock, section);
	testUtils.mockSanitizeResponseNoMessage(StatusCode.SuccessOK, () => section);
	await moveSectionToProject(testUtils.req as Request, testUtils.res);
	expect(sectionController.moveSectionToProject).toHaveBeenCalled();
	expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
    expect(testUtils.res.json).toHaveBeenCalledWith(section);

})

});

describe("changeSectionName", () => {
	beforeEach(() => testUtils.resetRequestHandlerTests());

	test("400s if new name and/or section id is invalid", async () => {
		(utils.mergeResults as jest.Mock).mockReturnValue({ success: false });
		await changeSectionName(testUtils.req as Request, testUtils.res);
		expect(sectionController.changeSectionName).not.toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.ClientErrorBadRequest);
	})

	test("409s if the new name of the section already exists within the project", async () => {
		const errorMessage = "A section within the project named \"1\" (id: 1) already has a section named \"1\". Cannot change the section named \"1\" (id: 1) to \"1\"";
		(utils.mergeResults as jest.Mock).mockReturnValue({ success: true });
		testUtils.mockCurried(
                sectionController.changeSectionName as jest.Mock,
                new Error(errorMessage)
            );
		await changeSectionName(testUtils.req as Request, testUtils.res);
		expect(sectionController.changeSectionName).toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.ClientErrorConflict);
        expect(testUtils.res.json).toHaveBeenCalledWith({ message: errorMessage });
	})

	test("200s and returns section with new name", async () => {
		const section = { id: 1, name: "Movies" };
		testUtils.req.body = { new_name: "new_name", section_id: 1 };
		(utils.mergeResults as jest.Mock).mockReturnValue({ success: true });
		testUtils.mockCurried(
                sectionController.changeSectionName as jest.Mock,
                section
            );
		testUtils.mockSanitizeResponseNoMessage(StatusCode.SuccessOK, () => section);
		await changeSectionName(testUtils.req as Request, testUtils.res);
		expect(sectionController.changeSectionName).toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
    	expect(testUtils.res.json).toHaveBeenCalledWith(section);
	})
})