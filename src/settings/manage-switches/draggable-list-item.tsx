import {
  Box, FilterOptionsState, IconButton, ListItem, ListItemIcon, ListItemText, createFilterOptions,
} from '@mui/material';
import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import {
  AutocompleteElement,
  TextFieldElement, useWatch,
} from 'react-hook-form-mui';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import Icon from '@mdi/react';
import { IEntityConfig } from '../../store';
import IState from '../../types/state';
import type { TFormValues } from '../entities-form';
import EntityUtils from '../../utils/entity-utils';
import icons, { getIconsPath } from './icons';

interface DraggableListItemProps {
  entity: IEntityConfig,
  index: number,
  state: IState | null,
  onRemove: () => void,
}

const OPTIONS_LIMIT = 100;
const defaultFilterOptions = createFilterOptions();

const filterOptions = (options: unknown[], state: FilterOptionsState<unknown>) => defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);

export default function DraggableListItem(props: DraggableListItemProps) {
  const {
    index, state, onRemove,
  } = props;

  const [editing, setEditing] = useState<boolean>(false);

  const entity = useWatch<TFormValues, `entities.${number}`>({ name: `entities.${index}` });
  const autocompleteOptions = icons.map((option) => ({
    label: option.name, id: option.name, path: option.path, aliases: option.aliases,
  }));

  return (
    <Draggable
      draggableId={`entity-${entity.entity_id}`}
      index={index}
      isDragDisabled={editing}
    >
      {(provided) => (
        <ListItem
          sx={{ userSelect: 'none' }}
          key={entity.entity_id}
          ref={provided.innerRef}
          secondaryAction={!editing ? (
            <IconButton edge="end" aria-label="rename" onClick={() => setEditing(true)}>
              <DriveFileRenameOutlineIcon />
            </IconButton>
          ) : (
            <Box display="flex" gap={2}>
              <IconButton edge="end" aria-label="rename" onClick={() => onRemove()}>
                <DeleteSweepIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="rename"
                onClick={() => {
                  setEditing(false);
                }}
              >
                <DoneOutlineIcon />
              </IconButton>
            </Box>
          )}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...provided.dragHandleProps}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...provided.draggableProps}
        >
          {
              !editing ? (
                <>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {entity.icon && <Icon path={getIconsPath(entity.icon)} size={1} />}
                  </ListItemIcon>
                  <ListItemText
                    primary={EntityUtils.getEntityName(entity, state)}
                  />
                </>
              ) : (
                <>
                  <AutocompleteElement<TFormValues>
                    name={`entities.${index}.icon`}
                    options={autocompleteOptions}
                    textFieldProps={{ fullWidth: true }}
                    label="Icon"
                    matchId
                    autocompleteProps={{
                      fullWidth: true,
                      filterOptions,

                      renderOption: (optionProps, option, { selected }) => (
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        <ListItem {...optionProps} key={option.id}>
                          <ListItemIcon>
                            <Icon path={option.path} size={1} />
                          </ListItemIcon>
                          <ListItemText
                            primaryTypographyProps={selected ? { fontWeight: 'bold' } : undefined}
                            primary={option.label}
                            secondary={option.aliases.join(', ')}
                          />
                        </ListItem>
                      ),
                    }}

                  />
                  <TextFieldElement<TFormValues>
                    name={`entities.${index}.label`}
                    label={state?.attributes.friendly_name ?? entity.entity_id}
                  />
                </>
              )
            }
        </ListItem>
      )}
    </Draggable>
  );
}
