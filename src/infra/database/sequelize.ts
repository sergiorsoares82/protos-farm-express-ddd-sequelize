import { Sequelize } from 'sequelize-typescript';
import sequelizeOptions from '../../interface/_shared/config';

export const sequelize = new Sequelize({ ...sequelizeOptions });
