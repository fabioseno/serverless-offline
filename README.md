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


## What to do next
- understand the problems of using an old verion of serverless (1.x.x)
- try using yml serverless instead of ts and test if the ```serverless-step-functions-offline``` plugin works


## To consider
- discover why people are not using these plugins so much (not many GitHub stars)
- is Step Functions a good approach although it provides lots of features out of the box (retry, exponential backoff, dead letter queue, etc)?


## Scenario

Two lambdas that delete data in different sources. The operation should be transactional.

Step 1: executes Lambda1 to delete from source 1 and returns success
Step 2: executes Lambda2 to delete from source 2 and returns error

Now, to "rollback" the transaction, the item removed in step 1 should be recreated.
In order to recreate the item, there should have a Step 0 to grab full information from the item before doing any changes to it.
This original data should be passed to the lambda that would recreate the item (in case of hard delete) or just the id (in case of soft delete).
