import {
  Task,
  TodoistApi,
  PersonalProject,
  WorkspaceProject,
} from "@doist/todoist-api-typescript";

export async function addTask(
  api: TodoistApi,
  content: string,
  labels: string[],
  projectId?: string,
  parentId?: string
) {
  try {
    const task = await api.addTask({
      content: content,
      labels: labels,
      projectId,
      parentId,
    });
    return task;
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function listTasks(
  api: TodoistApi,
  label?: string,
  projectId?: string,
  filter?: string
) {
  try {
    const params: {
      label?: string;
      projectId?: string;
      filter?: string;
    } = {};

    if (label) {
      params.label = label;
    }
    if (projectId) {
      params.projectId = projectId;
    }
    if (filter) {
      params.filter = filter;
    }

    const tasks = await api.getTasks(params);
    const taskGraph = createTaskGraph(tasks.results);
    return taskGraph;
  } catch (error: any) {
    return { error: error.message };
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
    return `Task ${taskId} processed.`;
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteTask(api: TodoistApi, taskId: string) {
  try {
    await api.deleteTask(taskId);
    return `Deleted task ${taskId}`;
  } catch (error: any) {
    return { error: error.message };
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
    return `Task ${taskId} updated.`;
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getProjects(api: TodoistApi) {
  try {
    const projects = await api.getProjects();
    const projectGraph = createProjectGraph(projects.results);
    return projectGraph;
  } catch (error: any) {
    return { error: error.message };
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
    if (
      "parentId" in project &&
      project.parentId &&
      projectsMap.has(project.parentId)
    ) {
      const parent = projectsMap.get(project.parentId)!;
      parent.children.push(projectWithChildren!);
    } else {
      roots.push(projectWithChildren!);
    }
  }

  return roots;
};

export async function getProjectDetails(api: TodoistApi, projectId: string) {
  try {
    const project = await api.getProject(projectId);
    return project;
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getLabels(api: TodoistApi) {
  try {
    const labels = await api.getLabels({});
    return labels.results;
  } catch (error: any) {
    return { error: error.message };
  }
}

const COLOR_MAP: { [key: string]: number } = {
  berry_red: 30,
  red: 31,
  orange: 32,
  yellow: 33,
  olive_green: 34,
  lime_green: 35,
  green: 36,
  mint_green: 37,
  teal: 38,
  sky_blue: 39,
  light_blue: 40,
  blue: 41,
  grape: 42,
  violet: 43,
  lavender: 44,
  magenta: 45,
  salmon: 46,
  charcoal: 47,
  grey: 48,
  taupe: 49,
};

export async function createLabel(
  api: TodoistApi,
  name: string,
  color?: string,
  isFavorite?: boolean
) {
  try {
    const colorId = color ? COLOR_MAP[color] : undefined;
    const label = await api.addLabel({ name, color: colorId, isFavorite });
    return label;
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getFilters(api: TodoistApi) {
  try {
    return [];
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createProject(
  api: TodoistApi,
  name: string,
  parentId?: string,
  color?: string,
  isFavorite?: boolean
) {
  try {
    const colorId = color ? COLOR_MAP[color] : undefined;
    const project = await api.addProject({
      name,
      parentId,
      color: colorId,
      isFavorite,
    });
    return project;
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteProject(api: TodoistApi, projectId: string) {
  try {
    await api.deleteProject(projectId);
    return `Deleted project ${projectId}`;
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function completeTask(api: TodoistApi, taskId: string): Promise<Task | { error: string }> {
  try {
    // First get the task details before closing it
    const task = await api.getTask(taskId);
    // Close the task
    const success = await api.closeTask(taskId);
    if (success) {
      return task;
    } else {
      return { error: `Failed to complete task ${taskId}` };
    }
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function completeTasks(
  api: TodoistApi,
  taskIds: string[]
): Promise<Array<{ taskId: string, result: Task | { error: string } }>> {
  const results: Array<{ taskId: string, result: Task | { error: string } }> = [];

  // Process tasks sequentially to avoid API rate limits
  for (const taskId of taskIds) {
    const result = await completeTask(api, taskId);
    results.push({
      taskId,
      result
    });
  }

  return results;
}



