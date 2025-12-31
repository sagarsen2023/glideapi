# GlideAPI

<p align="center">
  <strong>A powerful CLI tool to scaffold backend projects and generate modules for rapid API development</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#cli-commands">CLI Commands</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#templates">Templates</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## Features

✨ **Quick Project Initialization** - Scaffold a complete backend project with a single command  
🎯 **Module Generation** - Generate CRUD modules with models, services, controllers, and routes automatically  
🏗️ **Factory Pattern Architecture** - Built-in base classes for services and controllers to reduce boilerplate  
📦 **Multiple Templates** - Support for Express + MongoDB (more templates coming soon)  
🔒 **Built-in Authentication** - Pre-configured JWT authentication with user management  
⚡ **TypeScript First** - Full TypeScript support with type safety  
🧩 **Extensible** - Easy to extend services and controllers for custom business logic

---

## Installation

### Global Installation (Recommended)

```bash
npm install -g glideapi
```

### Using npx (No installation required)

```bash
npx glideapi <command>
```

---

## Quick Start

### 1. Initialize a New Project

Create a new backend project in the current directory:

```bash
glideapi init
```

Or create in a specific folder:

```bash
glideapi init my-project
```

You'll be prompted to choose a database template:
- **express-mongodb**: Express.js with MongoDB
- More templates coming soon!

### 2. Navigate to Your Project

```bash
cd my-project
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your-secret-key-here
SALT_ROUNDS=10
API_PREFIX=/api/v1
DEBUG_MODE=true
```

### 4. Start Development Server

```bash
npm run dev
```

Your API will be running at `http://localhost:3000` 🚀

---

## CLI Commands

### `glideapi init [folder]`

Initialize a new backend project with the selected template.

**Usage:**
```bash
# Initialize in current directory
glideapi init

# Initialize in a specific folder
glideapi init my-api-project

# Initialize with npx (no installation)
npx glideapi init my-project
```

**What it does:**
1. Prompts you to select a database template
2. Creates a complete project structure
3. Installs all required dependencies
4. Copies template files (models, controllers, services, routes)
5. Sets up initial configuration files
6. Initializes a git repository
7. Creates an initial commit

**Generated Project Structure:**
```
my-project/
├── core/                      # Core framework files
│   ├── factory/              # Base classes (GlideService, GlideController, etc.)
│   └── helper/               # Helper utilities
├── src/
│   ├── config/               # Configuration files
│   │   ├── index.ts         # Main config (env variables)
│   │   └── connect-to-db.ts # Database connection
│   ├── modules/             # Feature modules
│   │   ├── auth/           # Authentication module
│   │   └── users/          # User management module
│   ├── plugins/            # Express plugins
│   │   └── setup-all-routes.ts  # Route registration
│   ├── types/              # TypeScript types
│   └── index.ts            # Application entry point
├── .env.example            # Environment variables template
├── glideapi.json          # GlideAPI configuration
├── package.json
└── tsconfig.json
```

---

### `glideapi generate-module <module-name>`

Generate a new CRUD module with all necessary files.

**Usage:**
```bash
glideapi generate-module products
glideapi generate-module blog-posts
glideapi generate-module user-profiles
```

**What it generates:**

1. **Model File** (`products.model.ts`):
   - Mongoose schema definition
   - TypeScript interface for type safety
   - Model export

2. **DTO File** (`products.dto.ts`):
   - Zod validation schemas for input/output
   - `GetDTO` - for retrieving data
   - `InsertDTO` - for creating new records
   - TypeScript types derived from DTOs

3. **Service File** (`products.service.ts`):
   - Extends `GlideService` base class
   - Provides CRUD operations: `getAll`, `getById`, `insert`, `update`, `delete`
   - Handles database interactions
   - Can be extended with custom business logic

4. **Controller File** (`products.controller.ts`):
   - Extends `GlideController` base class
   - Handles HTTP requests and responses
   - Validates data using DTOs
   - Calls service methods
   - Returns standardized responses

5. **Routes File** (`products.routes.ts`):
   - Defines REST API endpoints
   - Maps HTTP methods to controller actions
   - Uses `glideRouter` for route creation

**Example Generated Files:**

```typescript
// products.model.ts
export interface ProductType extends Document {
  name: string;
  // Add your model properties here
}

const ProductSchema = new Schema<ProductType>({
  name: { type: String, required: true, trim: true },
  // Add your schema fields here
}, { timestamps: true, versionKey: false });

export const Products = model<ProductType>("Products", ProductSchema);
```

```typescript
// products.service.ts
export class ProductService extends GlideService<ProductType> {
  constructor() {
    super({
      endPoint: "products",
      model: Products,
    });
  }
  // Inherits: getAll, getById, insert, update, delete
  // Add custom methods here
}
```

```typescript
// products.controller.ts
export class ProductController extends GlideController {
  constructor() {
    super({
      endPoint: "products",
      dtoConfig: {
        getDTO: ProductGetDTO,
        insertDTO: ProductInsertDTO,
        updateDTO: ProductInsertDTO,
      },
      service: productService,
    });
  }
  // Inherits: getAll, insert, getById, update, delete
  // Add custom endpoints here
}
```

```typescript
// products.routes.ts
const productsRouter = glideRouter();

productsRouter.get("/", productController.getAll);
productsRouter.post("/", productController.insert);
productsRouter.get("/:id", productController.getById);
productsRouter.put("/:id", productController.update);
productsRouter.delete("/:id", productController.delete);

export { productsRouter };
```

**After Generating a Module:**

1. **Update the Model** - Define your schema fields in `products.model.ts`
2. **Update the DTOs** - Add validation rules in `products.dto.ts`
3. **Register the Router** - Add the route to `src/plugins/setup-all-routes.ts`:

```typescript
import { productsRouter } from "@/modules/products/products.routes";

export const setupAllRoutes = async (app: Express) => {
  app.use(`${apiPrefix}/products`, productsRouter);
  // ... other routes
};
```

**Generated API Endpoints:**

Once registered, your module will have these endpoints:

- `GET /api/v1/products` - Get all products (with pagination)
- `POST /api/v1/products` - Create a new product
- `GET /api/v1/products/:id` - Get a single product by ID
- `PUT /api/v1/products/:id` - Update a product
- `DELETE /api/v1/products/:id` - Delete a product

---

## Architecture

GlideAPI uses a factory pattern architecture that provides powerful base classes to reduce boilerplate code while maintaining flexibility for customization.

### GlideService (Base Service Class)

The `GlideService` class provides standard CRUD operations for any Mongoose model.

**Built-in Methods:**

#### `getAll(params)` - Retrieve Multiple Records

```typescript
// In your service or controller
const result = await service.getAll({
  queryParams: {
    offset: 0,
    limit: 10,
    search: "keyword",
    isDeleted: "false",
    // Any custom filters
  },
  populateFields: [
    { path: "author", select: "name email" },
    { path: "category" }
  ],
  getDTO: ProductGetDTO,
});

// Returns: { data: Product[], totalCount: number }
```

**Features:**
- Pagination with `offset` and `limit`
- Search functionality
- Soft delete filtering with `isDeleted`
- Custom query filters
- Population of referenced documents
- DTO validation for output
- Sorted by `createdAt` (latest first)

#### `getById(params)` - Retrieve Single Record

```typescript
const product = await service.getById({
  id: "507f1f77bcf86cd799439011",
  populateFields: [{ path: "category" }],
  getDTO: ProductGetDTO,
});
```

#### `insert(data)` - Create New Record

```typescript
const newProduct = await service.insert({
  name: "Product Name",
  price: 99.99,
  // ... other fields
});
```

#### `update(params)` - Update Existing Record

```typescript
const updated = await service.update({
  id: "507f1f77bcf86cd799439011",
  data: {
    name: "Updated Name",
    price: 149.99,
  },
});
```

#### `delete(id)` - Delete Record

```typescript
const deleted = await service.delete("507f1f77bcf86cd799439011");
```

**Extending GlideService:**

Add custom business logic by creating new methods:

```typescript
export class ProductService extends GlideService<ProductType> {
  constructor() {
    super({
      endPoint: "products",
      model: Products,
    });
  }

  // Custom method: Get products by category
  async getByCategory(categoryId: string) {
    return await this.model.find({ category: categoryId });
  }

  // Custom method: Get featured products
  async getFeaturedProducts() {
    return await this.model.find({ featured: true }).limit(10);
  }

  // Custom method: Update stock quantity
  async updateStock(productId: string, quantity: number) {
    const product = await this.model.findById(productId);
    if (!product) throw new Error("Product not found");
    
    product.stock += quantity;
    return await product.save();
  }
}
```

### GlideController (Base Controller Class)

The `GlideController` class handles HTTP requests, validates data, and returns standardized responses.

**Built-in Methods:**

All methods automatically handle:
- Request validation using DTOs
- Error handling with standardized error responses
- Success responses with proper status codes
- Debug logging (when `DEBUG_MODE=true`)

#### `getAll(req, res)` - Handle GET all requests

```typescript
// Automatically available at: GET /api/v1/products
// Supports query params: ?offset=0&limit=10&search=keyword
```

#### `insert(req, res)` - Handle POST requests

```typescript
// Automatically available at: POST /api/v1/products
// Validates request body with insertDTO
```

#### `getById(req, res)` - Handle GET by ID requests

```typescript
// Automatically available at: GET /api/v1/products/:id
```

#### `update(req, res)` - Handle PUT requests

```typescript
// Automatically available at: PUT /api/v1/products/:id
// Validates request body with updateDTO
```

#### `delete(req, res)` - Handle DELETE requests

```typescript
// Automatically available at: DELETE /api/v1/products/:id
```

**Extending GlideController:**

Add custom endpoints for specialized operations:

```typescript
export class ProductController extends GlideController {
  constructor() {
    super({
      endPoint: "products",
      dtoConfig: {
        getDTO: ProductGetDTO,
        insertDTO: ProductInsertDTO,
        updateDTO: ProductInsertDTO,
      },
      service: productService,
    });
    
    // Bind custom methods
    this.getByCategory = this.getByCategory.bind(this);
    this.getFeatured = this.getFeatured.bind(this);
  }

  // Custom endpoint: Get products by category
  async getByCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const products = await this.service.getByCategory(categoryId);
      return res.status(200).send(
        glideResponseHandler.successResponse(products)
      );
    } catch (error) {
      return res.status(500).send(
        glideResponseHandler.standardErrorResponse(error)
      );
    }
  }

  // Custom endpoint: Get featured products
  async getFeatured(req: Request, res: Response) {
    try {
      const products = await this.service.getFeaturedProducts();
      return res.status(200).send(
        glideResponseHandler.successResponse(products)
      );
    } catch (error) {
      return res.status(500).send(
        glideResponseHandler.standardErrorResponse(error)
      );
    }
  }
}
```

**Register Custom Routes:**

```typescript
// products.routes.ts
const productsRouter = glideRouter();

// Standard CRUD routes (from GlideController)
productsRouter.get("/", productController.getAll);
productsRouter.post("/", productController.insert);
productsRouter.get("/:id", productController.getById);
productsRouter.put("/:id", productController.update);
productsRouter.delete("/:id", productController.delete);

// Custom routes
productsRouter.get("/featured", productController.getFeatured);
productsRouter.get("/category/:categoryId", productController.getByCategory);

export { productsRouter };
```

### Response Handlers

GlideAPI provides standardized response formats through `glideResponseHandler`:

```typescript
// Success response
glideResponseHandler.successResponse(data);
// { success: true, data: {...} }

// Success with count (for pagination)
glideResponseHandler.successResponseWithCount({ data, totalCount });
// { success: true, data: [...], totalCount: 100 }

// Error responses
glideResponseHandler.standardErrorResponse(error);
glideResponseHandler.insertionErrorResponse(error);
glideResponseHandler.notFoundResponse(message);
```

### Authentication Module

The generated project includes a pre-configured authentication system:

**Features:**
- User registration with password hashing (bcrypt)
- User login with JWT token generation
- Get user profile endpoint
- Password verification
- Token-based authentication

**Auth Endpoints:**

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and receive JWT token
- `GET /api/v1/auth/profile` - Get current user profile (requires auth)

**Extending Auth Service:**

The auth service can be customized in `src/modules/auth/auth.service.ts`:

```typescript
export class AuthService {
  // Built-in methods
  hashPassword(password: string): Promise<string>
  verifyPassword({ password, hashedPassword }): Promise<boolean>
  createToken(user: UserType): string | null
  verifyToken(token: string): UserType | null
  registerUser(user: UserRegistrationDTOType): Promise<RegistrationOrLoginResponse>
  loginUser(user: UserLoginDTOType): Promise<RegistrationOrLoginResponse>
  getUserProfile(userId: string): Promise<UserType | null>

  // Add custom methods here
  async resetPassword(email: string) { /* ... */ }
  async changePassword(userId: string, newPassword: string) { /* ... */ }
}
```

---

## Templates

GlideAPI supports multiple project templates. Currently available:

### Express + MongoDB Template

**Technology Stack:**
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Language:** TypeScript
- **Validation:** Zod
- **Authentication:** JWT + bcrypt
- **Dev Tools:** ts-node-dev, ESLint, Prettier

**Included Packages:**

Dependencies:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `zod` - Schema validation
- `chalk` - Terminal styling
- `fs-extra` - File system utilities

Dev Dependencies:
- `typescript` - TypeScript compiler
- `ts-node` - TypeScript execution
- `ts-node-dev` - Development with hot reload
- `eslint` - Code linting
- `@typescript-eslint/*` - TypeScript ESLint plugins
- `tsc-alias` - Path alias resolution
- `tsconfig-paths` - Path mapping support

**Available NPM Scripts:**

```bash
# Start development server with hot reload
npm run dev

# Check for TypeScript and ESLint errors
npm run error-check

# Build the project
npm run build

# Start production server
npm start
```

**Configuration Files:**

1. **glideapi.json** - GlideAPI configuration
```json
{
  "database": "express-mongodb",
  "version": "1.0.0"
}
```

2. **tsconfig.json** - TypeScript configuration with path aliases
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "core/*": ["./core/*"]
    }
  }
}
```

3. **.env** - Environment variables (create from .env.example)

### Using the Templates Directory

The templates are stored in the `src/templates/` directory of the GlideAPI package. Each template contains:

```
templates/
└── express-mongodb/
    ├── initiator.ts              # Template initialization logic
    ├── route-generator.ts        # Module generation logic
    └── project-files/            # Template files to be copied
        ├── core/                 # Core framework files
        ├── src/                  # Source code structure
        ├── .gitignore
        ├── .prettierrc
        ├── eslint.config.mjs
        ├── glideapi.json
        └── tsconfig.json
```

**How Templates Work:**

1. **Template Selection:** When you run `glideapi init`, you select a template
2. **File Copying:** The CLI copies all files from `project-files/` to your project
3. **Dependency Installation:** Runs `npm init` and installs required packages
4. **Configuration:** Adds necessary npm scripts via `npm-add-script`
5. **Git Initialization:** Sets up git repository with initial commit

**Adding Custom Templates:**

To add support for more frameworks (coming soon):
- Create a new directory in `src/templates/` (e.g., `fastify-postgres`)
- Implement `initiator.ts` with template configuration
- Implement `route-generator.ts` for module generation
- Add template files to `project-files/`
- Register in `src/templates/index.ts`

---

## Configuration

### Environment Variables

All configuration is managed through environment variables:

```env
# Server Configuration
PORT=3000                          # Server port
API_PREFIX=/api/v1                 # API route prefix

# Database Configuration
MONGO_URI=mongodb://localhost:27017/mydb  # MongoDB connection string

# Authentication
JWT_SECRET=your-secret-key-here    # JWT signing secret
SALT_ROUNDS=10                     # Bcrypt salt rounds

# Development
DEBUG_MODE=true                    # Enable debug logging
```

### GlideAPI Configuration

The `glideapi.json` file identifies your project to the CLI:

```json
{
  "database": "express-mongodb",
  "version": "1.0.0"
}
```

This file is automatically created during initialization and is used by `generate-module` to determine which template generator to use.

---

## API Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Product Name",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Success with Pagination:**
```json
{
  "success": true,
  "data": [...],
  "totalCount": 100
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## Advanced Usage

### Custom Middleware

Add middleware to your routes:

```typescript
import { authenticate } from "@/middlewares/auth.middleware";

productsRouter.post("/", authenticate, productController.insert);
```

### Population and Relations

Use Mongoose population for related documents:

```typescript
const products = await this.service.getAll({
  populateFields: [
    { path: "category", select: "name description" },
    { path: "author", select: "name email" },
  ],
});
```

### Custom Validation

Add custom validation logic in DTOs:

```typescript
export const ProductInsertDTO = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),
});
```

### Query Parameters

Built-in query parameter support:

```bash
# Pagination
GET /api/v1/products?offset=0&limit=20

# Search (if implemented in service)
GET /api/v1/products?search=laptop

# Soft delete filter
GET /api/v1/products?isDeleted=false

# Custom filters (passed to MongoDB query)
GET /api/v1/products?category=electronics&inStock=true
```

---

## Examples

### Complete Module Example: Blog Posts

1. **Generate the module:**
```bash
glideapi generate-module blog-posts
```

2. **Update the model** (`blog-posts.model.ts`):
```typescript
export interface BlogPostType extends Document {
  title: string;
  content: string;
  author: Types.ObjectId;
  tags: string[];
  published: boolean;
}

const BlogPostSchema = new Schema<BlogPostType>({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  tags: [{ type: String }],
  published: { type: Boolean, default: false },
}, { timestamps: true });
```

3. **Update the DTOs** (`blog-posts.dto.ts`):
```typescript
export const BlogPostInsertDTO = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  author: z.string(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().default(false),
});
```

4. **Extend the service** with custom methods (`blog-posts.service.ts`):
```typescript
export class BlogPostService extends GlideService<BlogPostType> {
  constructor() {
    super({ endPoint: "blog-posts", model: BlogPosts });
  }

  async getPublishedPosts() {
    return await this.model.find({ published: true })
      .populate("author", "fullName email")
      .sort({ createdAt: -1 });
  }

  async getPostsByAuthor(authorId: string) {
    return await this.model.find({ author: authorId });
  }
}
```

5. **Register the router** in `setup-all-routes.ts`:
```typescript
import { blogPostsRouter } from "@/modules/blog-posts/blog-posts.routes";

app.use(`${apiPrefix}/blog-posts`, blogPostsRouter);
```

---

## Troubleshooting

### Module Not Found Errors

If you see path alias errors, ensure:
1. `tsconfig.json` has correct path mappings
2. You're using `ts-node -r tsconfig-paths/register` (already configured in npm scripts)

### MongoDB Connection Issues

1. Check `MONGO_URI` in `.env`
2. Ensure MongoDB is running
3. Check connection string format: `mongodb://localhost:27017/database-name`

### Generated Module Not Working

1. Make sure you registered the router in `src/plugins/setup-all-routes.ts`
2. Check that the module files were generated in `src/modules/`
3. Restart the development server after generation

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:

- Setting up the development environment
- Code style and conventions
- Commit message format
- Creating pull requests
- Adding new templates

---

## License

MIT © 2024-present [Sagar Sen](https://github.com/sagarsen2023)

---

## Links

- **GitHub Repository:** https://github.com/sagarsen2023/glideapi
- **npm Package:** https://www.npmjs.com/package/glideapi
- **Issues:** https://github.com/sagarsen2023/glideapi/issues
- **Author:** [Sagar Sen](mailto:sagarsen.dev@gmail.com)

---

## Roadmap

🚀 Upcoming features:
- [ ] Additional templates (Fastify, NestJS, etc.)
- [ ] Support for PostgreSQL, MySQL
- [ ] GraphQL support
- [ ] Built-in API documentation generation
- [ ] Testing utilities and scaffolding
- [ ] Docker configuration generation
- [ ] CI/CD pipeline templates
- [ ] File upload handling
- [ ] Real-time features with WebSocket
- [ ] Rate limiting middleware
- [ ] API versioning support

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/sagarsen2023">Sagar Sen</a>
</p>
