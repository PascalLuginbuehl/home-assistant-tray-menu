import React from 'react';
import {
  DragDropContext, Droppable, Draggable, OnDragEndResponder,
} from 'react-beautiful-dnd';
import { useFieldArray } from 'react-hook-form-mui';
import {
  List, ListItem, ListItemText, alpha,
} from '@mui/material';
import type { TFormValues } from './app';

export default function SwitchManager() {
  const {
    fields, move,
  } = useFieldArray<TFormValues>({
    name: 'entities',
  });

  const handleDrag: OnDragEndResponder = ({ source, destination }) => {
    if (destination) {
      move(source.index, destination.index);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <List
        dense
        sx={(theme) => ({
          '& .MuiListItem-container:hover': {
            backgroundColor: alpha(theme.palette.text.primary, theme.palette.action.hoverOpacity),
            '&:last-child': {
              backgroundColor: 'inherit',
            },
          },
        })}
      >
        <Droppable droppableId="test-items">
          {(providedOuter) => (
            <div
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...providedOuter.droppableProps}
              ref={providedOuter.innerRef}
            >
              {fields.map((item, index) => (
                <Draggable
                  key={`test[${item.entity_id}]`}
                  draggableId={`item-${item.entity_id}`}
                  index={index}
                >
                  {(provided) => (
                    <ListItem
                      dense
                      key={item.entity_id}
                      ref={provided.innerRef}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...provided.draggableProps}
                    >
                      <ListItemText
                        primary={item.entity_id}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...provided.dragHandleProps}
                      />
                    </ListItem>
                  )}
                </Draggable>
              ))}

              {providedOuter.placeholder}
            </div>
          )}
        </Droppable>
      </List>
    </DragDropContext>
  );
}
