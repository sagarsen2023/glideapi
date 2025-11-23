import { errorLog } from "@/utils/logger";

export type FieldOptions = {
  type:
    | "String"
    | "Number"
    | "Boolean"
    | "Date"
    | "Buffer"
    | "ObjectId"
    | "Array"
    | "Decimal128"
    | "Map"
    | "Mixed"
    | Record<string, any> // for nested objects
    | FieldOptions[]; // for nested array of fields
  required?: boolean;
  default?: any;
  unique?: boolean;
  ref?: string;
  enum?: string[];
  lowercase?: boolean;
  uppercase?: boolean;
  trim?: boolean;
  minlength?: number;
  maxlength?: number;
  validate?: any;
  sparse?: boolean;
  index?: boolean;
  // Add more mongoose options if needed
};

export type ModelContent = Record<string, FieldOptions>;

function typeScriptTypeFromField(type: any): string {
  if (Array.isArray(type)) {
    return `${typeScriptTypeFromField(type[0])}[]`;
  }
  if (typeof type === "object" && !Array.isArray(type)) {
    const fields = Object.entries(type)
      .map(([key, val]) => `${key}: ${typeScriptTypeFromField(val)};`)
      .join(" ");
    return `{ ${fields} }`;
  }
  switch (type) {
    case "String":
      return "string";
    case "Number":
      return "number";
    case "Boolean":
      return "boolean";
    case "Date":
      return "string";
    case "Buffer":
      return "Buffer";
    case "ObjectId":
      return "Types.ObjectId";
    case "Decimal128":
      return "any"; // or string if you prefer
    case "Map":
      return "Map<string, any>";
    case "Mixed":
      return "any";
    case "Array":
      return "any[]";
    default:
      return "any";
  }
}

function generateSchemaField(fieldName: string, options: FieldOptions): string {
  let schemaType;
  if (Array.isArray(options.type)) {
    // Array of sub-schema or simple types
    if (
      typeof options.type[0] === "object" &&
      !Array.isArray(options.type[0])
    ) {
      schemaType = `[${generateSchemaObject(options.type[0])}]`;
    } else {
      schemaType = `[${mapMongooseType(options.type[0])}]`;
    }
  } else if (typeof options.type === "object") {
    // Nested object
    schemaType = generateSchemaObject(options.type);
  } else {
    schemaType = mapMongooseType(options.type);
  }

  let fieldStr = `\n    ${fieldName}: { type: ${schemaType}`;
  if (options.ref) fieldStr += `,\n      ref: "${options.ref}"`;
  if (options.required) fieldStr += `,\n      required: true`;
  if (options.unique) fieldStr += `,\n      unique: true`;
  if (options.default !== undefined) {
    if (typeof options.default === "function") {
      fieldStr += `,\n      default: ${options.default.toString()}`;
    } else {
      fieldStr += `,\n      default: ${JSON.stringify(options.default)}`;
    }
  }
  if (options.enum)
    fieldStr += `,\n      enum: ${JSON.stringify(options.enum)}`;
  if (options.lowercase) fieldStr += `,\n      lowercase: true`;
  if (options.uppercase) fieldStr += `,\n      uppercase: true`;
  if (options.trim) fieldStr += `,\n      trim: true`;
  if (options.minlength !== undefined)
    fieldStr += `,\n      minlength: ${options.minlength}`;
  if (options.maxlength !== undefined)
    fieldStr += `,\n      maxlength: ${options.maxlength}`;
  if (options.sparse) fieldStr += `,\n      sparse: true`;
  if (options.index) fieldStr += `,\n      index: true`;
  // Add more option handlers if needed
  fieldStr += `\n    },`;
  return fieldStr;
}

function generateSchemaObject(fieldsObj: Record<string, FieldOptions>): string {
  return `{
${Object.entries(fieldsObj)
  .map(([key, val]) => generateSchemaField(key, val))
  .join("\n")}
  }`;
}

function mapMongooseType(type: string): string {
  switch (type) {
    case "String":
      return "String";
    case "Number":
      return "Number";
    case "Boolean":
      return "Boolean";
    case "Date":
      return "Date";
    case "Buffer":
      return "Buffer";
    case "ObjectId":
      return "Schema.Types.ObjectId";
    case "Array":
      return "Array";
    case "Decimal128":
      return "Schema.Types.Decimal128";
    case "Map":
      return "Map";
    case "Mixed":
      return "Schema.Types.Mixed";
    default:
      return "Schema.Types.Mixed";
  }
}

export const glideModelGenerator = async ({
  modelName,
  modelContent,
}: {
  modelName: string;
  modelContent: ModelContent;
}): Promise<string | undefined> => {
  try {
    const TypeName = modelName.charAt(0).toUpperCase() + modelName.slice(1);

    // Generate interface fields
    const interfaceFields = Object.entries(modelContent)
      .map(
        ([field, props]) =>
          `  ${field}: ${typeScriptTypeFromField(props.type)};`,
      )
      .join("\n");

    // Generate the schema body
    const schemaFields = Object.entries(modelContent)
      .map(([field, props]) => generateSchemaField(field, props))
      .join("\n");

    const finalModelCodeToWrite = `import {
  Schema,
  model,
  models,
  type Document,
  type Model,
  type Types,
} from "mongoose";

export interface ${TypeName} extends Document {
${interfaceFields}
}

const ${TypeName}Schema = new Schema<${TypeName}>({
${schemaFields}
}, {
  timestamps: true,
  versionKey: false,
});

export const ${modelName}s: Model<${TypeName}> =
  models.${modelName}s || model<${TypeName}>("${modelName}s", ${TypeName}Schema);
`;
    return finalModelCodeToWrite;
  } catch (e) {
    errorLog(`Error generating model ${modelName}: ${(e as Error).message}`);
  }
};
