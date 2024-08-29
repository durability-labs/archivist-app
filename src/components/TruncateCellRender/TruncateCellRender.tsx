export function TruncateCellRender(cid: string) {
  const truncated = cid.slice(0, 5) + ".".repeat(5) + cid.slice(-5);
  return <span>{truncated}</span>;
}
