export const json = (param: any): any => {
    return JSON.stringify(
      param,
      (_key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
    );
  };

