export type Classname = [string, boolean?];

export const classnames = (...classnames: Classname[]) =>
  classnames
    .filter(([, visible = true]) => visible)
    .map(([name]) => name)
    .join(" ");
