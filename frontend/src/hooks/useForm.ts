import { useEffect, useState } from "react";
import { APIError, APIErrorType, Continent } from "../types";
import { DOMAIN, ENDPOINTS } from "../config";

const useForm = (): {
  formData: Continent[];
  formLoading: boolean;
  formError: APIError | undefined;
} => {
  const [formData, setData] = useState<Continent[]>([]);
  const [formLoading, setLoading] = useState<boolean>(true);
  const [formError, setError] = useState<APIError | undefined>(undefined);

  const fetchForm = async (): Promise<Continent[]> => {
    const response: Response = await fetch(DOMAIN + ENDPOINTS.FORM);

    if (response.status === 400) {
      throw new APIError(APIErrorType.BAD_REQUEST, response.status);
    }
    if (response.status === 404) {
      throw new APIError(APIErrorType.NOT_FOUND, response.status);
    }
    if (!response.ok) {
      throw new APIError(APIErrorType.INTERNAL_SERVER, response.status);
    }

    return response.json();
  };

  useEffect((): void => {
    fetchForm()
      .then((response: Continent[]): void => setData(response))
      .catch((error: APIError): void => setError(error))
      .finally((): void => setLoading(false));
  }, []);

  return { formData, formLoading, formError };
};

export default useForm;
