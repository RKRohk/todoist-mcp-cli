import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { TodoistApi } from "@doist/todoist-api-typescript";
import * as dotenv from "dotenv";
import { addTask, listTasks, processTask, deleteTask, updateTask, getProjectDetails, getProjects } from "./tools";

dotenv.config();

const api = new TodoistApi(process.env.TODOIST_API_TOKEN || "");

const server = new McpServer({
    name: "gtd-with-gemini",
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
        },
    },
    async ({ content, labels }) => {
        const task = await addTask(api, content, labels || []);
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
        return { content: [{ type: "text", text: JSON.stringify(tasks, null, 2) }] };
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
        return { content: [{ type: "text", text: JSON.stringify(project, null, 2) }] };
    }
);

server.registerResource(
    "projects",
    "projects://",
    {
        title: "Projects",
        description: "List all projects",
    },
    async () => {
        const projects = await getProjects(api);
        return { contents: [{ uri: "projects://", type: "text", text: JSON.stringify(projects, null, 2) }] };
    }
);


const transport = new StdioServerTransport();
server.connect(transport);

console.log("MCP server started");
