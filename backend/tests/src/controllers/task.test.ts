import { PrismaClient, Task } from "../../../generated/prisma";
import * as taskController from "../../../src/controllers/task.ts"
import * as taskService from "../../../src/services/task.ts"

jest.mock("../../../src/services/task");

const prismaMock = (props: object = {}) => ({ ...props } as jest.Mocked<PrismaClient>);
jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

describe("Get All Tasks Controller", () => {
    test('If service returns, then controller should return service value', async () => {
       const taskData  = [{name: "name", complete: false}];
       (taskService.getAllTasks as jest.Mock).mockResolvedValueOnce(taskData);
       const response = await taskController.getAllTasksController(prismaMock());
       expect(response).toEqual(taskData);
    })

    test("If an error occurs, it should return the error", async () => {
       (taskService.getAllTasks as jest.Mock).mockRejectedValueOnce(new Error("Error message"));
       const response = await taskController.getAllTasksController(prismaMock());
       expect(response).toBeInstanceOf(Error);
    })
})

describe("Create Task Controller", () => {
    test('If service returns, then controller should return service value', async () => {
        const task: Task = {id: 1, name: "name", createdAt: new Date(), complete: false};
       (taskService.createTask as jest.Mock).mockReturnValueOnce(
            jest.fn().mockResolvedValueOnce(task)
        );
       const response = await taskController.createTaskController(prismaMock())(task.name, task.complete);
       expect(response).toEqual(task);
    })

    test("If an error occurs, it should return the error", async () => {
        (taskService.createTask as jest.Mock).mockReturnValue(
            jest.fn().mockRejectedValue(new Error("Error message"))
        );
       const response = await taskController.createTaskController(prismaMock())("", false);
       expect(response).toBeInstanceOf(Error);
    })
})