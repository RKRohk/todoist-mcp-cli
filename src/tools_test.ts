import { TodoistApi } from "@doist/todoist-api-typescript";
import dotenv from "dotenv";
import { listTasks } from "./tools";

dotenv.config();

const api = new TodoistApi(process.env.TODOIST_API_TOKEN!);

listTasks(api).then((tasks) => console.log(tasks));
