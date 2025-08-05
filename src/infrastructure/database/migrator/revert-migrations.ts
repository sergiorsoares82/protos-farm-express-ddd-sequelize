// scripts/revert-migrations.ts
import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';
import { sequelize } from '../sequelize';

// 2. Configuração do Umzug
const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, '../migrations/*.ts'), // ajuste para o caminho das suas migrations
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

async function revertMigrations() {
  const target = process.argv[2]; // argumento opcional

  try {
    if (!target) {
      console.log('Revertendo a ÚLTIMA migração...');
      await umzug.down();
    } else if (target === 'all') {
      console.log('Revertendo TODAS as migrações...');
      await umzug.down({ to: 0 });
    } else {
      console.log(`Revertendo até a migração: ${target} ...`);
      await umzug.down({ to: target });
    }

    console.log('Migrações revertidas com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao reverter migrações:', err);
    process.exit(1);
  }
}

revertMigrations();
