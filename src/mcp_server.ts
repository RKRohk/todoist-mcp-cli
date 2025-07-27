#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { TodoistApi } from "@doist/todoist-api-typescript";
import * as dotenv from "dotenv";
import {
  addTask,
  listTasks,
  processTask,
  deleteTask,
  updateTask,
  getProjectDetails,
  getProjects,
  getLabels,
  createLabel,
  getFilters,
  createProject,
  deleteProject,
  completeTask,
  completeTasks,
} from "./tools.js";

dotenv.config();

const api = new TodoistApi(process.env.TODOIST_API_TOKEN || "");

const server = new McpServer({
  name: "todoist-mcp-server",
  version: "1.0.0",
});

server.registerTool(
  "addTask",
  {
    title: "Add Task",
    description: "Add a new task to Todoist",
    inputSchema: {
      content: z.string(),
      labels: z.array(z.string()).optional(),
      projectId: z.string().optional(),
      parentId: z.string().optional(),
    },
  },
  async ({ content, labels, projectId, parentId }) => {
    const task = await addTask(api, content, labels || [], projectId, parentId);
    return { content: [{ type: "text", text: JSON.stringify(task, null, 2) }] };
  }
);

server.registerTool(
  "listTasks",
  {
    title: "List Tasks",
    description: "List tasks from Todoist",
    inputSchema: {
      label: z.string().optional(),
      projectId: z.string().optional(),
    },
  },
  async ({ label, projectId }) => {
    const tasks = await listTasks(api, label, projectId);
    if ("error" in tasks) {
      return { content: [{ type: "text", text: `Error: ${tasks.error}` }] };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(tasks, null, 2) }],
    };
  }
);

server.registerTool(
  "processTask",
  {
    title: "Process Task",
    description: "Move a task to a different project",
    inputSchema: {
      taskId: z.string(),
      projectId: z.string(),
    },
  },
  async ({ taskId, projectId }) => {
    await processTask(api, taskId, projectId);
    return { content: [{ type: "text", text: `Task ${taskId} processed.` }] };
  }
);

server.registerTool(
  "deleteTask",
  {
    title: "Delete Task",
    description: "Delete a task from Todoist",
    inputSchema: {
      taskId: z.string(),
    },
  },
  async ({ taskId }) => {
    await deleteTask(api, taskId);
    return { content: [{ type: "text", text: `Task ${taskId} deleted.` }] };
  }
);

server.registerTool(
  "updateTask",
  {
    title: "Update Task",
    description: "Update a task in Todoist",
    inputSchema: {
      taskId: z.string(),
      options: z.object({
        content: z.string().optional(),
        dueString: z.string().optional(),
        priority: z.number().optional(),
        labels: z.array(z.string()).optional(),
      }),
    },
  },
  async ({ taskId, options }) => {
    await updateTask(api, taskId, options);
    return { content: [{ type: "text", text: `Task ${taskId} updated.` }] };
  }
);

server.registerTool(
  "getProjectDetails",
  {
    title: "Get Project Details",
    description: "Get details for a specific project",
    inputSchema: {
      projectId: z.string(),
    },
  },
  async ({ projectId }) => {
    const project = await getProjectDetails(api, projectId);
    return {
      content: [{ type: "text", text: JSON.stringify(project, null, 2) }],
    };
  }
);

server.registerTool(
  "getProjects",
  {
    title: "Projects",
    description: "List all projects",
  },
  async () => {
    const projects = await getProjects(api);
    if ("error" in projects) {
      return { content: [{ type: "text", text: `Error: ${projects.error}` }] };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(projects, null, 2) }],
    };
  }
);

server.registerTool(
  "getLabels",
  {
    title: "Get Labels",
    description: "Get all labels from Todoist",
    inputSchema: {},
  },
  async () => {
    const labels = await getLabels(api);
    return {
      content: [{ type: "text", text: JSON.stringify(labels, null, 2) }],
    };
  }
);

server.registerTool(
  "createLabel",
  {
    title: "Create Label",
    description:
      "Create a new label in Todoist. Allowed colors are: berry_red, red, orange, yellow, lime_green, green, mint_green, teal, sky_blue, blue, grape, violet, lavender, magenta, salmon, charcoal, grey, taupe.",
    inputSchema: {
      name: z.string(),
      color: z.string().optional(),
      isFavorite: z.boolean().optional(),
    },
  },
  async ({ name, color, isFavorite }) => {
    const label = await createLabel(api, name, color, isFavorite);
    return {
      content: [{ type: "text", text: JSON.stringify(label, null, 2) }],
    };
  }
);

server.registerTool(
  "getFilters",
  {
    title: "Get Filters",
    description:
      "Get filters from Todoist. Note: The Todoist API does not have a direct 'getFilters' method. Filters are typically used to query tasks, not managed as separate entities.",
    inputSchema: {},
  },
  async () => {
    const filters = await getFilters(api);
    return {
      content: [{ type: "text", text: JSON.stringify(filters, null, 2) }],
    };
  }
);

server.registerTool(
  "createProject",
  {
    title: "Create Project",
    description:
      "Create a new project in Todoist. Allowed colors are: berry_red, red, orange, yellow, lime_green, green, mint_green, teal, sky_blue, blue, grape, violet, lavender, magenta, salmon, charcoal, grey, taupe.",
    inputSchema: {
      name: z.string(),
      parentId: z.string().optional(),
      color: z.string().optional(),
      isFavorite: z.boolean().optional(),
    },
  },
  async ({ name, parentId, color, isFavorite }) => {
    const project = await createProject(api, name, parentId, color, isFavorite);
    return {
      content: [{ type: "text", text: JSON.stringify(project, null, 2) }],
    };
  }
);

server.registerTool(
  "deleteProject",
  {
    title: "Delete Project",
    description: "Delete a project from Todoist",
    inputSchema: {
      projectId: z.string(),
    },
  },
  async ({ projectId }) => {
    await deleteProject(api, projectId);
    return {
      content: [{ type: "text", text: `Project ${projectId} deleted.` }],
    };
  }
);

server.registerTool(
  "completeTask",
  {
    title: "Complete Task",
    description: "Mark a task or multiple tasks as complete in Todoist",
    inputSchema: {
      taskId: z.string().optional(),
      taskIds: z.array(z.string()).optional(),
    },
  },
  async ({ taskId, taskIds }) => {
    try {
      // Input validation: ensure exactly one parameter is provided
      if ((taskId && taskIds) || (!taskId && !taskIds)) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              error: "Invalid input: Must provide either 'taskId' for single task completion or 'taskIds' for multiple task completion, but not both or neither."
            }, null, 2)
          }]
        };
      }

      // Additional validation for taskIds array
      if (taskIds && taskIds.length === 0) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              error: "Invalid input: 'taskIds' array cannot be empty. Provide at least one task ID."
            }, null, 2)
          }]
        };
      }

      let results: Array<{taskId: string, success: boolean, task?: any, error?: string}> = [];

      if (taskId) {
        // Single task completion
        const result = await completeTask(api, taskId);
        if ("error" in result) {
          results.push({
            taskId,
            success: false,
            error: result.error
          });
        } else {
          results.push({
            taskId,
            success: true,
            task: result
          });
        }
      } else if (taskIds) {
        // Multiple task completion
        const batchResults = await completeTasks(api, taskIds);
        results = batchResults.map(({ taskId, result }) => {
          if ("error" in result) {
            return {
              taskId,
              success: false,
              error: result.error
            };
          } else {
            return {
              taskId,
              success: true,
              task: result
            };
          }
        });
      }

      // Create summary
      const summary = {
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      };

      const response = {
        results,
        summary
      };

      return {
        content: [{
          type: "text",
          text: JSON.stringify(response, null, 2)
        }]
      };
    } catch (error: any) {
      // Handle any unexpected errors at the MCP tool level
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: `Unexpected error in completeTask tool: ${error.message}`
          }, null, 2)
        }]
      };
    }
  }
);


const transport = new StdioServerTransport();
server.connect(transport);
