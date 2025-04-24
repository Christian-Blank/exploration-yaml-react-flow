# LLM Development Guidelines for Schema-First Knowledge Graph System

## General Principles
- **Single Mental Model:** Always design or propose solutions aligned with the unified node-based architecture.
- **Explicit & Typed:** Ensure every suggested change or addition adheres strictly to strong typing and explicit schema definitions.
- **Self-Documenting:** Prioritize readability, clarity, and self-documentation in code and explanations.

## Schema Handling
- Always reference existing schemas clearly by their canonical paths.
- Use YAML for human-readable schema and node definitions; use JSON schemas for validation and tooling compatibility.

## Code Generation & Typing
- Automatically generate types and avoid manual modifications to generated code.
- Ensure type definitions strictly match schema definitions without drift.

## Development Workflow
- Follow a structured and incremental approach:
  - Clearly define each development phase.
  - Provide checklists with explicit acceptance criteria.
  - Validate each step against documented tests.
- Maintain clean commits, clearly documented with the rationale for changes.

## Documentation Standards
- Update documentation immediately upon decisions, code changes, or refactoring.
- Keep documentation concise, interconnected, and structured in a knowledge-graph-like format.
- Ensure no outdated or redundant information remains (adhere strictly to the broken window principle).

## Coding Conventions
- Follow prescribed coding standards:
  - Python: Use Black, Ruff, and strongly typed code with Pydantic v2.
  - TypeScript: Use ESLint, Prettier, and adhere to Typescript 5.8 standards.
- Keep file sizes manageable (ideally under 400 lines).
- Implement self-contained, idempotent, pure functions.

## Tooling and Integration
- CLI should support both human and AI (MCP-compatible) interaction equally.
- Ensure CI/CD pipeline compatibility for automated validation.

## Test-Driven Practices
- Always write tests clearly defining expected outcomes before implementing features.
- Ensure tests comprehensively cover end-to-end functionality to support robust refactoring.

## Project Management
- Keep project tracking simple, using markdown files that are easy to follow for both humans and AI systems.

Following these guidelines helps ensure consistency, clarity, and scalability throughout the project's lifecycle.