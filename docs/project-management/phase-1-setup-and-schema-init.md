# Phase 1: Project Setup, Schema Definition, and Schema Server

**Parent:** [Implementation Plan](./implementation-plan.md)

## Objective

Establish the foundational structure, define minimal viable schemas, and implement a local schema server with type generation.

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

### Task 4: Schema Validation Setup
- [ ] Define schema validation rules based on OpenAPI 3.1
  - Create validation utility functions
  - Implement schema reference resolution via local webserver
  - Add support for schema composition
- [ ] Setup basic test framework for schema validation
  - Create test cases for schema validation
  - Implement automated testing
  - Document validation process
- [ ] Fix CI tests to pass pre-push checks
  - Resolve lint errors
  - Configure tests to pass with minimal setup

**Acceptance Criteria:**
- Schema validation utility correctly validates against schema templates
- Schema resolution works with localhost URIs
- Test framework is in place and operational
- Schemas can be converted between YAML and JSON formats
- Documentation covers how to validate schemas
- Pre-push hooks pass successfully

**Checkpoint:** Schema Validation Framework

### Task 5: Local Schema Server Development
- [ ] Implement local schema server
  - Create server architecture for serving schemas
  - Set up Express server for Node.js environments
  - Implement schema versioning and retrieval API
  - Create endpoints for schema resolution
- [ ] Document server API endpoints
  - Document API usage for schema resolution
  - Create examples demonstrating reference resolution

**Acceptance Criteria:**
- Local schema server is running and serving schemas via API
- Schema references are properly resolved through the server
- API endpoints are documented with examples
- Schema server starts and stops cleanly

**Checkpoint:** Local Schema Server Implementation

### Task 6: Type Generation Implementation
- [ ] Build TypeScript type generator
  - Create generator for TypeScript types from JSON schemas
  - Implement interfaces for base and specialized nodes
  - Generate utility types for schema validation
- [ ] Build Python type generator
  - Create generator for Python classes using Pydantic
  - Implement inheritance structure for node types
  - Generate validation methods
- [ ] Set up automatic type generation
  - Create build/watch scripts for regeneration on schema changes
  - Document the type generation process
  - Add validation to ensure type consistency

**Acceptance Criteria:**
- Type generation works automatically from schema files
- Changes to schemas automatically propagate to generated types
- Generated types accurately represent schema structures
- TypeScript and Python types are consistent with each other
- Type generation process is documented

**Checkpoint:** Type Generation Implementation

## Acceptance Criteria (Phase)

- All development tools and configuration are properly set up
- Base schemas are defined in YAML format
- Schemas can be converted to JSON for validation
- Schema validation is working and tested
- Local schema server is running and serving schemas
- Type generation is working for both TypeScript and Python
- Documentation follows the knowledge graph structure
- Git workflow is streamlined and functional with passing CI

## Timeline

- Start date: 2023-11-15
- Target completion: 2023-12-31

## Dependencies

- None (initial phase)

## Next Phase

[Phase 3: CLI Development](./phase-3-cli-development.md)

## Checkpoints

- [Checkpoint 1: Project Setup and Environment Configuration](../reports/2025-04-24-phase1-checkpoint.md) - Repository structure, monorepo, and development environment setup
- [Checkpoint 2: Schema Templates Creation](../reports/2025-04-24-phase1-task3-checkpoint.md) - Base and specialized schema definitions

## Related Documentation

- [Architecture Overview](../architecture/index.md)
- [Schema Design](../specs/schema-design.md)
- [Development Workflow Guide](../guides/development-workflow.md) 