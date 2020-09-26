export const diff = (oldValue: any, newValue: any) => {
  // console.log('diff oldValue', oldValue, 'newValue', newValue);
  if (oldValue === newValue) {
    return undefined; // oldValue and newValue are the same
  } else if (isEmpty(oldValue) && !isEmpty(newValue)) {
    return newValue;
  } else if (isString(oldValue) && isString(newValue)) {
    return diffString(oldValue, newValue);
  } else if (isNumber(oldValue) && isNumber(newValue)) {
    return diffNumber(oldValue, newValue);
  } else if (isBoolean(oldValue) && isBoolean(newValue)) {
    return diffBoolean(oldValue, newValue);
  } else if (isArray(oldValue) && isArray(newValue)) {
    return diffArray(oldValue, newValue);
  } else if (isObject(oldValue) && isObject(newValue)) {
    return diffObject(oldValue, newValue);
  } else {
    console.log('oldValue', oldValue);
    console.log('newValue', newValue);
    throw new Error(
      'parameters must be the same type (i.e. string, number, object, or array)'
    );
  }
};

export const diffString = (oldValue: string, newValue: string) => {
  // console.log('diff string oldValue', oldValue, 'newValue', newValue);
  // console.log(oldValue !== newValue ? newValue : undefined);
  return oldValue !== newValue ? newValue : undefined;
};

export const diffNumber = (oldValue: number, newValue: number) => {
  return oldValue !== newValue ? newValue : undefined;
};

export const diffBoolean = (oldValue: boolean, newValue: boolean) => {
  return oldValue !== newValue ? newValue : undefined;
};

export const diffObject = (oldValue: any, newValue: any) => {
  const result = Object.keys(newValue).reduce((result, key) => {
    const value = diff(oldValue[key], newValue[key]);
    if (value || isString(value) || isNumber(value) || isBoolean(value)) {
      result[key] = value;
    }
    return result;
  }, {} as any);
  // if empty object then return undefined (objects are the same)
  return isEmpty(result) ? undefined : result;
};

export const diffArray = (oldArray: any[], newArray: any[]) => {
  if (oldArray.length !== newArray.length) {
    // if array lengths are different then return newValue
    return newArray;
  }
  for (let i = 0; i < newArray.length; i++) {
    const value = diff(oldArray[i], newArray[i]);
    if (!isEmpty(value)) {
      // found something different in the array so return the newArray
      return newArray;
    }
  }
};

export const isEmpty = (value: any) => {
  // Check if value is falsy or object has no keys
  if (isNumber(value) || isBoolean(value)) {
    return value === undefined || value === null;
  } else if (isObject(value)) {
    return Object.keys(value).length === 0;
  } else {
    return !value;
  }
};

export const isBoolean = (value: any) => {
  return typeof value === 'boolean';
};

export const isNumber = (value: any) => {
  return typeof value === 'number';
};

export const isString = (value: any) => {
  return typeof value === 'string';
};

export const isArray = (array: any) => {
  return array instanceof Array;
};

export const isObject = (object: any) => {
  return object !== null && typeof object === 'object';
};
