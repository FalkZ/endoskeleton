# endoskeleton

![picture of endoskeleton](https://cdn.deno.land/endoskeleton/versions/0.0.1/raw/assets/endoskeleton.jpg) _Picture source: https://creary.net/@ruslankazarez_

> the task runner from the future

Endoskeleton ([pronounced](https://youtube.com/clip/Ugkxq6J1SBGZev4AHYIQwpGqWYhWTdBiyQfj)) is a lightweight task runner for modern software development.

## Features

- Cross platform
- Type save configuration
- Templating
- Remote scripts
- Isolated permissions for scripts

## Getting started

```bash
deno install --allow-read=endo.yaml --allow-write=endo.yaml,.endo-schema.json --allow-run --no-check https://deno.land/x/endoskeleton@0.0.1/endo.ts
```

_for Windows: you also need to set the PATH environment variable_

### Usage

### Update

```bash
deno install -f --allow-read=endo.yaml --allow-write=endo.yaml,.endo-schema.json --allow-run --no-check https://deno.land/x/endoskeleton@0.0.1/endo.ts
```

## Coming soon

- Task dependencies
- Parallel tasks
