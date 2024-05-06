import { Model, Q, tableSchema } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";
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
    // @ts-ignore
    @field('Rating') Rating;
    // @ts-ignore
    @field('Note') Note;
    // @ts-ignore
    @field('Image') Image;
    // @ts-ignore
    @field('Category') Category;

    static getSchema() {
        return tableSchema({
            name: MapData.table,
            columns: [
                { name: 'latitude', type: 'number' },
                { name: 'longitude', type: 'number' },
                { name: 'title', type: 'string' },
                { name: 'description', type: 'string' },
                { name: 'NumOfHouse', type: 'string' },
                { name: 'ShopCode', type: 'string' },
                { name: 'ProvinceId', type: 'number' },
                { name: 'DistrictId', type: 'string' },
                { name: 'WardId', type: 'number' },
                { name: 'Rating', type: 'string' },
                { name: 'Note', type: 'string' },
                { name: 'Image', type: 'string' },
                { name: 'Category', type: 'string' },
            ],
        });
    }

    // @ts-ignore
    static async getAll(limit, offset) {
        // @ts-ignore
        const table = database.get<MapData>(MapData.table);
        const data: MapData[] = await table.query(
            Q.skip(offset),
            Q.take(limit)
        ).unsafeFetchRaw();
        return data;
    }

    // @ts-ignore
    static async getDataBasePosition(latitude, longitude, limit, offset) {
        try {
            // Get a reference to the table
            const table = database.get<MapData>(MapData.table);

            // Calculate the range of latitude and longitude values to query
            const latitudeRange = [latitude - 0.1, latitude + 0.1]; // Adjust the range as needed
            const longitudeRange = [longitude - 0.1, longitude + 0.1]; // Adjust the range as needed

            // Perform the query to fetch data within the specified range
            const data = await table.query(
                // Query conditions based on latitude and longitude range
                Q.where('latitude', Q.between(latitudeRange[0], latitudeRange[1])),
                Q.where('longitude', Q.between(longitudeRange[0], longitudeRange[1])),
                Q.skip(offset),
                Q.take(limit)
            ).unsafeFetchRaw();

            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error; // Re-throw the error for handling in the caller function
        }
    }


    static async getMapByShopCode(ShopCode: number) {
        // @ts-ignore
        const table = database.get<MapData>(MapData.table);
        return await table.query(
            Q.where("ShopCode", ShopCode),
        ).unsafeFetchRaw();
    }

    static async getMapByShopName(ShopName: string) {
        // @ts-ignore
        const table = database.get<MapData>(MapData.table)
        return await table.query(
            Q.where("title", ShopName),).unsafeFetchRaw();
    }

    static async deleteAll() {
        // @ts-ignore
        const table = database.get<MapData>(MapData.table);
        const tasksToDelete = await table.query().fetch();
        if (tasksToDelete.length > 0) {
            for (const task of tasksToDelete) {
                database.write(async () => {
                    try {
                        // await task.markAsDeleted();
                        await task.destroyPermanently();
                    } catch (error) {
                        console.error('Error deleting task:', error);
                    }
                })
            }
        }

    }
    static deleteItemByShopCode = async (shopCode: any) => {
        try {
            // Get the table
            const table = database.get(MapData.table);

            // Query for the item with the specified shopCode
            const itemToDelete = await table.query(Q.where('ShopCode', shopCode)).fetch();

            // Check if the item exists
            if (itemToDelete.length > 0) {
                // Loop through each item and delete it
                for (const item of itemToDelete) {
                    await database.write(async () => {
                        try {
                            // Delete the item permanently
                            await item.destroyPermanently();
                            console.log(`Item with shopCode ${shopCode} has been deleted.`);
                        } catch (error) {
                            console.error('Error deleting item:', error);
                        }
                    });
                }
            } else {
                console.log(`Item with shopCode ${shopCode} not found.`);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };


    // static deleteAllRecords = async () => {
    //     try {
    //       await collection.query().destroy();
    //       console.log('All records in YourCollection deleted permanently.');
    //     } catch (error) {
    //       console.error('Error deleting records:', error);
    //     }
    //   };

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
                        form.Rating = model.Rating;
                        form.Note = model.Note;
                        form.Image = model.Image
                        form.Category = model.Category

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
                        field.Rating = model.Rating
                        field.Note = model.Note
                        field.Image = model.Image
                        field.Category = model.Category

                    });
                }
            }
        });
    }


    static async addNewItem(item: any): Promise<void> {
        try {
            const table = database.get<MapData>(MapData.table);
            await database.write(async () => {
                await table.create((newItem) => {
                    newItem.latitude = item.latitude;
                    newItem.longitude = item.longitude;
                    newItem.title = item.title;
                    newItem.description = item.description || 'Description of the new shop';
                    newItem.NumOfHouse = item.NumOfHouse || '';
                    newItem.ProvinceId = item.ProvinceId || '';
                    newItem.DistrictId = item.DistrictId || '';
                    newItem.WardId = item.WardId || '';
                    newItem.Rating = item.Rating || '';
                    newItem.ShopCode = item.ShopCode || ''; // Make sure it's unique
                    newItem.Image = item.Image
                    newItem.Category = item.Category

                });
            });
            console.log('New item added successfully');
        } catch (error) {
            console.error('Error adding new item:', error);
        }
    }


}
