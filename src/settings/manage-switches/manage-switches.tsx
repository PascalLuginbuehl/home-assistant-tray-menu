import React from 'react';
import {
  DragDropContext, Droppable, OnDragEndResponder,
} from 'react-beautiful-dnd';
import { AutocompleteElement, useController, useFieldArray } from 'react-hook-form-mui';
import {
  Box,
  List, alpha,
} from '@mui/material';
import type { TFormValues } from '../entities-form';
import FormOnFieldChange from '../form/FormOnFieldChange';
import type IState from '../../interfaces/IState';
import DraggableListItem from './draggable-list-item';
import EntityUtils from '../../utils/entity-utils';
// import mockState from './mock-state';

interface ManageSwitchesProps {
  states: IState[]
}

export default function ManageSwitches(props: ManageSwitchesProps) {
  const { states } = props;
  const {
    field: { onChange: setSelectFieldValue },
  } = useController<TFormValues>({ name: 'selectSwitch' });

  const {
    fields, move, append, remove,
  } = useFieldArray<TFormValues>({
    name: 'entities',
  });

  const handleDrag: OnDragEndResponder = ({ source, destination }) => {
    if (destination) {
      move(source.index, destination.index);
    }
  };

  const filteredOptions = states.filter((state) => fields.find((field) => state.entity_id === field.entity_id) === undefined);

  // mockState.map((e) => ({ id: e.entity_id, label: e.attributes.friendly_name }))
  const filteredOptions2 = filteredOptions.map((e) => ({ id: e.entity_id, label: e.attributes.friendly_name }));

  return (
    <>
      <DragDropContext onDragEnd={handleDrag}>
        <List
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
              <Box
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...providedOuter.droppableProps}
                ref={providedOuter.innerRef}
              >
                {fields.map((entity, index) => (
                  <DraggableListItem key={`test[${entity.entity_id}]`} entity={entity} index={index} state={EntityUtils.getState(entity, states)} onRemove={() => remove(index)} />
                ))}
                {providedOuter.placeholder}
              </Box>
            )}
          </Droppable>
        </List>
      </DragDropContext>

      <FormOnFieldChange<TFormValues>
        fields={['selectSwitch']}
        onChange={([value]) => {
          if (value === null) {
            return;
          }

          append({ entity_id: value as string, label: null });

          setSelectFieldValue(null);
        }}
      />
      <AutocompleteElement<TFormValues>
        name="selectSwitch"
        options={filteredOptions2}
        textFieldProps={{ fullWidth: true }}
        matchId
        autocompleteProps={{ fullWidth: true }}
      />
    </>
  );
}
