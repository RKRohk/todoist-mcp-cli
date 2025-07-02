import { Task, TodoistApi, PersonalProject, WorkspaceProject } from "@doist/todoist-api-typescript";


export async function addTask(
  api: TodoistApi,
  content: string,
  labels: string[]
) {
  try {
    const task = await api.addTask({ content: content, labels: labels });
    console.log(`Added task: ${task.content}`);
    return task;
  } catch (error) {
    console.error(error);
  }
}

export async function listTasks(
  api: TodoistApi,
  label?: string,
  projectId?: string
) {
  try {
    const tasks = await api.getTasks({ label: label, projectId: projectId });
    if (tasks.results.length === 0) {
      console.log("No tasks found.");
      return [];
    }
    console.log("Tasks:");
    tasks.results.forEach((task) => {
      console.log(`- ${task.content} (ID: ${task.id})`);
    });
    const taskGraph = createTaskGraph(tasks.results);
    const taskGraphForDisplay = JSON.parse(JSON.stringify(taskGraph));
    taskGraphForDisplay.forEach((task: any) => {
      delete task.userId;
      delete task.addedByUid;
      delete task.assignedByUid;
      delete task.responsibleUid;
      delete task.url;
    });
    console.log(JSON.stringify(taskGraphForDisplay));
    return taskGraph;
  } catch (error) {
    console.error(error);
  }
}

interface TaskWithChildren extends Task {
  children: TaskWithChildren[];
}
type TaskGraph = TaskWithChildren[];

const createTaskGraph = (tasks: Task[]) => {
  const tasksMap = new Map<string, TaskWithChildren>();
  const roots: TaskWithChildren[] = [];

  for (const task of tasks) {
    tasksMap.set(task.id, { ...task, children: [] });
  }

  for (const task of tasks) {
    const taskWithChildren = tasksMap.get(task.id);
    if (task.parentId && tasksMap.has(task.parentId)) {
      const parent = tasksMap.get(task.parentId)!;
      parent.children.push(taskWithChildren!);
    } else {
      roots.push(taskWithChildren!);
    }
  }

  return roots;
};

const getTaskWithChildren = (
  task: Task | TaskWithChildren
): TaskWithChildren => {
  if ("children" in task) {
    return task;
  } else {
    (task as TaskWithChildren).children = [];
    return task as TaskWithChildren;
  }
};

export async function processTask(
  api: TodoistApi,
  taskId: string,
  projectId: string
) {
  try {
    await api.moveTasks([taskId], { projectId: projectId });
    console.log(`Moved task ${taskId} to project ${projectId}`);
  } catch (error) {
    console.error(error);
  }
}

export async function deleteTask(api: TodoistApi, taskId: string) {
  try {
    await api.deleteTask(taskId);
    console.log(`Deleted task ${taskId}`);
  } catch (error) {
    console.error(error);
  }
}

export async function updateTask(
  api: TodoistApi,
  taskId: string,
  options: {
    content?: string;
    dueString?: string;
    priority?: number;
    labels?: string[];
  }
) {
  try {
    await api.updateTask(taskId, options);
    console.log(`Updated task ${taskId}`);
  } catch (error) {
    console.error(error);
  }
}

type Project = PersonalProject | WorkspaceProject;

type ProjectWithChildren = Project & {
  children: ProjectWithChildren[];
};
type ProjectGraph = ProjectWithChildren[];

const createProjectGraph = (projects: Project[]): ProjectGraph => {
  const projectsMap = new Map<string, ProjectWithChildren>();
  const roots: ProjectWithChildren[] = [];

  for (const project of projects) {
    projectsMap.set(project.id, { ...project, children: [] });
  }

  for (const project of projects) {
    const projectWithChildren = projectsMap.get(project.id);
    if ("parentId" in project && project.parentId && projectsMap.has(project.parentId)) {
      const parent = projectsMap.get(project.parentId)!;
      parent.children.push(projectWithChildren!);
    } else {
      roots.push(projectWithChildren!);
    }
  }

  return roots;
};

export async function getProjects(api: TodoistApi) {
  try {
    const projects = await api.getProjects();
    if (projects.results.length === 0) {
      console.log("No projects found.");
      return [];
    }
    const projectGraph = createProjectGraph(projects.results);
    return projectGraph;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProjectDetails(api: TodoistApi, projectId: string) {
  try {
    const project = await api.getProject(projectId);
    console.log(`Project details for ${project.name}:`);
    console.log(JSON.stringify(project, null, 2));
    return project;
  } catch (error) {
    console.error(error);
  }
}
