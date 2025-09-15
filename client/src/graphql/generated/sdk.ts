import { GraphQLClient, RequestOptions } from 'graphql-request';
import { GraphQLError, print } from 'graphql'
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type HealthStatus = {
  __typename?: 'HealthStatus';
  message: Scalars['String']['output'];
  status: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  health: HealthStatus;
  hello: Scalars['String']['output'];
};

export type GetHealthQueryVariables = Exact<{ [key: string]: never; }>;


export type GetHealthQuery = { __typename?: 'Query', health: { __typename?: 'HealthStatus', status: string, message: string, timestamp: string } };

export type GetHelloQueryVariables = Exact<{ [key: string]: never; }>;


export type GetHelloQuery = { __typename?: 'Query', hello: string };


export const GetHealthDocument = gql`
    query GetHealth {
  health {
    status
    message
    timestamp
  }
}
    `;
export const GetHelloDocument = gql`
    query GetHello {
  hello
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();
const GetHealthDocumentString = print(GetHealthDocument);
const GetHelloDocumentString = print(GetHelloDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetHealth(variables?: GetHealthQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetHealthQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetHealthQuery>(GetHealthDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetHealth', 'query', variables);
    },
    GetHello(variables?: GetHelloQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetHelloQuery; errors?: GraphQLError[]; extensions?: any; headers: Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetHelloQuery>(GetHelloDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetHello', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;