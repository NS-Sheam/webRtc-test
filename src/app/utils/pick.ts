const pick = <T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Pick<T, K> => {
    return keys.reduce((acc, key) => {
      if (obj[key]) {
        acc[key] = obj[key];
      }
      return acc;
    }, {} as Pick<T, K>);
  };
  

  export default pick;