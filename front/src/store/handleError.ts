import { AxiosError, isAxiosError } from "axios";

function handleError(error: unknown | AxiosError): string {
  if (isAxiosError(error) && error.response) {
    throw error.response.data.message;
  }
  throw (error as Error).message;
}
export { handleError };
