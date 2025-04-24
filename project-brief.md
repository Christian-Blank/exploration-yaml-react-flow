## Project Exploration Brief

### Project Title:
Schema-First Node-Based Knowledge Graph System for Human-AI Orchestration

### Overview:
This project explores creating a unified system using YAML-defined schemas adhering to OpenAPI 3.1 standards to compile into Python and TypeScript types. The system centers around node-based entities representing processes and documents, enabling easy human readability, automated type generation, and developer-friendly workflows. The ultimate goal is to create an orchestration layer where humans and AI collaborate seamlessly.

### Objectives:
- Implement a schema-first system where schemas are the single source of truth.
- Utilize YAML files for human-friendly node definitions, compiled to JSON schemas.
- Enable automatic generation of Python and TypeScript types.
- Run a simple local server to serve schemas and support fast developer iteration.
- Provide a CLI tool for template creation, schema validation, and file management.
- Develop a UI (Next.js 15, React 19, React-Flow) for interactive node creation, viewing, editing, and saving.
- Focus initially on simple, scalable business processes across two different domains.
- Ensure all entities form a node-based directed graph structure for knowledge mapping.
- Explore and document technology stack decisions, functionality, trade-offs, and potential pitfalls to prepare for scalable MVP development.

### Key Requirements:

#### Schemas & Types
- YAML as the primary format for node definitions and templates.
- JSON as canonical schema representation for compatibility with code generators and validators.
- Automatic type generation (Python, TypeScript) without manual intervention.

#### Node Structure
- All entities follow a minimal root schema (id, type, parent_ids, child_ids, metadata).
- Use composition (JSON Schema `allOf`) for domain-specific extensions and behaviors.
- Nodes organized into an adjacency list forming a directed graph for easy knowledge graph creation.

#### User Experience
- CLI tool to:
  - Create new instances from templates.
  - Validate nodes against schema.
  - Support usage by both humans and AI agents (including MCP compatibility).
  - Be integratable into CI/CD pipelines for automated validations.
- Web UI for visual interaction and editing using Next.js, React, and React-Flow:
  - Discover existing processes and templates.
  - View, edit, and create new processes and tasks.
  - Add, modify, and remove tasks from processes.
  - Visualize relationships between files and nodes through graph views.
  - Incremental feature implementation to maintain simplicity and stability.

#### Automation & Abstraction Principles
- Automate or abstract every possible repetitive or error-prone step.
- Provide identical tooling and ease of use for humans and AI agents.
- Maintain flexibility for manual operation by experienced users or AI systems.
- Continuous identification and implementation of automation opportunities to ensure ease of correct use and difficulty in incorrect use.

#### Architecture & Tech Stack:
- Monorepo structure (preferably nx without nx-cloud).
- Repository hosted on GitHub.
- OpenAPI 3.1 standards as foundational guidelines.
- Test-driven development approach.
- "Schema on the edge" approach for seamless integration with event-driven architectures (e.g., Kafka).
- Node v22 managed via nvm for tooling.
- TypeScript v5.8 for frontend and tooling.
- Python 3.13+ with Pydantic v2.11+ and Poetry v2.1+ for backend, strongly typed.
- CLI built using Typer.

#### Documentation & Maintainability
- Markdown-based documentation in a knowledge-graph structure with clear single entry points and interlinked references.
- Document architecture, important decisions (with rationale, trade-offs, and considered options), and implementation clearly.
- Consistent, up-to-date, and easy to synchronize documentation.
- Immediate updating or removal of outdated decisions and information.
- Strict adherence to avoiding outdated or deprecated documentation and code ("broken window principle").
- Version control through git, with structured commits after each development phase.

#### Coding Standards & Best Practices
- Self-documenting, clean, readable code with emphasis on idempotent, pure functions.
- File length capped at approximately 400 lines for clarity.
- Plugin architecture for the CLI.
- Code quality tools:
  - Python: Black, Ruff
  - TypeScript: ESLint, Prettier
- Domain-driven design principles.
- Modular architecture planned for incremental refactoring, with tech debt clearly documented (20% tech debt acceptable if well-documented).
- Prefer object-oriented programming over functional programming when beneficial.
- Composition over inheritance, with considered inheritance when justified.
- Recursive folder/domain pattern to simplify navigation and mental models.
- Code reuse with a maximum of two repetitions before refactoring into common functions.

### Test-Driven Development Strategy:
- Establish initial core functionality and stabilize the technology stack.
- Focus initially on end-to-end tests for critical functionality.
- Clearly define acceptance criteria for each incremental development step.
- Develop features by first specifying and writing end-to-end tests that validate final expected outcomes.
- Use tests proactively to ensure refactoring efforts maintain existing functionality.

### Stateful Development Approach:
- Incremental development phases with clearly defined plans and checklists.
- Clearly documented acceptance criteria, ideally automated tests where feasible.
- Post-step validation of results and systematic updating/creation of documentation.
- Structured exploration ensuring rapid learning and robust validation towards a scalable MVP.
- Simple project management via markdown, maintaining ease of use for both humans and AI.

### Single Use-Case First Approach:
Begin with two minimal viable processes:
1. A process for writing a new process (e.g., drafting a minimum brief or specification document).
2. A process for executing an existing process.

Incrementally extend complexity and coverage through iterative development.

### Performance, Scalability & Security:
- Explicitly considered later in the lifecycle, post initial exploration.

### Initial Steps for Exploration:
1. Define minimal viable schemas and templates for the identified processes.
2. Set up local schema-serving server (toolchain decisions documented clearly).
3. Develop CLI for schema validation, template instantiation, and compatibility with MCP and CI/CD.
4. Implement a basic interactive UI for graph-based node editing.
5. Establish automated generation of Python and TypeScript types.
6. Document architecture, decisions, and iterative challenges clearly at each step using Markdown in a structured knowledge-graph.
7. Integrate basic end-to-end testing to validate initial functionality and guide incremental development.

