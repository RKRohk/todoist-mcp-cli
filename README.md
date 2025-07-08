# Todoist MCP CLI

This project provides a Model-Context-Protocol (MCP) server for managing Todoist tasks using the Getting-Things-Done (GTD) methodology. It allows you to connect your Todoist account to various AI models and development environments like Gemini, Claude, and Cursor to manage your tasks with natural language.

## Prerequisites

Before you begin, ensure you have the following:

- [Node.js](https://nodejs.org/) (v18 or higher) and npm
- A [Todoist](https://todoist.com/) account
- Access to an AI model that supports MCP (e.g., Gemini, Claude, Cursor)

## Installation and Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/RKRohk/todoist-mcp-cli.git
    cd todoist-mcp-cli
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:

    ```bash
    cp .env.example .env
    ```

    Open the `.env` file and add your Todoist API token and project IDs:

    ```
    TODOIST_API_TOKEN=your_todoist_api_token
    TODOIST_INBOX_PROJECT_ID=your_inbox_project_id
    TODOIST_SOMEDAY_MAYBE_PROJECT_ID=your_someday_maybe_project_id
    ```

    You can find your Todoist API token in your [Todoist settings](https://todoist.com/app/settings/integrations). To get the project IDs, open Todoist in your browser and click on the "Inbox" and "Someday/Maybe" projects. The ID will be in the URL (e.g., `https://todoist.com/app/project/1234567890`).

4.  **Build the project:**

    ```bash
    npm run build
    ```

5.  **Install the CLI globally:**
    To make the `todoist-mcp-cli` command available system-wide, run one of the following commands:
    ```bash
    npm link
    # OR
    npm install -g .
    ```

## Running the Server

Once installed, you can start the MCP server by running the following command in your terminal:

```bash
todoist-mcp-cli
```

The server will start and listen for requests from your AI model.

## Integration with AI Models

### Gemini

To use this server with the Gemini CLI, you can specify the tool using the `--tool_code_file` flag:

```bash
gemini --tool_code_file $(which todoist-mcp-cli) "add a task to buy milk"
```

### Claude

To integrate with Claude, you will need to configure it to use the local MCP server. This is typically done in the settings of your Claude client. Refer to the documentation of your specific Claude client for instructions on how to add a custom tool or MCP server.

### Cursor

In Cursor, you can add the `todoist-mcp-cli` as a custom command or tool in the settings. This will allow you to use natural language commands to interact with your Todoist tasks directly from the editor.

## Available Tools

This MCP server provides the following tools:

- `addTask`: Add a new task to Todoist.
- `listTasks`: List tasks from Todoist.
- `processTask`: Move a task to a different project.
- `deleteTask`: Delete a task from Todoist.
- `updateTask`: Update a task in Todoist.
- `getProjectDetails`: Get details for a specific project.
- `getProjects`: List all projects.
- `getLabels`: Get all labels from Todoist.
- `createLabel`: Create a new label in Todoist.
- `getFilters`: Get filters from Todoist.
- `createProject`: Create a new project in Todoist.
- `deleteProject`: Delete a project from Todoist.
- `weeklyReview`: Perform a weekly review of your Todoist tasks and projects.

## Usage Examples

Here are a few examples of how you can use the server with natural language prompts:

- `"Add a task to buy milk and add the 'groceries' label"`
- `"List all tasks in my 'Work' project"`
- `"Move the task 'Finish report' to the 'Done' project"`
- `"What are the details for the 'Personal' project?"`

## Development

To run the server in development mode without installing it globally, you can use the following command:

```bash
npm run start:mcp
```

To run the tests, use:

```bash
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the ISC License.
