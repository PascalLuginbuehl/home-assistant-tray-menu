import {
  Box, IconButton, ListItem, ListItemText,
} from '@mui/material';
import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import {
  TextFieldElement, useWatch,
} from 'react-hook-form-mui';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { IEntityConfig } from '../../store';
import IState from '../../interfaces/IState';
import type { TFormValues } from '../entities-form';
import EntityUtils from '../../utils/entity-utils';

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

  const [editing, setEditing] = useState<boolean>(false);

  const entity = useWatch<TFormValues, `entities.${number}`>({ name: `entities.${index}` });

  return (
    <Draggable
      draggableId={`item-${entity.entity_id}`}
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
                <ListItemText
                  primary={EntityUtils.getEntityName(entity, state)}
                />
              ) : (
                <TextFieldElement<TFormValues> name={`entities.${index}.label`} label={state?.attributes.friendly_name ?? entity.entity_id} />
              )
            }
        </ListItem>
      )}
    </Draggable>
  );
}
