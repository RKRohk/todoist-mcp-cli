# Todoist MCP CLI

A powerful Model Context Protocol (MCP) server that seamlessly integrates Todoist task management with AI models using the proven Getting Things Done (GTD) methodology. Transform your productivity workflow by managing tasks through natural language conversations with AI assistants like Claude, Gemini, and Cursor.

## 🚀 Value Proposition

- **Natural Language Task Management**: Interact with your Todoist tasks using conversational AI
- **GTD Methodology Integration**: Built-in support for Getting Things Done principles and workflows
- **Universal AI Compatibility**: Works with Claude Desktop, Gemini, Cursor, and other MCP-compatible AI tools
- **Hierarchical Task Organization**: Maintains parent-child relationships and project structures
- **Comprehensive Workflow Support**: From inbox processing to weekly reviews

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** v18.0.0 or higher ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Todoist account** ([Sign up here](https://todoist.com/))
- **AI model access** that supports MCP (Claude Desktop, Gemini, Cursor, etc.)

## 🛠 Installation

### Method 1: NPM Installation (Recommended)

```bash
# Install globally from npm
npm install -g todoist-mcp-cli

# Verify installation
todoist-mcp-cli --version
```

### Method 2: From Source (Development)

```bash
# Clone the repository
git clone https://github.com/username/todoist-mcp-cli.git
cd todoist-mcp-cli

# Install dependencies
npm install

# Build the project
npm run build

# Install globally
npm link
# OR
npm install -g .
```

### Method 3: Direct Download

```bash
# Download and install in one command
npx todoist-mcp-cli
```

## ⚙️ Configuration

### 1. Get Your Todoist API Token

1. Go to [Todoist Settings > Integrations](https://todoist.com/app/settings/integrations)
2. Scroll down to "API token" section
3. Copy your API token

### 2. Find Your Project IDs

1. Open Todoist in your browser
2. Navigate to your "Inbox" project
3. Copy the ID from the URL: `https://todoist.com/app/project/1234567890`
4. Repeat for your "Someday/Maybe" project (create one if needed)

### 3. Set Environment Variables

Create a `.env` file in your project directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Your Todoist API token from step 1
TODOIST_API_TOKEN=your_actual_api_token_here
```

## 🤖 AI Model Integration

### Claude Desktop

Add to your Claude Desktop configuration file (`~/.claude/config.json`):

```json
{
  "mcpServers": {
    "todoist": {
      "command": "todoist-mcp-cli",
      "args": [],
      "env": {
        "TODOIST_API_TOKEN": "your_api_token"
      }
    }
  }
}
```


### Cursor IDE

1. Open Cursor Settings (Cmd/Ctrl + ,)
2. Navigate to "Extensions" > "MCP Servers"
3. Add a new server:
   - **Name**: Todoist
   - **Command**: `todoist-mcp-cli`
   - **Environment Variables**: Add your Todoist credentials

### Other MCP Clients

For any MCP-compatible client, use:
- **Server Command**: `todoist-mcp-cli`
- **Protocol**: Model Context Protocol v1.0
- **Transport**: stdio

## 🔧 Available Tools

### Task Management

#### `addTask`
Add a new task to Todoist with optional labels, project, and parent task.

**Parameters:**
- `content` (string): Task description
- `labels` (array): Label names to apply
- `projectId` (string, optional): Target project ID
- `parentId` (string, optional): Parent task ID for subtasks

**Example:**
```
"Add a task 'Review quarterly reports' with labels 'work' and 'urgent' to my Work project"
```

#### `listTasks`
Retrieve tasks with filtering options and hierarchical structure.

**Parameters:**
- `label` (string, optional): Filter by label name
- `projectId` (string, optional): Filter by project ID
- `filter` (string, optional): Todoist filter syntax

**Example:**
```
"Show me all tasks with the 'next_actions' label"
"List overdue tasks"
```

#### `updateTask`
Modify existing task properties.

**Parameters:**
- `taskId` (string): Task ID to update
- `content` (string, optional): New task content
- `dueString` (string, optional): Due date in natural language
- `priority` (number, optional): Priority level (1-4)
- `labels` (array, optional): New label set

**Example:**
```
"Update task 'Finish presentation' to be due tomorrow with high priority"
```

#### `processTask`
Move a task to a different project (GTD processing).

**Parameters:**
- `taskId` (string): Task to move
- `projectId` (string): Destination project ID

**Example:**
```
"Move the 'Call dentist' task from Inbox to Personal project"
```

#### `deleteTask`
Remove a task from Todoist.

**Parameters:**
- `taskId` (string): Task ID to delete

### Project Management

#### `getProjects`
List all projects in hierarchical structure.

**Example:**
```
"Show me all my projects"
```

#### `createProject`
Create a new project with optional parent and styling.

**Parameters:**
- `name` (string): Project name
- `parentId` (string, optional): Parent project ID
- `color` (string, optional): Color name (e.g., 'blue', 'red')
- `isFavorite` (boolean, optional): Mark as favorite

**Example:**
```
"Create a new project called 'Home Renovation' under my Personal project"
```

#### `getProjectDetails`
Get detailed information about a specific project.

**Parameters:**
- `projectId` (string): Project ID

### Label Management

#### `getLabels`
List all available labels.

#### `createLabel`
Create a new label with optional color and favorite status.

**Parameters:**
- `name` (string): Label name
- `color` (string, optional): Color name
- `isFavorite` (boolean, optional): Mark as favorite

### GTD Workflows

#### `weeklyReview`
Perform a comprehensive GTD weekly review.

**Returns:**
- Inbox tasks requiring processing
- Overdue tasks needing attention
- Waiting-for items to follow up
- Project overview
- Someday/Maybe items to review

**Example:**
```
"Run my weekly review"
```

## 💡 Usage Examples

### Basic Task Management

```
# Add tasks
"Add 'Buy milk' to my grocery list"
"Create a task to 'Call mom' due tomorrow"
"Add 'Review budget' with high priority and 'finance' label"

# List and filter tasks
"Show me all my work tasks"
"What tasks are due today?"
"List all tasks with the 'waiting_for' label"

# Update tasks
"Mark 'Buy milk' as completed"
"Change the due date of 'Submit report' to Friday"
"Add the 'urgent' label to my presentation task"
```

### GTD Workflows

```
# Inbox processing
"Show me my inbox tasks"
"Move 'Plan vacation' from inbox to Personal project"
"Process my inbox - what needs to be organized?"

# Weekly review
"Run my weekly review"
"What overdue tasks do I have?"
"Show me my waiting-for items"

# Project management
"What projects do I have?"
"Create a new project for 'Website Redesign'"
"Show me all tasks in my Work project"
```

### Advanced Filtering

```
# Using Todoist filter syntax
"Show me tasks with filter '@next_actions & !##Work'"
"List all tasks due this week with high priority"
"Find tasks assigned to me that are overdue"
```

## 🚨 Troubleshooting

### Common Issues

#### "API Token Invalid" Error
**Problem**: Authentication fails with Todoist API
**Solutions:**
1. Verify your API token in [Todoist Settings](https://todoist.com/app/settings/integrations)
2. Check that the token is correctly set in your `.env` file
3. Ensure no extra spaces or characters in the token
4. Try regenerating your API token

#### "Project ID Not Found" Error
**Problem**: Specified project IDs don't exist
**Solutions:**
1. Open Todoist in browser and navigate to the project
2. Copy the ID from the URL (the number after `/project/`)
3. Verify the ID is correctly set in your environment variables
4. Create the "Someday/Maybe" project if it doesn't exist

#### "Command Not Found" Error
**Problem**: `todoist-mcp-cli` command not available
**Solutions:**
1. Reinstall globally: `npm install -g todoist-mcp-cli`
2. Check your PATH includes npm global bin directory
3. Try using `npx todoist-mcp-cli` instead
4. Verify Node.js and npm are properly installed

#### MCP Connection Issues
**Problem**: AI model can't connect to the server
**Solutions:**
1. Ensure the server is running: `todoist-mcp-cli`
2. Check that your AI client is configured correctly
3. Verify environment variables are accessible to the AI client
4. Try restarting both the server and AI client
5. Check for port conflicts (default MCP uses stdio)

#### Rate Limiting Issues
**Problem**: Too many API requests to Todoist
**Solutions:**
1. Reduce frequency of requests
2. Use batch operations when possible
3. Wait a few minutes before retrying
4. Check Todoist API status page

### Environment Issues

#### Missing Environment Variables
```bash
# Check if variables are set
echo $TODOIST_API_TOKEN
echo $TODOIST_INBOX_PROJECT_ID

# If empty, source your .env file
source .env
```

#### Permission Issues
```bash
# Fix executable permissions
chmod +x $(which todoist-mcp-cli)

# Or reinstall globally
npm uninstall -g todoist-mcp-cli
npm install -g todoist-mcp-cli
```

### Getting Help

1. **Check the logs**: Run with debug mode for detailed output
2. **Verify configuration**: Ensure all environment variables are set correctly
3. **Test API connection**: Try accessing Todoist directly to verify credentials
4. **Update dependencies**: Run `npm update` to get latest versions
5. **Report issues**: Open an issue on GitHub with error details and configuration

## 🏃‍♂️ Development

### Running in Development Mode

```bash
# Start MCP server in development
npm run start:mcp

# Run CLI directly
npm run start

# Run tests
npm test

# Build project
npm run build
```

### Project Structure

```
├── src/
│   ├── index.ts          # CLI entry point
│   ├── mcp_server.ts     # MCP server implementation
│   ├── tools.ts          # Core Todoist API functions
│   └── *.test.ts         # Test files
├── build/                # Compiled output
├── .env                  # Environment variables
└── package.json          # Project configuration
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with the [Model Context Protocol](https://modelcontextprotocol.io/)
- Powered by the [Todoist API](https://developer.todoist.com/)
- Inspired by [Getting Things Done](https://gettingthingsdone.com/) methodology

---

**Ready to supercharge your productivity?** Install Todoist MCP CLI today and start managing your tasks with the power of AI! 🚀
