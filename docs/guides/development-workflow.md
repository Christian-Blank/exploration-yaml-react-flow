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

## Project Management Structure

Our project follows a hierarchical structure for organization:

```
Implementation Plan
  └── Phase 1: Project Setup
      ├── Task 1: Repository Setup
      │   ├── Step 1.1
      │   └── Step 1.2
      └── Task 2: Environment Config
          ├── Step 2.1
          └── Step 2.2
```

Each phase has:
- A dedicated document with clear links to parent/child documents
- Tasks broken down into specific steps
- Checkpoints for commits after task completion
- Acceptance criteria for each task and the overall phase
- A pull request at the end of the phase

When working on tasks:
1. Reference the implementation plan to find your phase
2. Navigate to the specific task in the phase document
3. Follow the defined steps
4. Create checkpoints and commits after completing tasks
5. Update documentation to reflect progress

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

1. Check off completed steps in the task list
2. Update task status in the phase document:
   - Move tasks from "in progress" to "completed"
   - Update checkpoints as you reach them
3. Create/update checkpoint reports for completed tasks
4. Keep the implementation plan document in sync with progress
5. Ensure bidirectional links between documents remain intact

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