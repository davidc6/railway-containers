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
$ export ENVIRONMENT_ID=<environment_id>
```

# Railway Deployment

The app is deployed and available on this url - [https://railway-containers-production.up.railway.app/](https://railway-containers-production.up.railway.app/).

You can add a new Redis service, which will deploy it from the template. The service should then appear on the main page (once deployed gets initialised). You can then click on the service which will show the latest deployment. The deployment can be removed (spun down) or deploy (spun up). There's also a link to go back to the main / services page.

## Potential improvements / ideas

Given the time constrains, I decided not to take any longer to make the application perfect but rather explain some improvements and changes I would make if taking this app to production or working in a team.

- Remove remaining TypeScript `any`s and add proper types
- Figure out a way to generate types from graphql schemas
- Make it responsive (improve responsiveness)
- `page.tsx`, `Modal.tsx` and `service/[id]/page.tsx` should be broken down into smaller components. Currently everything is in one place but it is obvious that splitting into smaller components where each one owns its own state allows for better testability and possibility of defining some components as service side rendered since not everything is dynamic in the web app.
- Add tests (currently there are none, I'd add unit tests to test various components and then a number of e2e tests to cover the main functionality of the app)
- Add caching of results with occasional refetch with something like Apollo Client or ReactQuery (I had some issues with Apollo Client caching and didn't want to take too long to figure out the issues)
- Following up on the previous point, it would be much more beneficial to use Subscriptions instead of polling the endpoint to listen for any updates from the server
- Better loader (we can use Nextjs native loader functionality)
- Add loaders instead of a simple "Loading..." text
- Improve status return error status codes (be more intentional and informative about the statuses)
- API security of course is not the best at the moment and can be improved
