import { fire, stopEverything } from '../utils/event';
import { queryAll } from '../utils/dom';

export function handleTrigger(event) {
  const element = this;
  const onEventName = element.getAttribute('data-on') || 'click';
  if (event.type === onEventName) {
    stopDefaultEvent(event, element);
    const eventName = element.getAttribute('data-trigger');
    const target = element.getAttribute('data-target');
    const param = element.getAttribute('data-param');
    fireTriggerEvent(element, eventName, target, param);
  }
}

function stopDefaultEvent(event, element) {
  const preventDefault = element.getAttribute('data-prevent-default');
  if (preventDefault !== 'false') {
    stopEverything(event);
  }
}

function fireTriggerEvent(element, eventName, target, param) {
  if (target) {
    queryAll(target).forEach(target => fire(target, eventName, param));
  } else {
    fire(element, eventName, param);
  }
}
