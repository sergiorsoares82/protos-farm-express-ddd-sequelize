// scripts/migrations.ts
import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';
import { sequelize } from '../sequelize';

const umzug = new Umzug({
  migrations: { glob: path.join(__dirname, '../migrations/*.ts') },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

async function main() {
  const [command, arg] = process.argv.slice(2); // exemplo: revert all

  try {
    switch (command) {
      case 'revert':
        if (!arg) {
          console.log('Revertendo a última migração...');
          await umzug.down();
        } else if (arg === 'all') {
          console.log('Revertendo TODAS as migrações...');
          await umzug.down({ to: 0 });
        } else {
          console.log(`Revertendo até a migração ${arg}...`);
          await umzug.down({ to: arg });
        }
        break;

      case 'redo':
        if (arg === 'all') {
          console.log('Revertendo TODAS as migrações...');
          await umzug.down({ to: 0 });
          console.log('Reaplicando TODAS as migrações...');
          await umzug.up();
        } else {
          console.log('Revertendo a última migração...');
          await umzug.down();
          console.log('Reaplicando a última migração...');
          await umzug.up();
        }
        break;

      case 'up':
        if (arg === 'all') {
          console.log('Aplicando TODAS as migrações pendentes...');
          await umzug.up();
        } else {
          console.log('Aplicando a próxima migração pendente...');
          await umzug.up({ to: arg });
        }
        break;

      default:
        console.log(`
Uso:
  npm run migrations revert             # desfaz a última
  npm run migrations revert all        # desfaz todas
  npm run migrations revert <nome>     # desfaz até uma específica
  npm run migrations redo              # refaz a última
  npm run migrations redo all          # refaz todas
  npm run migrations up                # aplica a próxima pendente
  npm run migrations up all            # aplica todas as pendentes
        `);
        break;
    }

    console.log('Operação concluída com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao executar migrações:', err);
    process.exit(1);
  }
}

main();
