# Codex Marketplace UI

This project provide Marketplace UI for Codex.

## Philosophy

This CSS is written with semantic style. For more details check this [link](https://maintainablecss.com/chapters/semantics).

## Prerequisites

- Node 18+

## Install

Run the npm install command:

```
npm install
```

## Run

### Links

In order to run the UI, you need link some internal dependencies because it is not published yet< >

#### Codex SDK

Clone the [Codex SDK](https://github.com/codex-storage/codex-js).

Follow the instructions to install and build the SDK, then run this command in the SDK repository:

```
npm link
```

Now in the current repository, you'll we able to link your local SDK build by running:

```
npm link @codex/sdk-js
```

#### Codex Marketplace Components

Clone the [Codex SDK](https://github.com/codex-storage/codex-marketplace-ui-components).

Follow the instructions to install and build the SDK, then run this command in the SDK repository:

```
npm link
```

Now in the current repository, you'll we able to link your local SDK build by running:

```
npm link @codex/marketplace-ui-components
```

#### Codex SDK

```
npm run dev
```
