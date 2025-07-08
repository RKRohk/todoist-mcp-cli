import { weeklyReview } from "./tools.js";
import { TodoistApi } from "@doist/todoist-api-typescript";

jest.mock("@doist/todoist-api-typescript");

const mockedTodoistApi = TodoistApi as jest.MockedClass<typeof TodoistApi>;

describe("weeklyReview", () => {
  it("should return a weekly review object", async () => {
    const inboxTasks = [{ id: "1", content: "Inbox Task" }];
    const overdueTasks = [{ id: "2", content: "Overdue Task" }];
    const waitingForTasks = [{ id: "3", content: "Waiting For Task" }];
    const projects = [{ id: "4", name: "Test Project" }];
    const somedayMaybeTasks = [{ id: "5", content: "Someday/Maybe Task" }];

    const mockApi = {
      getTasks: jest.fn().mockImplementation((params) => {
        if (params.projectId === "inboxId")
          return Promise.resolve({ results: inboxTasks });
        if (params.filter === "overdue")
          return Promise.resolve({ results: overdueTasks });
        if (params.label === "waiting_for_💤")
          return Promise.resolve({ results: waitingForTasks });
        if (params.projectId === "somedayMaybeId")
          return Promise.resolve({ results: somedayMaybeTasks });
        return Promise.resolve({ results: [] });
      }),
      getProjects: jest.fn().mockResolvedValue({ results: projects }),
    };

    const reviewData = await weeklyReview(
      mockApi as any,
      "inboxId",
      "somedayMaybeId"
    );

    expect(reviewData).toEqual({
      inboxTasks: [{ id: "1", content: "Inbox Task", children: [] }],
      overdueTasks: [{ id: "2", content: "Overdue Task", children: [] }],
      waitingForTasks: [{ id: "3", content: "Waiting For Task", children: [] }],
      projects: [{ id: "4", name: "Test Project", children: [] }],
      somedayMaybeTasks: [
        { id: "5", content: "Someday/Maybe Task", children: [] },
      ],
    });
  });
});
