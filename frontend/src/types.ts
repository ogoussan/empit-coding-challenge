type Continent = {
  id: number;
  name: string;
  countries: Country[];
};

type Country = {
  id: number;
  name: string;
  polygons: number[];
};

type Polygon = {
  id: number;
  coordinates: number[][];
};

export type { Continent, Country, Polygon };

enum APIErrorType {
  BAD_REQUEST = "BAD_REQUEST",
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_SERVER = "INTERNAL_SERVER",
}

class APIError extends Error {
  type: APIErrorType;
  status: number;
  constructor(type: APIErrorType, status: number, ...args: any) {
    super(...args);
    this.type = type;
    this.status = status;
  }

  get name() {
    return `APIError[${this.type}]`;
  }
}

export { APIError, APIErrorType };
