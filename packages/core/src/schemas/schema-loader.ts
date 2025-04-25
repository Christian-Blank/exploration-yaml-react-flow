import * as fs from 'fs';
import * as path from 'path';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import * as yaml from 'js-yaml';
import * as $RefParser from 'json-schema-ref-parser';

// Create an instance of Ajv
const ajv = new Ajv({
  allErrors: true,
  strict: false,
  strictSchema: false,
  strictTypes: false,
});

// Add string formats
addFormats(ajv);

/**
 * Interface for schema loader options
 */
export interface SchemaLoaderOptions {
  /**
   * Base directory for resolving relative paths
   */
  baseDir?: string;

  /**
   * Whether to dereference schema references
   */
  dereference?: boolean;
}

/**
 * Class for loading and validating schemas
 */
export class SchemaLoader {
  private baseDir: string;
  private dereference: boolean;
  private schemas: Map<string, object> = new Map();

  /**
   * Create a new SchemaLoader
   * @param options Options for the schema loader
   */
  constructor(options: SchemaLoaderOptions = {}) {
    this.baseDir = options.baseDir || process.cwd();
    this.dereference = options.dereference ?? true;
  }

  /**
   * Load a schema from a YAML file
   * @param schemaPath Path to the schema file (relative to baseDir)
   * @returns The loaded schema
   */
  async loadSchema(schemaPath: string): Promise<object> {
    const fullPath = path.resolve(this.baseDir, schemaPath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Schema file not found: ${fullPath}`);
    }

    // Read file content
    const content = fs.readFileSync(fullPath, 'utf8');

    // Parse YAML to object
    const schema = yaml.load(content) as object;

    // Dereference schema if needed
    const processedSchema = this.dereference
      ? await $RefParser.dereference(schema as $RefParser.JSONSchema)
      : schema;

    // Store schema
    this.schemas.set(schemaPath, processedSchema);

    return processedSchema;
  }

  /**
   * Convert a schema to JSON Schema format
   * @param schema The schema to convert
   * @returns The converted schema
   */
  convertToJsonSchema(schema: object): object {
    if (!schema || typeof schema !== 'object') {
      throw new Error('Invalid schema');
    }

    // For OpenAPI schemas, extract the actual schema
    if ('components' in schema && 'schemas' in (schema as any).components) {
      const components = (schema as any).components;
      const schemaName = Object.keys(components.schemas)[0];
      return components.schemas[schemaName];
    }

    return schema;
  }

  /**
   * Validate data against a schema
   * @param data The data to validate
   * @param schemaPath Path to the schema file
   * @returns Validation result
   */
  async validateAgainstSchema(
    data: unknown,
    schemaPath: string
  ): Promise<{ valid: boolean; errors: any[] | null }> {
    // Load schema if not already loaded
    if (!this.schemas.has(schemaPath)) {
      await this.loadSchema(schemaPath);
    }

    const schema = this.schemas.get(schemaPath);
    if (!schema) {
      throw new Error(`Schema not found: ${schemaPath}`);
    }

    const jsonSchema = this.convertToJsonSchema(schema);

    // Compile schema validator
    const validate = ajv.compile(jsonSchema);

    // Validate data
    const valid = validate(data);

    return {
      valid: !!valid,
      errors: validate.errors,
    };
  }

  /**
   * Get a loaded schema
   * @param schemaPath Path to the schema file
   * @returns The schema or undefined if not loaded
   */
  getSchema(schemaPath: string): object | undefined {
    return this.schemas.get(schemaPath);
  }

  /**
   * Clear all loaded schemas
   */
  clearSchemas(): void {
    this.schemas.clear();
  }
}
