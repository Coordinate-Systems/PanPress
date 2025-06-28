/**
 * Auto-generated Pandoc argument validation schema
 * Generated from pandoc --help output
 */

export interface PandocOptionSchema {
  type: 'boolean' | 'string' | 'number' | 'file';
  description: string;
  flagOnly?: boolean;
  choices?: string[];
}

export const PANDOC_OPTIONS_SCHEMA: Record<string, PandocOptionSchema> = {
  "from": {
    "description": "Input format",
    "flagOnly": false,
    "type": "string"
  },
  "to": {
    "description": "Output format",
    "flagOnly": false,
    "type": "string"
  },
  "output": {
    "description": "Output file path",
    "flagOnly": false,
    "type": "file"
  },
  "data-dir": {
    "description": "Data directory",
    "flagOnly": false,
    "type": "file"
  },
  "metadata": {
    "description": "Set metadata field",
    "flagOnly": false,
    "type": "string"
  },
  "metadata-file": {
    "description": "Read metadata from file",
    "flagOnly": false,
    "type": "file"
  },
  "defaults": {
    "description": "Read defaults from file",
    "flagOnly": false,
    "type": "file"
  },
  "file-scope": {
    "description": "Parse each file individually",
    "flagOnly": false,
    "type": "boolean"
  },
  "sandbox": {
    "description": "Run in sandbox mode",
    "flagOnly": false,
    "type": "boolean"
  },
  "standalone": {
    "description": "Produce standalone document",
    "flagOnly": false,
    "type": "boolean"
  },
  "template": {
    "description": "Use custom template",
    "flagOnly": false,
    "type": "file"
  },
  "variable": {
    "description": "Set template variable",
    "flagOnly": false,
    "type": "string"
  },
  "variable-json": {
    "description": "Set template variable from JSON",
    "flagOnly": false,
    "type": "string"
  },
  "wrap": {
    "description": "Text wrapping behavior",
    "flagOnly": false,
    "type": "string",
    "choices": [
      "auto",
      "none",
      "preserve"
    ]
  },
  "ascii": {
    "description": "Use ASCII characters only",
    "flagOnly": false,
    "type": "boolean"
  },
  "toc": {
    "description": "Include table of contents",
    "flagOnly": false,
    "type": "boolean"
  },
  "toc-depth": {
    "description": "Maximum depth for table of contents",
    "flagOnly": false,
    "type": "number"
  },
  "lof": {
    "description": "Include list of figures",
    "flagOnly": false,
    "type": "boolean"
  },
  "lot": {
    "description": "Include list of tables",
    "flagOnly": false,
    "type": "boolean"
  },
  "number-sections": {
    "description": "Number sections",
    "flagOnly": false,
    "type": "boolean"
  },
  "number-offset": {
    "description": "Offset for section numbers",
    "flagOnly": false,
    "type": "string"
  },
  "top-level-division": {
    "description": "Top-level division type",
    "flagOnly": false,
    "type": "string",
    "choices": [
      "section",
      "chapter",
      "part"
    ]
  },
  "extract-media": {
    "description": "Extract media to directory",
    "flagOnly": false,
    "type": "file"
  },
  "resource-path": {
    "description": "Resource search path",
    "flagOnly": false,
    "type": "string"
  },
  "include-in-header": {
    "description": "Include file in header",
    "flagOnly": false,
    "type": "file"
  },
  "include-before-body": {
    "description": "Include file before body",
    "flagOnly": false,
    "type": "file"
  },
  "include-after-body": {
    "description": "Include file after body",
    "flagOnly": false,
    "type": "file"
  },
  "no-highlight": {
    "description": "Disable syntax highlighting",
    "flagOnly": true,
    "type": "boolean"
  },
  "highlight-style": {
    "description": "Syntax highlighting style",
    "flagOnly": false,
    "type": "string",
    "choices": [
      "STYLE",
      "FILE"
    ]
  },
  "syntax-definition": {
    "description": "Custom syntax definition",
    "flagOnly": false,
    "type": "file"
  },
  "dpi": {
    "description": "DPI for images",
    "flagOnly": false,
    "type": "number"
  },
  "eol": {
    "description": "Line ending style",
    "flagOnly": false,
    "type": "string",
    "choices": [
      "crlf",
      "lf",
      "native"
    ]
  },
  "columns": {
    "description": "Column width",
    "flagOnly": false,
    "type": "number"
  },
  "preserve-tabs": {
    "description": "Preserve tabs",
    "flagOnly": false,
    "type": "boolean"
  },
  "tab-stop": {
    "description": "Tab stop width",
    "flagOnly": false,
    "type": "number"
  },
  "pdf-engine": {
    "description": "PDF rendering engine",
    "flagOnly": false,
    "type": "string",
    "choices": [
      "pdflatex",
      "lualatex",
      "xelatex",
      "wkhtmltopdf",
      "weasyprint",
      "pagedjs-cli",
      "prince",
      "context",
      "pdfroff"
    ]
  },
  "pdf-engine-opt": {
    "description": "PDF engine options",
    "flagOnly": false,
    "type": "string"
  },
  "reference-doc": {
    "description": "Reference document for styling",
    "flagOnly": false,
    "type": "file"
  },
  "self-contained": {
    "description": "Produce self-contained document",
    "flagOnly": false,
    "type": "boolean"
  },
  "embed-resources": {
    "description": "Embed resources in document",
    "flagOnly": false,
    "type": "boolean"
  },
  "link-images": {
    "description": "Link to images instead of embedding",
    "flagOnly": false,
    "type": "boolean"
  },
  "request-header": {
    "description": "HTTP request header",
    "flagOnly": false,
    "type": "string"
  },
  "no-check-certificate": {
    "description": "Disable certificate checking",
    "flagOnly": false,
    "type": "boolean"
  },
  "abbreviations": {
    "description": "Abbreviations file",
    "flagOnly": false,
    "type": "file"
  },
  "indented-code-classes": {
    "description": "Classes for indented code blocks",
    "flagOnly": false,
    "type": "string"
  },
  "default-image-extension": {
    "description": "Default image extension",
    "flagOnly": false,
    "type": "string"
  },
  "filter": {
    "description": "Pandoc filter",
    "flagOnly": false,
    "type": "string"
  },
  "lua-filter": {
    "description": "Lua filter",
    "flagOnly": false,
    "type": "string"
  },
  "shift-heading-level-by": {
    "description": "Shift heading levels",
    "flagOnly": false,
    "type": "number"
  },
  "base-header-level": {
    "description": "Base header level",
    "flagOnly": false,
    "type": "number"
  },
  "track-changes": {
    "description": "Track changes mode",
    "flagOnly": false,
    "type": "string",
    "choices": [
      "accept",
      "reject",
      "all"
    ]
  },
  "strip-comments": {
    "description": "Strip HTML comments",
    "flagOnly": false,
    "type": "boolean"
  },
  "reference-links": {
    "description": "Use reference links",
    "flagOnly": false,
    "type": "boolean"
  },
  "reference-location": {
    "description": "Reference link location",
    "flagOnly": false,
    "type": "string",
    "choices": [
      "block",
      "section",
      "document"
    ]
  },
  "figure-caption-position": {
    "description": "Figure caption position",
    "flagOnly": false,
    "type": "string",
    "choices": [
      "above",
      "below"
    ]
  },
  "table-caption-position": {
    "description": "Table caption position",
    "flagOnly": false,
    "type": "string",
    "choices": [
      "above",
      "below"
    ]
  },
  "markdown-headings": {
    "description": "Markdown heading style",
    "flagOnly": false,
    "type": "string",
    "choices": [
      "setext",
      "atx"
    ]
  },
  "list-tables": {
    "description": "Use list tables",
    "flagOnly": false,
    "type": "boolean"
  },
  "listings": {
    "description": "Use listings package",
    "flagOnly": false,
    "type": "boolean"
  },
  "incremental": {
    "description": "Incremental slides",
    "flagOnly": false,
    "type": "boolean"
  },
  "slide-level": {
    "description": "Slide level",
    "flagOnly": false,
    "type": "number"
  },
  "section-divs": {
    "description": "Wrap sections in divs",
    "flagOnly": false,
    "type": "boolean"
  },
  "html-q-tags": {
    "description": "Use HTML q tags",
    "flagOnly": false,
    "type": "boolean"
  },
  "email-obfuscation": {
    "description": "Email obfuscation method",
    "flagOnly": false,
    "type": "string",
    "choices": [
      "none",
      "javascript",
      "references"
    ]
  },
  "id-prefix": {
    "description": "ID prefix",
    "flagOnly": false,
    "type": "string"
  },
  "title-prefix": {
    "description": "Title prefix",
    "flagOnly": false,
    "type": "string"
  },
  "css": {
    "description": "CSS stylesheet",
    "flagOnly": false,
    "type": "string"
  },
  "epub-subdirectory": {
    "description": "EPUB subdirectory",
    "flagOnly": false,
    "type": "string"
  },
  "epub-cover-image": {
    "description": "EPUB cover image",
    "flagOnly": false,
    "type": "file"
  },
  "epub-title-page": {
    "description": "Include EPUB title page",
    "flagOnly": false,
    "type": "boolean"
  },
  "epub-metadata": {
    "description": "EPUB metadata file",
    "flagOnly": false,
    "type": "file"
  },
  "epub-embed-font": {
    "description": "Embed font in EPUB",
    "flagOnly": false,
    "type": "file"
  },
  "split-level": {
    "description": "Split level for chunked HTML",
    "flagOnly": false,
    "type": "number"
  },
  "chunk-template": {
    "description": "Chunk template",
    "flagOnly": false,
    "type": "string"
  },
  "epub-chapter-level": {
    "description": "EPUB chapter level",
    "flagOnly": false,
    "type": "number"
  },
  "ipynb-output": {
    "description": "Jupyter notebook output mode",
    "flagOnly": false,
    "type": "string",
    "choices": [
      "all",
      "none",
      "best"
    ]
  },
  "citeproc": {
    "description": "Process citations with citeproc",
    "flagOnly": true,
    "type": "boolean"
  },
  "bibliography": {
    "description": "Bibliography file",
    "flagOnly": false,
    "type": "file"
  },
  "csl": {
    "description": "Citation style language file",
    "flagOnly": false,
    "type": "file"
  },
  "citation-abbreviations": {
    "description": "Citation abbreviations file",
    "flagOnly": false,
    "type": "file"
  },
  "natbib": {
    "description": "Use natbib for citations",
    "flagOnly": true,
    "type": "boolean"
  },
  "biblatex": {
    "description": "Use biblatex for citations",
    "flagOnly": true,
    "type": "boolean"
  },
  "mathml": {
    "description": "Use MathML for math",
    "flagOnly": true,
    "type": "boolean"
  },
  "webtex": {
    "description": "Use WebTeX for math",
    "flagOnly": false,
    "type": "boolean"
  },
  "mathjax": {
    "description": "Use MathJax for math",
    "flagOnly": false,
    "type": "boolean"
  },
  "katex": {
    "description": "Use KaTeX for math",
    "flagOnly": false,
    "type": "boolean"
  },
  "gladtex": {
    "description": "Use GladTeX for math",
    "flagOnly": true,
    "type": "boolean"
  },
  "trace": {
    "description": "Enable tracing",
    "flagOnly": false,
    "type": "boolean"
  },
  "dump-args": {
    "description": "Dump arguments",
    "flagOnly": false,
    "type": "boolean"
  },
  "ignore-args": {
    "description": "Ignore arguments",
    "flagOnly": false,
    "type": "boolean"
  },
  "verbose": {
    "description": "Verbose output",
    "flagOnly": true,
    "type": "boolean"
  },
  "quiet": {
    "description": "Quiet output",
    "flagOnly": true,
    "type": "boolean"
  },
  "fail-if-warnings": {
    "description": "Fail on warnings",
    "flagOnly": false,
    "type": "boolean"
  },
  "log": {
    "description": "Log file",
    "flagOnly": false,
    "type": "file"
  },
  "bash-completion": {
    "description": "Generate bash completion",
    "flagOnly": true,
    "type": "boolean"
  },
  "list-input-formats": {
    "description": "List input formats",
    "flagOnly": true,
    "type": "boolean"
  },
  "list-output-formats": {
    "description": "List output formats",
    "flagOnly": true,
    "type": "boolean"
  },
  "list-extensions": {
    "description": "List extensions",
    "flagOnly": false,
    "type": "boolean"
  },
  "list-highlight-languages": {
    "description": "List highlight languages",
    "flagOnly": true,
    "type": "boolean"
  },
  "list-highlight-styles": {
    "description": "List highlight styles",
    "flagOnly": true,
    "type": "boolean"
  },
  "print-default-template": {
    "description": "Print default template",
    "flagOnly": false,
    "type": "string"
  },
  "print-default-data-file": {
    "description": "Print default data file",
    "flagOnly": false,
    "type": "file"
  },
  "print-highlight-style": {
    "description": "Print highlight style",
    "flagOnly": false,
    "type": "string",
    "choices": [
      "STYLE",
      "FILE"
    ]
  },
  "version": {
    "description": "Show version",
    "flagOnly": true,
    "type": "boolean"
  },
  "help": {
    "description": "Show help",
    "flagOnly": true,
    "type": "boolean"
  }
};

/**
 * Check if a pandoc option is valid
 */
export function isValidPandocOption(optionName: string): boolean {
  return optionName in PANDOC_OPTIONS_SCHEMA;
}

/**
 * Validate a pandoc option value
 */
export function validatePandocOptionValue(optionName: string, value: unknown): boolean {
  const schema = PANDOC_OPTIONS_SCHEMA[optionName];
  if (!schema) return false;
  
  if (schema.flagOnly && value !== true) {
    return false;
  }
  
  if (schema.type === 'boolean') {
    return typeof value === 'boolean';
  }
  
  if (schema.type === 'number') {
    return typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)));
  }
  
  if (schema.choices) {
    return schema.choices.includes(String(value));
  }
  
  return true;
}
