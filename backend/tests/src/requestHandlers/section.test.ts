import * as sectionController from "../../../src/controllers/section";
import * as utils from "../../../src/utils";
import { Request, Response } from "express";
import {
	createSection,
	getAllSections,
	getAllSectionsInProject,
	getSectionById,
	moveSectionToProject,
	changeSectionName
} from "../../../src/requestHandlers/section";
import { PrismaClient } from "../../../generated/prisma";
import { StatusCode } from "status-code-enum";

jest.mock("../../../src/controllers/section");
jest.mock("../../../src/utils");

type MockPrisma = Partial<PrismaClient>;
let req: Partial<Request> & { prisma?: MockPrisma };
let res: jest.Mocked<Response>;

const resetTests = () => {
	req = { prisma: {}, body: {}, query: {} };
	const resPartial: Partial<jest.Mocked<Response>> = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn().mockReturnThis()
	};
	res = resPartial as jest.Mocked<Response>;
	jest.clearAllMocks();
};

const mockCurried = <T>(fn: jest.Mock, returnValue: T) => {
	fn.mockReturnValueOnce(jest.fn().mockResolvedValueOnce(returnValue));
};

describe("createSection", () => {
	beforeEach(() => resetTests());
	test("400s when given invalid data", async () => {
		(utils.mergeResults as jest.Mock).mockReturnValue({ success: false });
		await createSection(req as Request, res);
		expect(sectionController.createSection).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorBadRequest);
	});

	describe("409s", () => {
		test("when a section already exists within the project", async () => {
			const message =
				'A section with the name "Math" already exists within the project "Work"';
			req.body = { project_id: 1, name: "Math" };
			(utils.mergeResults as jest.Mock).mockReturnValue({ success: true });
			mockCurried(
				sectionController.createSection as jest.Mock,
				new Error(message)
			);
			await createSection(req as Request, res);
			expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorConflict);
			expect(res.json).toHaveBeenCalledWith({ message });
		});

		test("when max sections threshold is reached", async () => {
			const message =
				'Reached maximum amount of sections (100) for the project "Other"';
			req.body = { project_id: 1, name: "Other" };
			(utils.mergeResults as jest.Mock).mockReturnValue({ success: true });
			mockCurried(
				sectionController.createSection as jest.Mock,
				new Error(message)
			);
			await createSection(req as Request, res);
			expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorConflict);
			expect(res.json).toHaveBeenCalledWith({ message });
		});
	});

	test("200s and returns the section on success", async () => {
		const section = { id: 1, project_id: 2, name: "Math" };
		req.body = { project_id: 2, name: "Math " }; // padded name to test trim
		(utils.mergeResults as jest.Mock).mockReturnValue({ success: true });
		mockCurried(sectionController.createSection as jest.Mock, section);
		jest.spyOn(utils, "sanitizeResponse").mockImplementation((_r, res) => {
			res.status(StatusCode.SuccessOK).json(section);
			return res;
		});
		await createSection(req as Request, res);
		expect(sectionController.createSection).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(res.json).toHaveBeenCalledWith(section);
	});
});

describe("getSectionById", () => {
	beforeEach(() => resetTests());

	test("400s if id is invalid", async () => {
		(req as Request).params = { id: "abc" };
		const obj = { success: false, message: "invalid" };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
		await getSectionById(req as Request, res);
		expect(sectionController.getSectionById).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorBadRequest);
		expect(res.json).toHaveBeenCalledWith(obj);
	});

	test("404s if section not found", async () => {
		const id = 1;
		(req as Request).params = { id: String(id) };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue({
			success: true
		});
		mockCurried(sectionController.getSectionById as jest.Mock, null);
		const notFound = `A section with the id "${id}" could not be found.`;
		jest.spyOn(utils, "sanitizeResponse").mockImplementation((_r, res, msg) => {
			res.status(StatusCode.ClientErrorNotFound).json({ message: msg });
			return res;
		});
		await getSectionById(req as Request, res);
		expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorNotFound);
		expect(res.json).toHaveBeenCalledWith({ message: notFound });
	});

	test("200s and returns section", async () => {
		const id = 1;
		const section = { id, name: "Math" };
		(req as Request).params = { id: String(id) };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue({
			success: true
		});
		mockCurried(sectionController.getSectionById as jest.Mock, section);
		jest.spyOn(utils, "sanitizeResponse").mockImplementation((_r, res) => {
			res.status(StatusCode.SuccessOK).json(section);
			return res;
		});
		await getSectionById(req as Request, res);
		expect(res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(res.json).toHaveBeenCalledWith(section);
	});
});

describe("getAllSectionsInProject", () => {
	beforeEach(() => resetTests());

	test("400s if id is invalid", async () => {
		(req as Request).params = { id: "bad" };
		const obj = { success: false, message: "invalid" };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
		await getAllSectionsInProject(req as Request, res);
		expect(sectionController.getAllSectionsInProject).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorBadRequest);
		expect(res.json).toHaveBeenCalledWith(obj);
	});

	test("404s if no sections found", async () => {
		const id = 1;
		(req as Request).params = { id: String(id) };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue({
			success: true
		});
		mockCurried(sectionController.getAllSectionsInProject as jest.Mock, []);
		const msg = `No sections were found in the project with the id of ${id}`;
		jest.spyOn(utils, "sanitizeResponse").mockImplementation((_r, res, m) => {
			res.status(StatusCode.ClientErrorNotFound).json({ message: m });
			return res;
		});
		await getAllSectionsInProject(req as Request, res);
		expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorNotFound);
		expect(res.json).toHaveBeenCalledWith({ message: msg });
	});

	test("200s and returns all sections in project", async () => {
		const id = 1;
		const sections = [{ id: 1, name: "Other" }];
		(req as Request).params = { id: String(id) };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue({
			success: true
		});
		mockCurried(
			sectionController.getAllSectionsInProject as jest.Mock,
			sections
		);
		jest.spyOn(utils, "sanitizeResponse").mockImplementation((_r, res) => {
			res.status(StatusCode.SuccessOK).json(sections);
			return res;
		});
		await getAllSectionsInProject(req as Request, res);
		expect(res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(res.json).toHaveBeenCalledWith(sections);
	});
});

describe("getAllSections", () => {
	beforeEach(() => resetTests());

	test("404s if no sections found", async () => {
		mockCurried(sectionController.getAllSections as jest.Mock, []);
		const msg = "No sections were found";
		jest.spyOn(utils, "sanitizeResponse").mockImplementation((_r, res, m) => {
			res.status(StatusCode.ClientErrorNotFound).json({ message: m });
			return res;
		});
		await getAllSections(req as Request, res);
		expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorNotFound);
		expect(res.json).toHaveBeenCalledWith({ message: msg });
	});

	test("200s and returns all sections", async () => {
		const sections = [{ id: 1, name: "Movies" }];
		mockCurried(sectionController.getAllSections as jest.Mock, sections);
		jest.spyOn(utils, "sanitizeResponse").mockImplementation((_r, res) => {
			res.status(StatusCode.SuccessOK).json(sections);
			return res;
		});
		await getAllSections(req as Request, res);
		expect(res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(res.json).toHaveBeenCalledWith(sections);
	});
});

describe("moveSectionToProject", () => {
	beforeEach(() => resetTests());

	test("400s when given invalid data", async () => {
		(utils.mergeResults as jest.Mock).mockReturnValue({ success: false });
		await moveSectionToProject(req as Request, res);
		expect(sectionController.moveSectionToProject).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorBadRequest);
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
            mockCurried(
                sectionController.moveSectionToProject as jest.Mock,
                new Error(errorMessage)
            );

            await moveSectionToProject(req as Request, res);

            expect(sectionController.moveSectionToProject).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorNotFound);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
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
            mockCurried(
                sectionController.moveSectionToProject as jest.Mock,
                new Error(errorMessage)
            );

            await moveSectionToProject(req as Request, res);

            expect(sectionController.moveSectionToProject).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorConflict);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
        }
    );
});


test("200s and returns moved section with updated data", async () => {
	req.body = { section_id: 1, project_id: 2 };
	const section = { id: 1, name: "Movies" };
	(utils.mergeResults as jest.Mock).mockReturnValue({ success: true });
		mockCurried(sectionController.moveSectionToProject as jest.Mock, section);
		jest.spyOn(utils, "sanitizeResponse").mockImplementation((_r, res) => {
			res.status(StatusCode.SuccessOK).json(section);
			return res;
		});
	await moveSectionToProject(req as Request, res);
	expect(sectionController.moveSectionToProject).toHaveBeenCalled();
	expect(res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
    expect(res.json).toHaveBeenCalledWith(section);

	

})

});

describe("changeSectionName", () => {
	beforeEach(() => resetTests());

	test("400s if new name and/or section id is invalid", async () => {
		(utils.mergeResults as jest.Mock).mockReturnValue({ success: false });
		await changeSectionName(req as Request, res);
		expect(sectionController.changeSectionName).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorBadRequest);
	})

	test("409s if the new name of the section already exists within the project", async () => {
		const errorMessage = "A section within the project named \"1\" \(id: 1\) already has a section named \"1\". Cannot change the section named \"1\" \(id: 1\) to \"1\"";
		(utils.mergeResults as jest.Mock).mockReturnValue({ success: true });
		mockCurried(
                sectionController.changeSectionName as jest.Mock,
                new Error(errorMessage)
            );
		await changeSectionName(req as Request, res);
		expect(sectionController.changeSectionName).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorConflict);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
	})

	test("200s and returns section with new name", async () => {
		const section = { id: 1, name: "Movies" };
		req.body = { new_name: "new_name", section_id: 1 };
		(utils.mergeResults as jest.Mock).mockReturnValue({ success: true });
		mockCurried(
                sectionController.changeSectionName as jest.Mock,
                section
            );
		jest.spyOn(utils, "sanitizeResponse").mockImplementation((_r, res) => {
			res.status(StatusCode.SuccessOK).json(section);
			return res;
		});
		await changeSectionName(req as Request, res);
		expect(sectionController.changeSectionName).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
    	expect(res.json).toHaveBeenCalledWith(section);
	})
})