## Frontend Structure

```
src/
	app/page.tsx              # Page composition only
	components/               # Reusable UI parts (NameForm, NameList)
	hooks/                    # Data hooks (useUsers, useSaveName)
	graphql/
		operations/             # .graphql documents (queries + mutations)
		codegen.yml             # Codegen config (YAML)
		generated/              # Auto-generated (after running codegen)
		client.ts               # GraphQLClient config
```

## Scripts

```bash
npm run dev       # Start Next.js
npm run codegen   # Generate typed documents from operations
```

Optional environment variable:
`NEXT_PUBLIC_API_URL` (defaults to http://localhost:4000/)

## Workflow

1. Start backend (port 4000) and Mongo.
2. In `client/`: `npm run codegen` (after you add/change .graphql files).
3. Run `npm run dev` and use UI to add names.

## Adding a New Operation

1. Create a new file in `src/graphql/operations/` (e.g. `deleteName.graphql`).
2. Run `npm run codegen` to regenerate typed documents.
3. Consume via `import { graphql } from '../graphql/generated';`

## Troubleshooting

- Empty list? Check Network tab for GraphQL errors.
- Saving fails? See server logs for thrown message.
- Codegen errors? Ensure server is running and schema reachable.
