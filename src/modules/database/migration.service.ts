import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import migrations from './migrations';

@Injectable()
export class MigrationService implements OnApplicationBootstrap {
  constructor(
    @InjectModel('Migration') private model: Model<any>,
    @InjectConnection() private dbConnection: Connection,
  ) {}

  async onApplicationBootstrap(): Promise<any> {
    console.log(`Checking for migrations...`);
    for (let migration of migrations) {
      let { name, condition, execute } = migration;

      // If migration is not registered as complete in the db
      if ((await this.model.findOne({ name })) == undefined) {
        // If no condition or if condition is met
        if (!condition || (await condition(this.dbConnection))) {
          console.log('Executing migration ' + name);
          if (await execute(this.dbConnection)) {
            console.log('Migration ' + name + ' executed successfully');
            // If execute returns true, mark the migration as complete on the database
            await this.model.create({ name });
          } else {
            console.log(
              'Migration ' + name + ' did was executed but not return true',
            );
          }
        }
      }
    }
  }
}
