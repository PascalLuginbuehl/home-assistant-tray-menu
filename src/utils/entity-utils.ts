import IState, { LightAttributes, SwitchAttributes } from '../types/state';
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

  public static isSwitchType(state: IState): state is IState<SwitchAttributes> {
    if (state.entity_id.startsWith('switch.')) {
      return true;
    }

    return false;
  }

  public static isLightType(state: IState): state is IState<LightAttributes> {
    if (state.entity_id.startsWith('light.')) {
      return true;
    }

    return false;
  }
}
