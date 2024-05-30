import {
  Autocomplete,
  Checkbox,
  TextField,
  Typography,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import React, {ReactElement, SyntheticEvent, useMemo, useState} from "react";
import {ListboxComponent} from "./ListboxComponent.tsx";

const TAGS_LIMIT = 12;

type DropdownProps = {
  options: Option[];
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  label: string;
  enableSelectAll?: boolean;
};

type Option = {
  id: number;
  name: string;
};

const Dropdown = ({
  options,
  selected,
  setSelected,
  label,
  enableSelectAll
}: DropdownProps): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
  const isEveryOptionSelected = useMemo(() => (
    options.length &&
    options.every((option) => selected.includes(option.id))
  ), [options, selected]);
  const dropdownOptions = useMemo(() =>  enableSelectAll && options.length
    ? ['Select all', ...options.map((option: Option) => option.name)]
    : options.map((option: Option) => option.name), [enableSelectAll, options]
  );
  const dropdownValue = useMemo(() => (
    options
      .filter(
        (option: Option) => !!selected.find((id: number) => id === option.id)
      )
      .map((option: Option) => option.name)
  ), [options, selected]);

  const handleChange = (
    _: SyntheticEvent<Element, Event>,
    value: string[],
    reason: string,
  ): void => {
    if (!value.includes('Select all') && enableSelectAll && isEveryOptionSelected && reason === 'removeOption') {
      setSelected([]);
    }
    else if (value[value.length-1] === 'Select all') {
      setSelected(options.map((option) => option.id));
    } else {
      setSelected(
        options
          .filter((option) => value.find((v) => v === option.name))
          .map((option) => option.id)
      );
    }
  };

  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    item: string,
    { selected }: any
  ) => (
    <Typography component="li" {...props}>
      <Checkbox
        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
        checkedIcon={<CheckBoxIcon fontSize="small" />}
        style={{ marginRight: 8 }}
        checked={selected}
        className={"option_" + item}
      />
      {item}
    </Typography>
  );

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      clearOnEscape // clear <Chip>s with escape key
      disabled={false}
      disableCloseOnSelect // keep list opened
      multiple
      noOptionsText={`No ${label} Found!`}
      options={dropdownOptions}
      openOnFocus
      onChange={handleChange}
      sx={{ width: "100%" }}
      renderInput={(params) => (
        <>
          <Typography variant="subtitle1">
            {label}
          </Typography>
          <TextField
            {...params}
            style={{ maxHeight: "40vh", overflowY: "scroll" }}
          />
        </>
      )}
      ListboxComponent={ ListboxComponent as React.ComponentType<
        React.HTMLAttributes<HTMLElement>
      >}
      renderOption={renderOption}
      limitTags={TAGS_LIMIT}
      selectOnFocus
      value={
        enableSelectAll && isEveryOptionSelected ? ['Select all', ...dropdownValue] : dropdownValue
      }
    />
  );
};

export default Dropdown;
export type { Option };
