export default interface IState {
  entity_id: string
  state: string
  attributes: {
    friendly_name: string
  }
  last_changed: string
  last_updated: string
  context: {
    id: string
    parent_id: string | null
    user_id: string
  }
}
