export interface FilterOptions {
  fields: string[],
  separator: string
}

export const createFilterPredicate = (options: FilterOptions) => {
  const { fields, separator } = options;

  return (row: any, filters: string) => {
    const filtersArray: string[] = filters.split(separator);

    const matchFilter: boolean[] = fields.map((fieldName, index) => {
      const filter: string  = filtersArray[index];
      const columnName: string = row[fieldName];

      return columnName.toLowerCase().includes(filter);
    });

    return matchFilter.every(Boolean);
  }
}
