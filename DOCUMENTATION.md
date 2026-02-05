# User CRUD Application

A modern, extensible React-based CRUD application for managing user data with TypeScript, Material-UI, and a mock JSON API.

## Features

✅ **Complete CRUD Operations**
- Create new users
- Read and display all users in a responsive table
- Update existing user information
- Delete users with confirmation dialog

✅ **Form Validation**
- Email format validation
- Phone number validation (minimum 10 digits)
- Name validation (minimum 2 characters)
- Required field enforcement
- Real-time error clearing on input change

✅ **Extensible Architecture**
- Configuration-driven form building
- Schema-based field management
- Easy addition of new fields with minimal code changes
- Type-safe implementation with full TypeScript support

✅ **User Experience**
- Material-UI components for professional appearance
- Responsive design (mobile, tablet, desktop)
- Loading indicators and error messages
- Success notifications
- Confirmation dialogs for destructive actions
- Edit mode with visual feedback

## Project Structure

```
src/
├── components/
│   ├── UserForm.tsx          # Reusable form component with validation
│   └── UserList.tsx          # Users table with edit/delete actions
├── config/
│   └── formConfig.ts         # Extensible form field configuration
├── services/
│   └── userService.ts        # API communication layer
├── types/
│   └── index.ts              # TypeScript type definitions
├── App.tsx                   # Main application component
├── App.css                   # Application styles
├── index.css                 # Global styles
└── main.tsx                  # Application entry point

db.json                        # Mock database for json-server
```

## Installation

```bash
npm install
```

This installs all dependencies including:
- React 19 & React DOM
- Material-UI (MUI) components
- Axios for API calls
- TypeScript
- Vite as build tool
- json-server for mock API
- concurrently for running multiple processes

## Development

### Option 1: Run with Mock API (Recommended for Testing)

```bash
npm run dev:full
```

This starts both:
- Vite development server (http://localhost:5173)
- JSON Server on port 3001 (http://localhost:3001)

### Option 2: Run Just the Frontend

```bash
npm run dev
```

Starts Vite development server only. Note: API calls will fail without a running backend.

### Option 3: Run Just the Mock API Server

```bash
npm run server
```

Runs JSON Server on http://localhost:3001 independently.

## Building for Production

```bash
npm run build
```

Compiles TypeScript and creates optimized production build in `dist/` folder.

## How to Extend the Form

The form is fully extensible. To add a new field:

### Step 1: Update the User Type

Edit [src/types/index.ts](src/types/index.ts):

```typescript
export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string;  // New field
}
```

### Step 2: Add Field Configuration

Edit [src/config/formConfig.ts](src/config/formConfig.ts):

```typescript
export const formFieldsConfig: FormFieldConfig[] = [
  // ... existing fields ...
  {
    name: 'dateOfBirth',
    label: 'Date of Birth',
    type: 'date',
    required: false,
    validation: validateDate,
  },
];
```

### Step 3: Add Validation (Optional)

Add a validation function in [src/config/formConfig.ts](src/config/formConfig.ts):

```typescript
const validateDate = (date: string): string | null => {
  const d = new Date(date);
  const now = new Date();
  return d < now ? null : 'Date must be in the past';
};
```

### Step 4: Update Mock Database

Edit [db.json](db.json) to include the new field:

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

That's it! The form, table, and all CRUD operations automatically support the new field.

## Architecture Highlights

### Configuration-Driven Design

The form configuration in [src/config/formConfig.ts](src/config/formConfig.ts) drives:
- Field rendering in the form
- Column display in the table
- Validation rules
- Error messages

Adding a new field in this configuration automatically updates the entire application.

### API Service Layer

[src/services/userService.ts](src/services/userService.ts) provides:
- Centralized API communication
- Error handling with meaningful messages
- Timeout protection
- Consistent async/await patterns

### Type Safety

Full TypeScript implementation ensures:
- Type-safe props and state
- Compile-time error detection
- Better IDE autocompletion
- Maintainable code

### Responsive Design

Built with Material-UI's responsive system:
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly controls

## Form Fields

### Current Fields

1. **First Name** (Required)
   - Text input, minimum 2 characters
   
2. **Last Name** (Required)
   - Text input, minimum 2 characters
   
3. **Email Address** (Required)
   - Email input with RFC validation
   
4. **Phone Number** (Required)
   - Tel input, minimum 10 digits

## API Endpoints

When using the mock server, the following endpoints are available:

- `GET /users` - Get all users
- `GET /users/:id` - Get a specific user
- `POST /users` - Create a new user
- `PUT /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user

## Error Handling

The application includes comprehensive error handling:
- Network error messages
- Validation error display
- API error responses
- Loading states to prevent duplicate submissions
- User-friendly error notifications

## Validation Rules

| Field | Rules | Example |
|-------|-------|---------|
| First Name | Required, min 2 chars | John |
| Last Name | Required, min 2 chars | Doe |
| Email | Required, valid format | john@example.com |
| Phone | Required, min 10 digits | +1 (555) 123-4567 |

## Browser Support

Works on all modern browsers that support:
- ES2020+
- CSS Grid and Flexbox
- LocalStorage (for form data recovery)

## Troubleshooting

### API Connection Errors

If you see "Failed to fetch users":
1. Ensure json-server is running on port 3001
2. Check that db.json exists in the root directory
3. Verify the backend URL in [src/services/userService.ts](src/services/userService.ts)

### Port Already in Use

If port 3001 or 5173 is already in use:
1. Kill the existing process
2. Or modify the port in package.json and [src/services/userService.ts](src/services/userService.ts)

### Build Errors

Run these commands to reset:
```bash
npm install
npm run build
```

## Best Practices Implemented

✅ **Code Organization** - Modular, well-structured components  
✅ **Type Safety** - Full TypeScript coverage  
✅ **Validation** - Comprehensive input validation  
✅ **Error Handling** - User-friendly error messages  
✅ **Loading States** - Prevents duplicate submissions  
✅ **Accessibility** - ARIA labels and semantic HTML  
✅ **Responsive** - Works on all device sizes  
✅ **Extensibility** - Configuration-driven architecture  
✅ **Performance** - Optimized renders and updates  

## License

MIT

## Support

For issues or questions, please check the code comments and type definitions for detailed explanations.
