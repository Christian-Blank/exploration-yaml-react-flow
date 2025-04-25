/**
 * IMPORTANT: This file is deprecated and will be replaced with a Python implementation.
 * 
 * See docs/decisions/schema-resolution-strategy.md for the new approach that uses
 * Python-based schema validation and URI-based references. This file is maintained
 * temporarily for backwards compatibility until the new implementation is complete.
 * 
 * DO NOT ADD NEW FEATURES TO THIS FILE. Any new schema validation functionality
 * should be implemented in the Python packages/python/schema_validator module.
 */

import { promises as fs } from 'fs';
import * as path from 'path';

import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import * as yaml from 'js-yaml';

// Using require for json-schema-ref-parser due to module issues
// eslint-disable-next-line @typescript-eslint/no-var-requires
const $RefParser = require('json-schema-ref-parser');

/**
 * Interface for schema validator options
 */
export interface SchemaValidatorOptions {
  /**
   * Base directory for resolving relative paths
   */
  baseDir?: string;

  /**
   * Schema server URL for resolving remote references (e.g. http://localhost:3000)
   */
  schemaServerUrl?: string;
}

/**
 * Interface for validation options
 */
export interface ValidationOptions {
  /**
   * Whether to dereference JSON schema references
   */
  dereference?: boolean;
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
  private options: SchemaValidatorOptions;
  private schemaCache: Record<string, object> = {};

  /**
   * Creates a new SchemaValidator instance
   * @param options Schema validator options
   */
  constructor(options: SchemaValidatorOptions = {}) {
    this.options = {
      baseDir: process.cwd(),
      schemaServerUrl: 'http://localhost:3000',
      ...options
    };
    this.ajv = new Ajv({ 
      allErrors: true,
      loadSchema: this.loadSchemaByUri.bind(this)
    });
    addFormats(this.ajv);
  }

  /**
   * Loads a schema from a URI (could be a file path or HTTP URL)
   * @param uri URI of the schema to load
   * @returns The loaded schema object
   */
  private async loadSchemaByUri(uri: string): Promise<object> {
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
      // Handle HTTP(S) URIs
      try {
        const response = await fetch(uri);
        if (!response.ok) {
          throw new Error(`Failed to fetch schema: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('yaml') || contentType?.includes('yml') || uri.endsWith('.yaml') || uri.endsWith('.yml')) {
          const text = await response.text();
          return yaml.load(text) as object;
        } else {
          return await response.json();
        }
      } catch (error: any) {
        throw new Error(`Failed to load schema from URI ${uri}: ${error.message}`);
      }
    } else {
      // Handle file paths
      let filePath = uri;
      if (!path.isAbsolute(uri)) {
        filePath = path.join(this.options.baseDir || process.cwd(), uri);
      }

      try {
        const content = await fs.readFile(filePath, 'utf8');
        if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
          return yaml.load(content) as object;
        } else {
          return JSON.parse(content);
        }
      } catch (error: any) {
        throw new Error(`Failed to load schema from file ${filePath}: ${error.message}`);
      }
    }
  }

  /**
   * Resolves a schema path to a full URI
   * @param schemaPath Path to the schema file
   * @returns Resolved URI
   */
  private resolveSchemaUri(schemaPath: string): string {
    if (schemaPath.startsWith('http://') || schemaPath.startsWith('https://')) {
      return schemaPath;
    }

    // If using schema server, convert to URI
    if (this.options.schemaServerUrl && !schemaPath.startsWith('file://')) {
      const relativePath = schemaPath.replace(/\\/g, '/');
      return `${this.options.schemaServerUrl}/schemas/${relativePath}`;
    }

    // Otherwise use file path
    return schemaPath;
  }

  /**
   * Loads a schema file 
   * @param schemaPath Path to the schema file
   * @param options Validation options
   * @returns The loaded schema object
   */
  private async loadSchema(schemaPath: string, options: ValidationOptions = {}): Promise<object> {
    const cacheKey = schemaPath;
    if (this.schemaCache[cacheKey]) {
      return this.schemaCache[cacheKey];
    }

    try {
      let schema: object;
      
      if (options.dereference) {
        // Dereference the schema to resolve all $refs
        schema = await $RefParser.dereference(schemaPath);
      } else {
        // Just load the schema without dereferencing
        schema = await this.loadSchemaByUri(schemaPath);
      }
      
      this.schemaCache[cacheKey] = schema;
      return schema;
    } catch (error: any) {
      throw new Error(`Failed to load schema from ${schemaPath}: ${error.message}`);
    }
  }

  /**
   * Validate data against a schema
   * @param data The data to validate
   * @param schemaPath Path to the schema file
   * @param options Validation options
   * @returns Validation result
   */
  async validate(data: unknown, schemaPath: string, options: ValidationOptions = {}): Promise<ValidationResult> {
    // Load schema
    const schema = await this.loadSchema(schemaPath, options);

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
    const resolvedUri = this.resolveSchemaUri(schemaPath);

    return this.validate(node, resolvedUri, { dereference: true });
  }

  /**
   * Validates a file containing JSON/YAML data against a schema
   * @param filePath Path to the JSON/YAML file
   * @param schemaPath Path to the schema file
   * @returns Validation result
   */
  async validateFile(filePath: string, schemaPath?: string): Promise<ValidationResult> {
    try {
      const fileData = await fs.readFile(filePath, 'utf8');
      let data;
      
      if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
        data = yaml.load(fileData);
      } else {
        data = JSON.parse(fileData);
      }
      
      if (!schemaPath && data && typeof data === 'object' && 'type' in data) {
        return this.validateNode(data);
      } else if (schemaPath) {
        return this.validate(data, schemaPath);
      } else {
        throw new Error('Schema path not provided and node does not have a type property');
      }
    } catch (error: any) {
      throw new Error(`File validation error: ${error.message}`);
    }
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
