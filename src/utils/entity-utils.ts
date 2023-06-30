import IState from '../types/state';
import { IEntityConfig } from '../store';

export default class EntityUtils {
  public static getEntityName(entity: IEntityConfig, state: IState | null): string {
    if (entity.label) {
      return entity.label;
    }

    if (state?.attributes.friendly_name) {
      return state.attributes.friendly_name;
    }

    return entity.entity_id;
  }

  public static getState(entity: IEntityConfig, states: IState[]): IState | null {
    const foundState = states.find((state) => state.entity_id === entity.entity_id);

    if (foundState) {
      return foundState;
    }

    return null;
  }
}
