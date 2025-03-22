

# Microtypography Tool

**Apply HTML micro-typography to any text.**

This tool was created **for a real project** as an editorial assistant for CMS work, helping to maintain proper typographical standards in web articles.

## Purpose

This tool addresses the subtle yet important aspects of digital typography that are often overlooked in standard text editors. It automatically performs various text replacements to improve readability and adhere to typographical best practices, such as:

- Correct handling of non-breaking spaces
- Proper typographic quotes and dashes
- Consistent spacing around punctuation marks
- Special character formatting in HTML context

## How It Works

The Microtypography tool:

1. **Takes HTML input**: Paste your HTML content into the input area
2. **Processes the text**: Applies a series of predefined search-and-replace patterns defined in a JSON ruleset file
3. **Generates improved output**: Delivers typographically enhanced HTML ready for use in your CMS
4. **Copy and Paste enhanced HTML** using a button. 

## Usage

Clone the repo, then start small web server and vist [http://127.0.0.1:8040](http://127.0.0.1:8040)

```bash
$ php -S localhost:8040
```

## The ruleset

File **replacements.json** contains dozens of regex search-and-replace patterns. **Keep in mind that this ruleset was developed for a real project. It contains rules which may not be relevant to everyone.***

```json
[{
  "search": "<p>\\s+<\\/p>",
  "replace": "",
  "label": "Leere Absätze"
},
{
  "search": "<(li|h2|h3|h4|h5|h6)( [^>]+)?>\\s*([\\s]*|&nbsp;)*\\s*<\\/(li|h2|h3|h4|h5|h6)>",
  "replace": "",
  "label": "Leere Überschriften und List-items löschen"
}]
```

