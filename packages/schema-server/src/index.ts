/**
 * IMPORTANT: This file is deprecated and will be replaced with a Python implementation.
 * 
 * See docs/decisions/schema-resolution-strategy.md for the new approach that uses
 * a FastAPI-based schema server. This file is maintained temporarily for
 * backwards compatibility until the new implementation is complete.
 * 
 * DO NOT ADD NEW FEATURES TO THIS FILE. Any new schema server functionality
 * should be implemented in the Python packages/python/schema_server module.
 */

/**
 * Schema-First Schema Server
 * Serves schema files via a RESTful API
 */

import * as fs from 'fs';
import * as path from 'path';

import cors from 'cors';
import express, { Request, Response } from 'express';
import * as yaml from 'js-yaml';
import * as swaggerUi from 'swagger-ui-express';

// Initialize express app
const app = express();
const port = process.env['PORT'] || 3000;

// Enable CORS
app.use(cors());

// Root directory - assuming we're running from project root
const rootDir = process.cwd();
const schemasDir = path.join(rootDir, 'schemas');

// Setup Swagger UI
const swaggerDocument = {
  openapi: '3.1.0',
  info: {
    title: 'Schema Server API',
    version: '1.0.0',
    description: 'API for serving schema files from the Schema-First Knowledge Graph System'
  },
  servers: [
    {
      url: `http://localhost:${port}`,
      description: 'Local development server'
    }
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Health check endpoint',
        responses: {
          '200': {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/schemas': {
      get: {
        summary: 'Get a listing of all available schemas',
        responses: {
          '200': {
            description: 'List of schemas',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      path: { type: 'string' },
                      type: { type: 'string', enum: ['directory', 'file'] },
                      children: {
                        type: 'array',
                        items: { type: 'object' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/schemas/{path}': {
      get: {
        summary: 'Get a specific schema by path',
        parameters: [
          {
            name: 'path',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'Path to the schema file'
          },
          {
            name: 'format',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['json', 'yaml']
            },
            description: 'Format to return the schema in'
          }
        ],
        responses: {
          '200': {
            description: 'Schema file contents',
            content: {
              'application/json': {
                schema: { type: 'object' }
              },
              'application/yaml': {
                schema: { type: 'string' }
              },
              'text/plain': {
                schema: { type: 'string' }
              }
            }
          },
          '404': {
            description: 'Schema not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

// Setup Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Serve schema directory listing
app.get('/schemas', async (req: Request, res: Response) => {
  try {
    const schemas = await listSchemas(schemasDir);
    res.json(schemas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Serve individual schema files
app.get('/schemas/*', async (req: Request, res: Response) => {
  try {
    const schemaPath = req.path.replace('/schemas/', '');
    const fullPath = path.join(schemasDir, schemaPath);
    
    // Check if file exists
    try {
      await fs.promises.access(fullPath);
    } catch {
      return res.status(404).json({ error: 'Schema not found' });
    }
    
    // Read file
    const content = await fs.promises.readFile(fullPath, 'utf-8');
    
    // Parse based on file extension
    let parsed;
    if (fullPath.endsWith('.yaml') || fullPath.endsWith('.yml')) {
      parsed = yaml.load(content);
      res.setHeader('Content-Type', 'application/yaml');
    } else if (fullPath.endsWith('.json')) {
      parsed = JSON.parse(content);
      res.setHeader('Content-Type', 'application/json');
    } else {
      // Default to text
      res.setHeader('Content-Type', 'text/plain');
      return res.send(content);
    }
    
    // Format response based on query param
    const format = req.query.format as string;
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      return res.json(parsed);
    } else if (format === 'yaml') {
      res.setHeader('Content-Type', 'application/yaml');
      return res.send(yaml.dump(parsed));
    }
    
    // Send raw content by default
    res.send(content);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Function to recursively list schemas
async function listSchemas(dir: string, basePath: string = ''): Promise<any[]> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  
  const result = [];
  
  for (const entry of entries) {
    const relativePath = path.join(basePath, entry.name);
    
    if (entry.isDirectory()) {
      const children = await listSchemas(path.join(dir, entry.name), relativePath);
      result.push({
        name: entry.name,
        path: relativePath,
        type: 'directory',
        children
      });
    } else if (entry.isFile() && (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml') || entry.name.endsWith('.json'))) {
      result.push({
        name: entry.name,
        path: relativePath,
        type: 'file'
      });
    }
  }
  
  return result;
}

// Start the server
const server = app.listen(port, () => {
  console.log(`Schema server running at http://localhost:${port}`);
  console.log(`API documentation available at http://localhost:${port}/api-docs`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export { app, server }; 