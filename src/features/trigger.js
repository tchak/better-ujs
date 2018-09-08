import { fire, stopEverything } from '../utils/event';
import { find } from '../utils/dom';

export function handleTrigger(e) {
  const element = this;
  const eventName = element.getAttribute('data-on') || 'click';
  if (e.type === eventName) {
    stopEverything(e);
    const triggerEventName = element.getAttribute('data-trigger');
    const target = element.getAttribute('data-target');
    const param = element.getAttribute('data-param');
    if (target) {
      find(target).forEach(target => fire(target, triggerEventName, param));
    } else {
      fire(element, triggerEventName, param);
    }
  }
}
