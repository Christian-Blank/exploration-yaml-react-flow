import { promises as fs } from 'fs';
import * as path from 'path';

import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';

// Using require for json-schema-ref-parser due to module issues
// eslint-disable-next-line @typescript-eslint/no-var-requires
const $RefParser = require('json-schema-ref-parser');

/**
 * Interface for validation options
 */
export interface ValidationOptions {
  /**
   * Whether to dereference JSON schema references
   */
  dereference?: boolean;

  /**
   * Base directory for resolving relative paths
   */
  baseDir?: string;
}

/**
 * Interface for validation results
 */
export interface ValidationResult {
  /**
   * Whether the data is valid against the schema
   */
  valid: boolean;

  /**
   * Validation errors, if any
   */
  errors: ErrorObject[] | null;

  /**
   * Schema used for validation
   */
  schema: object;
}

/**
 * Type representing a node with a type property
 */
export interface TypedNode {
  type: string;
}

/**
 * SchemaValidator provides functionality to validate nodes against JSON schemas
 */
export class SchemaValidator {
  private ajv: Ajv;
  private schemaBasePath: string;
  private schemaCache: Record<string, object> = {};

  /**
   * Creates a new SchemaValidator instance
   * @param schemaBasePath Base path to schema files
   */
  constructor(schemaBasePath: string) {
    this.schemaBasePath = schemaBasePath;
    this.ajv = new Ajv({ allErrors: true });
    addFormats(this.ajv);
  }

  /**
   * Loads a schema file from disk
   * @param type The type of node to load schema for
   * @returns The loaded schema object
   */
  private async loadSchema(type: string): Promise<object> {
    if (this.schemaCache[type]) {
      return this.schemaCache[type];
    }

    const schemaPath = path.join(this.schemaBasePath, `${type}.json`);

    try {
      // Load and dereference the schema
      const schema = await $RefParser.dereference(schemaPath);
      this.schemaCache[type] = schema;
      return schema;
    } catch (error: any) {
      throw new Error(`Failed to load schema for type ${type}: ${error.message}`);
    }
  }

  /**
   * Validates a node against its schema
   * @param node The node to validate
   * @returns True if valid, false otherwise
   */
  async validate(node: TypedNode): Promise<boolean> {
    if (!node.type) {
      throw new Error('Node is missing type property');
    }

    try {
      const schema = await this.loadSchema(node.type);
      const validate = this.ajv.compile(schema);
      return validate(node);
    } catch (error: any) {
      throw new Error(`Validation error: ${error.message}`);
    }
  }

  /**
   * Validates a node and returns any validation errors
   * @param node The node to validate
   * @returns Array of validation error messages or null if valid
   */
  async validateWithErrors(node: TypedNode): Promise<string[] | null> {
    if (!node.type) {
      throw new Error('Node is missing type property');
    }

    try {
      const schema = await this.loadSchema(node.type);
      const validate = this.ajv.compile(schema);
      const valid = validate(node);

      if (!valid && validate.errors) {
        return validate.errors.map((err: ErrorObject) => `${err.instancePath} ${err.message}`);
      }

      return null;
    } catch (error: any) {
      throw new Error(`Validation error: ${error.message}`);
    }
  }

  /**
   * Validates a file containing JSON data against a schema
   * @param filePath Path to the JSON file
   * @returns True if valid, false otherwise
   */
  async validateFile(filePath: string): Promise<boolean> {
    try {
      const fileData = await fs.readFile(filePath, 'utf8');
      const node = JSON.parse(fileData) as TypedNode;
      return this.validate(node);
    } catch (error: any) {
      throw new Error(`File validation error: ${error.message}`);
    }
  }

  /**
   * Validate data against a schema
   * @param data The data to validate
   * @param schemaPath Path to the schema file
   * @returns Validation result
   */
  async validateData(data: unknown, schemaPath: string): Promise<ValidationResult> {
    // Load schema
    const schema = await this.loadSchema(schemaPath);

    // Compile validator
    const validate = this.ajv.compile(schema);

    // Validate data
    const valid = validate(data);

    return {
      valid: !!valid,
      errors: validate.errors || null,
      schema: schema,
    };
  }

  /**
   * Validate a node against its type schema
   * @param node Node to validate
   * @param baseSchemaDir Base directory for schema files
   * @returns Validation result
   */
  async validateNode(node: any, baseSchemaDir: string = 'schemas'): Promise<ValidationResult> {
    if (!node || typeof node !== 'object' || !node.type) {
      return {
        valid: false,
        errors: [{ message: 'Invalid node: missing type property' }] as ErrorObject[],
        schema: {},
      };
    }

    // Determine schema path based on node type
    const schemaPath = path.join(baseSchemaDir, `${node.type}/${node.type}.yaml`);

    return this.validateData(node, schemaPath);
  }

  /**
   * Get formatted validation errors
   * @param result Validation result
   * @returns Formatted validation errors
   */
  getFormattedErrors(result: ValidationResult): string[] {
    if (!result.errors) {
      return [];
    }

    return result.errors.map(error => {
      const property = error.instancePath || '';
      const message = error.message || 'Unknown error';
      return `${property ? property + ': ' : ''}${message}`;
    });
  }

  /**
   * Clear all loaded schemas
   */
  clearSchemas(): void {
    this.schemaCache = {};
  }
}
