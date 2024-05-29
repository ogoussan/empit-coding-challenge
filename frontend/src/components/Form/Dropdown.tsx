import {
  Autocomplete,
  Checkbox,
  Chip,
  TextField,
  Typography,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import React, {ReactElement, SyntheticEvent, useMemo, useState} from "react";

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
  const dropdownOptions = useMemo(() =>  enableSelectAll
    ? ['Select all', ...options.map((option: Option) => option.name)]
    : options.map((option: Option) => option.name), [enableSelectAll, options]
  );

  const handleChange = (
    _: SyntheticEvent<Element, Event>,
    value: string[]
  ): void => {
    if (value.includes('Select all')) {
      setSelected(options.map((option) => option.id));
      return;
    }

    setSelected(
      options
        .filter((option) => value.find((v) => v === option.name))
        .map((option) => option.id)
    );
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

  const renderTags = (value: string[]) => {
    return <Chip label={value.length} />;
  };

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
        <TextField
          {...params}
          label={`${label} List`}
          placeholder={`Select ${label}`}
        />
      )}
      renderOption={renderOption}
      renderTags={renderTags}
      selectOnFocus
      value={
        options
          .filter(
            (option: Option) => !!selected.find((id: number) => id === option.id)
          )
          .map((option: Option) => option.name)
      }
    />
  );
};

export default Dropdown;
export type { Option };
