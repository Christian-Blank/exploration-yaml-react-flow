# Decision Record: Schema-First Approach

## Date
2023-04-24

## Status
Accepted

## Context
We need to establish a clear methodology for defining, managing, and validating entities in our knowledge graph system. The system needs to support both human readability and machine processing, with consistent validation across different programming languages (primarily Python and TypeScript).

## Decision
We will adopt a schema-first approach where:

1. YAML files are the primary format for human-readable schema definitions.
2. These schemas adhere to OpenAPI 3.1 standards.
3. Schema files are compiled to canonical JSON Schema format for validation and tooling compatibility.
4. All node types extend a common base node schema using composition (JSON Schema `allOf`).
5. Automatic code generation will create TypeScript and Python types from these schemas.
6. Schemas will be served by a local server during development for easy reference and validation.

## Rationale

### Advantages
- **Single Source of Truth**: Schemas are defined once and used consistently across all system components.
- **Human Readability**: YAML format is easier for humans to read and edit compared to JSON.
- **Standards Compliance**: OpenAPI 3.1 provides a well-established standard with robust tooling support.
- **Type Safety**: Automatic generation of types ensures consistency between schemas and code.
- **Composition**: Using JSON Schema's `allOf` allows for extension and composition of schemas.
- **Validation**: JSON Schema provides powerful validation capabilities.
- **Developer Experience**: Schema-first approach simplifies development by providing clear contracts.

### Disadvantages
- **Initial Setup Complexity**: Requires additional tooling for schema validation and type generation.
- **Learning Curve**: Developers need to understand OpenAPI/JSON Schema syntax.
- **Maintenance Overhead**: Need to ensure schemas stay in sync with generated code.

## Alternatives Considered

### Code-First Approach
Define types in code (TypeScript/Python) and generate schemas from them.

**Pros**:
- More familiar for developers
- Better IDE support for type definitions

**Cons**:
- Different languages would have different "sources of truth"
- More difficult to ensure cross-language consistency
- Less human-readable schema definitions

### Custom Schema Format
Create our own schema format tailored to the specific needs of the project.

**Pros**:
- Could be optimized for our specific use cases
- Might be more concise for our domain

**Cons**:
- No established tooling or ecosystem
- Would require custom parsers and validators
- Higher development and maintenance costs

## Implementation Notes
- We will maintain schemas in a dedicated `/schemas` directory organized by domain.
- Base schema definitions will be in `/schemas/base`.
- Domain-specific schemas will extend the base schemas.
- Type generation will be automated as part of the build process.

## Consequences
- All entity definitions must have corresponding schemas.
- Validation against schemas becomes a requirement for all node operations.
- We need to implement robust schema-to-type generation for TypeScript and Python.
- Development workflow will include schema validation as a key step.

## Related Decisions
- [Decision 002: Type Generation Strategy](./002-type-generation-strategy.md)
- [Decision 003: Node Structure](./003-node-structure.md)

## References
- [OpenAPI 3.1 Specification](https://spec.openapis.org/oas/v3.1.0)
- [JSON Schema](https://json-schema.org/)
- [YAML Specification](https://yaml.org/spec/1.2.2/) 