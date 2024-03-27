import {appSchema, tableSchema} from "@nozbe/watermelondb";
import { MapData } from "./models/MapData";

const schema = appSchema({
    version: 1,
    tables: [
        MapData.getSchema()
    ],
});
export default schema;
