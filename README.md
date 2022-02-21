# serverless-offline

## Instructions

### Publishing lambdas locally
```
npm run dev
```

### Invoking lambdas
Call the HTTP request for the lambda displayed in VSCode using a browser or Postman.


## Findings

- there are two main similar plugins for step fuctions offline: [serverless-step-functions-offline](https://www.npmjs.com/package/serverless-step-functions-offline) and [deprecated serverless-offline-step-functions](https://github.com/flocasts/serverless-offline-step-functions) and lots of (unreliable) forks. The first one is not deprecated bit is not maintained for a long time as it still depends on serveless version 1 (there is already a version 3): ```Serverless step offline requires Serverless v1.x.x but found ${version}```
- there's no official (@types/serverless) support for Step functions Typescript definitions in serverless file using Typescript. Lots of step functions properties are missing in type definitions.
- it seems that the first plugin (not deprecated) is not compatible with Typescript serverless file:  ```Could not find serverless manifest```