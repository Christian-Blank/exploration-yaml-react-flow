# Contributing Guide

Thank you for your interest in contributing to the Schema-First Knowledge Graph System! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/schema-first-knowledge-graph.git`
3. Install dependencies:
   ```bash
   pnpm install
   poetry install
   ```
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development Workflow

1. Make your changes following the project's coding standards and guidelines
2. Write tests for your changes
3. Update documentation to reflect your changes
4. Run tests and linting: `pnpm test && pnpm lint`
5. Commit your changes following conventional commit standards
6. Push to your fork and submit a pull request

## Coding Standards

Please follow the coding standards defined in the project:

- TypeScript/JavaScript: ESLint and Prettier with project settings
- Python: Black and Ruff with project settings
- Follow the principles outlined in the [guidelines](../../guidelines.md)

## Documentation

- Update documentation as part of your changes
- Documentation follows a knowledge graph structure
- All documentation folders must have an index.md file
- Use relative links to connect documents
- Include "Related Documentation" sections

## Testing

- Write unit tests for your code
- Write integration tests for component interactions
- Write end-to-end tests for critical user flows
- Use test fixtures to minimize test setup duplication

## Pull Request Process

1. Ensure all tests pass
2. Update documentation to reflect your changes
3. You may merge the pull request once it has been approved by a maintainer

## Code Review Process

Your pull request will be reviewed by a maintainer who will:

1. Check that the code follows the project's standards
2. Verify that all tests pass
3. Ensure documentation is updated
4. Provide feedback as necessary

## Related Documentation

- [Development Setup](./development-setup.md) - Setting up the development environment
- [Architecture Documentation](../architecture/index.md) - Understanding the system architecture
- [Guidelines](../../guidelines.md) - Project guidelines and standards 