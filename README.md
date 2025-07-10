# reestri_connector

This repository contains an experimental connector for interacting with external registries. It uses Cloud Functions written in TypeScript along with a small React dashboard.

## Troubleshooting

If ESLint fails with an error like:

```
TypeError: Error while loading rule '@typescript-eslint/no-unused-expressions': Cannot read properties of undefined
```

Ensure that your ESLint configuration sets `parserOptions.project` to point to a valid `tsconfig.json`. Some `@typescript-eslint` rules require type information from the parser, and they will crash if the project option is missing. Updating `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` to matching versions may also help.
