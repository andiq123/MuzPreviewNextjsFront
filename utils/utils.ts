const LIMIT_CHARS = 40;

export const trimIfTooLong = (str: string, limit: number = LIMIT_CHARS) =>
  str.length > limit ? `${str.substring(0, limit)}...` : str;
