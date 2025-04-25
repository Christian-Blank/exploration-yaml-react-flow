# Schema-First Node-Based Knowledge Graph System

A unified system using YAML-defined schemas adhering to OpenAPI 3.1 standards to compile into Python and TypeScript types. The system centers around node-based entities representing processes and documents, enabling easy human readability, automated type generation, and developer-friendly workflows. The ultimate goal is to create an orchestration layer where humans and AI collaborate seamlessly.

## Project Overview

This project implements a schema-first system where:

- Schemas are the single source of truth, defined in YAML and compiled to JSON Schema
- All entities form a node-based directed graph structure for knowledge mapping
- Types are automatically generated for Python and TypeScript
- A simple local server serves schemas and supports fast developer iteration
- A CLI tool enables template creation, schema validation, and file management
- A web UI (Next.js, React, React-Flow) provides interactive node creation, viewing, and editing

## Getting Started

### Prerequisites

- [Node.js v18+](https://nodejs.org/) (recommend using [NVM](https://github.com/nvm-sh/nvm))
- [PNPM](https://pnpm.io/) v8+
- [Python 3.13+](https://www.python.org/)
- [Poetry 2.1+](https://python-poetry.org/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Christian-Blank/exploration-yaml-react-flow.git
   cd exploration-yaml-react-flow
   ```

2. Install Node.js dependencies:
   ```bash
   pnpm install
   ```

3. Install Python dependencies:
   ```bash
   poetry install
   ```

### Working with the Nx Monorepo

This project uses [Nx](https://nx.dev/) for monorepo management. The workspace is organized into multiple packages in the `packages/` directory, each with its own responsibilities.

#### Monorepo Structure

- **core**: Shared utilities, schemas, and validation logic
- **cli**: Command-line interface for working with schemas and nodes
- **schema-server**: API server for serving and validating schemas
- **type-generators**: Tools for generating TypeScript and Python types from schemas
- **web**: Next.js web application for visualization and editing

#### Nx Commands

Here are the most common Nx commands you'll use:

```bash
# Show all projects in the workspace
npx nx show projects

# View the dependency graph in a browser
npx nx graph

# List all available targets for a project
npx nx show project core --targets

# Run a command for all projects
npx nx run-many --target=build --all

# Run a command for a specific project
npx nx run core:build

# Run a command for multiple projects
npx nx run-many --target=build --projects=core,cli

# Only run for projects affected by your changes
npx nx affected --target=test
```

We also provide pnpm script aliases for common operations:

```bash
# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format

# Clean build outputs
pnpm clean
```

#### Package-Specific Commands

Some packages have specific commands:

```bash
# Start the Next.js development server
npx nx run web:dev

# Serve the schema server
npx nx run schema-server:serve

# Generate types from schemas
npx nx run type-generators:generate
```

#### Working with Dependencies

Nx automatically manages the build order based on dependencies between packages. For example, if the `cli` package depends on `core`, Nx will build `core` first when you run:

```bash
npx nx run cli:build
```

## Project Structure

```
exploration-yaml-react-flow/
├── docs/                       # Project documentation
│   ├── architecture/           # Architecture documentation
│   ├── decisions/              # Decision records
│   ├── guides/                 # User and developer guides
│   ├── project-management/     # Project planning and tracking
│   ├── reports/                # Checkpoint reports
│   └── specs/                  # Detailed specifications
├── packages/                   # Monorepo packages
│   ├── core/                   # Core library (shared code)
│   ├── schema-server/          # Schema serving API
│   ├── cli/                    # Command-line interface
│   ├── type-generators/        # Code generation tools
│   └── web/                    # Next.js web application
├── schemas/                    # Schema definitions
├── templates/                  # Node templates
├── examples/                   # Example nodes and processes
└── tests/                      # End-to-end tests
```

## Documentation

Our documentation follows a knowledge graph structure, with interconnected documents and clear entry points for each domain. The main entry point is [docs/index.md](./docs/index.md).

Key documentation sections:

- [Architecture](./docs/architecture/index.md) - System architecture and design
- [Decision Records](./docs/decisions/index.md) - Key technical decisions with context and rationale
- [Guides](./docs/guides/index.md) - User and developer guides
- [Specifications](./docs/specs/index.md) - Detailed technical specifications
- [Project Management](./docs/project-management/index.md) - Implementation plans and progress tracking

## Implementation Plan

The implementation is organized into six phases:

1. [Project Setup and Core Schema Definition](./docs/project-management/phase-1-project-setup.md)
2. [Schema Server and Type Generation](./docs/project-management/phase-2-schema-server.md)
3. [CLI Development](./docs/project-management/phase-3-cli-development.md)
4. [Basic UI Development](./docs/project-management/phase-4-ui-development.md)
5. [Process Implementation](./docs/project-management/phase-5-process-implementation.md)
6. [Integration and Testing](./docs/project-management/phase-6-integration.md)

For the overall implementation plan, see the [Implementation Plan](./docs/project-management/implementation-plan.md).

## Contributing

To contribute to the project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For detailed development workflow information, see our [Development Workflow Guide](./docs/guides/development-workflow.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
