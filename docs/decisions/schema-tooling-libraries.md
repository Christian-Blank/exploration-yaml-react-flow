# Decision: Third-Party Libraries for Schema Tooling

**Date:** 2025-04-24  
**Status:** Accepted  
**Deciders:** Project Team  
**Related:** [Schema Resolution Strategy](./schema-resolution-strategy.md)

## Context

For the Schema-First Knowledge Graph System, we need to implement schema validation, a local schema server, and type generation capabilities. Instead of building custom solutions from scratch, we want to leverage existing mature third-party libraries where appropriate, following our "buy first, customize where needed, build what's necessary" approach.

## Decision Drivers

- Minimize custom code
- Use mature, well-maintained libraries
- Ensure compatibility with OpenAPI 3.1 specification
- Support for both YAML and JSON formats
- Performance and reliability
- Active community support
- License compatibility (ideally MIT, Apache, or similar)
- Python-first approach with TypeScript generation support

## Decisions

### Schema Validation

**Selected:** jsonschema (Python)

- **Why:** 
  - Standard Python library for JSON Schema validation
  - Good support for OpenAPI 3.1 features
  - Well-maintained with regular updates
  - Strong community support
  - Good documentation and examples
  - MIT license

- **Alternatives Considered:**
  - AJV (TypeScript) - Excellent but would require duplication of validation logic
  - Pydantic - Good for schema definition but less focused on schema validation

### Schema Server

**Selected:** FastAPI + Uvicorn (Python)

- **Why:**
  - FastAPI is a modern, high-performance Python web framework
  - Built-in support for OpenAPI documentation
  - Excellent performance with Uvicorn ASGI server
  - Type checking via Pydantic
  - Active development and community
  - MIT licensed

- **Alternatives Considered:**
  - Express.js - Good but would be inconsistent with Python-first approach
  - Flask - Lighter weight but fewer built-in features
  - Django - Too heavyweight for our use case

### Type Generation

**Selected:** datamodel-code-generator (Python) + json-schema-to-typescript (TypeScript)

- **Why:**
  - datamodel-code-generator is specifically designed for generating Pydantic models
  - json-schema-to-typescript produces high-quality TypeScript types from JSON schemas
  - Both support OpenAPI specifications
  - Active maintenance and community support
  - MIT licensed
  - Complementary tools that work well together

- **Alternatives Considered:**
  - quicktype - Supports multiple languages but less focused on Pydantic
  - OpenAPI Generator - More focused on client/server code generation than just types
  - Custom generators - Would require significant development effort

## Consequences

### Positive

- Faster development by leveraging existing solutions
- More reliable code through battle-tested libraries
- Better documentation through standardized tools
- Reduced maintenance burden
- Single source of truth for schema validation in Python
- Ability to focus on core business logic rather than infrastructure

### Negative

- Requires Python environment setup for TypeScript developers
- Some learning curve for team members new to these libraries
- Need to manage dependencies in both Python and TypeScript ecosystems
- Need to ensure schema server is running for development

### Neutral

- We'll need to keep dependencies updated in both ecosystems
- May need to contribute back to these projects for specific edge cases

## Implementation Plan

1. Set up Python environment with FastAPI, jsonschema, and datamodel-code-generator
2. Implement schema server with FastAPI
3. Create schema validation service using jsonschema
4. Set up json-schema-to-typescript for TypeScript type generation
5. Document usage patterns for the team
6. Create helper scripts for common tasks

## Related Documents

- [Schema Resolution Strategy](./schema-resolution-strategy.md)
- [Phase 1 Consolidated Plan](../project-management/phase-1-consolidated.md)
- [Schema Design](../specs/schema-design.md)
- [Development Workflow Guide](../guides/development-workflow.md) 