import { Backdrop, CircularProgress } from "@mui/material";
import useForm from "../../hooks/useForm";
import {ReactElement, useEffect, useMemo, useState} from "react";
import { Continent, Country } from "../../types";
import Dropdown, { Option } from "./Dropdown";

type FormProps = {
  selectedPolygonIds: number[];
  setSelectedPolygonIds: React.Dispatch<React.SetStateAction<number[]>>;
};

const getOptionsFromItems = (items: Record<string, unknown>[]): Option[] => (
  items.map(({id, name}) => ({id: id as number, name: name as string}))
);

const getOptionsFromNumbers = (numbers: number[]): Option[] => (numbers.map((num) => (
    {id: num, name: num.toString()}
)));

const Form = ({
  selectedPolygonIds,
  setSelectedPolygonIds,
}: FormProps): ReactElement => {
  const { formData, formLoading, formError } = useForm();
  const [selectedContinentIds, setSelectedContinentIds] = useState<number[]>([]);
  const [selectedCountryIds, setSelectedCountryIds] = useState<number[]>([]);
  const continents = useMemo(() => formData.sort((a, b) => a.name.localeCompare(b.name)), [formData]);
  const countries = useMemo(() => {
    const selectedContinents: Continent[] = formData.filter((continent: Continent) => selectedContinentIds.includes(continent.id));

    const countries: Country[] = selectedContinents.map(
        (continent: Continent): Country[] => continent.countries
    ).flat(1);

    return countries.sort((a, b) => a.name.localeCompare(b.name));
  }, [formData, selectedContinentIds]);
  const polygons = useMemo(() => {
    const selectedCountries = countries.filter((country) => selectedCountryIds.includes(country.id));

    return selectedCountries.map((country) => country.polygons).flat(1).sort((a, b) => a - b)
  }, [countries, selectedCountryIds]);

  useEffect(() => {
    const updatedSelectedCountryIds = selectedCountryIds.filter((id) => countries.map((country) => country.id).includes(id));
    const updatedPolygonIds = selectedPolygonIds.filter((id) => polygons.includes(id));

    if (updatedSelectedCountryIds.length !== selectedCountryIds.length) {
      setSelectedCountryIds(updatedSelectedCountryIds);
    }

    if (updatedPolygonIds.length !== selectedPolygonIds.length) {
      setSelectedPolygonIds(updatedPolygonIds);
    }
  }, [countries, polygons, selectedCountryIds, selectedPolygonIds, setSelectedPolygonIds]);


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        position: "relative",
        margin: "20px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "20px",
        }}
      >
        <Dropdown
          enableSelectAll
          options={getOptionsFromItems(continents)}
          selected={selectedContinentIds}
          setSelected={setSelectedContinentIds}
          label={"Continent"}
        />
        <Dropdown
          enableSelectAll
          options={getOptionsFromItems(countries)}
          selected={selectedCountryIds}
          setSelected={setSelectedCountryIds}
          label={"Country"}
        />
        <Dropdown
          enableSelectAll
          options={getOptionsFromNumbers(polygons)}
          selected={selectedPolygonIds}
          setSelected={setSelectedPolygonIds}
          label={"Polygon"}
        />
      </div>
      <Backdrop open={formLoading || !!formError} sx={{ position: "absolute" }}>
        {formError ? <div>{formError.type}</div> : <CircularProgress />}
      </Backdrop>
    </div>
  );
};

export default Form;
