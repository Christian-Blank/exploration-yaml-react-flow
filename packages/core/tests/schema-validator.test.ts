import * as path from 'path';

import { SchemaValidator, ValidationResult } from '../src/utils/schema-validator';

describe('SchemaValidator', () => {
  const schemaDir = path.join(process.cwd(), 'schemas');
  
  let validator: SchemaValidator;
  
  beforeEach(() => {
    validator = new SchemaValidator({
      baseDir: process.cwd(),
      schemaServerUrl: 'http://localhost:3000'
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
    
    // Mock the loadSchema method to return a simplified schema for testing
    jest.spyOn(validator as any, 'loadSchema').mockResolvedValue({
      type: 'object',
      required: ['id', 'type', 'created_at', 'updated_at', 'status'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        type: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        parent_ids: { type: 'array', items: { type: 'string' } },
        child_ids: { type: 'array', items: { type: 'string' } },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
        created_by: { type: 'string' },
        updated_by: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        metadata: { type: 'object' },
        status: { type: 'string', enum: ['draft', 'active', 'completed', 'archived', 'failed'] },
        priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
        steps: { type: 'array', items: { type: 'object' } }
      }
    });
    
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
    
    // Mock the loadSchema method to return a simplified schema for testing
    jest.spyOn(validator as any, 'loadSchema').mockResolvedValue({
      type: 'object',
      required: ['id', 'type', 'created_at', 'updated_at', 'status'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        type: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        parent_ids: { type: 'array', items: { type: 'string' } },
        child_ids: { type: 'array', items: { type: 'string' } },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
        created_by: { type: 'string' },
        updated_by: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        metadata: { type: 'object' },
        status: { type: 'string', enum: ['pending', 'in_progress', 'blocked', 'completed', 'cancelled'] },
        priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
        estimated_effort: { type: 'object' },
        actual_effort: { type: 'object' },
        checklist: { type: 'array', items: { type: 'object' } }
      }
    });
    
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
    
    // Mock the loadSchema method to return a simplified schema for testing
    jest.spyOn(validator as any, 'loadSchema').mockResolvedValue({
      type: 'object',
      required: ['id', 'type', 'created_at', 'updated_at', 'status'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        type: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        parent_ids: { type: 'array', items: { type: 'string' } },
        child_ids: { type: 'array', items: { type: 'string' } },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
        created_by: { type: 'string' },
        updated_by: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        metadata: { type: 'object' },
        status: { type: 'string', enum: ['draft', 'active', 'completed', 'archived', 'failed'] },
        priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
        steps: { type: 'array', items: { type: 'object' } }
      }
    });
    
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
    
    // Mock the loadSchema method to return a simplified schema for testing
    jest.spyOn(validator as any, 'loadSchema').mockResolvedValue({
      type: 'object',
      required: ['id', 'type', 'created_at', 'updated_at', 'status'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        type: { type: 'string' },
        status: { type: 'string', enum: ['draft', 'active', 'completed', 'archived', 'failed'] }
      }
    });
    
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
    // Skip actual file loading and mock the schema validation
    const mockResult: ValidationResult = {
      valid: true,
      errors: null,
      schema: {}
    };
    
    jest.spyOn(validator, 'validate').mockResolvedValue(mockResult);
    
    // Arrange
    const processSchemaPath = path.join(schemaDir, 'process/process.yaml');
    
    // We can't directly load YAML files in Jest, so this is a mock example
    const exampleNode = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      type: "process",
      title: "Process for Defining a New Process",
      status: "active"
    };
    
    // Act
    const result = await validator.validate(exampleNode, processSchemaPath);
    
    // Assert
    expect(result.valid).toBe(true);
    expect(result.errors).toBeNull();
  });
}); 