/* eslint-disable @typescript-eslint/no-explicit-any */

import type { QueryUpdate } from "@/types/api";

type QueryKeyBuilder = (...params: any[]) => {
  add: QueryKeyBuilder;
  value: any[];
  queryUpdate: QueryUpdate;
};

export const queryKey: QueryKeyBuilder = (...params) => {
  const value = params.filter((param) => param !== undefined);

  return {
    add: (...newParams) => queryKey(...value.concat(newParams)),
    value,
    queryUpdate: { queryKey: value },
  };
};
