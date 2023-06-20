import React, { useEffect } from "react";

import { ListItem, List, ListItemSecondaryAction, IconButton, Divider, alpha } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { FieldValues, get, Path, useController, useFormState } from "react-hook-form-mui";

import FormOnFieldChange from "./FormOnFieldChange";

interface UnknownObject {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface FormGroupListProps<TFieldValues extends FieldValues, OptionsObject extends UnknownObject> {
    options: OptionsObject[];
    optionValueField: keyof OptionsObject & string;

    renderOption: (item: OptionsObject) => React.ReactNode;
    disableOptionAction?: (item: OptionsObject) => boolean;

    renderSelectField: (filteredOptions: OptionsObject[]) => React.ReactNode;
    selectFieldName: Path<TFieldValues>;

    disabled?: boolean;
    overrideDisabled?: boolean;
    name: Path<TFieldValues>;

    disableAutoAdd?: boolean;

    enableAutoSave?: boolean;
    saveAction?: () => void,
}

export default function FormGroupList<TFieldValues extends FieldValues, OptionsObject extends UnknownObject>(
    props: FormGroupListProps<TFieldValues, OptionsObject>
): JSX.Element {
    const {
        options,
        optionValueField,
        renderOption: renderListItem,
        disableOptionAction: disableListItemAction = () => false,

        renderSelectField,
        selectFieldName,

        disabled = false,
        overrideDisabled = false,
        name,
        enableAutoSave: enableAutoSubmit,

        disableAutoAdd = false,

        saveAction,
    } = props;

    const { defaultValues, isSubmitting } = useFormState<TFieldValues>();

    const {
        field: { value: selectFieldValue, onChange: setSelectFieldValue },
    } = useController<TFieldValues>({ name: selectFieldName });

    const {
        field: { value: listInputValueTemp, onChange },
    } = useController<TFieldValues>({ name });
    const listInputValue = listInputValueTemp as unknown[];

    const listInputDefaultValue = get(defaultValues, name) as unknown[];

    // This only works if enableReinitialize is enabled.
    useEffect(() => {
        if (listInputDefaultValue) {
            setAddedIds([]);
        }
    }, [listInputDefaultValue]);

    const [addedIds, setAddedIds] = React.useState<unknown[]>([]);

    function deleteSelectedItem(item: OptionsObject): void {
        const itemValueId = item[optionValueField];

        // console.debug("deleteSelectedItem: itemIndex=", itemValue);

        onChange(listInputValue.filter((valueId) => valueId !== itemValueId));

        setAddedIds(addedIds.filter((addedId) => addedId !== itemValueId));

        if (enableAutoSubmit) {
            void saveAction();
        }
    }

    function addSelectedItem(): void {
      console.log("hHi")
        // id 0 is allowed!
        if (selectFieldValue === null) {
            return;
        }
        let parsed: unknown;
        if (typeof selectFieldValue === "number") {
            parsed = selectFieldValue;
        } else {
            const strFieldValue = selectFieldValue as unknown as string;
            parsed = parseInt(strFieldValue);
            if (isNaN(parseInt(strFieldValue))) {
                parsed = strFieldValue;
            }
        }

        //console.debug(`addSelectedItem: parsed=${parsed}`)

        const newValue = [...listInputValue];
        newValue.push(parsed);

        onChange(newValue);

        if (!listInputDefaultValue?.includes(parsed)) {
            setAddedIds([...addedIds, parsed]);
        }

        setSelectFieldValue(null);

        if (enableAutoSubmit) {
            void saveAction();
        }
    }

    const remainingOptions = [];
    const defaultSelectedOptions = [];

    for (const option of options) {
        const optionId = option[optionValueField];
        if (listInputValue.includes(optionId)) {
            if (listInputDefaultValue?.includes(optionId)) {
                defaultSelectedOptions.push(option);
            }
            continue;
        }

        remainingOptions.push(option);
    }

    const newSelectedOptions = addedIds
        .map((addedId) => options.find((option) => option[optionValueField] === addedId))
        .filter((option): option is OptionsObject => !!option);

    const disabledMerged = overrideDisabled ? disabled : isSubmitting || disabled;

    return (
        <List
            dense
            sx={(theme) => ({
                "& .MuiListItem-container:hover": {
                    backgroundColor: alpha(theme.palette.text.primary, theme.palette.action.hoverOpacity),
                    "&:last-child": {
                        backgroundColor: "inherit",
                    },
                },
            })}
        >
            {defaultSelectedOptions.map((item) => (
                <ListItem
                    dense
                    key={item[optionValueField]}
                >
                    {renderListItem(item)}
                    <ListItemSecondaryAction>
                        <IconButton
                            edge="end"
                            aria-label="delete"
                            size="small"
                            disabled={disabledMerged || disableListItemAction(item)}
                            onClick={() => deleteSelectedItem(item)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
            {defaultSelectedOptions.length > 0 && newSelectedOptions.length > 0 && <Divider />}
            {newSelectedOptions.map((item) => (
                <ListItem
                    dense
                    key={item[optionValueField]}
                >
                    {renderListItem(item)}
                    <ListItemSecondaryAction>
                        <IconButton
                            edge="end"
                            aria-label="delete"
                            size="small"
                            disabled={disabledMerged || disableListItemAction(item)}
                            onClick={() => deleteSelectedItem(item)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
            <ListItem
                sx={{ pr: disableAutoAdd ? 8 : 1, pt: 1, pb: 1 }}
                dense
            >
                {renderSelectField(remainingOptions)}
                {disableAutoAdd ? (
                    <ListItemSecondaryAction>
                        <IconButton
                            edge="end"
                            aria-label="add"
                            disabled={disabledMerged || selectFieldValue === null}
                            onClick={() => addSelectedItem()}
                            size="large"
                        >
                            <AddIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                ) : (
                    <FormOnFieldChange<TFieldValues>
                        fields={[selectFieldName]}
                        onChange={() => addSelectedItem()}
                    />
                )}
            </ListItem>
        </List>
    );
}
