import {appSchema, tableSchema} from "@nozbe/watermelondb";
import { MapData } from "./models/MapData";
import { ImageChildData } from "./models/ImageChildData";

const schema = appSchema({
    version: 1,
    tables: [
        MapData.getSchema(),
        ImageChildData.getSchema()
    ],
});
export default schema;
