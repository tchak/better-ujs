import { getData, setData } from '../utils/dom';
import { fire } from '../utils/event';

export function handleSetData({ detail }) {
  const element = this;
  let data = getData(element, 'ujs:page-data');
  if (data !== detail) {
    setData(element, 'ujs:page-data', detail);
    fire(element, 'data:change', detail);
  }
}
