# Architecture Documentation

This document provides an overview of the system architecture for the Schema-First Node-Based Knowledge Graph System and serves as an entry point to detailed architecture documentation.

## Architecture Overview

The system is built around a schema-first approach where YAML-defined schemas are the single source of truth. The architecture follows a modular design with clearly separated concerns, enabling flexible extension and adaptation.

![System Architecture Overview](./images/architecture-overview.png)

## Key Components

### Core Components

- [Schema Definitions](./schemas.md) - YAML-based OpenAPI 3.1 schemas defining the structure of all nodes
- [Type Generation](./type-generation.md) - Automatic generation of TypeScript and Python types from schemas
- [Schema Validation](./validation.md) - Tools and utilities for validating nodes against schemas

### Infrastructure Components

- [Schema Server](./schema-server.md) - Local server for serving schemas and supporting fast development iterations
- [CLI Tools](./cli.md) - Command-line interface for schema operations, node management, and automation
- [Web UI](./web-ui.md) - Interactive user interface for visualizing and editing nodes

## Data Flow

1. Schemas are defined in YAML format and compiled to JSON schema for validation
2. Type generators use these schemas to create TypeScript and Python type definitions
3. The schema server serves schemas to clients for validation and reference
4. The CLI tools interact with schemas and nodes for management operations
5. The Web UI provides visualization and editing capabilities for nodes

## Technology Stack

- **Frontend**: Next.js 15.3+, React 19.1+, TypeScript 5.8+, React Flow
- **Backend**: Python 3.13+, Pydantic 2.11+, FastAPI
- **CLI**: Python with Typer
- **Type Generation**: Custom generators for TypeScript and Python
- **Build System**: Nx monorepo (without nx-cloud)
- **Package Management**: pnpm for Node.js, Poetry for Python

## Integration Points

- [JSON Schema Validation](./integration/json-schema.md) - Integration with OpenAPI 3.1 and JSON Schema
- [Event-Driven Architecture](./integration/event-driven.md) - "Schema on the edge" approach for integration with event-driven systems
- [External Systems](./integration/external-systems.md) - Integration with external systems and APIs

## Additional Resources

- [README](./README.md) - Complete architecture documentation
- [System Design](./system-design.md) - Detailed system design documentation
- [Component Diagrams](./component-diagrams.md) - Visual representation of system components

## Related Documentation

- [Decision Records](../decisions/index.md) - Key architecture decisions
- [Specifications](../specs/index.md) - Detailed component specifications
- [Implementation Plan](../project-management/implementation-plan.md) - Current implementation status 