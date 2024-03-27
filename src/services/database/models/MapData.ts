import {Model, Q, tableSchema} from "@nozbe/watermelondb";
import {field} from "@nozbe/watermelondb/decorators";
import {isNullOrEmpty} from "../../../utils/function";
import { database } from "../database";

export class MapData extends Model {
    static table = 'Map';
    // @ts-ignore
    @field('latitude') latitude;
    // @ts-ignore
    @field('longitude') longitude;
    // @ts-ignore
    @field('title') title;
    // @ts-ignore
    @field('description') description;
    // @ts-ignore
    @field('NumOfHouse') NumOfHouse;
    // @ts-ignore
    @field('ShopCode') ShopCode;
    // @ts-ignore
    @field('ProvinceId') ProvinceId;
    // @ts-ignore
    @field('DistrictId') DistrictId;
    // @ts-ignore
    @field('WardId') WardId;

    static getSchema() {
        return tableSchema({
            name: MapData.table,
            columns: [
                {name: 'latitude', type: 'number'},
                {name: 'longitude', type: 'number'},
                {name: 'title', type: 'string'},
                {name: 'description', type: 'string'},
                {name: 'NumOfHouse', type: 'string'},
                {name: 'ShopCode', type: 'string'},
                {name: 'ProvinceId', type: 'number'},
                {name: 'DistrictId', type: 'string'},
                {name: 'WardId', type: 'number'},

            ],
        });
    }

    // @ts-ignore
    static async getAll(limit) {
        // @ts-ignore
            // @ts-ignore
        const table = database.get<MapData>(MapData.table);
        const data: MapData[] = await table.query(
            Q.skip(0), // Apply the offset
            Q.take(20) // Apply the limit
        ).unsafeFetchRaw();
        return data;
    }

    static async getMapByShopCode(ShopCode: number) {
        // @ts-ignore
        const table = database.get<MapData>(MapData.table);
        return await table.query(
            Q.where("ShopCode", ShopCode),
        ).unsafeFetchRaw();
    }

    static async deleteAll() {
        // @ts-ignore
        const table = database.get<MapData>(MapData.table);
        const tasksToDelete = await table.query().fetch();
        if (tasksToDelete.length > 0) {
            for (const task of tasksToDelete) {
                database.write(async () => {
                    try {
                        await task.markAsDeleted();
                        await task.destroyPermanently();
                    } catch (error) {
                        console.error('Error deleting task:', error);
                    }
                })
            }
        }

    }

    static async insertOrUpdateAll(models: any[]): Promise<void> {
        // @ts-ignore
        const table = database.get<MapData>(MapData.table);
        database.write(async () => {
            for (const model of models) {
                const data = await table
                    .query(
                        Q.where('ShopCode', model.ShopCode)
                    ).fetch();
                if (data?.length > 0) {
                    // @ts-ignore
                    data[0].update(form => {
                        form.latitude = model.latitude;
                        form.longitude = model.longitude;
                        form.description = model.description
                        form.NumOfHouse = model.NumOfHouse;
                        form.ShopCode = model.ShopCode;
                        form.title = model.title;
                        form.ProvinceId = model.ProvinceId;
                        form.DistrictId = model.DistrictId;
                        form.WardId = model.WardId;
                    });
                    if (__DEV__)
                        console.log('Update Comment:', model);
                } else {
                    if (__DEV__)
                        console.log('Insert Comment:', model);
                    // @ts-ignore
                    table.create(field => {
                        field.latitude = model.latitude;
                        field.longitude = model.longitude;
                        field.ShopCode = model.ShopCode;
                        field.description = model.description
                        field.NumOfHouse = model.NumOfHouse;
                        field.title = model.title;
                        field.ProvinceId = model.ProvinceId;
                        field.DistrictId = model.DistrictId;
                        field.WardId = model.WardId;
                    });
                }
            }
        });
    }

}
