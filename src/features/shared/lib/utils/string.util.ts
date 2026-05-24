export const randomUuid = (): string => {
  return crypto.randomUUID();
};

export const randomInputId = (): string => {
  return `input-${randomUuid().split('-')[0]}`;
};
