import { AxiosError, isAxiosError } from "axios";

function handleError(error: unknown | AxiosError): string {
  if (isAxiosError(error) && error.response) {
    return error.response.data.message;
  }
  return (error as Error).message;
}
export { handleError };
