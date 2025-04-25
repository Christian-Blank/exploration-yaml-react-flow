# Phase 1: Project Setup, Schema Definition, and Schema Resolution

**Parent:** [Implementation Plan](./implementation-plan.md)

## Objective

Establish the foundational structure, define minimal viable schemas, implement a schema server for resolution, and set up automated type generation for both Python and TypeScript.

## Tasks

### Task 1: Repository and Environment Setup
- [x] Create project repository with initial structure
  - Initialize Git repository
  - Add README.md with project overview
  - Add LICENSE file
- [x] Define and document folder structure
  - Create directory hierarchy
  - Document purpose of each directory
  - Setup document knowledge graph structure
- [x] Set up linting and formatting tools (ESLint, Prettier, Black, Ruff)
  - Configure ESLint for TypeScript
  - Set up Prettier for consistent formatting
  - Create configuration for Python tools
- [x] Set up monorepo structure with nx (without nx-cloud)
  - Initialize nx workspace
  - Configure workspace packages
  - Setup build scripts

**Acceptance Criteria:**
- Repository initialized with proper structure
- Linting and formatting tools properly configured and working
- Documentation structure follows knowledge graph principles
- Pre-commit hooks properly set up

**Checkpoint:** [Initial Project Setup](../reports/2023-11-15-phase1-checkpoint1.md), [Monorepo Setup](../reports/2023-11-20-phase1-task1-checkpoint.md)

### Task 2: Development Environment Configuration
- [x] Configure development environment (Node.js v22, Python 3.13+)
  - Setup Node.js environment
  - Setup Python environment
  - Configure package managers (pnpm, poetry)
  - Document environment setup process

**Acceptance Criteria:**
- Both Node.js and Python environments are properly configured
- Package managers are working correctly
- Environment setup is documented

**Checkpoint:** [Development Environment Setup](../reports/phase1-task2-checkpoint.md)

### Task 3: Schema Templates Creation
- [x] Create initial schema templates:
  - [x] Base node schema with common properties
    - Add id, type fields
    - Add parent_ids, child_ids for graph relationships
    - Add metadata fields
  - [x] Process node schema extending base node
    - Add process-specific fields
    - Define relationships to tasks
  - [x] Task node schema extending base node
    - Add task-specific fields
    - Define completion criteria
  - [x] Document node schema extending base node
    - Add document-specific fields
    - Define content structure

**Acceptance Criteria:**
- Base schema templates are defined in YAML format
- All required properties are included in each schema
- Schema templates follow OpenAPI 3.1 standards
- Schema inheritance is properly implemented

**Checkpoint:** [Schema Templates Creation](../reports/2025-04-24-phase1-task3-checkpoint.md)

### Task 4: Update Schema References
- [ ] Refactor schemas to use URI-based references
  - Convert all file references to use HTTP URIs
  - Standardize on `http://localhost:3000/schemas/...` format
  - Test schema composition with URIs
- [ ] Document schema reference structure
  - Create guidelines for schema references
  - Document URI structure and conventions

**Acceptance Criteria:**
- All schema references use HTTP URIs rather than file paths
- Schema references are consistent across all schema files
- Schema reference structure is documented
- Schema composition continues to work with the new references

**Checkpoint:** Schema Reference Update

### Task 5: Python Schema Server Implementation
- [ ] Set up Python environment
  - Install FastAPI, Uvicorn, and required dependencies
  - Configure Poetry for dependency management
- [ ] Implement FastAPI schema server
  - Create routes for serving schema files
  - Add content negotiation for JSON/YAML formats
  - Implement CORS support for cross-origin requests
  - Add Swagger UI for API documentation
- [ ] Create schema server tests
  - Test schema retrieval endpoints
  - Test content negotiation
  - Test reference resolution

**Acceptance Criteria:**
- FastAPI schema server is running and serving schemas
- Server supports content negotiation for JSON/YAML
- CORS is properly configured for cross-origin requests
- Swagger UI is available for API documentation
- All tests pass

**Checkpoint:** Schema Server Implementation

### Task 6: Schema Validation Implementation
- [ ] Set up Python schema validation
  - Install jsonschema and related dependencies
  - Create schema validation service
  - Implement URI-based reference resolution
- [ ] Create validation tests
  - Test validation against valid/invalid instances
  - Test reference resolution
  - Test error reporting

**Acceptance Criteria:**
- Schema validation service correctly validates instances
- Schema references are properly resolved
- Error reporting is clear and useful
- All tests pass

**Checkpoint:** Schema Validation Implementation

### Task 7: Code Generation Setup
- [ ] Set up Python code generation
  - Install datamodel-code-generator
  - Create generation scripts for Pydantic models
  - Document code generation process
- [ ] Set up TypeScript code generation
  - Install json-schema-to-typescript
  - Create generation scripts for TypeScript interfaces
  - Document TypeScript generation process
- [ ] Create watch scripts for automatic regeneration
  - Set up file watchers for schema changes
  - Automate code generation on schema changes

**Acceptance Criteria:**
- Pydantic models are generated from schemas
- TypeScript interfaces are generated from schemas
- Code generation is documented
- Watch scripts automatically regenerate code on schema changes

**Checkpoint:** Code Generation Setup

### Task 8: CLI Tools Development
- [ ] Create Python CLI for schema validation
  - Implement validation command
  - Add support for file and stdin validation
  - Document CLI usage
- [ ] Create Python CLI for code generation
  - Implement code generation commands
  - Support both Pydantic and TypeScript generation
  - Document CLI usage

**Acceptance Criteria:**
- CLI tools are available for schema validation
- CLI tools are available for code generation
- CLI tools are documented
- CLI tools are integrated with the schema server

**Checkpoint:** CLI Tools Development

## Acceptance Criteria (Phase)

- All development tools and configuration are properly set up
- Base schemas are defined in YAML format with URI-based references
- Python schema server is running and serving schemas
- Schema validation is working and tested
- Code generation is set up for both Python and TypeScript
- CLI tools are available for validation and generation
- Documentation follows the knowledge graph structure
- Git workflow is streamlined and functional

## Timeline

- Start date: 2023-11-15
- Target completion: 2023-12-31

## Dependencies

- None (initial phase)

## Next Phase

[Phase 2: Node Management and UI Development](./phase-2-node-management.md)

## Checkpoints

- [Checkpoint 1: Project Setup and Environment Configuration](../reports/2025-04-24-phase1-checkpoint.md) - Repository structure, monorepo, and development environment setup
- [Checkpoint 2: Schema Templates Creation](../reports/2025-04-24-phase1-task3-checkpoint.md) - Base and specialized schema definitions
- Checkpoint 3: Schema Server and Validation - To be created after Task 6
- Checkpoint 4: Code Generation and CLI Tools - To be created after Task 8

## Related Documentation

- [Architecture Overview](../architecture/index.md)
- [Schema Design](../specs/schema-design.md)
- [Schema Resolution Strategy](../decisions/schema-resolution-strategy.md)
- [Schema Tooling Libraries](../decisions/schema-tooling-libraries.md)
- [Development Workflow Guide](../guides/development-workflow.md) 