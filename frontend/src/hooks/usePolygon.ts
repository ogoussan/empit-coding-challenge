import { useEffect, useState } from "react";
import { APIError, APIErrorType, Polygon } from "../types";
import { DOMAIN, ENDPOINTS } from "../config";

const usePolygon = (selectedPolygons: number[]) => {
  const [polygonData, setData] = useState<Polygon[]>([]);
  const [polygonLoading, setLoading] = useState<boolean>(false);
  const [polygonError, setError] = useState<APIError | undefined>(undefined);
  const [abortController, setAbortController] = useState<AbortController>(
    new AbortController()
  );

  const fetchPolygon = async (
    polygonID: number,
    abortController: AbortController
  ): Promise<number[][]> => {
    const params: URLSearchParams = new URLSearchParams();
    params.append("id", JSON.stringify(polygonID));
    const response: Response = await fetch(
      DOMAIN + ENDPOINTS.POLYGON + "?" + params.toString(),
      { signal: abortController.signal }
    );

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
    setData(
      polygonData.filter((polygon: Polygon) =>
        selectedPolygons.find((selected: number) => selected === polygon.id)
      )
    );
    if (selectedPolygons.length < 1) return;
    abortController.abort();
    const newAbortController: AbortController = new AbortController();
    setAbortController(newAbortController);
    setLoading(true);
    for (const poly of selectedPolygons) {
      fetchPolygon(poly, newAbortController)
        .then(
          (response: number[][]) =>
            !polygonData.find((polygon: Polygon) => polygon.id === poly) &&
            setData([
              ...polygonData,
              { id: poly, coordinates: response } as Polygon,
            ])
        )
        .catch((error: Error) => {
          error instanceof APIError && setError(error);
        });
    }
    setLoading(false);
  }, [abortController, polygonData, selectedPolygons]);

  return { polygonData, polygonLoading, polygonError };
};

export default usePolygon;
