import { DataTypes } from 'sequelize';

export const personSchemaFields = {
  person_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  person_type: {
    type: DataTypes.ENUM('física', 'jurídica'),
    allowNull: false,
  },
  document_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  company_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
};
