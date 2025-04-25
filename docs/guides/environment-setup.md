# Development Environment Setup

This guide provides detailed instructions for setting up your development environment for the Schema-First Knowledge Graph System.

## Prerequisites

### Required Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | v22+ | JavaScript runtime |
| Python | 3.13+ | Python runtime |
| pnpm | 8+ | Node.js package manager |
| Poetry | 2.1+ | Python dependency manager |
| Git | 2.0+ | Version control |

## Node.js Setup

We use Node.js v22+ for JavaScript/TypeScript development and recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions.

### Installing nvm

If you don't have nvm installed, follow the [official installation instructions](https://github.com/nvm-sh/nvm#installing-and-updating).

For macOS/Linux users:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

For Windows users, use [nvm-windows](https://github.com/coreybutler/nvm-windows).

### Installing Node.js v22

The project includes an `.nvmrc` file that specifies Node.js v22. Use the following commands to install and use the correct version:

```bash
# Navigate to the project directory
cd exploration-yaml-react-flow

# Install the version specified in .nvmrc
nvm install

# Use the specified version
nvm use
```

Verify your Node.js version:
```bash
node -v
# Should output v22.x.x
```

## Python Setup

We use Python 3.13+ and Poetry for dependency management.

### Installing Python 3.13+

#### macOS

Using Homebrew:
```bash
brew install python@3.13
```

#### Linux

Using pyenv:
```bash
pyenv install 3.13.2
pyenv global 3.13.2
```

#### Windows

Download the installer from the [official Python website](https://www.python.org/downloads/).

### Verify Python Installation

```bash
python --version
# Should output Python 3.13.x
```

## Poetry Setup

Poetry is used for Python dependency management.

### Installing Poetry

Follow the [official installation instructions](https://python-poetry.org/docs/#installation).

For macOS/Linux/Windows:
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

### Verify Poetry Installation

```bash
poetry --version
# Should output Poetry (version 2.1.x)
```

## Package Managers

### pnpm Setup

We use pnpm for Node.js dependency management.

```bash
# Install pnpm globally using npm
npm install -g pnpm@latest

# Verify installation
pnpm --version
# Should output 8.x.x or higher
```

## Setting Up the Project

### Clone the Repository

```bash
git clone https://github.com/Christian-Blank/exploration-yaml-react-flow.git
cd exploration-yaml-react-flow
```

### Install Node.js Dependencies

```bash
# Switch to the correct Node.js version
nvm use

# Install dependencies
pnpm install
```

### Install Python Dependencies

```bash
# Install dependencies using Poetry
poetry install
```

## Verifying Your Setup

Run the following commands to verify your setup:

```bash
# Verify Node.js version
node -v  # Should show v22.x.x

# Verify pnpm
pnpm -v  # Should show 8.x.x or higher

# Verify Python version
python --version  # Should show Python 3.13.x

# Verify Poetry
poetry --version  # Should show Poetry 2.1.x or higher
```

## IDE Recommendations

We recommend using [Visual Studio Code](https://code.visualstudio.com/) or [Cursor](https://cursor.sh/) with the following extensions:

- ESLint
- Prettier
- Python
- YAML

## Next Steps

Now that your environment is set up, check out these guides:

- [Development Workflow](./development-workflow.md)
- [Using Nx Monorepo](./using-nx.md)
- [Working with Schemas](./working-with-schemas.md)

## Troubleshooting

### Node.js Version Issues

If you encounter issues with Node.js versions:

```bash
# Ensure nvm is installed
command -v nvm

# List available Node.js versions
nvm ls

# Install the required version
nvm install 22

# Use the required version
nvm use 22
```

### Python Environment Issues

If you encounter issues with Python:

```bash
# Check Python path
which python

# Ensure Poetry is using the correct Python version
poetry env info
```

### Package Installation Issues

If you encounter issues installing packages:

```bash
# Clear pnpm cache
pnpm store prune

# Clear Poetry cache
poetry cache clear --all pypi
```

## Related Documentation

- [Development Workflow Guide](./development-workflow.md)
- [Project Structure](../architecture/project-structure.md) 