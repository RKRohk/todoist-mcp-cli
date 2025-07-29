# Todoist MCP Server

A Model Context Protocol (MCP) server that integrates Todoist task management with AI models, enabling natural language task management through AI assistants like Claude, Gemini, Cursor, and other MCP-compatible tools.

## Features

- **Complete Task Management**: Add, list, update, delete, and complete tasks
- **Project Organization**: Create, manage, and organize projects hierarchically  
- **Label Management**: Create and manage labels with color coding
- **Hierarchical Data**: Maintains parent-child relationships for tasks and projects
- **GTD Integration**: Built with Getting Things Done methodology in mind
- **Universal AI Compatibility**: Works with any MCP-compatible AI assistant

## Prerequisites

- Node.js v18.0.0 or higher
- npm (comes with Node.js)
- Todoist account and API token

## Installation

### From npm (Recommended)

```bash
npm install -g todoist-mcp-cli
```

### From Source

```bash
git clone https://github.com/rkrohk/todoist-mcp-cli.git
cd todoist-mcp-cli
npm install
npm run build
npm install -g .
```

## Configuration

### 1. Get Your Todoist API Token

1. Go to [Todoist Settings > Integrations](https://todoist.com/app/settings/integrations)
2. Find the "API token" section
3. Copy your API token

### 2. Set Environment Variable

Create a `.env` file in your project directory:

```env
TODOIST_API_TOKEN=your_actual_api_token_here
```

## AI Client Integration

### Claude Desktop

Add to your Claude Desktop configuration (`~/.claude/config.json`):

```json
{
  "mcpServers": {
    "todoist": {
      "command": "todoist-mcp-cli",
      "env": {
        "TODOIST_API_TOKEN": "your_api_token"
      }
    }
  }
}
```

### Cursor IDE

1. Open Cursor Settings
2. Navigate to MCP Servers configuration
3. Add new server:
   - **Command**: `todoist-mcp-cli`
   - **Environment**: `TODOIST_API_TOKEN=your_token`

### Other MCP Clients

Use the command `todoist-mcp-cli` with your Todoist API token in the environment.

## Available Tools

### Task Management

#### `addTask`
Add a new task to Todoist.

**Parameters:**
- `content` (string): Task description
- `labels` (array, optional): Label names to apply
- `projectId` (string, optional): Target project ID
- `parentId` (string, optional): Parent task ID for subtasks

#### `listTasks`
List tasks with optional filtering.

**Parameters:**
- `label` (string, optional): Filter by label name
- `projectId` (string, optional): Filter by project ID

#### `updateTask`
Update an existing task.

**Parameters:**
- `taskId` (string): Task ID to update
- `options` (object): Update options
  - `content` (string, optional): New task content
  - `dueString` (string, optional): Due date in natural language
  - `priority` (number, optional): Priority level (1-4)
  - `labels` (array, optional): New label set

#### `completeTask`
Mark task(s) as complete.

**Parameters:**
- `taskId` (string, optional): Single task ID to complete
- `taskIds` (array, optional): Multiple task IDs to complete

#### `deleteTask`
Delete a task.

**Parameters:**
- `taskId` (string): Task ID to delete

#### `processTask`
Move a task to a different project (GTD processing).

**Parameters:**
- `taskId` (string): Task to move
- `projectId` (string): Destination project ID

### Project Management

#### `getProjects`
List all projects in hierarchical structure.

#### `createProject`
Create a new project.

**Parameters:**
- `name` (string): Project name
- `parentId` (string, optional): Parent project ID
- `color` (string, optional): Color name
- `isFavorite` (boolean, optional): Mark as favorite

#### `getProjectDetails`
Get detailed information about a specific project.

**Parameters:**
- `projectId` (string): Project ID

#### `deleteProject`
Delete a project.

**Parameters:**
- `projectId` (string): Project ID to delete

### Label Management

#### `getLabels`
List all available labels.

#### `createLabel`
Create a new label.

**Parameters:**
- `name` (string): Label name
- `color` (string, optional): Color name
- `isFavorite` (boolean, optional): Mark as favorite

### Available Colors

For projects and labels, you can use these colors:
`berry_red`, `red`, `orange`, `yellow`, `lime_green`, `green`, `mint_green`, `teal`, `sky_blue`, `blue`, `grape`, `violet`, `lavender`, `magenta`, `salmon`, `charcoal`, `grey`, `taupe`

## Usage Examples

### Basic Task Management

```
"Add a task 'Buy groceries' with label 'personal'"
"Show me all tasks in my Work project"
"Complete the task about finishing the report"
"Update my presentation task to be due tomorrow"
```

### Project Organization

```
"Create a new project called 'Home Renovation'"
"Show me all my projects"
"Move the 'Call contractor' task to my Home project"
```

### GTD Workflows

```
"Show me my inbox tasks that need processing"
"List all tasks with the 'next_actions' label"
"Move this task from inbox to my Personal project"
```

## Development

### Running in Development

```bash
# Install dependencies
npm install

# Run MCP server in development
npm run start:mcp

# Run tests
npm test

# Build project
npm run build
```

### Project Structure

```
├── src/
│   ├── mcp_server.ts     # MCP server implementation (main executable)
│   ├── tools.ts          # Core Todoist API functions
│   └── index.ts          # CLI entry point
├── build/                # Compiled TypeScript output
└── package.json          # Project configuration
```

## Troubleshooting

### Common Issues

**"API Token Invalid"**
- Verify your API token in Todoist Settings
- Check the token is correctly set in your environment
- Ensure no extra spaces in the token

**"Command Not Found"**
- Reinstall globally: `npm install -g todoist-mcp-cli`
- Check your PATH includes npm global bin directory
- Try using `npx todoist-mcp-cli`

**MCP Connection Issues**
- Verify environment variables are accessible to your AI client
- Check that the server command is correct in your AI client config
- Try restarting both the server and AI client

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with the [Model Context Protocol](https://modelcontextprotocol.io/)
- Powered by the [Todoist API](https://developer.todoist.com/)
- Inspired by [Getting Things Done](https://gettingthingsdone.com/) methodology
