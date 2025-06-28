#!/usr/bin/env node

/**
 * Utility script to parse pandoc --help output and generate a JSON schema
 * for pandoc arguments validation.
 */

const fs = require('fs');
const path = require('path');

// Read the pandoc options file
const pandocOptionsPath = path.join(__dirname, 'pandoc_options_utf8.txt');
const pandocOptions = fs.readFileSync(pandocOptionsPath, 'utf8');

const schema = {};

// Parse each line to extract option information
const lines = pandocOptions.split('\n').filter(line => line.trim());

for (const line of lines) {
    // Skip BOM character if present
    const cleanLine = line.replace(/^\ufeff/, '');
    
    // Parse line format: "  -f FORMAT, -r FORMAT  --from=FORMAT, --read=FORMAT"
    // Extract the long option name and determine its type
    
    const longOptionMatch = cleanLine.match(/--([a-z-]+)(?:=([A-Z|a-z-]+(?:\|[A-Z|a-z-]+)*))?(?:\[=([A-Z|a-z-]+(?:\|[A-Z|a-z-]+)*)\])?/);
    
    if (longOptionMatch) {
        const optionName = longOptionMatch[1];
        const requiredValue = longOptionMatch[2];
        const optionalValue = longOptionMatch[3];
        
        // Determine option type and properties
        let optionInfo = {
            description: getOptionDescription(optionName),
            flagOnly: false
        };
        
        if (requiredValue) {
            // Has required value
            if (requiredValue.includes('|')) {
                // Enum type
                optionInfo.type = 'string';
                optionInfo.choices = requiredValue.split('|');
            } else if (requiredValue === 'NUMBER') {
                optionInfo.type = 'number';
            } else if (requiredValue === 'FILE' || requiredValue === 'DIRECTORY' || requiredValue === 'PATH') {
                optionInfo.type = 'file';
            } else {
                optionInfo.type = 'string';
            }
        } else if (optionalValue) {
            // Optional value (usually boolean or enum)
            if (optionalValue.includes('|')) {
                if (optionalValue.includes('true|false')) {
                    optionInfo.type = 'boolean';
                } else {
                    optionInfo.type = 'string';
                    optionInfo.choices = optionalValue.split('|');
                }
            } else {
                optionInfo.type = 'boolean';
            }
        } else {
            // Flag only (no value)
            optionInfo.type = 'boolean';
            optionInfo.flagOnly = true;
        }
        
        schema[optionName] = optionInfo;
    }
}

// Add descriptions and fix some edge cases
function getOptionDescription(optionName) {
    const descriptions = {
        'from': 'Input format',
        'read': 'Input format (alias for --from)',
        'to': 'Output format',
        'write': 'Output format (alias for --to)',
        'output': 'Output file path',
        'data-dir': 'Data directory',
        'metadata': 'Set metadata field',
        'metadata-file': 'Read metadata from file',
        'defaults': 'Read defaults from file',
        'file-scope': 'Parse each file individually',
        'sandbox': 'Run in sandbox mode',
        'standalone': 'Produce standalone document',
        'template': 'Use custom template',
        'variable': 'Set template variable',
        'variable-json': 'Set template variable from JSON',
        'wrap': 'Text wrapping behavior',
        'ascii': 'Use ASCII characters only',
        'toc': 'Include table of contents',
        'table-of-contents': 'Include table of contents (alias for --toc)',
        'toc-depth': 'Maximum depth for table of contents',
        'lof': 'Include list of figures',
        'list-of-figures': 'Include list of figures (alias for --lof)',
        'lot': 'Include list of tables', 
        'list-of-tables': 'Include list of tables (alias for --lot)',
        'number-sections': 'Number sections',
        'number-offset': 'Offset for section numbers',
        'top-level-division': 'Top-level division type',
        'extract-media': 'Extract media to directory',
        'resource-path': 'Resource search path',
        'include-in-header': 'Include file in header',
        'include-before-body': 'Include file before body',
        'include-after-body': 'Include file after body',
        'no-highlight': 'Disable syntax highlighting',
        'highlight-style': 'Syntax highlighting style',
        'syntax-definition': 'Custom syntax definition',
        'dpi': 'DPI for images',
        'eol': 'Line ending style',
        'columns': 'Column width',
        'preserve-tabs': 'Preserve tabs',
        'tab-stop': 'Tab stop width',
        'pdf-engine': 'PDF rendering engine',
        'pdf-engine-opt': 'PDF engine options',
        'reference-doc': 'Reference document for styling',
        'self-contained': 'Produce self-contained document',
        'embed-resources': 'Embed resources in document',
        'link-images': 'Link to images instead of embedding',
        'request-header': 'HTTP request header',
        'no-check-certificate': 'Disable certificate checking',
        'abbreviations': 'Abbreviations file',
        'indented-code-classes': 'Classes for indented code blocks',
        'default-image-extension': 'Default image extension',
        'filter': 'Pandoc filter',
        'lua-filter': 'Lua filter',
        'shift-heading-level-by': 'Shift heading levels',
        'base-header-level': 'Base header level',
        'track-changes': 'Track changes mode',
        'strip-comments': 'Strip HTML comments',
        'reference-links': 'Use reference links',
        'reference-location': 'Reference link location',
        'figure-caption-position': 'Figure caption position',
        'table-caption-position': 'Table caption position',
        'markdown-headings': 'Markdown heading style',
        'list-tables': 'Use list tables',
        'listings': 'Use listings package',
        'incremental': 'Incremental slides',
        'slide-level': 'Slide level',
        'section-divs': 'Wrap sections in divs',
        'html-q-tags': 'Use HTML q tags',
        'email-obfuscation': 'Email obfuscation method',
        'id-prefix': 'ID prefix',
        'title-prefix': 'Title prefix',
        'css': 'CSS stylesheet',
        'epub-subdirectory': 'EPUB subdirectory',
        'epub-cover-image': 'EPUB cover image',
        'epub-title-page': 'Include EPUB title page',
        'epub-metadata': 'EPUB metadata file',
        'epub-embed-font': 'Embed font in EPUB',
        'split-level': 'Split level for chunked HTML',
        'chunk-template': 'Chunk template',
        'epub-chapter-level': 'EPUB chapter level',
        'ipynb-output': 'Jupyter notebook output mode',
        'citeproc': 'Process citations with citeproc',
        'bibliography': 'Bibliography file',
        'csl': 'Citation style language file',
        'citation-abbreviations': 'Citation abbreviations file',
        'natbib': 'Use natbib for citations',
        'biblatex': 'Use biblatex for citations',
        'mathml': 'Use MathML for math',
        'webtex': 'Use WebTeX for math',
        'mathjax': 'Use MathJax for math',
        'katex': 'Use KaTeX for math',
        'gladtex': 'Use GladTeX for math',
        'trace': 'Enable tracing',
        'dump-args': 'Dump arguments',
        'ignore-args': 'Ignore arguments',
        'verbose': 'Verbose output',
        'quiet': 'Quiet output',
        'fail-if-warnings': 'Fail on warnings',
        'log': 'Log file',
        'bash-completion': 'Generate bash completion',
        'list-input-formats': 'List input formats',
        'list-output-formats': 'List output formats',
        'list-extensions': 'List extensions',
        'list-highlight-languages': 'List highlight languages',
        'list-highlight-styles': 'List highlight styles',
        'print-default-template': 'Print default template',
        'print-default-data-file': 'Print default data file',
        'print-highlight-style': 'Print highlight style',
        'version': 'Show version',
        'help': 'Show help'
    };
    
    return descriptions[optionName] || `Pandoc option: ${optionName}`;
}

// Special handling for some options
schema['pdf-engine'].choices = ['pdflatex', 'lualatex', 'xelatex', 'wkhtmltopdf', 'weasyprint', 'pagedjs-cli', 'prince', 'context', 'pdfroff'];

// Write the schema to a TypeScript file
const schemaOutput = `/**
 * Auto-generated Pandoc argument validation schema
 * Generated from pandoc --help output
 */

export interface PandocOptionSchema {
  type: 'boolean' | 'string' | 'number' | 'file';
  description: string;
  flagOnly?: boolean;
  choices?: string[];
}

export const PANDOC_OPTIONS_SCHEMA: Record<string, PandocOptionSchema> = ${JSON.stringify(schema, null, 2)};

/**
 * Check if a pandoc option is valid
 */
export function isValidPandocOption(optionName: string): boolean {
  return optionName in PANDOC_OPTIONS_SCHEMA;
}

/**
 * Validate a pandoc option value
 */
export function validatePandocOptionValue(optionName: string, value: any): boolean {
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
`;

fs.writeFileSync(path.join(__dirname, 'pandoc-schema.ts'), schemaOutput);

console.log('Generated pandoc-schema.ts with', Object.keys(schema).length, 'options');
console.log('Example options:');
console.log('- Flag only:', Object.keys(schema).filter(k => schema[k].flagOnly).slice(0, 5));
console.log('- With choices:', Object.keys(schema).filter(k => schema[k].choices).slice(0, 5));
console.log('- File types:', Object.keys(schema).filter(k => schema[k].type === 'file').slice(0, 5));