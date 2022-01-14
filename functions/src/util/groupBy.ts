// Kindly stolen from: https://stackoverflow.com/a/38327540

function groupBy<V, K>(list: V[], keyGetter: (input: V) => K): Map<K, V[]> {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

export default groupBy;
