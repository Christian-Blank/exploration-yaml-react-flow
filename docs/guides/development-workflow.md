# Development Workflow Guide

This guide explains the streamlined workflow for contributing to this project.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/exploration-yaml-react-flow.git
   cd exploration-yaml-react-flow
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up your environment**
   - Node.js >= 18.0.0
   - pnpm >= 8.0.0
   - Python >= 3.13 (for Python tools)

## Daily Development Workflow

### 1. Start with a fresh branch

```bash
git checkout main
git pull
git checkout -b feature/your-feature-name
```

### 2. Make changes in small, logical commits

As you develop, commit changes in small, focused increments:

```bash
# Stage changes
git add .

# Commit (this will use our commit template)
git commit
```

Our commit message template will guide you to write conventional commit messages.

### 3. Run checks before pushing

```bash
# Run all checks
pnpm run ci:local

# Or run specific checks
pnpm run lint
pnpm run test
```

### 4. Push your changes

```bash
git push -u origin feature/your-feature-name
```

The pre-push hook will automatically run checks before pushing.

#### Handling Check Failures

If checks fail during push, you have options:

```bash
# Skip specific checks temporarily
SKIP_LINT=true SKIP_TEST=true git push

# Skip all checks (use sparingly)
git push --no-verify
```

### 5. Update Documentation and Implementation Plan

After each meaningful commit:

1. Check off completed items in the implementation plan
2. Update relevant documentation
3. Create/update checkpoint reports for milestones

### 6. Create a Pull Request

When your feature is ready:

1. Push your final changes
2. Create a PR on GitHub
3. Use a checkpoint report as the PR description
4. Request review

## Useful Commands

| Command | Description |
|---------|-------------|
| `pnpm run lint` | Run linting |
| `pnpm run test` | Run tests |
| `pnpm run ci:local` | Run all CI checks locally |
| `pnpm run format` | Format code |
| `pnpm run build` | Build all packages |

## Troubleshooting

### Missing Dependencies

If you encounter build errors related to missing dependencies:

```bash
# Add the missing dependency
pnpm add -D [package-name]

# Rebuild
pnpm run build
```

### Pre-push Hook Issues

If the pre-push hook is causing problems:

```bash
# Temporarily disable pre-push hooks
git config --local core.hooksPath /dev/null

# Re-enable hooks
git config --local --unset core.hooksPath
```

## Further Information

- [Commit Practices](./.cursor/rules/commit-practices.mdc)
- [Development Workflow Rules](./.cursor/rules/development-workflow.mdc)
- [Documentation Standards](./.cursor/rules/documentation-standards.mdc) 