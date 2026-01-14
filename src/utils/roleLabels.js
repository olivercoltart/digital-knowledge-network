const ROLE_LABELS = {
  CONSULTANT: "Consultant",
  CHAMPION: "Knowledge Champion",
  COUNCIL: "Knowledge Governance Council",
  DATA_OFFICER: "Data Officer"
};

export function getRoleLabel(role) {
  return ROLE_LABELS[role] || role;
}
