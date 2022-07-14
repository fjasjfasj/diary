const date = new Date();

export const today = {
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  date: date.getDate(),
};
