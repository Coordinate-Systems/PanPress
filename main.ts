
/*
 * main.ts
 *
 * Initialises the plugin, adds command palette options, adds the settings UI
 * Markdown processing is done in renderer.ts and Pandoc invocation in pandoc.ts
 *
 */

import * as fs from 'fs';
import * as path from 'path';
import * as temp from 'temp';

import { Notice, Plugin, FileSystemAdapter, MarkdownView } from 'obsidian';
import { lookpath } from 'lookpath';
import { pandoc, inputExtensions, outputFormats, OutputFormat, needsLaTeX, needsPandoc } from './pandoc';
import * as YAML from 'yaml';

import render from './renderer';
import PandocPluginSettingTab from './settings';
import { PandocPluginSettings, DEFAULT_SETTINGS, replaceFileExtension, fileExists } from './global';
export default class PandocPlugin extends Plugin {
    settings!: PandocPluginSettings;
    features: { [key: string]: string | undefined } = {};
    private binaryMapInitialized = false;
    private everFoundPandoc = false;

    override async onload() {
        console.log('Loading Pandoc plugin');
        await this.loadSettings();

        // Check if Pandoc, LaTeX, etc. are installed and in the PATH
        await this.createBinaryMap();

        // Register all of the command palette entries
        this.registerCommands();

        this.addSettingTab(new PandocPluginSettingTab(this.app, this));
    }

    registerCommands() {
        for (let [prettyName, pandocFormat, extension, shortName] of outputFormats) {
            // All outputFormats entries have 4 elements, so these are guaranteed to exist
            const safeExtension = extension as string;
            const safeShortName = shortName as string;

            const name = 'Export as ' + prettyName;
            this.addCommand({
                id: 'pandoc-export-' + pandocFormat, name,
                checkCallback: (checking: boolean) => {
                    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                    if (!activeView) return false;
                    if (!this.currentFileCanBeExported(pandocFormat as OutputFormat)) return false;
                    if (!checking) {
                        const currentFile = this.getCurrentFile();
                        if (currentFile) {
                            this.startPandocExport(currentFile, pandocFormat as OutputFormat, safeExtension, safeShortName);
                        }
                    }
                    return true;
                }
            });
        }
    }

    vaultBasePath(): string {
        return (this.app.vault.adapter as FileSystemAdapter).getBasePath();
    }

    getCurrentFile(): string | null {
        const fileData = this.app.workspace.getActiveFile();
        if (!fileData) return null;
        const adapter = this.app.vault.adapter;
        if (adapter instanceof FileSystemAdapter)
            return adapter.getFullPath(fileData.path);
        return null;
    }

    currentFileCanBeExported(format: OutputFormat): boolean {
        // Is it a supported input type?
        const file = this.getCurrentFile();
        if (!file) {
            console.log('No current file for export check');
            return false;
        }
        
        let validInput = false;
        for (const ext of inputExtensions) {
            if (file.endsWith(ext)) {
                validInput = true;
                break;
            }
        }
        
        if (!validInput) {
            console.log('File type not supported for export:', file);
            return false;
        }
        
        // ALWAYS show commands if we haven't initialized binary map yet
        if (!this.binaryMapInitialized) {
            return true;
        }
        
        // ALWAYS show commands if we've ever found Pandoc (even if features got cleared)
        if (needsPandoc(format) && this.everFoundPandoc) {
            return true;
        }
        
        // Check current binary availability
        if (needsPandoc(format) && !this.features['pandoc']) {
            return false;
        }
        
        if (needsLaTeX(format) && !this.features['pdflatex']) {
            return false;
        }
        
        return true;
    }

    async createBinaryMap() {
        this.features['pandoc'] = this.settings.pandoc || await lookpath('pandoc');
        this.features['pdflatex'] = this.settings.pdflatex || await lookpath('pdflatex');
        this.binaryMapInitialized = true;
        
        // Remember if we ever found Pandoc
        if (this.features['pandoc']) {
            this.everFoundPandoc = true;
        }
        
    }

    async startPandocExport(inputFile: string, format: OutputFormat, extension: string, shortName: string) {
        
        new Notice(`Exporting ${inputFile} to ${shortName}`);

        // Instead of using Pandoc to process the raw Markdown, we use Obsidian's
        // internal markdown renderer, and process the HTML it generates instead.
        // This allows us to more easily deal with Obsidian specific Markdown syntax.
        // However, we provide an option to use MD instead to use citations

        let outputFile: string = replaceFileExtension(inputFile, extension);
        if (this.settings.outputFolder) {
            outputFile = path.join(this.settings.outputFolder, path.basename(outputFile));
        }
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        
        try {
            let error, command;

            switch (this.settings.exportFrom) {
                case 'html': {
                    if (!view) {
                        new Notice('No active markdown view found');
                        return;
                    }
                    const { html, metadata, cliArgs } = await render(this, view, inputFile, format);

                    if (format === 'html') {
                        // Write to HTML file
                        await fs.promises.writeFile(outputFile, html);
                        new Notice('Successfully exported via Pandoc to ' + outputFile);
                        return;
                    } else {
                        // Spawn Pandoc
                        const metadataFile = temp.path();
                        const metadataString = YAML.stringify(metadata);
                        try {
                            await fs.promises.writeFile(metadataFile, metadataString);
                        } catch (error) {
                            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                            new Notice(`Failed to create temporary metadata file: ${errorMessage}`);
                            console.error('Metadata file write error:', error);
                            return;
                        }
                        const result = await pandoc(
                            {
                                file: 'STDIN', contents: html, format: 'html', metadataFile,
                                pandoc: this.settings.pandoc || undefined, pdflatex: this.settings.pdflatex || undefined,
                                directory: path.dirname(inputFile),
                                documentArgs: cliArgs,
                            },
                            { file: outputFile, format },
                            this.settings.extraArguments.split('\n')
                        );
                        error = result.error;
                        command = result.command;
                    }
                    break;
                }
                case 'md': {
                    // For markdown export, we still need to extract YAML for CLI args
                    const markdownContent = view ? view.data : await fs.promises.readFile(inputFile, 'utf8');
                    
                    // Process embeds in the markdown content
                    const processedMarkdown = await this.processMarkdownEmbeds(markdownContent, inputFile);
                    
                    // Extract metadata and CLI args from the processed content
                    const rawMetadata = this.getYAMLMetadata(processedMarkdown);
                    const currentFileDir = path.dirname(inputFile);
                    const vaultBasePath = this.vaultBasePath();
                    const { cliArgs } = await this.convertYamlToPandocArgs(rawMetadata, currentFileDir, vaultBasePath);
                    
                    // Write processed content to a secure temporary file
                    const tempFile = temp.path({ suffix: '.md' });
                    await fs.promises.writeFile(tempFile, processedMarkdown, 'utf8');
                    
                    const result = await pandoc(
                        {
                            file: tempFile, format: 'markdown',
                            pandoc: this.settings.pandoc || undefined, pdflatex: this.settings.pdflatex || undefined,
                            directory: path.dirname(inputFile),
                            documentArgs: cliArgs,
                        },
                        { file: outputFile, format },
                        this.settings.extraArguments.split('\n')
                    );
                    
                    // Clean up temporary file
                    try {
                        await fs.promises.unlink(tempFile);
                    } catch (e) {
                        console.warn('Could not clean up temporary file:', tempFile, e);
                    }
                    error = result.error;
                    command = result.command;
                    break;
                }
            }

            if (error.length) {
                new Notice('Exported via Pandoc to ' + outputFile + ' with warnings');
                new Notice('Pandoc warnings:' + error, 10000);
            } else {
                new Notice('Successfully exported via Pandoc to ' + outputFile);
            }
            if (this.settings.showCLICommands) {
                new Notice('Pandoc command: ' + command, 10000);
                console.log(command);
            }

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            new Notice('Pandoc export failed: ' + errorMessage, 15000);
            console.error(e);
        }
        
    }

    override onunload() {
        console.log('Unloading Pandoc plugin');
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    // Helper method for extracting YAML metadata (duplicated from renderer.ts for markdown export)
    private getYAMLMetadata(markdown: string) {
        markdown = markdown.trim();
        if (markdown.startsWith('---')) {
            const trailing = markdown.substring(3);
            const frontmatter = trailing.substring(0, trailing.indexOf('---')).trim();
            return YAML.parse(frontmatter);
        }
        return {};
    }

    // Extract content without frontmatter (for embedded files)
    private stripFrontmatter(markdown: string): string {
        markdown = markdown.trim();
        if (markdown.startsWith('---')) {
            const trailing = markdown.substring(3);
            const endIndex = trailing.indexOf('---');
            if (endIndex !== -1) {
                // Return content after the closing ---
                return trailing.substring(endIndex + 3).trim();
            }
        }
        // No frontmatter found, return as-is
        return markdown;
    }

    // Process embeds in markdown content (for markdown export mode)
    private async processMarkdownEmbeds(markdown: string, inputFile: string, parentFiles: string[] = []): Promise<string> {
        const adapter = this.app.vault.adapter as FileSystemAdapter;
        let processedMarkdown = markdown;
        
        // Find all embed patterns: ![[filename]] or ![[filename|alias]]
        const embedPattern = /!\[\[([^\]\|]+)(\|[^\]]+)?\]\]/g;
        const embeds = [...markdown.matchAll(embedPattern)];
        
        
        for (const embed of embeds) {
            const fullMatch = embed[0]; // Full ![[...]] text
            const filename = embed[1].trim(); // Just the filename part
            // const alias = embed[2]; // |alias part if present (unused for now)
            
            try {
                // Find the file using Obsidian's link resolution
                const relativePath = inputFile.startsWith(adapter.getBasePath()) 
                    ? inputFile.substring(adapter.getBasePath().length + 1)
                    : inputFile;
                const subfolder = path.dirname(relativePath);
                const file = this.app.metadataCache.getFirstLinkpathDest(filename, subfolder);
                
                if (!file) {
                    console.error(`Could not resolve embedded file: ${filename}`);
                    continue;
                }
                
                // Get the full path of the embedded file
                const embeddedFilePath = adapter.getFullPath(file.path);
                
                // Prevent infinite recursion
                if (parentFiles.includes(embeddedFilePath)) {
                    // Replace with link instead of embed
                    processedMarkdown = processedMarkdown.replace(fullMatch, `[${filename}](${filename})`);
                    continue;
                }
                
                // Read the embedded file and strip its frontmatter
                // (prevents embedded frontmatter from overriding main file's frontmatter)
                const embeddedRawContent = await adapter.read(file.path);
                const embeddedContent = this.stripFrontmatter(embeddedRawContent);
                
                // Recursively process embeds in the embedded file
                const newParentFiles = [...parentFiles, embeddedFilePath];
                const processedEmbeddedContent = await this.processMarkdownEmbeds(embeddedContent, embeddedFilePath, newParentFiles);
                
                // Replace the embed with the processed content
                processedMarkdown = processedMarkdown.replace(fullMatch, processedEmbeddedContent);
                
            } catch (error) {
                console.error(`Error processing embed ${filename}:`, error);
                // Leave the embed as-is if we can't process it
            }
        }
        
        return processedMarkdown;
    }

    // Helper method for converting YAML to CLI args (duplicated from renderer.ts for markdown export)
    private async convertYamlToPandocArgs(
        metadata: { [key: string]: any }, 
        currentFileDir: string, 
        vaultBasePath: string
    ): Promise<{ 
        cleanedMetadata: { [key: string]: any }, 
        cliArgs: string[] 
    }> {
        const cleanedMetadata: { [key: string]: any } = {};
        const cliArgs: string[] = [];
        
        // Arguments that typically expect file paths (for smart resolution)
        const FILE_PATH_ARGUMENTS = new Set([
            'template', 'css', 'bibliography', 'csl', 'reference-doc', 'reference-odt', 
            'reference-docx', 'epub-cover-image', 'epub-stylesheet', 'include-in-header',
            'include-before-body', 'include-after-body', 'lua-filter', 'filter',
            'metadata-file', 'abbreviations', 'syntax-definition'
        ]);
        
        for (const [key, value] of Object.entries(metadata)) {
            if (key.startsWith('pandoc-')) {
                const argName = key.substring(7);
                
                if (value === true) {
                    cliArgs.push(`--${argName}`);
                } else if (value === false || value === null || value === undefined) {
                    continue;
                } else if (Array.isArray(value)) {
                    for (const item of value) {
                        if (item !== null && item !== undefined) {
                            // Apply smart path resolution for file arguments
                            const resolvedValue = FILE_PATH_ARGUMENTS.has(argName) 
                                ? await this.resolveFilePath(String(item), currentFileDir, vaultBasePath)
                                : item;
                            cliArgs.push(`--${argName}=${resolvedValue}`);
                        }
                    }
                } else {
                    // Apply smart path resolution for file arguments
                    const resolvedValue = FILE_PATH_ARGUMENTS.has(argName) 
                        ? await this.resolveFilePath(String(value), currentFileDir, vaultBasePath)
                        : value;
                    cliArgs.push(`--${argName}=${resolvedValue}`);
                }
            } else {
                cleanedMetadata[key] = value;
            }
        }
        
        return { cleanedMetadata, cliArgs };
    }

    // Helper method for smart path resolution (duplicated from renderer.ts for markdown export)
    private async resolveFilePath(filePath: string, currentFileDir: string, vaultBasePath: string): Promise<string> {
        // If it's already an absolute path, use as-is
        if (path.isAbsolute(filePath)) {
            return filePath;
        }
        
        // Try relative to current file directory
        const relativeToCurrent = path.resolve(currentFileDir, filePath);
        if (await fileExists(relativeToCurrent)) {
            return relativeToCurrent;
        }
        
        // Try relative to vault root
        const relativeToVault = path.resolve(vaultBasePath, filePath);
        if (await fileExists(relativeToVault)) {
            return relativeToVault;
        }
        
        // Try custom template folder first if specified
        if (this.settings.templateFolder) {
            const customPath = path.isAbsolute(this.settings.templateFolder) 
                ? path.resolve(this.settings.templateFolder, filePath)
                : path.resolve(vaultBasePath, this.settings.templateFolder, filePath);
            if (await fileExists(customPath)) {
                return customPath;
            }
        }
        
        // Try common template directories in vault
        const commonDirs = ['templates', 'Templates', '_templates', 'pandoc', 'assets'];
        for (const dir of commonDirs) {
            const templatePath = path.resolve(vaultBasePath, dir, filePath);
            if (await fileExists(templatePath)) {
                return templatePath;
            }
        }
        
        // If not found anywhere, return the original path (let Pandoc handle the error)
        return filePath;
    }
}
