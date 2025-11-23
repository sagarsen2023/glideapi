import { errorLog } from "@/utils/logger";

export type ZodFieldOptions = {
  type: "string" | "number" | "boolean" | "email" | "date" | "array" | "object";
  min?: number;
  max?: number;
  message?: string;
  optional?: boolean;
  nullable?: boolean;
  // Add more Zod validation options if needed
};

export type DTOContent = Record<string, ZodFieldOptions>;

// Utility to convert field definition to Zod validation string
function generateZodField(fieldName: string, options: ZodFieldOptions): string {
  let zodType = "z.any()";

  switch (options.type) {
    case "string":
      zodType = "z.string()";
      if (options.min !== undefined) {
        zodType += `.min(${options.min}, "${
          options.message || `${fieldName} minimum length is ${options.min}`
        }")`;
      }
      if (options.max !== undefined) {
        zodType += `.max(${options.max}, "${
          options.message || `${fieldName} maximum length is ${options.max}`
        }")`;
      }
      break;
    case "number":
      zodType = "z.number()";
      break;
    case "boolean":
      zodType = "z.boolean()";
      break;
    case "email":
      zodType = `z.string().email("${
        options.message || "Please provide a valid email"
      }")`;
      break;
    case "date":
      zodType = "z.date()";
      break;
    case "array":
      zodType = "z.array(z.any())";
      break;
    case "object":
      zodType = "z.object({})";
      break;
    default:
      zodType = "z.any()";
  }

  // Apply nullable or optional modifiers after base type is set
  if (options.nullable) {
    zodType = `${zodType}.nullable()`;
  }
  if (options.optional) {
    zodType = `${zodType}.optional()`;
  }

  return `  ${fieldName}: ${zodType}`;
}

function generateZodSchema(
  schemaName: string,
  fields: DTOContent,
  isPartial = false,
): string {
  const entries = Object.entries(fields).map(([key, opts]) => {
    let fieldStr = generateZodField(key, opts);
    if (isPartial && !fieldStr.includes(".optional()")) {
      fieldStr += ".optional()";
    }
    return fieldStr;
  });
  return `export const ${schemaName} = z.object({\n${entries.join(
    ",\n",
  )}\n});\n`;
}

export const glideDTOGenerator = async ({
  moduleName,
  createOptions,
  updateOptions,
  getOptions,
}: {
  moduleName: string;
  createOptions: DTOContent;
  updateOptions: DTOContent;
  getOptions: DTOContent;
}): Promise<string | undefined> => {
  try {
    const TypeName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

    const getSchemaName = `${TypeName}GetDTO`;
    const createSchemaName = `${TypeName}CreateDTO`;
    const updateSchemaName = `${TypeName}UpdateDTO`;

    // Generate schemas
    const createSchema = generateZodSchema(createSchemaName, createOptions);
    const updateSchema = generateZodSchema(
      updateSchemaName,
      updateOptions,
      true,
    );
    const getSchema = generateZodSchema(getSchemaName, getOptions);

    // Generate type exports
    const typesExports = `
export type ${getSchemaName}Type = z.infer<typeof ${getSchemaName}>;
export type ${createSchemaName}Type = z.infer<typeof ${createSchemaName}>;
export type ${updateSchemaName}Type = z.infer<typeof ${updateSchemaName}>;
`;

    const finalDTOFileContent = `import { z } from "zod";

${getSchema}
${createSchema}
${updateSchema}
${typesExports}
`;
    return finalDTOFileContent;
  } catch (e) {
    errorLog(`Error generating DTO ${moduleName}: ${(e as Error).message}`);
  }
};
