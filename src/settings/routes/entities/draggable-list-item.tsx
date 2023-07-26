import {
  Box, IconButton, ListItem, ListItemIcon, ListItemText, createFilterOptions,
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
import { IEntityConfig } from '../../../store';
import IState from '../../../types/state';
import type { TFormValues } from './entities';
import EntityUtils from '../../../utils/entity-utils';
import icons from './icons';
import MdiIcon from '../../../components/mdi-icon';

interface DraggableListItemProps {
  entity: IEntityConfig,
  index: number,
  state: IState | null,
  onRemove: () => void,
}

export default function DraggableListItem(props: DraggableListItemProps) {
  const {
    index, state, onRemove,
  } = props;

  const [isEditing, setEditing] = useState<boolean>(false);

  const entity = useWatch<TFormValues, `entities.${number}`>({ name: `entities.${index}` });
  const autocompleteOptions = icons.map((option) => ({
    label: option.name, id: option.name, path: option.path, aliases: option.aliases,
  }));

  const iconName = entity.icon || state?.attributes.icon;

  return (
    <Draggable
      draggableId={`entity-${entity.entity_id}`}
      index={index}
      isDragDisabled={isEditing}
    >
      {(provided) => (
        <ListItem
          sx={{ userSelect: 'none', gap: 1, pr: isEditing ? 12 : undefined }}
          key={entity.entity_id}
          ref={provided.innerRef}
          dense
          secondaryAction={!isEditing ? (
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
              !isEditing ? (
                <>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {iconName && <MdiIcon iconName={iconName} size={1} />}
                  </ListItemIcon>
                  <ListItemText
                    primary={EntityUtils.getEntityName(entity, state)}
                    secondary={entity.entity_id}
                  />
                  {state?.state}
                </>
              ) : (
                <>
                  <AutocompleteElement<TFormValues>
                    name={`entities.${index}.icon`}
                    options={autocompleteOptions}
                    label="Overwrite icon"
                    matchId
                    autocompleteProps={{
                      filterOptions: createFilterOptions({
                        limit: 100,
                        stringify: (option) => `${option.label} ${option.aliases.join(' ')}`,
                      }),
                      fullWidth: true,

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
                    fullWidth
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
