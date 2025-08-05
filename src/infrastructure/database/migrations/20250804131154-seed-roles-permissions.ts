import { QueryInterface } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export const up = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}) => {
  const now = new Date();

  // Roles
  const adminRoleId = uuidv4();
  const userRoleId = uuidv4();

  await queryInterface.sequelize.query(`
  INSERT INTO roles (role_id, name, created_at, updated_at)
  VALUES 
    ('${adminRoleId}', 'Admin', NOW(), NOW()),
    ('${userRoleId}', 'User', NOW(), NOW())
  ON CONFLICT (name) DO NOTHING;
`);

  // Permissions
  const permissions = [
    { name: 'view_users' },
    { name: 'create_users' },
    { name: 'update_users' },
    { name: 'delete_users' },
  ].map((p) => ({
    permission_id: uuidv4(),
    name: p.name,
    created_at: now,
    updated_at: now,
  }));

  await queryInterface.bulkInsert('permissions', permissions);

  // Link Admin to all permissions
  const rolePermissions = permissions.map((p) => ({
    role_id: adminRoleId,
    permission_id: p.permission_id,
  }));

  await queryInterface.bulkInsert('role_permissions', rolePermissions);
};

export const down = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}) => {
  const tableExists = await queryInterface.sequelize.query(`
    SELECT to_regclass('public.role_permissions') IS NOT NULL AS exists;
  `);

  const exists = (tableExists[0] as Array<{ exists: boolean }>)[0]?.exists;

  if (!exists) {
    console.log('⚠️ role_permissions não existe, ignorando down da seed.');
    return;
  }

  if (exists) {
    await queryInterface.bulkDelete('role_permissions', {});
    await queryInterface.bulkDelete('permissions', {});
    await queryInterface.bulkDelete('roles', {});
  }
};
