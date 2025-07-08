import { TodoistApi } from "@doist/todoist-api-typescript";
import * as dotenv from "dotenv";

dotenv.config();

import {
  addTask,
  listTasks,
  processTask,
  deleteTask,
  updateTask,
  getProjectDetails,
  getLabels,
  createLabel,
  getFilters,
} from "./tools.js";

const api = new TodoistApi(process.env.TODOIST_API_TOKEN || "");

export async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "add":
      const taskContent = args
        .slice(1)
        .filter((arg) => !arg.startsWith("@"))
        .join(" ");
      const labels = args
        .slice(1)
        .filter((arg) => arg.startsWith("@"))
        .map((label) => label.substring(1));
      if (!taskContent) {
        console.error("Please provide a task to add.");
        process.exit(1);
      }
      await addTask(api, taskContent, labels);
      break;
    case "list":
      const listLabel =
        args[1] && !args[1].startsWith("--") ? args[1] : undefined;
      const listProjectId = args
        .find((arg) => arg.startsWith("--projectId="))
        ?.split("=")[1];
      await listTasks(api, listLabel, listProjectId);
      break;
    case "process":
      const processTaskId = args[1];
      const processProjectId = args[2];
      if (!processTaskId || !processProjectId) {
        console.error("Please provide a task ID and project ID to process.");
        process.exit(1);
      }
      await processTask(api, processTaskId, processProjectId);
      break;
    case "delete":
      const deleteTaskId = args[1];
      if (!deleteTaskId) {
        console.error("Please provide a task ID to delete.");
        process.exit(1);
      }
      await deleteTask(api, deleteTaskId);
      break;
    case "update":
      const updateTaskId = args[1];
      if (!updateTaskId) {
        console.error("Please provide a task ID to update.");
        process.exit(1);
      }
      const updateOptions: {
        content?: string;
        dueString?: string;
        priority?: number;
        labels?: string[];
      } = {};
      for (let i = 2; i < args.length; i++) {
        if (args[i].startsWith("--content=")) {
          updateOptions.content = args[i].split("=")[1];
        } else if (args[i].startsWith("--due=")) {
          updateOptions.dueString = args[i].split("=")[1];
        } else if (args[i].startsWith("--priority=")) {
          updateOptions.priority = parseInt(args[i].split("=")[1]);
        } else if (args[i].startsWith("--labels=")) {
          updateOptions.labels = args[i].split("=")[1].split(",");
        }
      }
      await updateTask(api, updateTaskId, updateOptions);
      break;
    case "project-details":
      const projectDetailsId = args[1];
      if (!projectDetailsId) {
        console.error("Please provide a project ID.");
        process.exit(1);
      }
      await getProjectDetails(api, projectDetailsId);
      break;
    case "get-labels":
      await getLabels(api);
      break;
    case "create-label":
      const labelName = args[1];
      if (!labelName) {
        console.error("Please provide a label name.");
        process.exit(1);
      }
      const labelColor = args
        .find((arg) => arg.startsWith("--color="))
        ?.split("=")[1];
      const labelFavorite = args.find((arg) => arg === "--favorite")
        ? true
        : undefined;
      await createLabel(api, labelName, labelColor, labelFavorite);
      break;
    case "get-filters":
      await getFilters(api);
      break;
    default:
      console.log(
        "Unknown command. Available commands: add, list, process, delete, update, project-details, get-labels, create-label, get-filters"
      );
      process.exit(1);
  }
}
