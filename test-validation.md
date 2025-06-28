---
title: "Test Document"
author: "Test Author"

# Valid pandoc arguments
pandoc-citeproc: true
pandoc-toc: true
pandoc-number-sections: true
pandoc-pdf-engine: "lualatex"
pandoc-css: ["style1.css", "style2.css"]
pandoc-template: "mytemplate.tex"

# Invalid pandoc arguments (should be caught)
pandoc-invalid-option: true
pandoc-pdf-engine: "invalid-engine"

# Edge cases
pandoc-standalone: false  # Should be skipped
pandoc-quiet: true        # Flag-only option
---

# Test Document

This is a test document to verify pandoc argument validation.

## Features tested:

1. **Valid flag-only arguments**: `citeproc`, `quiet`
2. **Valid boolean arguments**: `toc`, `number-sections`
3. **Valid choice arguments**: `pdf-engine` with valid choice
4. **Valid array arguments**: `css` with multiple values
5. **Valid file arguments**: `template`

## Invalid cases:

1. **Unknown option**: `invalid-option`
2. **Invalid choice**: `pdf-engine` with invalid value
3. **False boolean**: `standalone` set to false (should be skipped)