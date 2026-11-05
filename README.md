# KaagJaat — Nepali Document Editor

**A digital writing and document management platform built for Nepali users.**

KaagJaat is a web-based document editor designed to simplify the process of creating, formatting, and managing Nepali documents.

Writing Nepali digitally often requires users to rely on third-party Unicode converters to convert Romanized Nepali into Devanagari before transferring the text into a document editor. KaagJaat aims to simplify this fragmented process by integrating Nepali Unicode transliteration into its document-writing workflow.

The goal is to provide a unified platform for writing, organizing, and managing Nepali documents.

## Features

- **Nepali Document Editor:** A built-in rich-text editor powered by [Slate.js](https://docs.slatejs.org/), with Nepali font support (Mukta), text formatting, headings, alignment, lists, line-height controls, and page breaks.
- **Nepali Unicode Transliteration:** Romanized Nepali-to-Devanagari conversion powered by a backend deployment using [`loudrumbles/indic-transliterate`](https://github.com/loudrumbles/indic-transliterate).
- **Spaces:** Organize documents into Personal, Presentation, and Work spaces.
- **Folder Management:** Create folders to organize documents within workspaces.
- **Trash & Recovery:** Soft-delete documents and restore them when needed.
- **Cloud-Based Autosave:** Automatically save document changes to the database using a debounced autosave mechanism.

## Screenshots

### Document Editor
<img width="1899" height="729" alt="image" src="https://github.com/user-attachments/assets/5ac6801b-ce6c-4e25-a96a-473b8fae00ec" />

### Workspace
<img width="1899" height="777" alt="image" src="https://github.com/user-attachments/assets/cc9d4d56-6b72-4b7c-99dc-53317031e321" />
<img width="1907" height="723" alt="image" src="https://github.com/user-attachments/assets/3ad84369-71fb-4fe7-80d4-4eb904e30976" />

## Tech Stack

| Frontend | Backend & Database |
|---|---|
| React.js | Node.js |
| TypeScript | Express.js |
| Vite | MongoDB |
| Tailwind CSS | JWT Authentication |
| Shadcn UI | Axios |
| Slate.js | Indic Transliteration |

## Work in Progress

- [ ] Real-time document collaboration.
- [ ] Shared workspaces and team collaboration.
- [ ] Advanced document formatting.
- [ ] Improved Nepali writing experience.
- [ ] Document export (PDF/DOCX).

## Vision

KaagJaat aims to make digital Nepali documentation more accessible by bringing writing, Unicode conversion, formatting, and document management into one unified platform.

**Built to make writing in Nepali simpler.**
