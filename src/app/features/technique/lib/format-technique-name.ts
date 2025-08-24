export const formatTechniqueName = (value: string) => {
  if (value === "none") return "None"
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}