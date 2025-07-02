
import { TodoistApi } from "@doist/todoist-api-typescript";
import { listTasks } from "./tools";
import * as dotenv from "dotenv";

dotenv.config();

console.log("TODOIST_API_KEY:", process.env.TODOIST_API_TOKEN);
const api = new TodoistApi(process.env.TODOIST_API_TOKEN as string);

async function testListTasks() {
  console.log("Testing listTasks...");
  const taskGraph = await listTasks(api);
  console.log("Task graph:", JSON.stringify(taskGraph, null, 2));
}

testListTasks();
