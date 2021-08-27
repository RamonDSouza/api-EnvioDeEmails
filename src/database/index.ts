import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (): Promise<Connection> =>{
  const defautOptions = await getConnectionOptions();
  
  return createConnection(
    Object.assign(defautOptions, {
      database: process.env.NODE_ENV === 'test' 
      ? "./src/database/database.test.sqlite" 
      : defautOptions.database,
    })
  );
}