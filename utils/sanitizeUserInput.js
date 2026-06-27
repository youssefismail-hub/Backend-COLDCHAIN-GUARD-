const ALLOWED_PUBLIC_ROLES = ["user", "driver"];
const ALLOWED_ADMIN_ROLES = ["admin", "user", "driver"];

function pickUserFields(body, { allowRole = false, isAdmin = false } = {}) {
  const data = {};

  if (body.name !== undefined) data.name = body.name;
  if (body.email !== undefined) data.email = body.email;
  if (body.password !== undefined) data.password = body.password;
  if (body.confirm_password !== undefined) data.confirm_password = body.confirm_password;
  if (body.company !== undefined) data.company = body.company;

  if (allowRole && body.role !== undefined) {
    const roles = isAdmin ? ALLOWED_ADMIN_ROLES : ALLOWED_PUBLIC_ROLES;
    data.role = roles.includes(body.role) ? body.role : "user";
  }

  return data;
}

module.exports = { pickUserFields, ALLOWED_PUBLIC_ROLES };
