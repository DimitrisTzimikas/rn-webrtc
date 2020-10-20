const mapHash = (hash, func) => {
  const array = [];

  for (const key in hash) {
    if (hash.hasOwnProperty(key)) {
      const obj = hash[key];

      array.push(func(obj, key));
    }
  }

  return array;
};

export {mapHash};
