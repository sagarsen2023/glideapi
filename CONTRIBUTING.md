# Contributing to GlideAPI

Thank you for your interest in contributing to GlideAPI! We're excited to have you join us in making backend development faster and more enjoyable for everyone. 🎉

This document provides guidelines and instructions for contributing to the project. Please read it carefully before submitting your contributions.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Adding New Templates](#adding-new-templates)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

By participating in this project, you agree to:

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

We are committed to providing a welcoming and inspiring community for all. Please report unacceptable behavior to [sagarsen.dev@gmail.com](mailto:sagarsen.dev@gmail.com).

---

## Getting Started

### Prerequisites

Before contributing, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Git**
- **MongoDB** (for testing Express-MongoDB template)

### Fork and Clone

1. **Fork the repository** on GitHub by clicking the "Fork" button
2. **Clone your fork** to your local machine:

```bash
git clone https://github.com/YOUR_USERNAME/glideapi.git
cd glideapi
```

3. **Add upstream remote** to keep your fork synced:

```bash
git remote add upstream https://github.com/sagarsen2023/glideapi.git
```

4. **Create a new branch** for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

---

## Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Project

```bash
npm run build
```

This command will:
- Run ESLint to check for code issues
- Compile TypeScript to JavaScript
- Fix ESM imports with `tsc-esm-fix`
- Copy template files to the `dist` directory

### 3. Link the CLI Locally

To test your changes with the CLI commands:

```bash
npm link
```

Now you can use `glideapi` command globally to test your changes.

Alternatively, for a complete local install:

```bash
npm run local-install
```

This will lint, build, link, and install the package globally.

### 4. Test the CLI

Create a test directory and try the commands:

```bash
mkdir /tmp/test-glideapi
cd /tmp/test-glideapi
glideapi init
```

---

## Project Structure

Understanding the project structure will help you contribute effectively:

```
glideapi/
├── bin/
│   └── index.js                 # CLI entry point (loads dist/index.js)
├── src/
│   ├── config/                  # Command configurations
│   │   ├── initialize-project.config.ts
│   │   └── generate-module.config.ts
│   ├── lib/                     # Library functions
│   │   └── get-templates.ts    # Template discovery
│   ├── scripts/                 # Build scripts
│   │   └── copy-templates.ts   # Copies template files during build
│   ├── templates/               # Project templates
│   │   ├── index.ts            # Template registry
│   │   └── express-mongodb/    # Express + MongoDB template
│   │       ├── initiator.ts    # Project initialization logic
│   │       ├── route-generator.ts  # Module generation logic
│   │       └── project-files/  # Template files to be copied
│   ├── types/                   # TypeScript type definitions
│   │   ├── glideapi-json.types.ts
│   │   └── initiator.types.ts
│   ├── utils/                   # Utility functions
│   │   ├── custom-prompt.ts    # Interactive CLI prompts
│   │   ├── logger.ts           # Console logging utilities
│   │   ├── text-to-camel-case.ts
│   │   └── text-to-upper-camel-case.ts
│   └── index.ts                 # Main CLI program
├── dist/                        # Compiled output (git-ignored)
├── .gitignore
├── .npmignore
├── .prettierrc                  # Prettier configuration
├── eslint.config.js             # ESLint configuration
├── package.json
├── tsconfig.json                # TypeScript configuration
├── README.md
└── CONTRIBUTING.md
```

### Key Directories

- **`src/config/`** - CLI command definitions using Commander.js
- **`src/templates/`** - All project templates (add new templates here)
- **`src/templates/*/project-files/`** - Template files that get copied to user projects
- **`src/utils/`** - Reusable utility functions
- **`bin/`** - CLI executable entry point

---

## How to Contribute

### Types of Contributions We Welcome

1. **Bug Fixes** - Fix issues reported in GitHub Issues
2. **New Features** - Add new CLI commands or functionality
3. **New Templates** - Add support for new frameworks/databases
4. **Documentation** - Improve README, code comments, or guides
5. **Code Quality** - Refactoring, performance improvements
6. **Tests** - Add or improve test coverage (when test infrastructure exists)

### Contribution Workflow

1. **Check existing issues** - Look for open issues or create a new one to discuss your idea
2. **Get assigned** - Comment on the issue to get assigned (for larger changes)
3. **Create a branch** - Use a descriptive branch name
4. **Make your changes** - Follow the code style guidelines
5. **Test thoroughly** - Test your changes with `glideapi` commands
6. **Commit with good messages** - Follow the commit message guidelines
7. **Push and create PR** - Submit a pull request for review

---

## Commit Message Guidelines

We follow the **Conventional Commits** specification for clear and structured commit messages.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes only
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring without adding features or fixing bugs
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Changes to build system or dependencies
- **ci**: Changes to CI configuration files
- **chore**: Other changes that don't modify src or test files

### Scope (Optional)

The scope specifies the area of the codebase affected:

- `cli` - CLI command changes
- `templates` - Template-related changes
- `express-mongodb` - Express-MongoDB template
- `generator` - Module generation logic
- `utils` - Utility functions
- `docs` - Documentation

### Subject

- Use imperative mood ("add feature" not "added feature")
- Don't capitalize the first letter
- No period at the end
- Keep it under 50 characters

### Examples

```bash
# Feature addition
feat(templates): add fastify-postgres template

# Bug fix
fix(generator): correct module naming in route generator

# Documentation
docs(readme): add installation instructions for Windows

# Refactoring
refactor(utils): simplify text transformation functions

# Style changes
style(cli): format code with prettier

# Build changes
build(deps): update commander to version 14.0.2
```

### Good Commit Messages

```
✅ feat(cli): add support for custom template directories
✅ fix(express-mongodb): resolve path issues on Windows
✅ docs(contributing): add commit message guidelines
✅ refactor(generator): extract common generation logic
```

### Bad Commit Messages

```
❌ update files
❌ Fixed bug
❌ WIP
❌ changes to readme
```

### Multi-line Commits

For complex changes, add a body and footer:

```
feat(templates): add NestJS template

- Add NestJS project initialization
- Include TypeORM integration
- Add JWT authentication module
- Include Swagger documentation setup

Closes #42
```

---

## Code Style Guidelines

### TypeScript Best Practices

1. **Type Safety**
   - Always use explicit types for function parameters and return values
   - Avoid using `any` unless absolutely necessary
   - Use interfaces for object shapes
   - Use type aliases for complex types

```typescript
// ✅ Good
interface TemplateConfig {
  name: string;
  command: string;
  templateFiles: TemplateFile[];
}

async function getConfig(): Promise<TemplateConfig> {
  // ...
}

// ❌ Bad
async function getConfig() {
  // ...
}
```

2. **Naming Conventions**
   - Use `PascalCase` for classes and interfaces
   - Use `camelCase` for variables, functions, and methods
   - Use `UPPER_SNAKE_CASE` for constants
   - Use descriptive names

```typescript
// ✅ Good
class ProductService extends GlideService<ProductType> {}
const userProfile = await getUserProfile();
const MAX_RETRY_ATTEMPTS = 3;

// ❌ Bad
class product_service {}
const up = await getUP();
const max = 3;
```

3. **File Organization**
   - One class/interface per file (with exceptions for closely related types)
   - Export statements at the end of the file
   - Group imports: Node.js built-ins → Third-party → Local

```typescript
// ✅ Good
import path from "path";
import fs from "fs-extra";
import { Command } from "commander";
import { customPrompt } from "../utils/custom-prompt";
import { errorLog } from "../utils/logger";
```

4. **Function Structure**
   - Keep functions small and focused
   - Use async/await instead of promises
   - Handle errors properly

```typescript
// ✅ Good
async function generateModule(moduleName: string): Promise<void> {
  try {
    validateModuleName(moduleName);
    await createModelFile(moduleName);
    await createServiceFile(moduleName);
    await createControllerFile(moduleName);
  } catch (error) {
    errorLog(`Failed to generate module: ${error.message}`);
    throw error;
  }
}
```

### Code Formatting

- **Indentation**: 2 spaces (not tabs)
- **Line Length**: Maximum 100 characters (soft limit)
- **Quotes**: Use double quotes for strings
- **Semicolons**: Use semicolons
- **Trailing Commas**: Use trailing commas in multi-line objects/arrays

We use **Prettier** for automatic formatting. Configuration in `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2
}
```

### Linting

We use **ESLint** with TypeScript support. Run the linter:

```bash
npx eslint .
```

Fix auto-fixable issues:

```bash
npx eslint . --fix
```

### Comments and Documentation

1. **JSDoc Comments** for public APIs:

```typescript
/**
 * Generates a new module with model, service, controller, and routes.
 * @param moduleName - The name of the module (e.g., "blog-posts")
 * @throws {Error} If module name is invalid or generation fails
 */
export function generateModule(moduleName: string): void {
  // ...
}
```

2. **Inline Comments** for complex logic:

```typescript
// ? Calculate total count before pagination
const totalCount = await this.model.countDocuments(queryFilter).exec();

// ! Important: Bind methods to prevent 'this' context loss in Express
this.getAll = this.getAll.bind(this);
```

3. **TODO Comments** for future improvements:

```typescript
// TODO: Add support for custom validation rules
// FIXME: Handle edge case when module already exists
```

---

## Testing Guidelines

### Manual Testing

Before submitting a PR, manually test your changes:

1. **Build the project**:
```bash
npm run build
```

2. **Link locally**:
```bash
npm link
```

3. **Test `init` command**:
```bash
mkdir /tmp/test-project
cd /tmp/test-project
glideapi init
```

4. **Test `generate-module` command**:
```bash
cd /tmp/test-project
glideapi generate-module test-module
```

5. **Test the generated project**:
```bash
npm run dev
# Test API endpoints with curl or Postman
```

### What to Test

- ✅ CLI commands work without errors
- ✅ Generated files have correct content
- ✅ Generated code compiles without TypeScript errors
- ✅ Generated modules work correctly in the running application
- ✅ Templates copy correctly on different operating systems (Windows/Mac/Linux)
- ✅ Error handling works as expected

### Automated Testing

Currently, the project doesn't have automated tests. **We welcome contributions to add test infrastructure!**

Potential test frameworks and testing areas to consider:

**Test Frameworks:**
- Jest or Vitest for unit tests
- Execa or similar for testing CLI commands
- Integration tests for generated projects

**Priority Testing Areas:**
1. **CLI Command Tests** - Test `init` and `generate-module` commands
2. **Template Generation Tests** - Verify correct file generation
3. **Cross-Platform Compatibility Tests** - Test on Windows, Mac, and Linux
4. **Generated Code Validation** - Ensure generated code compiles without errors
5. **Module Generation Tests** - Verify generated modules work correctly
6. **Path Resolution Tests** - Test template file copying and path resolution

---

## Adding New Templates

One of the most valuable contributions is adding support for new frameworks and databases!

### Step 1: Create Template Directory

Create a new directory under `src/templates/`:

```bash
mkdir -p src/templates/fastify-postgres
```

### Step 2: Create Template Files

Create the `project-files/` directory with your template structure:

```
src/templates/fastify-postgres/
├── initiator.ts
├── route-generator.ts
└── project-files/
    ├── .gitignore
    ├── .prettierrc
    ├── package.json
    ├── tsconfig.json
    ├── glideapi.json
    └── src/
        ├── index.ts
        ├── config/
        ├── modules/
        └── plugins/
```

### Step 3: Implement Initiator

Create `initiator.ts` to define project initialization:

```typescript
import { ConfigOptions, TemplateFile } from "../../types/initiator.types";
import fs from "fs-extra";
import path from "path";

export const fastifyPostgresConfig = async (
  folderName: string,
): Promise<ConfigOptions> => {
  const templateDir = `${__dirname}/project-files`;
  
  // Get all template files recursively
  const getAllFilesRecursively = (dir: string, prefix = ""): TemplateFile[] => {
    // ... implementation similar to express-mongodb
  };

  const allProjectFiles = getAllFilesRecursively(templateDir);

  return {
    name: "Fastify with PostgreSQL",
    command: `npm init -y ${folderName === "." ? "" : folderName} && cd ${folderName} && npm i fastify @fastify/cors pg`,
    templateFiles: allProjectFiles,
    postInstallCommands: [
      `cd ${folderName} && npx npm-add-script -k "dev" -v "ts-node src/index.ts"`,
      // ... more commands
    ],
    finalizationCommands: [
      `cd ${folderName} && git init`,
      // ... more commands
    ],
  };
};
```

### Step 4: Implement Route Generator

Create `route-generator.ts` for module generation:

```typescript
import fs from "fs-extra";
import path from "path";
import { successLog, errorLog, infoLog } from "../../utils/logger";

export const fastifyPostgresRouteGenerator = (moduleName: string) => {
  try {
    infoLog(`Generating module: ${moduleName}`);
    
    // Generate model
    generateModel(moduleName);
    
    // Generate service
    generateService(moduleName);
    
    // Generate controller
    generateController(moduleName);
    
    // Generate routes
    generateRoutes(moduleName);
    
    successLog(`Module "${moduleName}" generated successfully!`);
  } catch (error) {
    errorLog(error.message);
  }
};

function generateModel(moduleName: string) {
  // Implementation
}

function generateService(moduleName: string) {
  // Implementation
}

function generateController(moduleName: string) {
  // Implementation
}

function generateRoutes(moduleName: string) {
  // Implementation
}
```

### Step 5: Register Template

Add your template to `src/templates/index.ts`:

```typescript
import { fastifyPostgresConfig } from "./fastify-postgres/initiator";
import { fastifyPostgresRouteGenerator } from "./fastify-postgres/route-generator";

export const templateConfigs: TemplateConfig = {
  "express-mongodb": {
    init: (folderName: string) => expressMongodbConfig(folderName),
    generateModule: (module: string) => expressMongodbRouteGenerator(module),
  },
  "fastify-postgres": {
    init: (folderName: string) => fastifyPostgresConfig(folderName),
    generateModule: (module: string) => fastifyPostgresRouteGenerator(module),
  },
};
```

### Step 6: Test Your Template

1. Build the project: `npm run build`
2. Link locally: `npm link`
3. Test initialization: `glideapi init test-fastify`
4. Test module generation: `cd test-fastify && glideapi generate-module products`
5. Verify the generated project works

### Step 7: Document Your Template

Add documentation to README.md about your new template, including:
- Technology stack
- Features
- Configuration
- Usage examples

### Template Checklist

- [ ] Directory structure created
- [ ] All project-files are present
- [ ] initiator.ts implemented
- [ ] route-generator.ts implemented
- [ ] Template registered in index.ts
- [ ] glideapi.json includes correct database name
- [ ] Tested on Windows, Mac, and Linux (if possible)
- [ ] README.md updated with template documentation
- [ ] Example module can be generated and works

---

## Pull Request Process

### Before Submitting

1. **Test your changes thoroughly**
2. **Run linter**: `npx eslint .`
3. **Build successfully**: `npm run build`
4. **Update documentation** if needed
5. **Ensure commits follow guidelines**

### PR Title Format

Use the same format as commit messages:

```
feat(templates): add fastify-postgres template
fix(generator): resolve naming conflicts in routes
docs(readme): update API documentation
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Related Issue
Closes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## How Has This Been Tested?
Describe the tests you ran and the results.

## Checklist
- [ ] My code follows the project's code style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested this thoroughly
- [ ] Any dependent changes have been merged and published
```

### Review Process

1. **Maintainer Review** - A maintainer will review your PR
2. **Feedback** - Address any feedback or requested changes
3. **Approval** - Once approved, a maintainer will merge your PR
4. **Release** - Your contribution will be included in the next release

### PR Best Practices

- Keep PRs focused on a single concern
- Split large changes into multiple PRs
- Respond to feedback promptly
- Be open to suggestions and discussions
- Update your PR if requested

---

## Reporting Bugs

### Before Reporting

1. **Check existing issues** - Your bug might already be reported
2. **Try the latest version** - The bug might be fixed
3. **Reproduce the bug** - Ensure it's reproducible

### Bug Report Template

Create an issue with the following information:

```markdown
## Bug Description
Clear and concise description of the bug.

## Steps to Reproduce
1. Run `glideapi init`
2. Select express-mongodb
3. Run `glideapi generate-module test`
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g., Windows 11, macOS 13, Ubuntu 22.04]
- Node.js version: [e.g., v18.17.0]
- npm version: [e.g., 9.6.7]
- GlideAPI version: [e.g., 1.0.0]

## Additional Context
- Error logs
- Screenshots
- Any other relevant information
```

---

## Suggesting Features

We love new ideas! Here's how to suggest features:

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature you'd like to see.

## Motivation
Why do you need this feature? What problem does it solve?

## Proposed Solution
How do you think it should work?

## Alternatives Considered
What alternative solutions have you considered?

## Additional Context
Any other context, mockups, or examples.
```

### Feature Discussion

- Open an issue with the "feature request" label
- Discuss the feature with maintainers
- Get feedback before starting implementation
- Large features may need design proposals

---

## Using the Templates Directory

### Understanding Template Structure

Templates are the heart of GlideAPI. They define:

1. **Project Structure** - How the generated project is organized
2. **Dependencies** - What packages are installed
3. **Configuration** - Default settings and configurations
4. **Code Generation** - How modules are generated

### Template Components

Each template has three main components:

#### 1. Project Files (`project-files/`)

These are the actual files copied to user projects:

```
project-files/
├── core/                    # Framework core (services, controllers, etc.)
├── src/                     # Application source code
│   ├── config/             # Configuration files
│   ├── modules/            # Feature modules (auth, users, etc.)
│   ├── plugins/            # Express/framework plugins
│   └── index.ts            # Application entry point
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── glideapi.json           # GlideAPI configuration
└── tsconfig.json
```

**Best Practices for project-files:**
- Include only essential boilerplate code
- Use placeholder comments where users will add code
- Provide working examples (like auth module)
- Keep configuration files minimal but functional

#### 2. Initiator (`initiator.ts`)

Handles project initialization:

```typescript
export const yourTemplateConfig = async (
  folderName: string,
): Promise<ConfigOptions> => {
  return {
    name: "Your Template Name",
    command: "npm init -y && npm install ...",  // Installation command
    templateFiles: [...],                        // Files to copy
    postInstallCommands: [...],                  // Commands after install
    finalizationCommands: [...],                 // Final setup (git, etc.)
  };
};
```

**Best Practices for initiator:**
- Install all required dependencies in the command
- Use postInstallCommands for npm script additions
- Add git initialization in finalizationCommands
- Handle cross-platform differences (Windows vs Unix)

#### 3. Route Generator (`route-generator.ts`)

Handles module generation:

```typescript
export const yourTemplateRouteGenerator = (moduleName: string) => {
  // Generate model file
  // Generate DTO file
  // Generate service file
  // Generate controller file
  // Generate routes file
};
```

**Best Practices for route generator:**
- Normalize module names (lowercase, replace spaces)
- Check if files already exist before creating
- Generate working boilerplate code
- Provide helpful comments in generated files
- Log next steps for the user

### Modifying Template Files

When modifying template files:

1. **Edit in `src/templates/*/project-files/`**
2. **Run `npm run build`** to copy changes to `dist/`
3. **Test by running `glideapi init`** in a test directory

Changes to template files won't take effect until you rebuild.

### Template File Best Practices

1. **Comments**: Add clear comments explaining what users should modify
2. **Defaults**: Provide sensible defaults that work out of the box
3. **Examples**: Include working examples (like the auth module)
4. **Documentation**: Comment complex patterns or architectures
5. **Flexibility**: Make it easy for users to extend and customize

---

## Getting Help

If you need help contributing:

- **GitHub Issues** - Ask questions in issues
- **Email** - Contact [sagarsen.dev@gmail.com](mailto:sagarsen.dev@gmail.com)
- **Discussions** - Start a discussion on GitHub (if enabled)

---

## Recognition

Contributors will be:
- Listed in our CONTRIBUTORS.md file
- Mentioned in release notes
- Credited in the repository

---

## License

By contributing to GlideAPI, you agree that your contributions will be licensed under the MIT License.

---

<p align="center">
  Thank you for contributing to GlideAPI! 🚀
  <br>
  Your efforts help make backend development better for everyone.
</p>
