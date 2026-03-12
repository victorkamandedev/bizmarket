# Frontend Architecture Documentation

## 📁 Project Structure

```
frontend/src/
├── components/          # Reusable UI components
├── pages/              # Full page views
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── styles/             # Separated style objects
├── utils/              # Utility functions
├── constants/          # App-wide constants
├── api.js              # API client
├── App.jsx             # Root component
├── main.jsx            # Entry point
└── index.css           # Global CSS
```

## 🎨 Styles Organization

**Location**: `src/styles/`

### `common.js`
- Shared colors, spacing, radius, shadows
- Reusable style objects (buttons, inputs, cards)
- Design tokens for consistency

### `headerStyles.js`
- All Header component styles
- Navigation styles
- Search bar styles

### `footerStyles.js`
- Footer layout styles
- Contact section styles
- Social media button styles

**Usage Example**:
```javascript
import * as styles from '../styles/headerStyles';
import { colors, buttonPrimary } from '../styles/common';

<button style={styles.navButton(isActive)}>...</button>
```

## 🔧 Utility Functions

**Location**: `src/utils/helpers.js`

### Available Functions:
- `socialLink(handle, platform)` - Convert handle to full URL
- `fileToBase64(file)` - Convert File to base64
- `filterBusinesses(businesses, query, categories)` - Filter logic
- `separateByTier(businesses)` - Separate premium/basic
- `getStatusColors(status)` - Get badge colors
- `formatDate(dateString)` - Format dates
- `truncate(text, maxLength)` - Truncate text
- `isValidEmail(email)` - Email validation
- `isValidUrl(url)` - URL validation
- `ensureHttps(url)` - Add https:// if missing

**Usage Example**:
```javascript
import { socialLink, filterBusinesses } from '../utils/helpers';

const instagramUrl = socialLink('@myhandle', 'instagram');
const filtered = filterBusinesses(businesses, searchQuery, selectedCats);
```

## 🎣 Custom Hooks

**Location**: `src/hooks/`

### `useClickOutside.js`
Detects clicks outside a ref element (for dropdowns, modals)

**Usage**:
```javascript
import { useClickOutside } from '../hooks/useClickOutside';

const ref = useRef(null);
useClickOutside(ref, () => setIsOpen(false));
```

## 📊 Constants

**Location**: `src/constants/index.js`

### Available Constants:
- `CATEGORIES` - List of business categories
- `CATEGORY_ICONS` - Icon mapping for categories
- `NAVIGATION_TABS` - App navigation tabs
- `DEMO_CREDENTIALS` - Demo login credentials
- `CONTACT_INFO` - Contact details
- `BUSINESS_STATUS` - Status enums
- `BUSINESS_TIER` - Tier enums
- `USER_ROLES` - Role enums

**Usage Example**:
```javascript
import { CATEGORIES, DEMO_CREDENTIALS } from '../constants';

CATEGORIES.forEach(cat => console.log(cat));
console.log(DEMO_CREDENTIALS.admin.email);
```

## 🔄 Component Pattern

### Before (Inline Styles):
```javascript
<button style={{
  background: '#2563eb',
  color: '#fff',
  padding: '10px 18px',
  // ... 20 more lines
}}>
  Click me
</button>
```

### After (Separated Styles):
```javascript
import * as styles from '../styles/componentStyles';

<button style={styles.primaryButton}>
  Click me
</button>
```

## 🧩 Shared Components

**Location**: `src/components/ui.jsx`

- `<Overlay>` - Modal backdrop
- `<CloseBtn>` - Modal close button
- `<Stars>` - Star rating display
- `<ImageGrid>` - Image gallery component

**Exported Styles**:
- `inputStyle` - Standard input field
- `btnPrimaryStyle` - Primary button

## 🎯 Benefits

### Easier Debugging
- Styles are named and findable
- Logic separated from presentation
- Easy to locate style definitions

### Better Maintainability
- Change color scheme in one place
- Consistent spacing and sizing
- Reusable style objects

### Improved DX
- Autocomplete for style imports
- Type safety (when using TypeScript)
- Clear component structure

## 📝 Code Examples

### Refactoring a Component

**Before**:
```javascript
function MyComponent() {
  const containerStyle = {
    padding: '20px',
    background: '#fff',
    // ... more styles
  };
  
  const buttonStyle = {
    background: '#2563eb',
    color: '#fff',
    // ... more styles
  };
  
  return (
    <div style={containerStyle}>
      <button style={buttonStyle}>Click</button>
    </div>
  );
}
```

**After**:
```javascript
import * as styles from '../styles/myComponentStyles';

function MyComponent() {
  return (
    <div style={styles.container}>
      <button style={styles.button}>Click</button>
    </div>
  );
}
```

### Using Utilities

**Before**:
```javascript
const instagramUrl = handle.startsWith('http') 
  ? handle 
  : `https://instagram.com/${handle.replace(/^@/, '')}`;
```

**After**:
```javascript
import { socialLink } from '../utils/helpers';

const instagramUrl = socialLink(handle, 'instagram');
```

## 🚀 Best Practices

1. **Always use constants** instead of magic strings
2. **Import styles from style files** instead of inline
3. **Use utility functions** for common operations
4. **Keep components focused** on logic, not styling
5. **Group related styles** in the same file

## 📚 Further Reading

- See individual component files for implementation
- Check `src/styles/common.js` for all design tokens
- Review `src/utils/helpers.js` for all utility functions
