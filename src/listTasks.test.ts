import { listTasks } from "./tools.js";
import { TodoistApi } from "@doist/todoist-api-typescript";

jest.mock("@doist/todoist-api-typescript");

const mockedTodoistApi = TodoistApi as jest.MockedClass<typeof TodoistApi>;

describe("listTasks", () => {
  it("should return a task graph", async () => {
    const tasks = [
      { id: "1", content: "Task 1", parentId: null },
      { id: "2", content: "Task 2", parentId: "1" },
    ];

    const mockApi = {
      getTasks: jest.fn().mockResolvedValue({ results: tasks }),
    };

    const taskGraph = await listTasks(mockApi as any);

    expect(mockApi.getTasks).toHaveBeenCalled();
    expect(taskGraph).toEqual([
      {
        id: "1",
        content: "Task 1",
        parentId: null,
        children: [{ id: "2", content: "Task 2", parentId: "1", children: [] }],
      },
    ]);
  });
});
