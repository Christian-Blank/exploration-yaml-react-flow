# Decision: Schema Resolution and Code Generation Strategy

**Date:** 2025-04-24  
**Status:** Accepted  
**Deciders:** Project Team  
**Related:** [Schema Tooling Libraries](./schema-tooling-libraries.md)

## Context

The Schema-First Knowledge Graph System requires robust schema validation, resolution of schema references, and code generation capabilities. We initially started implementing these features in TypeScript but have reconsidered our approach to ensure a more maintainable, robust solution.

Key requirements include:
- Resolving schema references across files
- Validating schema instances against their definitions
- Generating TypeScript and Python types from schemas
- Supporting both local development and production environments
- Maintaining schema composition via references

## Decision Drivers

- Need for a unified approach to schema handling
- Schema references should use URIs rather than file paths for better portability
- Schema resolution should work across both Python and TypeScript environments
- Preference for leveraging existing, mature tools over custom implementations
- Need to minimize custom code and maintenance burden
- Need for a consistent schema resolution strategy in both development and production

## Decision

We will implement a Python-based schema resolution and code generation system with the following components:

1. **Schema Structure**:
   - All schemas will use HTTP(S) URIs for references instead of relative file paths
   - References will use `http://localhost:3000/schemas/...` in development
   - References can be replaced with production URLs when deployed

2. **Schema Server**:
   - Implement a FastAPI-based schema server to serve schemas via HTTP
   - The server will support content negotiation (JSON/YAML)
   - Schemas will be served with appropriate CORS headers for cross-origin requests

3. **Schema Validation**:
   - Use `jsonschema` Python library for schema validation
   - Create a Python-based validation service that resolves references through the schema server

4. **Code Generation**:
   - Use `datamodel-code-generator` for generating Python Pydantic models
   - Use `json-schema-to-typescript` for generating TypeScript interfaces
   - Implement watch scripts to regenerate code when schemas change

5. **CLI Tools**:
   - Develop Python-based CLI tools for validation and code generation
   - Support both local development and CI/CD pipeline usage

## Alternatives Considered

1. **TypeScript-based Implementation**:
   - Initially started with AJV and json-schema-ref-parser
   - Would require duplicate schema handling code in Python
   - Less robust support for generating Python models

2. **Swagger/OpenAPI Server**:
   - More heavyweight than needed for our use case
   - Better suited for API documentation than schema serving

3. **File Path References**:
   - Simpler implementation but less portable
   - Doesn't scale well to distributed environments
   - More difficult to migrate to production URLs

## Consequences

### Positive

- One source of truth for schema validation (Python)
- Clear separation between schema serving and validation
- Better portability of schemas between environments
- Leveraging mature tools for code generation
- More robust reference resolution
- Easier to integrate with other systems via HTTP

### Negative

- Need to reimplement work already started in TypeScript
- Dependency on a running schema server for development
- Additional complexity in setting up the development environment
- Need to manage Python dependencies alongside TypeScript

## Implementation Plan

1. **Phase 1: Schema Server**
   - Implement FastAPI-based schema server
   - Configure server to serve existing schemas
   - Add support for content negotiation

2. **Phase 2: Schema Validation**
   - Implement Python-based schema validation using jsonschema
   - Create validation service with URI-based reference resolution
   - Write tests for validation service

3. **Phase 3: Code Generation**
   - Set up datamodel-code-generator for Python
   - Set up json-schema-to-typescript for TypeScript
   - Create watch scripts for automatic regeneration

4. **Phase 4: CLI Tools**
   - Create CLI commands for validation and generation
   - Add support for both local development and CI/CD usage

## Related Documents

- [Schema Tooling Libraries](./schema-tooling-libraries.md)
- [Phase 1 Consolidated Plan](../project-management/phase-1-consolidated.md)
- [Schema Design](../specs/schema-design.md) 