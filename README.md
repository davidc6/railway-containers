## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:8000](http://localhost:8000) in your browser to see the result.

In order for this to work locally, you'd need to set your project id like so:

```sh
$ export API_KEY=<your_railway_graphql_api_key>
$ export PROJECT_ID=<your_railway_project_id>
```

# Railway Deployment

TODO

## Potential improvements / ideas

- Remove remaining TypeScript `any`s
- Add tests
- Add caching of results with occasional refetch with something like Apollo Client or ReactQuery (I had some issues with Apollo Client caching and didn't want to take too long to figure out the issue before submitting the solution)
- Following up on the previous point, it would be much more beneficial to use Subscriptions instead of polling the endpoint to listen for any updates from the server
- Better loader (we can use Nextjs native loader functionality)
- Enable cold / initial start of containers
- Make it responsive
- Add loaders instead of a simple "Loading..." text
- Improve status return error status codes (be more intentional and informative about the statuses that we return)
- API security of course is not the best at the moment and can be improved
- page.tsx can be broken down into smaller components
