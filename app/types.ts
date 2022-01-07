import { DataFunctionArgs } from '@remix-run/server-runtime';
import type { LoaderFunction as LF, ActionFunction as AF } from 'remix'

export type Setter<A> = (f: (prev: A) => A) => void

type Env = {
  SESSION_SECRET: string;
  PORTFOLIO: DurableObjectNamespace;
  AUTH0_KV: KVNamespace;
  AUTH0_CALLBACK_URL: string;
  AUTH0_CLIENT_ID: string;
  AUTH0_CLIENT_SECRET: string;
  AUTH0_DOMAIN: string;
};


export type WorkerContext = EventContext<Env, '', unknown>;

export interface LoaderFunction {
  (param: Omit<DataFunctionArgs, 'context'> & { context: WorkerContext }): ReturnType<LF>;
}

export type ActionFunction = AF
