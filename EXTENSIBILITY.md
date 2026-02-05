# Extensibility Guide

This guide demonstrates how to add new fields to the User CRUD application with minimal code changes.

## Quick Start: Adding a New Field

### Example: Add "Date of Birth" Field

#### Step 1: Update Type Definition

File: `src/types/index.ts`

```typescript
export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string;  // Add new field (optional or required)
}
```

#### Step 2: Add Field Configuration

File: `src/config/formConfig.ts`

Add this to the `formFieldsConfig` array:

```typescript
{
  name: 'dateOfBirth',
  label: 'Date of Birth',
  type: 'date',
  required: false,
  validation: validateDate,
},
```

#### Step 3: Create Validation Function (Optional)

File: `src/config/formConfig.ts`

```typescript
const validateDate = (dateStr: string): string | null => {
  const date = new Date(dateStr);
  const today = new Date();
  
  if (date > today) {
    return 'Date of birth cannot be in the future';
  }
  
  const age = today.getFullYear() - date.getFullYear();
  if (age < 18) {
    return 'User must be at least 18 years old';
  }
  
  return null;
};
```

#### Step 4: Update Mock Database

File: `db.json`

```json
{
  "users": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phoneNumber": "+1 (555) 123-4567",
      "dateOfBirth": "1990-01-15"
    }
  ]
}
```

That's it! The form, table, and all operations automatically support the new field.

## Complete Examples

### Example 1: Add "Address" Field (Textarea)

```typescript
// 1. Update User type
export interface User {
  // ... existing fields ...
  address?: string;
}

// 2. Add to formFieldsConfig
{
  name: 'address',
  label: 'Home Address',
  type: 'textarea',
  required: false,
  placeholder: 'Enter your street address',
},

// 3. Add to db.json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1 (555) 123-4567",
  "address": "123 Main St, Anytown, USA"
}
```

### Example 2: Add "Age" Field (Number)

```typescript
// 1. Update User type
export interface User {
  // ... existing fields ...
  age?: number;
}

// 2. Add validation function
const validateAge = (age: string): string | null => {
  const num = parseInt(age, 10);
  if (num < 0 || num > 150) {
    return 'Age must be between 0 and 150';
  }
  return null;
};

// 3. Add to formFieldsConfig
{
  name: 'age',
  label: 'Age',
  type: 'number',
  required: false,
  validation: validateAge,
},

// 4. Add to db.json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1 (555) 123-4567",
  "age": 34
}
```

### Example 3: Add "Company" Field (Required Text)

```typescript
// 1. Update User type
export interface User {
  // ... existing fields ...
  company: string;  // Required field
}

// 2. Add validation function
const validateCompany = (company: string): string | null => {
  return company.trim().length >= 2 ? null : 'Company name must be at least 2 characters';
};

// 3. Add to formFieldsConfig
{
  name: 'company',
  label: 'Company Name',
  type: 'text',
  required: true,
  placeholder: 'e.g., Acme Corporation',
  validation: validateCompany,
},

// 4. Add to db.json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1 (555) 123-4567",
  "company": "Acme Corporation"
}
```

### Example 4: Add "Department" Field (Dropdown-like)

For a dropdown, use a text field with predefined values via validation:

```typescript
// 1. Update User type
export interface User {
  // ... existing fields ...
  department?: 'Sales' | 'Engineering' | 'HR' | 'Marketing';
}

// 2. Add validation function
const validateDepartment = (dept: string): string | null => {
  const validDepts = ['Sales', 'Engineering', 'HR', 'Marketing'];
  return validDepts.includes(dept) ? null : 'Invalid department';
};

// 3. Add to formFieldsConfig
{
  name: 'department',
  label: 'Department',
  type: 'text',
  required: false,
  placeholder: 'Sales, Engineering, HR, or Marketing',
  validation: validateDepartment,
},

// 4. Add to db.json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1 (555) 123-4567",
  "department": "Engineering"
}
```

## Field Types Available

```typescript
type FieldType = 'text' | 'email' | 'tel' | 'date' | 'number' | 'textarea';
```

| Type | Best For | Input Example |
|------|----------|----------------|
| `text` | Names, titles, short text | John, Developer, 100 chars |
| `email` | Email addresses | john@example.com |
| `tel` | Phone numbers | +1 (555) 123-4567 |
| `date` | Dates | 1990-01-15 |
| `number` | Numeric values | 42, 99.99 |
| `textarea` | Long text | Multi-line addresses, notes |

## How It Works

The extensibility comes from these key components:

### 1. Configuration-Driven Rendering

`UserForm.tsx` iterates over `formFieldsConfig`:

```typescript
{formFieldsConfig.map((field) => (
  <TextField
    key={field.name}
    name={field.name}
    label={field.label}
    type={field.type}
    // ... more props
  />
))}
```

### 2. Dynamic Validation

`validateForm()` uses the config:

```typescript
export const validateForm = (user: Partial<User>): Record<string, string> => {
  const errors: Record<string, string> = {};

  formFieldsConfig.forEach((field) => {
    const value = user[field.name];

    if (field.required && (!value || value === '')) {
      errors[field.name] = `${field.label} is required`;
    }

    if (value && field.validation) {
      const error = field.validation(value as string);
      if (error) {
        errors[field.name] = error;
      }
    }
  });

  return errors;
};
```

### 3. Automatic Table Columns

`UserList.tsx` generates table columns from the same config:

```typescript
{formFieldsConfig.map((field) => (
  <TableCell key={field.name} sx={{ fontWeight: 600 }}>
    {field.label}
  </TableCell>
))}
```

### 4. Type-Safe Updates

TypeScript ensures `field.name` is a valid `User` property:

```typescript
const value = user[field.name];  // Type-safe!
```

## Advanced: Custom Validation Rules

You can create complex validation functions:

```typescript
const validateUSPhoneNumber = (phone: string): string | null => {
  const regex = /^\+?1?\s?(\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
  return regex.test(phone) ? null : 'Invalid US phone number';
};

const validateStrongPassword = (password: string): string | null => {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);
  const isLongEnough = password.length >= 8;

  if (!hasUppercase || !hasLowercase || !hasNumbers || !hasSpecial || !isLongEnough) {
    return 'Password must contain uppercase, lowercase, number, special char, and be 8+ chars';
  }
  
  return null;
};

const validateUniqueEmail = async (email: string): Promise<string | null> => {
  // Could call an API to check if email exists
  try {
    const users = await userService.getAllUsers();
    return users.some(u => u.email === email) ? 'Email already in use' : null;
  } catch {
    return null; // Skip validation on error
  }
};
```

## Field Configuration Reference

```typescript
interface FormFieldConfig {
  name: keyof User;                    // Must match User interface key
  label: string;                       // Display label
  type: FieldType;                     // HTML input type
  required: boolean;                   // Is it mandatory?
  placeholder?: string;                // Placeholder text
  validation?: (value: string | number | null) => string | null;  // Validation function
}
```

## Testing Your Changes

After adding a new field:

1. **Start the application:**
   ```bash
   npm run dev:full
   ```

2. **Test in the form:**
   - Open form and verify new field appears
   - Test validation works
   - Submit the form
   - Check browser console for errors

3. **Test in the table:**
   - Verify new column appears
   - Check data displays correctly

4. **Test CRUD operations:**
   - Create user with new field
   - Edit user and change new field
   - Delete user
   - Refresh page and verify persistence

## Troubleshooting

### New field doesn't appear in form

✓ Check field name matches `User` interface key (case-sensitive)  
✓ Verify field is added to `formFieldsConfig` array  
✓ Check TypeScript compilation (run `npm run build`)

### Validation not working

✓ Ensure `validation` function is defined in `formConfig.ts`  
✓ Check function returns `null` for valid, `string` for invalid  
✓ Verify required fields have `required: true`

### Data not persisting

✓ Update `db.json` with new field for mock data  
✓ Restart json-server (`npm run server`)  
✓ Check browser network tab for API errors

## Performance Considerations

The configuration-driven approach is highly efficient:
- ✓ No re-renders when viewing config
- ✓ Minimal bundle size increase per field
- ✓ Fast form validation
- ✓ Scalable to 50+ fields

## Next Steps

- Add file upload support
- Implement custom field types (dropdown, multiselect)
- Add conditional field visibility
- Implement field dependencies
- Add custom CSS per field
