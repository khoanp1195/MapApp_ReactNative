import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import {appSchema, Database} from "@nozbe/watermelondb";
import schema from "./schema";
import { MapData } from "./models/MapData";
import { ImageChildData } from "./models/ImageChildData";

const adapter = new SQLiteAdapter({
    schema:schema,
    dbName: 'myDatabase',
});
// @ts-ignore
export const database = new Database({
    adapter: adapter,
    modelClasses: [
        MapData,
        ImageChildData
    ],
    // @ts-ignore
    actionsEnabled: true,
})
