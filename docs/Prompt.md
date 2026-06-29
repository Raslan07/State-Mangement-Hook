### Role

You are a **Senior Frontend Engineer and Software Architect** with 15+ years of experience in React, TypeScript, and Design Systems.

Your task is to build a highly modular, academic-style React documentation web application.

### Objective

Build a comprehensive **React Masterclass** web application documenting three foundational hooks:

*   useState
    
*   useReducer
    
*   useContext
    

The application must visually and architecturally demonstrate the differences between them regarding:

*   Syntax
    
*   How to use it
    
*   Why we use it
    
*   When to use it
    
*   Best Practices
    
*   Common Mistakes
    

### Design System Requirements — "Academic Brutalism"

**Inspiration**

*   CSSWG Wiki
    
*   Visual Git Guide
    

**Styling**

*   Use **ONLY pure CSS**.
    
*   **Do NOT use**: Tailwind CSS, CSS-in-JS, Styled Components, Emotion.
    

**Typography**

*   **Body**: Merriweather, Georgia, Serif fallback_(High readability, long-form documentation)_
    
*   **Headings / UI**: Inter, system-ui, Sans-serif fallback_(Strong hierarchy)_
    
*   **Code**: Fira Code, monospace fallback_(Syntax highlighting, diagrams, code snippets)_
    

**Visual Language — Academic Brutalism**

*   High contrast
    
*   Flat surfaces
    
*   Thick borders: border: 2px solid black;
    
*   Flat brutalist shadows: box-shadow: 4px 4px 0px black;
    
*   No gradients, no glassmorphism, no neumorphism
    
*   Minimal rounded corners
    

**Semantic Colors**

*   useState: **#059669** (Green)
    
*   useReducer: **#d97706** (Orange)
    
*   useContext: **#7c3aed** (Purple)
    

### Architectural Requirements (STRICT)

Strictly separate concerns. **Do NOT** place everything in one file.

**Project Structure**:

Bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   src/  ├── types/  │   └── index.ts  ├── data/  │   └── hooksData.ts  ├── styles/  │   └── global.css  ├── hooks/  │   └── useTheme.ts  ├── components/  │   ├── layout/  │   │   ├── Sidebar.tsx  │   │   └── Layout.tsx  │   ├── documentation/  │   │   ├── HookArticle.tsx  │   │   ├── CodeBlock.tsx  │   │   ├── PracticeCard.tsx  │   │   └── MistakeCard.tsx  │   └── demos/  │       ├── UseStateDemo.tsx  │       ├── UseReducerDemo.tsx  │       └── UseContextDemo.tsx  └── App.tsx   `

### File Responsibilities

**types/index.ts**

*   All TypeScript interfaces/types (HookData, Section, Practice, Mistake, etc.)
    
*   Strict typing, no any
    

**data/hooksData.ts**

*   All educational content (Syntax, Explanation, Why, When, Best Practices, Common Mistakes, Code snippets)
    
*   **Only data** — no React components
    

**styles/global.css**

*   Full design system implementation (typography, layout, sidebar, cards, code blocks, colors, responsive)
    

**hooks/useTheme.ts**

*   Custom hook demonstrating Context logic (Theme Provider + consumption)
    

**Layout Components**

*   Sidebar.tsx: Navigation for the three hooks with active state
    
*   Layout.tsx: Wrapper with Sidebar + Main content (responsive)
    

**Documentation Components**

*   HookArticle.tsx: Renders full page from HookData
    
*   CodeBlock.tsx: Reusable syntax-highlight block
    
*   PracticeCard.tsx: Green bordered best-practice cards
    
*   MistakeCard.tsx: Red bordered mistake cards
    

**Interactive Demo Components**

*   UseStateDemo.tsx: Counter with increment/decrement/reset + functional updater
    
*   UseReducerDemo.tsx: Shopping cart (reducer, dispatch, actions)
    
*   UseContextDemo.tsx: Nested Provider/Consumer to show prop drilling solution
    

### Content Requirements

Populate hooksData.ts based on official React docs.

**useState**

*   Local component state
    
*   Functional updater (setCount(prev => prev + 1))
    
*   State preservation, rendering lifecycle, lazy initialization
    
*   Common mistake: Mutating state directly
    
*   Explain Object.is() comparison
    

**useReducer**

*   Complex state, state machines, reducer pattern
    
*   Pure reducers, discriminated union actions
    
*   Common mistake: Side effects inside reducers
    

**useContext**

*   Dependency Injection, shared state, solving prop drilling
    
*   Provider value memoization with useMemo
    
*   Common mistake: Using Context for high-frequency updates
    

### Code Quality, Accessibility & Responsive

**Code Quality**

*   React 19+, TypeScript (strict)
    
*   Reusable components, composition, separation of concerns
    
*   No duplicated code, no giant components
    

**Accessibility**

*   Semantic HTML
    
*   Keyboard navigation
    
*   Visible focus states
    
*   Proper heading hierarchy
    
*   Good color contrast
    

**Responsive**

*   Desktop, Tablet, Mobile
    
*   Sidebar collapses on smaller screens
    

### Deliverables

Generate the **complete codebase**, with every file shown under its own heading.

Requirements:

*   Every file must be shown separately
    
*   Strict TypeScript
    
*   CSS must fully implement Academic Brutalism
    
*   Production-ready, modular, readable, best practices