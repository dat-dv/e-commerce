# Issue: NestJS Swagger Plugin Monorepo Path Resolution Bug

## Symptoms

When running the backend in development or production mode from the `dist` folder, the application crashes with a `MODULE_NOT_FOUND` error.

**Error Example:**

```
Error: Cannot find module '../../../../../../packages/shared/dist/index'
Require stack:
- /Users/datdoan/Documents/projects/e-commerce/apps/backend/dist/src/api/products/dto/get-products.dto.js
```

## Root Cause Analysis

The `@nestjs/swagger` plugin automatically generates a `_OPENAPI_METADATA_FACTORY` static method in DTO classes to enable CLI-based metadata generation.

1. **Path Calculation**: When a DTO property uses a type from another workspace (e.g., `@ecommerce/shared`), the plugin calculates a relative path from the **source** file to that package.
2. **Context Mismatch**:
   - In the **source** tree (`src/api/...`), the path `../../../../../../` correctly reaches the root.
   - In the **compiled** tree (`dist/src/api/...`), the files are one level deeper. The plugin hardcodes the 6-level path into the JS file, but it actually needs 7 levels to reach the root from `dist/src`.
3. **Failure**: Node.js attempts to load the module from the wrong directory, leading to the crash.

## Workaround / Fix

To resolve this without restructuring the entire build pipeline:

1. **Manual Metadata**: Use the `@ApiProperty()` decorator to explicitly define the enum or type for Swagger.
2. **Type Masking**: Change the TypeScript property type to a primitive (e.g., `number` for numeric enums).
   - This prevents the Swagger plugin from attempting to "introspect" the complex type and generating the broken `require()` call.
   - Since numeric enums are just numbers at runtime, this remains type-safe and compatible with the rest of the application logic.

**Example Fix:**

```typescript
// Before (Broken)
@IsEnum(EProductSort)
sort?: EProductSort;

// After (Fixed)
@ApiProperty({ enum: EProductSort, required: false })
@IsEnum(EProductSort)
sort?: number; // Use number to skip broken plugin introspection
```

## Status

- **Status**: Resolved via workaround.
- **Affected Files**: `apps/backend/src/api/products/dto/get-products.dto.ts`
