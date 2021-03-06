// Link elements bound to click
export const linkClickSelector =
  'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]';

// Button elements bound to click
export const buttonClickSelector = {
  selector: 'button[data-remote]:not([form]), button[data-confirm]:not([form])',
  exclude: 'form button'
};

// Input elements bound to change
export const inputChangeSelector = 'select[data-remote], input[data-remote]';

// Input elements bound to input
export const inputInputSelector = 'input[data-remote] textarea[data-remote]';

// Form elements bound to submit
export const formSubmitSelector = 'form';

// Form input elements bound to click
export const formInputClickSelector =
  'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])';

// Form input elements disabled during form submission
export const formDisableSelector =
  'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled';

// Form input elements re-enabled after form submission
export const formEnableSelector =
  'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled';

// Form file input elements
export const fileInputSelector = 'input[name][type=file]:not([disabled])';

// Link onClick disable selector with possible reenable after remote submission
export const linkDisableSelector = 'a[data-disable-with], a[data-disable]';

// Button onClick disable selector with possible reenable after remote submission
export const buttonDisableSelector =
  'button[data-remote][data-disable-with], button[data-remote][data-disable]';

export const triggerSelector =
  'a[data-trigger], button[data-trigger], input[data-trigger], select[data-trigger], form[data-trigger], body[data-trigger]';
