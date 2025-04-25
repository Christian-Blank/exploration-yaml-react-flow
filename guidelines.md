# LLM Development Guidelines for Schema-First Knowledge Graph System

## General Principles
- **Single Mental Model:** Always design or propose solutions aligned with the unified node-based architecture.
- **Explicit & Typed:** Ensure every suggested change or addition adheres strictly to strong typing and explicit schema definitions.
- **Self-Documenting:** Prioritize readability, clarity, and self-documentation in code and explanations.
- **Domain-Driven Design:** Use consistent domain language throughout code, documentation, and communication.
- **Modular & Composable:** Design components that are loosely coupled but strongly cohesive.
- **Progressive Enhancement:** Start with minimal viable implementations and incrementally add features.

## Schema Handling
- Always reference existing schemas clearly by their canonical paths.
- Use YAML for human-readable schema and node definitions; use JSON schemas for validation and tooling compatibility.
- Follow OpenAPI 3.1 standards for all schema definitions.
- Maintain a single source of truth for schema definitions.
- Always validate instances against schemas before processing.
- Use composition (JSON Schema `allOf`) for extending base schemas.
- Keep schema definitions concise and focused on a single responsibility.

## Code Generation & Typing
- Automatically generate types and avoid manual modifications to generated code.
- Ensure type definitions strictly match schema definitions without drift.
- Use generated types directly in both Python and TypeScript codebases.
- Include clear comments in generated files indicating they are auto-generated.
- Implement appropriate tooling to detect type mismatches during build or commit.
- Regenerate types automatically on schema changes through watch scripts.
- For explicit customization needs, create wrapper or adapter classes rather than modifying generated code.

## Development Workflow
- Follow a structured and incremental approach:
  - Clearly define each development phase.
  - Provide checklists with explicit acceptance criteria.
  - Validate each step against documented tests.
- Maintain clean commits, clearly documented with the rationale for changes.
- Use feature branches for all changes, with clear naming conventions.
- Follow test-driven development practices, especially for critical functionality.
- Maintain an up-to-date implementation plan tracking progress.
- When implementing a feature, always check for existing patterns in the codebase.
- Keep refactoring and feature development separate where possible.
- Break down implementation plan into phase-specific documents under 400 lines each.
- Create checkpoint reports at significant milestones to document progress and provide review guidance.
- Run local CI checks before pushing to catch issues early:
  - Use `pnpm run ci:local` to run all validation checks manually
  - Pre-push hook automatically runs these checks before pushing
  - Use `git push --no-verify` only when absolutely necessary and document why
- After each meaningful commit:
  - Check off completed items in the implementation plan
  - Update relevant documentation to reflect changes
  - Create/update checkpoint reports when reaching milestones
  - Consider whether the changes warrant a PR for review
  - Ensure the project remains in a consistent state at all times

## Documentation Standards
- Update documentation immediately upon decisions, code changes, or refactoring.
- Keep documentation concise, interconnected, and structured in a knowledge-graph-like format.
- Ensure no outdated or redundant information remains (adhere strictly to the broken window principle).
- Use consistent terminology across all documentation.
- Document architecture decisions with context, considered alternatives, and trade-offs.
- Structure documentation with clear entry points and navigable links.
- Include examples for all core functionality and concepts.
- Keep implementation details separate from conceptual documentation.
- Ensure documentation is accessible and relevant for solo development with AI assistance.
- All documentation folders must have an index.md file serving as an entry point.
- Use relative links to connect documents in the knowledge graph structure.
- Include "Related Documentation" sections to provide cross-references to related areas.
- Document both the "why" and the "how" for all significant decisions and implementations.
- Use Markdown tables for complex data representation.
- Include diagrams where appropriate to clarify complex relationships.

## Coding Conventions
- Follow prescribed coding standards:
  - Python: Use Black, Ruff, and strongly typed code with Pydantic v2.
  - TypeScript: Use ESLint, Prettier, and adhere to Typescript 5.8 standards.
- Keep file sizes manageable (ideally under 400 lines).
- Implement self-contained, idempotent, pure functions.
- Use descriptive variable, function, and class names.
- Keep functions short and focused on a single responsibility.
- Use consistent naming conventions across all codebases:
  - TypeScript/JavaScript: camelCase for variables and functions, PascalCase for classes and types
  - Python: snake_case for variables and functions, PascalCase for classes
- Document tech debt inline with clear TODO comments including rationale.
- Use composition over inheritance, but consider inheritance for appropriate use cases.
- Follow the principle of least surprise in API design.
- Implement defensive programming practices, especially at system boundaries.

## Schema Design Principles
- Use consistent property naming across all schemas.
- Implement clear versioning for all schemas.
- Define appropriate validation constraints in schemas.
- Keep schemas focused on data structure, not behavior.
- Use enums for fields with a limited set of valid values.
- Include descriptive metadata in all schemas.
- Design schemas with forward compatibility in mind.
- Use schema references to reuse common structures.

## Frontend Development
- Build responsive UIs that work across device sizes.
- Use React Flow for all node visualization and interaction.
- Implement clear visual hierarchy and intuitive interaction patterns.
- Utilize React hooks for state management where appropriate.
- Keep components focused on a single responsibility.
- Implement proper error handling and user feedback.
- Ensure accessibility is considered from the beginning.
- Use TypeScript for all frontend code with strict typing.
- Follow Next.js 15+ conventions and best practices.

## Backend Development
- Use strongly typed Python with Pydantic for data validation.
- Implement clear separation of concerns in API design.
- Design services with clear boundaries and responsibilities.
- Use Poetry for dependency management in all Python code.
- Follow Typer conventions for CLI development.
- Implement comprehensive error handling and logging.
- Design APIs with versioning in mind.
- Document API endpoints with clear examples.

## Tooling and Integration
- CLI should support both human and AI (MCP-compatible) interaction equally.
- Ensure CI/CD pipeline compatibility for automated validation.
- Implement consistent error messages across all tools.
- Design tools with composability in mind.
- Provide both programmatic and interactive interfaces where appropriate.
- Ensure tools are well-documented with examples.
- Implement verbose logging options for debugging.
- Develop tools with plugin architecture for extensibility.

## Test-Driven Practices
- Always write tests clearly defining expected outcomes before implementing features.
- Ensure tests comprehensively cover end-to-end functionality to support robust refactoring.
- Implement unit tests for core functionality.
- Use integration tests for component interactions.
- Implement end-to-end tests for critical user flows.
- Design tests for failure cases and edge conditions.
- Keep tests focused, readable, and maintainable.
- Use test fixtures to minimize test setup duplication.
- Document test coverage gaps as tech debt.

## Knowledge Graph Principles
- Design nodes with clear relationships and semantics.
- Use consistent relationship types across the graph.
- Implement appropriate traversal and query patterns.
- Consider graph query performance in design decisions.
- Design with eventual scale in mind, but optimize for the current use case.
- Document graph structure and semantics clearly.
- Consider visualization needs in graph design.
- Structure all documentation following knowledge graph principles:
  - Each document should link to related documents
  - Each folder should have an index document as an entry point
  - Navigation should be intuitive and consistent
  - Cross-references should be bi-directional

## Project Management
- Keep project tracking simple, using markdown files that are easy to follow for both humans and AI systems.
- Break down implementation phases into separate files under 400 lines each.
- Structure project plans hierarchically:
  - Phase → Task → Steps
  - Each phase should have its own document with clear links to parent and child documents
  - Each task should have defined acceptance criteria
  - Each task should have a checkpoint to create a commit after completion
  - Each phase should end with a pull request
- Track progress against clearly defined phases and acceptance criteria.
- Document and address blocking issues promptly.
- Maintain a clear roadmap aligned with the implementation plan.
- Use GitHub issues for tracking specific tasks and bugs.
- Use GitHub pull requests for code review and integration.
- Document decisions and their rationale clearly.
- Store all project management documents in the docs/project-management directory.
- Update implementation plan when completing tasks or making significant changes.
- Create checkpoint reports at each significant milestone:
  - Store reports in the docs/reports directory
  - Name reports with date and phase (e.g., 2023-11-15-phase1-checkpoint1.md)
  - Include summary of changes, review guidance, testing procedures, and next steps
  - Use checkpoint reports as PR descriptions when submitting for review
  - Reference checkpoint reports in phase documentation

Following these guidelines helps ensure consistency, clarity, and scalability throughout the project's lifecycle.