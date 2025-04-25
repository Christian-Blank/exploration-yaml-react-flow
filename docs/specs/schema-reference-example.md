# Schema Reference Example

This document provides examples of how schemas should be structured using URI-based references rather than file paths.

## Current Approach (File-Based References)

Currently, our schemas use relative file paths for references, which limits portability and makes it harder to resolve references in different environments.

### Example: Base Node Reference in Process Schema

```yaml
# schemas/process/process.yaml
components:
  schemas:
    ProcessNode:
      allOf:
        - $ref: "../base/node.yaml#/components/schemas/BaseNode"
        - type: object
          # Process-specific properties
```

## New Approach (URI-Based References)

The new approach uses HTTP URIs for all references, which provides better portability and enables resolution through a schema server.

### Example: Base Schema with URI Identifier

```yaml
# schemas/base/node.yaml
openapi: 3.1.0
info:
  title: Base Node Schema
  version: 0.1.0
  description: Base schema for all nodes in the knowledge graph system
$id: "http://localhost:3000/schemas/base/node.yaml"

components:
  schemas:
    BaseNode:
      type: object
      required:
        - id
        - type
      properties:
        id:
          type: string
          format: uuid
        type:
          type: string
        # Other base properties
```

### Example: Process Schema with URI Reference

```yaml
# schemas/process/process.yaml
openapi: 3.1.0
info:
  title: Process Node Schema
  version: 0.1.0
  description: Schema for process nodes in the knowledge graph system
$id: "http://localhost:3000/schemas/process/process.yaml"

components:
  schemas:
    ProcessNode:
      allOf:
        - $ref: "http://localhost:3000/schemas/base/node.yaml#/components/schemas/BaseNode"
        - type: object
          # Process-specific properties
```

### Example: Common Enumerations with URI References

For commonly used enums like status or priority, we can define them in separate schemas and reference them:

```yaml
# schemas/common/status.yaml
openapi: 3.1.0
info:
  title: Status Schema
  version: 0.1.0
  description: Common status enum used by various node types
$id: "http://localhost:3000/schemas/common/status.yaml"

components:
  schemas:
    Status:
      type: string
      enum:
        - draft
        - active
        - completed
        - archived
        - failed
```

```yaml
# schemas/task/task.yaml
openapi: 3.1.0
info:
  title: Task Node Schema
  version: 0.1.0
  description: Schema for task nodes in the knowledge graph system
$id: "http://localhost:3000/schemas/task/task.yaml"

components:
  schemas:
    TaskNode:
      allOf:
        - $ref: "http://localhost:3000/schemas/base/node.yaml#/components/schemas/BaseNode"
        - type: object
          required:
            - status
          properties:
            status:
              $ref: "http://localhost:3000/schemas/common/status.yaml#/components/schemas/Status"
            # Other task-specific properties
```

## Benefits of URI-Based References

1. **Portability**: References work in any environment where the schema server is available
2. **Discoverability**: URIs make it easier to discover and navigate related schemas
3. **Consistency**: Using URIs provides a single, consistent way to reference schemas
4. **Scalability**: Easy to migrate from localhost to production URLs when needed
5. **Tool Support**: Better support for tools that resolve references via HTTP

## Implementation Notes

- For local development, schemas will be served by a FastAPI server running on localhost:3000
- The schema server will handle content negotiation (JSON/YAML)
- In production, the same schemas can be served from a stable domain
- The `$id` field helps tools understand the canonical location of each schema

## Related Documentation

- [Schema Resolution Strategy](../decisions/schema-resolution-strategy.md)
- [Schema Tooling Libraries](../decisions/schema-tooling-libraries.md) 