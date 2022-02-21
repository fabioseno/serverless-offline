import type { Serverless, Event } from 'serverless/aws';

type Definition = {
  Comment?: string;
  StartAt: string;
  States: {
    [state: string]: {
      Catch?: Catcher[];
      Type: "Map" | "Task" | "Choice" | "Pass";
      End?: boolean;
      Next?: string;
      ItemsPath?: string;
      ResultPath?: string;
      Resource?: string | { "Fn::GetAtt": string[] };
      Iterator?: Definition;
      Choices?: any[] // fabio added
    };
  };
};

type Catcher = {
  ErrorEquals: ErrorName[];
  Next: string;
  ResultPath?: string;
};

type ErrorName =
  | "States.ALL"
  | "States.DataLimitExceeded"
  | "States.Runtime"
  | "States.Timeout"
  | "States.TaskFailed"
  | "States.Permissions"
  | string;

interface ServerlessWithStepFunctions extends Serverless {
  stepFunctions?: {
    stateMachines: {
      [stateMachine: string]: {
        name: string;
        events?: Event[],
        definition: Definition;
      };
    };
    activities?: string[];
    validate?: boolean;
  };
}


// Step 1 = delete Profile in API
// Step 2 = delete profile Azure


// step1 => step2 => ok

// step 0 (grab profile from API) => step 1 (success) => step 2 (success) => ok
// step 0 (grab profile from API) => step 1 (success) => step 2 (fails) => create profile API => fail




const serverlessConfiguration: ServerlessWithStepFunctions = {
  service: 'step-functions',
  frameworkVersion: '>=1.72.0',
  plugins: [
    'serverless-plugin-typescript',
    'serverless-offline',
    'serverless-bundle',
    'serverless-step-functions',
    'serverless-step-functions-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x'
    // apiGateway: {
    //   minimumCompressionSize: 1024,
    // },
    // environment: {
    //   AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    // },
  },
  package: {
    individually: true
  },
  custom: {
    stepFunctionsOffline: {
      InitialStatus: 'studentProfile',
      FinalStatus: 'azureProfile' 
    }
  },
  stepFunctions: {
    stateMachines: {
      sequenceStateMachine: {
        name: 'Executes two tasks in sequence',
        events: [
          {
            http: {
              path: 'start',
              method: 'GET'
            }
          }
        ],
        definition: {
          Comment: '',
          StartAt: 'InitialStatus',
          States: {
            InitialStatus: {
              Type: 'Task',
              Resource: {
                'Fn::GetAtt': ['studentProfile', 'Arn']
              },
              Next: 'FinalStatus'
            },
            FinalStatus: {
              Type: 'Task',
              Resource: {
                'Fn::GetAtt': ['azureProfile', 'Arn']
              },
              End: true
            }
          }
        }
      }
      // createProfileSincronization: {
      //   name: 'Create profile in API and Azure',
      //   definition: {
      //     Comment: 'Syncronizes profile operation between the Profile API and Azure account',
      //     StartAt: 'CreateProfileAPI',
      //     States: {
      //       CreateProfileAPI: {
      //         Type: 'Task',
      //         Resource: {
      //           'Fn::GetAtt': ['studentProfile', 'Arn']
      //         },
      //         Next: 'choice_task'
      //       },
      //       choice_task: {
      //         Type: 'Choice',
      //         Choices: [
      //           {
      //             Variable: '$.foo',
      //             NumericEquals: 1,
      //             Next: 'CreateAzureProfile'
      //           },
      //           {
      //             Variable: '$.foo',
      //             NumericEquals: 2,
      //             Next: 'CreateAzureProfile'
      //           }
      //         ]
      //       },
      //       CreateAzureProfile: {
      //         Type: 'Task',
      //         Resource: {
      //           'Fn::GetAtt': ['studentProfile', 'Arn']
      //         },
      //         End: true
      //       }
      //     }
      //   }
      // }
    }
  },
  functions: {
    studentProfile: {
      handler: 'src/functions/student-profile.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'profiles123'
          }
        }
      ]
    },
    azureProfile: {
      handler: 'src/functions/azure-profile.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'azure'
          }
        }
      ]
    },
  }
}

module.exports = serverlessConfiguration;