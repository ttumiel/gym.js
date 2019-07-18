/**
 * Utilities and constants that are helpful for creating
 * environments that use Phaser.js
 */

/** The parent of the phaser canvas for rendering.  */
export const PHASER_PARENT = 'gym-environment';

/**
 * Validate the keyword arguments of a function.
 * @param kwargs - the keyword args
 * @param defaults - the expected defaults of the kwargs
 */
export function validateConfig(
  kwargs: { [index: string]: any },
  defaults: { [index: string]: any },
): { [index: string]: any } {
  Object.keys(kwargs).forEach(key => {
    if (!defaults.hasOwnProperty(key)) {
      console.warn(`Received unknown kwarg "${key}"`);
    }
  });

  Object.keys(defaults).forEach(key => {
    if (kwargs.hasOwnProperty(key)) {
      if (typeof kwargs[key] !== typeof defaults[key]) {
        console.warn(`kwarg "${key}" expects type "${typeof defaults[key]}" but got type "${typeof kwargs[key]}"`);
      }
    } else {
      kwargs[key] = defaults[key];
    }
  });

  return kwargs;
}

// A function that gets a headless phaser env to a canvas/tf.Tensor
