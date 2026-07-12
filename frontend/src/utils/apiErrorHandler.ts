import _ from "lodash";

export interface ApiErrorShape {
  status?: number;
  error?: string;
  message?: string;
  errors?: Record<string, string>;
}

export function extractErrorMessage(error: unknown): string {
  const data = _.get(error, "data") as ApiErrorShape | undefined;
  if (data?.errors && !_.isEmpty(data.errors)) {
    return Object.values(data.errors).join(", ");
  }
  return (
    _.get(data, "message") ??
    _.get(error, "error") ??
    "Something went wrong. Please try again."
  );
}
