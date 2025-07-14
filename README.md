# DevCon Scheduler

Check out our [website](https://devconmu.netlify.app)!

## Motivation

The [MSCC Developers Conference](https://conference.mscc.mu/) has an awesome agenda that showcases all of its sessions. One issue though is attendees can't save sessions they're interested in attending, which can be an inconvenience at the conference as they need to check the whole agenda just to find out details about the next session.

## Update conference data

Every year, the MSCC creates a new repository for the developers conference on [GitHub](https://github.com/mscraftsman). Usually, the JSON data is stored under `/storage/data`.

To update this repository's data, changes need to be made in the:

- JSON files under `src/data`
- `registrationSession` constant in `src/app/page.tsx` (This session is not stored in the sessions data and is not usually assigned a `roomId` in MSCC's data. We have a special `roomId` of -1 to account for this.)

The [exported PDF's title](src/app/components/PDFPreview.tsx) also needs to be updated based on the current year.

Adapt tests to the new data. Execute `npm test` and `npx cypress run` (or `npx cypress open`) to run tests.

## Contribute

Feel free to contribute!

### Getting Started

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
