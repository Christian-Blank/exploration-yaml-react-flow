# Using Nx in the Schema-First Monorepo

This guide provides detailed information on how to effectively use Nx to work with our monorepo structure.

## Overview

Our project uses [Nx](https://nx.dev/), a powerful build system for monorepos. Nx helps manage dependencies between packages, provides intelligent caching, and makes it easy to run commands across multiple packages.

## Project Structure

The monorepo is organized into the following packages:

| Package | Description | Dependencies |
|---------|-------------|--------------|
| `core` | Shared utilities and schema validation | None |
| `cli` | Command-line interface | `core` |
| `schema-server` | API for serving schemas | `core` |
| `type-generators` | Type generation tools | `core` |
| `web` | Next.js web application | `core` |

## Common Nx Commands

### Exploring the Workspace

```bash
# List all projects in the workspace
npx nx show projects

# Display the dependency graph in a browser
npx nx graph

# Show details about a specific project
npx nx show project core

# List all available targets (commands) for a project
npx nx show project core --targets
```

### Running Commands

```bash
# Run a command for a specific project
npx nx run core:build
# Or the shorthand syntax
npx nx build core

# Run a command for all projects
npx nx run-many --target=build --all

# Run a command for multiple specific projects
npx nx run-many --target=test --projects=core,cli

# Run a command only for projects affected by your changes
npx nx affected --target=lint
```

### Dependency Management

Nx automatically manages build order based on the dependency graph:

```bash
# Building cli will automatically build core first
npx nx build cli
```

### PNPM Aliases

We've set up shorthand pnpm commands in the root package.json:

```bash
# Equivalent to npx nx run-many --target=build --all
pnpm build

# Equivalent to npx nx run-many --target=test --all
pnpm test

# Equivalent to npx nx run-many --target=lint --all
pnpm lint

# Equivalent to npx nx run-many --target=format --all
pnpm format

# Equivalent to npx nx run-many --target=clean --all
pnpm clean
```

## Package-Specific Commands

### Core Package

```bash
# Build the core library
npx nx build core

# Run tests for core
npx nx test core

# Lint the core codebase
npx nx lint core
```

### CLI Package

```bash
# Build the CLI
npx nx build cli

# Test the CLI
npx nx test cli
```

### Schema Server

```bash
# Build the schema server
npx nx build schema-server

# Start the schema server
npx nx serve schema-server
```

### Type Generators

```bash
# Build the type generators
npx nx build type-generators

# Run the generators
npx nx generate type-generators
```

### Web Application

```bash
# Start the Next.js development server
npx nx dev web

# Build the Next.js application
npx nx build web

# Start the production server
npx nx start web
```

## Caching and Performance

Nx provides intelligent caching to speed up your workflow:

```bash
# Clear the Nx cache
npx nx reset

# Display the Nx cache status
npx nx report
```

## Tips and Best Practices

1. **Use the Dependency Graph**: View the dependency graph with `npx nx graph` to understand how packages relate to each other.

2. **Run Affected Commands**: Instead of rebuilding everything, use `npx nx affected` to only build what's affected by your changes.

3. **Use Tags for Organization**: Our package.json files use tags like "core", "cli", etc. You can filter by these tags:
   ```bash
   npx nx run-many --target=build --projects=tag:cli
   ```

4. **Consistent Project Structure**: Each package follows a similar structure with src directory, TypeScript configuration, and package.json.

5. **Parallel Execution**: Nx runs tasks in parallel by default, making builds faster.

## Troubleshooting

### Command Not Found

If you get `Command not found` when running an Nx command, make sure your current directory is the root of the monorepo.

### Build Errors

If you encounter build errors:
1. Check if dependencies are built first (`core` usually needs to be built before other packages)
2. Try cleaning the build output with `npx nx clean [package]`
3. Verify TypeScript configurations are correct

### More Help

For more detailed information about Nx, refer to:
- [Nx Documentation](https://nx.dev/getting-started/intro)
- Run `npx nx --help` for command-line help

## Related Documentation

- [Development Workflow Guide](./development-workflow.md)
- [Project Structure](../architecture/project-structure.md) 