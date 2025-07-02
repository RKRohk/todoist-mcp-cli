import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
    const transport = new StdioClientTransport({
        command: "npx",
        args: ["ts-node", "src/mcp_server.ts"],
    });

    const client = new Client({
        name: "gtd-mcp-client",
        version: "1.0.0",
    });

    await client.connect(transport);

    console.log("MCP client connected");

    const projectsResult = await client.readResource({
        uri: "projects://",
    });
    console.log("projects result:", projectsResult);

    await client.close();
    console.log("MCP client disconnected");
}

main();
