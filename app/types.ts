import { DataFunctionArgs } from '@remix-run/server-runtime';
import type * as React from 'react'
import type { LoaderFunction as LF, ActionFunction as AF } from 'remix'

export type Setter<A> = React.Dispatch<React.SetStateAction<A>>

type Env = {
  SESSION_SECRET: string;
  PORTFOLIO: DurableObjectNamespace;
  AUTH0_KV: KVNamespace;
  AUTH0_CALLBACK_URL: string;
  AUTH0_CLIENT_ID: string;
  AUTH0_CLIENT_SECRET: string;
  AUTH0_DOMAIN: string;
};


export type Context = EventContext<Env, '', unknown>;

export interface LoaderFunction {
  (param: Omit<DataFunctionArgs, 'context'> & { context: Context }): ReturnType<LF>;
}

export type ActionFunction = AF
