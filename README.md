# User Management System CRUD

A modern, extensible React + TypeScript CRUD application for managing users with a clean UI built with Material-UI and DataGrid.

## Features

- ✨ **Create, Read, Update, Delete** user records
- 🎨 **Modern UI** with Material-UI components and gradient design
- 📊 **DataGrid Table** with pagination, sorting, and filtering
- 📝 **Form Validation** with real-time error messages
- 🔄 **Real-time Updates** with toast notifications
- 🎯 **Extensible Design** - easily add new form fields
- 📱 **Responsive Layout** that works on all screen sizes

---

## Setup Instructions



### Installation

1. **Clone/Navigate to project directory:**
   ```bash
   cd user-crud
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start JSON Server (Mock API):**
   ```bash
   npm run server
   ```
   The API will run on `http://localhost:3001`

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## Project Structure

```
src/
├── components/
│   ├── UserForm.tsx              # Form modal for create/edit
│   ├── UserList.tsx              # DataGrid table display
│   └── DeleteConfirmDialog.tsx    # Delete confirmation modal
├── services/
│   └── userService.ts            # API calls (axios)
├── config/
│   └── formConfig.ts             # Form field configuration
├── types/
│   └── index.ts                  # TypeScript interfaces
├── App.tsx                       # Main app component
└── main.tsx                      # Entry point
```

---

## How to Add New Fields to the Form

Adding a new field to the form is simple and requires changes in only **one file**: `src/config/formConfig.ts`

### Example: Add a "Department" Field

1. **Open** `src/config/formConfig.ts`

2. **Add validation function** (optional):
   ```typescript
   const validateDepartment = (dept: string | number | null): string | null => {
     if (!dept || typeof dept !== 'string') return 'Department is required';
     return dept.trim().length >= 2 ? null : 'Department must be at least 2 characters';
   };
   ```

3. **Add field to `formFieldsConfig` array:**
   ```typescript
   export const formFieldsConfig: FormFieldConfig[] = [
     // ... existing fields ...
     {
       name: 'department',
       label: 'Department',
       type: 'text',
       required: true,
       placeholder: 'Enter department',
       validation: validateDepartment,
     },
   ];
   ```

4. **Update User type** in `src/types/index.ts`:
   ```typescript
   export interface User {
     id?: number;
     firstName: string;
     lastName: string;
     email: string;
     phoneNumber: string;
     department: string;  // Add this line
   }
   ```

That's it! The field will automatically appear in:
- ✅ Create/Edit form
- ✅ DataGrid table columns
- ✅ Delete confirmation
- ✅ All CRUD operations

---

## Design Decisions & Assumptions

### 1. **Mock API (JSON Server)**
   - Uses `db.json` as a local database for development
   - Allows testing without a backend server
   - Can be replaced with a real API by changing the `baseURL` in `userService.ts`

### 2. **Centralized Form Configuration**
   - All form fields are defined in one place (`formConfig.ts`)
   - Reduces code duplication between form and table
   - Makes it easy to add/remove fields globally

### 3. **Material-UI Components**
   - Professional, accessible UI components
   - Built-in form validation and error handling
   - Responsive design out of the box

### 4. **DataGrid for Table Display**
   - Better performance for large datasets (pagination, virtualization)
   - Built-in sorting and filtering
   - More professional than basic HTML tables

### 5. **React Hook Form**
   - Minimal re-renders for better performance
   - Uncontrolled component pattern
   - Built-in validation support

### 6. **Toast Notifications**
   - Real-time feedback for user actions (create, update, delete)
   - Non-intrusive and user-friendly
   - Auto-dismiss after 3 seconds

### 7. **Async Operations**
   - All API calls are async with loading states
   - Prevents multiple submissions
   - Buttons disabled during processing

### 8. **Error Handling**
   - Client-side validation before submission
   - Server-side error messages displayed to user
   - Global error state in App component

---

## API Endpoints

The app expects the following JSON Server endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get a specific user |
| POST | `/users` | Create a new user |
| PUT | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |

---

## Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run server` - Start JSON Server (mock API)

---

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Material-UI (MUI)** - Component library
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **MUI DataGrid** - Advanced table component

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Deployment to Vercel

### Important: Configure Backend API


1. **Create a `.env.production` file:**
   ```
   VITE_API_URL=https://user-management-lyart-seven.vercel.app/users
   ```

2. **Or set Environment Variable in Vercel:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://user-management-lyart-seven.vercel.app/users`

3. **Options for Backend:**
   - Use a real backend API (Node.js, Python, etc.)
   - Use Vercel Serverless Functions
   - Use Firebase Realtime Database
   - Use MongoDB Atlas with a backend

### Quick Deployment Steps

1. Push code to GitHub
2. Go to https://vercel.com/new and import repository
3. Add environment variable `VITE_API_URL`
4. Deploy and test on mobile

---

## License

MIT License - Feel free to use this project for learning and development.


