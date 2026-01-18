---
id: 015
title: convert-dashboard-to-book-focused
stage: green
date: 2025-12-25
surface: phase-2
model: claude-sonnet-4-5
feature: 002-frontend-web-app
branch: 002-frontend-web-app
user: user
command: /sp.implement
labels: [implementation, dashboard, books, refactoring, terminology, ui]
links:
  spec: specs/002-frontend-web-app/spec.md
  ticket: N/A
  adr: N/A
  pr: N/A
files:
  - path: frontend/src/app/dashboard/page.tsx
    status: modified
    lines_changed: +100
tests:
  - name: Dashboard Book Terminology
    status: passed
    framework: manual-verification
  - name: Stats Cards Update
    status: passed
    framework: manual-verification
---

## Prompt

```text
/sp.implement "Convert the dashboard to be book-focused instead of task-focused. Update all terminology, labels, and descriptions to reflect book management. Change 'tasks' to 'books', 'active' to 'reading', and update all stats, filters, and UI elements accordingly."
```

**Implementation Requirements**:
- Replace all "task" terminology with "book" throughout dashboard
- Update view mode from "Tasks" to "Books"
- Change filter from "active" to "reading"
- Update stats cards labels and descriptions
- Modify empty states and messages
- Ensure all UI text reflects book management theme

## Response Snapshot

Successfully converted dashboard to book-focused terminology:

### 1. **Type System Updates**
   - `ViewMode`: Changed from `'overview' | 'tasks'` to `'overview' | 'books'`
   - Filter state: Renamed `taskFilter` to `bookFilter`
   - Filter values: Updated from `'all' | 'active' | 'completed'` to `'all' | 'reading' | 'completed'`
   - Variable names: `filteredTasks` → `filteredBooks`
   - Stats calculation: `pending` → `reading`

### 2. **Stats Cards Transformation**
   - **"Reading"** → **"Currently Reading"** (displays reading books count)
   - **"Completed"** → **"Completed Books"** (displays completed books count)
   - **"Total"** → **"Total Books"** (displays total books count)
   - **"This Week"** → **"Added This Week"** (displays books added this week)
   - Updated trend labels to reflect reading status

### 3. **UI Component Updates**
   - View mode button: "Tasks" → "Books"
   - Filter buttons: "active" → "Reading"
   - Action buttons: "Add Task" → "Add Book"
   - Empty state messages: Updated to book terminology
   - Page titles and descriptions: Book-focused language

### 4. **Stats Calculation Logic**
   - `reading`: Books that are not completed (total - completed)
   - `completionRate`: Percentage of completed books
   - `thisWeekCreated`: Books added in current week
   - `readingTrend`: Percentage of books currently being read
   - `completedTrend`: Completion rate percentage

### 5. **Filter Logic Implementation**
   - "all": Returns all books
   - "reading": Returns books where `completed === false`
   - "completed": Returns books where `completed === true`
   - Filter counts updated to reflect book counts accurately

**Technical Implementation**:
```typescript
type ViewMode = 'overview' | 'books'; // Changed from 'tasks'

const [bookFilter, setBookFilter] = useState<'all' | 'reading' | 'completed'>('all');

const stats = useMemo(() => {
  const total = books.length;
  const completed = books.filter((b) => b.completed).length;
  const reading = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  // ... additional calculations
}, [books]);

const filteredBooks = useMemo(() => {
  if (bookFilter === 'all') return books;
  if (bookFilter === 'reading') return books.filter((b) => !b.completed);
  return books.filter((b) => b.completed);
}, [books, bookFilter]);
```

**Stats Cards Configuration**:
```typescript
<StatsCard
  title="Currently Reading"
  value={stats.reading}
  icon={Circle}
  trend={{ value: stats.readingTrend, isPositive: false }}
/>
<StatsCard
  title="Completed Books"
  value={stats.completed}
  icon={CheckCircle2}
  trend={{ value: stats.completedTrend, isPositive: true }}
/>
```

## Outcome

✅ **Terminology Consistency**: All task terminology replaced with book-focused language

✅ **Stats Accuracy**: Cards now reflect book management metrics accurately

✅ **Filter Clarity**: "Active" changed to "Reading" for better user understanding

✅ **User Experience**: Dashboard clearly communicates book management functionality

✅ **Design Consistency**: Dashboard aligns with overall book-focused theme

## Evaluation Notes

- **Terminology Clarity**: "Reading" is more intuitive than "Active" for book management context
- **Stats Relevance**: All metrics now relevant to reading/book management workflows
- **Visual Consistency**: Stats cards maintain same design while content reflects books
- **User Understanding**: Clear labels help users understand their reading progress
- **Future Scalability**: Book-focused terminology supports future reading features

## Technical Details

**Variable Naming Convention**:
- `tasks` → `books` (where data represents books)
- `taskFilter` → `bookFilter`
- `filteredTasks` → `filteredBooks`
- `pending` → `reading` (for statistics)

**Filter Logic**:
- "all": Returns complete book collection
- "reading": Returns `books.filter(b => !b.completed)`
- "completed": Returns `books.filter(b => b.completed)`

**Stats Calculations**:
- Total: `books.length`
- Completed: `books.filter(b => b.completed).length`
- Reading: `total - completed`
- This Week Created: Filtered by `created_at >= weekStart`

**Files Modified**:
- `frontend/src/app/dashboard/page.tsx`: Complete terminology and logic updates

