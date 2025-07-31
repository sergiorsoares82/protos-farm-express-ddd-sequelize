import { Sequelize } from 'sequelize-typescript';
import sequelizeOptions from '../../interfaces/_shared/config';

export const sequelize = new Sequelize({ ...sequelizeOptions });
