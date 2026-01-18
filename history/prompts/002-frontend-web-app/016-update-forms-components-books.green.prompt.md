---
id: 016
title: update-forms-components-books
stage: green
date: 2025-12-25
surface: phase-2
model: claude-sonnet-4-5
feature: 002-frontend-web-app
branch: 002-frontend-web-app
user: user
command: /sp.implement
labels: [implementation, forms, components, books, refactoring, terminology, ui]
links:
  spec: specs/002-frontend-web-app/spec.md
  ticket: N/A
  adr: N/A
  pr: N/A
files:
  - path: frontend/src/components/tasks/TaskList.tsx
    status: modified
    lines_changed: +30
  - path: frontend/src/components/tasks/CreateTaskModal.tsx
    status: modified
    lines_changed: +50
  - path: frontend/src/components/tasks/EditTaskModal.tsx
    status: modified
    lines_changed: +50
  - path: frontend/src/components/tasks/TaskItem.tsx
    status: modified
    lines_changed: +20
  - path: frontend/src/components/tasks/SuccessPopup.tsx
    status: modified
    lines_changed: +5
  - path: frontend/src/components/tasks/TaskTable.tsx
    status: modified
    lines_changed: +80
  - path: frontend/src/app/calendar/page.tsx
    status: modified
    lines_changed: +30
  - path: frontend/src/app/tasks/page.tsx
    status: modified
    lines_changed: +15
  - path: frontend/src/components/dashboard/QuickActions.tsx
    status: modified
    lines_changed: +5
  - path: frontend/src/components/dashboard/LineChart.tsx
    status: modified
    lines_changed: +5
tests:
  - name: Forms Book Terminology
    status: passed
    framework: manual-verification
  - name: Components Book Labels
    status: passed
    framework: manual-verification
---

## Prompt

```text
/sp.implement "Update all forms, components, and pages to be book-focused. This includes CreateTaskModal, EditTaskModal, TaskList, TaskItem, TaskTable, Calendar page, Tasks page, and all dashboard components. Replace all 'task' terminology with 'book' and ensure labels, placeholders, messages, and UI text reflect book management throughout the application."
```

**Implementation Requirements**:
- Update all form labels and placeholders
- Change modal titles and descriptions
- Update component text and messages
- Modify toast notifications
- Update page titles and descriptions
- Change "Active" to "Reading" where applicable
- Update all user-facing text across components

## Response Snapshot

Comprehensively updated all forms and components to book-focused terminology:

### 1. **CreateTaskModal Updates**
   - Title: "Create New Task" → "Add New Book"
   - Description: "Add a new task to stay organized" → "Add a book to your reading list"
   - Form label: "Task Title" → "Book Title"
   - Placeholder: "What needs to be done?" → "Enter book title (e.g., Peer-e-Kamil)"
   - Quick templates: Updated to book-related templates
     - "Quick Task" → "Currently Reading" (📖)
     - "Goal" → "Want to Read" (🎯)
     - "Idea" → "Fiction" (📚)
     - "Reminder" → "Non-Fiction" (✨)
   - Button: "Create Task" → "Add Book"
   - Date labels: "Start Date" → "Start Reading Date", "End Date" → "Target Completion Date"
   - Category: "Category" → "Genre/Category" with book examples

### 2. **EditTaskModal Updates**
   - Title: "Edit Task" → "Edit Book"
   - Description: "Update your task details" → "Update your book details"
   - Form labels: Updated to match CreateTaskModal
   - Error messages: "Task is still being created" → "Book is still being added"
   - Button text: "Task Creating..." → "Book Adding..."

### 3. **TaskList Component Updates**
   - Loading message: "Loading your tasks..." → "Loading your books..."
   - Search placeholder: "Search tasks..." → "Search books..."
   - Empty state: "No tasks found" → "No books found"
   - Filter labels: "active" → "Reading"
   - Pagination: "task(s)" → "book(s)"

### 4. **TaskItem Component Updates**
   - Status badge: "Active" → "Reading"
   - Due date label: "Due:" → "Target:"
   - Aria labels: "Edit task" → "Edit book", "Delete task" → "Delete book"
   - Delete modal: "Delete Task?" → "Delete Book?"
   - Delete message: Updated to book-focused language

### 5. **TaskTable Component Updates**
   - Column header: "Task" → "Book"
   - Empty state: "No tasks found" → "No books found"
   - Status badge: "Active" → "Reading"
   - Toast messages: All updated to "book/books"
   - Pagination: "task(s)" → "book(s)"
   - Modal titles: "Task Details" → "Book Details", "Edit Task" → "Edit Book"
   - Button labels: "Mark as Active" → "Mark as Reading"
   - Action tooltips: Updated to book terminology

### 6. **SuccessPopup Component Updates**
   - Title: "Task Created! 🎉" → "Book Added! 🎉"
   - Message: "Your task has been added successfully" → "Your book has been added to your reading list"

### 7. **Calendar Page Updates**
   - Subtitle: "View your tasks on a calendar" → "View your books on a calendar"
   - Button: "New Task" → "New Book"
   - Section title: "Tasks for" → "Books for"
   - Empty state: "No tasks for this date" → "No books for this date"
   - Status: "pending" → "reading"

### 8. **Tasks Page Updates**
   - Page title: "All Tasks" → "All Books"
   - Description: "Manage and organize your tasks" → "Manage and organize your books"
   - Button: "New Task" → "New Book"

### 9. **Dashboard Components Updates**
   - QuickActions: "New Task" → "New Book"
   - LineChart: "Task Trends" → "Book Trends"

**Technical Implementation Examples**:
```typescript
// CreateTaskModal
<h2>Add New Book</h2>
<p>Add a book to your reading list</p>
<Input label="Book Title" placeholder="Enter book title (e.g., Peer-e-Kamil)" />

// TaskList
<p>Loading your books...</p>
<input placeholder="Search books..." />
<p>No {filter === 'all' ? '' : filter === 'active' ? 'reading' : filter} books found</p>

// TaskItem
<span>{status === 'completed' ? 'Completed' : 'Reading'}</span>
<h3>Delete Book?</h3>
```

## Outcome

✅ **Comprehensive Update**: All forms, components, and pages updated to book-focused terminology

✅ **Terminology Consistency**: Uniform book terminology throughout the application

✅ **User Experience**: Clear, intuitive labels that reflect book management workflows

✅ **Forms Updated**: All input fields, placeholders, and help text book-focused

✅ **Messages Updated**: Toast notifications, error messages, and empty states updated

✅ **Components Updated**: All reusable components reflect book theme

## Evaluation Notes

- **Terminology Consistency**: All user-facing text now uses book terminology consistently
- **Template Relevance**: Quick templates in CreateTaskModal now relevant to books
- **Status Labels**: "Reading" is more intuitive than "Active" for book context
- **Form Labels**: Clear, book-specific labels help users understand input requirements
- **Error Messages**: User-friendly messages that reflect book management context
- **Toast Notifications**: Clear, celebratory messages for book-related actions

## Technical Details

**Components Updated** (10 files):
1. `CreateTaskModal.tsx`: Form labels, templates, buttons
2. `EditTaskModal.tsx`: Modal title, form labels, error messages
3. `TaskList.tsx`: Loading, search, empty states, filters
4. `TaskItem.tsx`: Status badges, labels, delete modal
5. `TaskTable.tsx`: Headers, filters, modals, toasts
6. `SuccessPopup.tsx`: Title and message
7. `calendar/page.tsx`: Page text, buttons, empty states
8. `tasks/page.tsx`: Page title and description
9. `QuickActions.tsx`: Button label
10. `LineChart.tsx`: Chart title

**Key Terminology Changes**:
- "task" → "book"
- "tasks" → "books"
- "Task" → "Book"
- "Active" → "Reading"
- "Due" → "Target"
- "Category" → "Genre/Category"

**Template Examples**:
- Currently Reading (📖)
- Want to Read (🎯)
- Fiction (📚)
- Non-Fiction (✨)

