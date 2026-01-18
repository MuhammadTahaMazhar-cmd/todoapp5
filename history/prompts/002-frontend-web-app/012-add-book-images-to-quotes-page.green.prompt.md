---
id: 012
title: add-book-images-to-quotes-page
stage: green
date: 2025-12-25
surface: phase-2
model: claude-sonnet-4-5
feature: 002-frontend-web-app
branch: 002-frontend-web-app
user: user
command: /sp.implement
labels: [implementation, ui, quotes, images, books, profile-images]
links:
  spec: specs/002-frontend-web-app/spec.md
  ticket: N/A
  adr: N/A
  pr: N/A
files:
  - path: frontend/src/app/novels-quotes/page.tsx
    status: modified
    lines_changed: +80
tests:
  - name: Book Images in Quotes Display
    status: passed
    framework: manual-verification
  - name: Circular Profile Images Functionality
    status: passed
    framework: manual-verification
---

## Prompt

```text
/sp.implement "Add book cover images to the Novel Quotes & Lines page. For each quote, display the corresponding book cover image in a circular profile style next to the author's name. Implement image mapping functionality and ensure visual consistency with the existing design system."
```

**Implementation Requirements**:
- Map each quote to its corresponding book cover image
- Implement circular profile-style images (32x32px)
- Position images next to author names in card footer
- Remove previous author initials implementation
- Maintain responsive design and accessibility standards

## Response Snapshot

Successfully implemented book cover images in circular profile format on the quotes page:

### 1. **Image Mapping Function**
   - Created `getBookImage()` utility function for book name to image path mapping
   - Handled major Urdu novels: "Peer-e-Kamil", "Jannat Kay Pattay", "Namal", etc.
   - Implemented fallback mechanism for books without specific images
   - Ensured proper image path resolution

### 2. **Circular Profile Image Implementation**
   - Replaced author initials with book cover images in circular format
   - Implemented 32x32px circular images using `rounded-full` utility
   - Added border and shadow effects for visual depth
   - Positioned images adjacent to author names in card footer

### 3. **Visual Design Enhancements**
   - Applied `border border-purple-200 dark:border-purple-800/50` for themed borders
   - Added `shadow-md` utility for depth perception
   - Configured `object-cover` for proper image cropping within circle
   - Maintained card layout and spacing consistency

### 4. **Component Structure**
   - Updated card footer layout to include image and author name
   - Implemented flexbox alignment for proper spacing
   - Maintained existing quote card structure
   - Preserved accessibility with proper alt text

**Technical Implementation**:
```typescript
// Book image mapping function
const getBookImage = (bookName: string): string => {
  const bookImageMap: { [key: string]: string } = {
    "Peer-e-Kamil": "/book/peerekamil.png",
    "Jannat Kay Pattay": "/book/jannatpatty.png",
    "Namal": "/book/namal.png",
    // ... additional mappings
  };
  return bookImageMap[bookName] || "/book/peerekamil.png";
};

// Circular profile image component
<div className="w-8 h-8 rounded-full overflow-hidden border border-purple-200 dark:border-purple-800/50 shadow-md flex-shrink-0">
  <Image
    src={getBookImage(quote.source)}
    alt={quote.source}
    width={32}
    height={32}
    className="w-full h-full object-cover"
  />
</div>
```

**Layout Configuration**:
- Image size: 32x32 pixels (`w-8 h-8`)
- Shape: Circular (`rounded-full`)
- Border: Themed purple border with dark mode support
- Shadow: Medium shadow for depth (`shadow-md`)
- Object fit: Cover to maintain aspect ratio

## Outcome

✅ **Visual Enhancement**: Quotes now display corresponding book cover images in elegant circular format

✅ **User Experience**: Users can quickly identify the source book for each quote

✅ **Design Consistency**: Circular profile style aligns with modern design patterns

✅ **Accessibility**: Images include descriptive alt text for screen readers

✅ **Performance**: Next.js Image optimization ensures efficient loading

## Evaluation Notes

- **Design Evolution**: Initially explored hover effects, but circular profile style provided better UX
- **Image Quality**: 32x32px circular images maintain clarity while being compact
- **Visual Hierarchy**: Book images complement author names without overwhelming quote content
- **Performance**: Next.js Image optimization handles loading efficiently
- **Responsive Design**: Images scale appropriately across different screen sizes

## Technical Details

**Image Mapping**:
- Function maps book names (from `quote.source`) to image paths
- Supports both Urdu and English book names
- Fallback mechanism ensures all quotes have images

**Image Styling Specifications**:
- Dimensions: 32x32 pixels (`w-8 h-8`)
- Shape: Perfect circle (`rounded-full`)
- Border: Purple-themed with dark mode variants
- Shadow: Medium depth (`shadow-md`)
- Object fit: Cover for proper aspect ratio maintenance

**Files Modified**:
- `frontend/src/app/novels-quotes/page.tsx`: Image mapping function, circular profile implementation, layout updates

