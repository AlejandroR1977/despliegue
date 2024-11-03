export const json = (param: any): any => {
  return JSON.stringify(
    param,
    (_, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
  );
};

