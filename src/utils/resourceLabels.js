export const RESOURCE_TYPE_LABELS = {
  PROJECT_DOCUMENTATION: "Project Documentation",
  CLIENT_DATA: "Client Data",
  TECHNICAL_RESOURCE: "Technical Resource"
};

export function getResourceTypeLabel(value) {
  return RESOURCE_TYPE_LABELS[value] || value;
}
