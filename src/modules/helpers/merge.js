export default function deepmerge(...objects) {
  let target = {};

  const merge = (obj) => {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (typeof obj[prop] === 'object') {
          target[prop] = deepmerge(target[prop], obj[prop]);
        } else {
          target[prop] = obj[prop];
        }
      }
    }
  };

  objects.forEach(object => merge(object));

  return target;
}
