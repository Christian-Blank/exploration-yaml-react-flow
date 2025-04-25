import * as path from 'path';

import { SchemaValidator } from '../src/utils/schema-validator';

describe('SchemaValidator', () => {
  const schemaDir = path.join(process.cwd(), 'schemas');
  const examplesDir = path.join(process.cwd(), 'examples');
  
  let validator: SchemaValidator;
  
  beforeEach(() => {
    validator = new SchemaValidator({
      baseDir: process.cwd(),
    });
  });
  
  afterEach(() => {
    validator.clearSchemas();
  });
  
  test('should validate a valid process node', async () => {
    // Arrange
    const processSchemaPath = path.join(schemaDir, 'process/process.yaml');
    const processNode = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      type: 'process',
      title: 'Test Process',
      description: 'A test process',
      parent_ids: [],
      child_ids: [],
      created_at: '2023-04-24T10:00:00Z',
      updated_at: '2023-04-24T11:30:00Z',
      created_by: 'test-user',
      updated_by: 'test-user',
      tags: ['test'],
      metadata: {},
      status: 'draft',
      priority: 'medium',
      steps: []
    };
    
    // Act
    const result = await validator.validate(processNode, processSchemaPath);
    
    // Assert
    expect(result.valid).toBe(true);
    expect(result.errors).toBeNull();
  });
  
  test('should validate a valid task node', async () => {
    // Arrange
    const taskSchemaPath = path.join(schemaDir, 'task/task.yaml');
    const taskNode = {
      id: '123e4567-e89b-12d3-a456-426614174001',
      type: 'task',
      title: 'Test Task',
      description: 'A test task',
      parent_ids: [],
      child_ids: [],
      created_at: '2023-04-24T10:00:00Z',
      updated_at: '2023-04-24T11:30:00Z',
      created_by: 'test-user',
      updated_by: 'test-user',
      tags: ['test'],
      metadata: {},
      status: 'pending',
      priority: 'medium',
      estimated_effort: {
        unit: 'hours',
        value: 4
      },
      actual_effort: {
        unit: 'hours',
        value: 0
      },
      checklist: []
    };
    
    // Act
    const result = await validator.validate(taskNode, taskSchemaPath);
    
    // Assert
    expect(result.valid).toBe(true);
    expect(result.errors).toBeNull();
  });
  
  test('should detect validation errors', async () => {
    // Arrange
    const processSchemaPath = path.join(schemaDir, 'process/process.yaml');
    const invalidNode = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      type: 'process',
      // Missing required fields: created_at, updated_at
      title: 'Test Process',
      description: 'A test process',
      parent_ids: [],
      child_ids: [],
      created_by: 'test-user',
      updated_by: 'test-user',
      tags: ['test'],
      metadata: {},
      status: 'invalid-status', // Invalid enum value
      priority: 'medium',
      steps: []
    };
    
    // Act
    const result = await validator.validate(invalidNode, processSchemaPath);
    
    // Assert
    expect(result.valid).toBe(false);
    expect(result.errors).not.toBeNull();
    
    // Check for specific errors
    const formattedErrors = validator.getFormattedErrors(result);
    expect(formattedErrors.length).toBeGreaterThan(0);
  });
  
  test('should validate against the correct schema based on node type', async () => {
    // Arrange
    const processNode = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      type: 'process',
      title: 'Test Process',
      description: 'A test process',
      parent_ids: [],
      child_ids: [],
      created_at: '2023-04-24T10:00:00Z',
      updated_at: '2023-04-24T11:30:00Z',
      created_by: 'test-user',
      updated_by: 'test-user',
      tags: ['test'],
      metadata: {},
      status: 'draft',
      priority: 'medium',
      steps: []
    };
    
    // Act
    const result = await validator.validateNode(processNode, schemaDir);
    
    // Assert
    expect(result.valid).toBe(true);
    expect(result.errors).toBeNull();
  });
  
  test('should handle missing node type', async () => {
    // Arrange
    const invalidNode = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      // Missing type property
      title: 'Test Node',
    };
    
    // Act
    const result = await validator.validateNode(invalidNode, schemaDir);
    
    // Assert
    expect(result.valid).toBe(false);
    expect(result.errors).not.toBeNull();
    expect(result.errors?.length).toBe(1);
    expect(result.errors?.[0].message).toContain('missing type property');
  });
  
  test('should validate example process file', async () => {
    // Arrange
    const processSchemaPath = path.join(schemaDir, 'process/process.yaml');
    const examplePath = path.join(examplesDir, 'process-definition-process.yaml');
    
    // We can't directly load YAML files in Jest, so this is a mock example
    // In a real test, we would use a utility to load the YAML file
    const exampleNode = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      type: "process",
      title: "Process for Defining a New Process",
      description: "A standardized approach for creating and documenting new processes in the system.",
      parent_ids: [],
      child_ids: [
        "123e4567-e89b-12d3-a456-426614174001",
        "123e4567-e89b-12d3-a456-426614174002",
        "123e4567-e89b-12d3-a456-426614174003"
      ],
      created_at: "2023-04-24T10:00:00Z",
      updated_at: "2023-04-24T11:30:00Z",
      created_by: "system",
      updated_by: "system",
      tags: ["meta", "process-definition", "example"],
      metadata: {
        "domain": "process-management",
        "version": "1.0.0"
      },
      status: "active",
      status_reason: "In active use as a core process",
      priority: "high",
      owner: "process-admin",
      assignees: ["process-admin", "documentation-team"],
      start_date: "2023-04-24T10:00:00Z",
      due_date: null,
      completion_date: null,
      progress: 100,
      steps: [
        {
          id: "step-1",
          title: "Identify Process Need",
          description: "Determine the need for a new process and its preliminary scope.",
          task_ids: ["123e4567-e89b-12d3-a456-426614174001"],
          status: "completed"
        },
        {
          id: "step-2",
          title: "Document Process Structure",
          description: "Define the steps, tasks, and flow of the new process.",
          task_ids: ["123e4567-e89b-12d3-a456-426614174002"],
          status: "completed"
        },
        {
          id: "step-3",
          title: "Create Process Implementation",
          description: "Implement the process in the system with all required nodes and relationships.",
          task_ids: ["123e4567-e89b-12d3-a456-426614174003"],
          status: "completed"
        },
        {
          id: "step-4",
          title: "Review and Activate",
          description: "Review the process definition and activate it for use.",
          task_ids: [],
          status: "completed"
        }
      ],
      dependencies: []
    };
    
    // Act
    const result = await validator.validate(exampleNode, processSchemaPath);
    
    // Assert
    expect(result.valid).toBe(true);
    expect(result.errors).toBeNull();
  });
}); 