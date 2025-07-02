import type { TypeFlag } from 'type-flag';
import type { Commands, HandlerContext } from './typeCommand.js';
import type { Dict } from './typeUtils.js';

export type FallbackType<T, U> = {} extends T ? U : T;

export type InterceptorContext<C extends Commands = Commands> =
  HandlerContext<C> & {
    flags: FallbackType<
      TypeFlag<NonNullable<C[keyof C]['flags']>>['flags'],
      Dict<any>
    >;
  };

export type Interceptor<C extends Commands = Commands> =
  | InterceptorFn<C>
  | InterceptorObject<C>;

export type InterceptorFn<C extends Commands = Commands> = (
  ctx: InterceptorContext<C>,
  next: () => void
) => void;

export interface InterceptorObject<C extends Commands = Commands> {
  enforce?: 'pre' | 'post';
  fn: InterceptorFn<C>;
}
