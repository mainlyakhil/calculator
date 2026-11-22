# Calculator

A lightweight, responsive arithmetic calculator built with vanilla HTML, CSS, and JavaScript.

## Features

- **Safe Expression Parser:** Evaluates addition, subtraction, multiplication, division, and unary negative numbers using a two-pass arithmetic parser without `eval()`.
- **Input Validation:** Prevents duplicate consecutive operators, multiple decimal points within a single number, and division-by-zero errors.
- **Full Keyboard Support:**
  - `0–9` and `.` for numeric entry
  - `+`, `-`, `*`, `/` for arithmetic operators
  - `Enter` or `=` to evaluate
  - `Backspace` to delete the last character
  - `Escape` or `C` to clear the display
- **Responsive Layout:** Mobile-ready viewport configuration and a balanced 4-column CSS Grid layout.

## Project Structure

```text
.
├── index.html   # Semantic markup and ARIA labels
├── style.css    # Responsive 4-column grid and button styling
├── script.js    # Safe tokenizer/evaluator and keyboard event handlers
└── README.md    # Project documentation
```

## Getting Started

Open `index.html` directly in any modern web browser, or serve the directory locally:

```bash
npx serve .
```
