import { Model, Q, tableSchema } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";
import { database } from "../database";

export class ImageChildData extends Model {
    static table = 'ImageChildData';
    // @ts-ignore
    @field('title') title;
    // @ts-ignore
    @field('ShopCode') ShopCode;
    // @ts-ignore
    @field('Image') Image;


    static getSchema() {
        return tableSchema({
            name: ImageChildData.table,
            columns: [
                { name: 'title', type: 'string' },
                { name: 'ShopCode', type: 'string' },
                { name: 'Image', type: 'string' },
            ],
        });
    }

    // @ts-ignore
    static async getAll(limit, offset) {
        // @ts-ignore
        const table = database.get<ImageChildData>(ImageChildData.table);
        const data: ImageChildData[] = await table.query(
            Q.skip(offset),
            Q.take(limit)
        ).unsafeFetchRaw();
        return data;
    }

    // @ts-ignore
    static async getDataBasePosition(latitude, longitude, limit, offset) {
        try {
            // Get a reference to the table
            const table = database.get<ImageChildData>(ImageChildData.table);

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
        const table = database.get<ImageChildData>(ImageChildData.table);
        return await table.query(
            Q.where("ShopCode", ShopCode),
        ).unsafeFetchRaw();
    }

    static async getMapByShopName(ShopName: string) {
        // @ts-ignore
        const table = database.get<ImageChildData>(ImageChildData.table)
        return await table.query(
            Q.where("title", ShopName),).unsafeFetchRaw();
    }

    static async deleteAll() {
        // @ts-ignore
        const table = database.get<ImageChildData>(ImageChildData.table);
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
            const table = database.get(ImageChildData.table);

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
        const table = database.get<ImageChildData>(ImageChildData.table);
        database.write(async () => {
            for (const model of models) {
                const data = await table
                    .query(
                        Q.where('ShopCode', model.ShopCode)
                    ).fetch();
                if (data?.length > 0) {
                    // @ts-ignore
                    data[0].update(form => {
                        form.ShopCode = model.ShopCode;
                        form.title = model.title;
                        form.Image = model.Image

                    });
                    if (__DEV__)
                        console.log('Update Comment:', model);
                } else {
                    if (__DEV__)
                        console.log('Insert Comment:', model);
                    // @ts-ignore
                    table.create(field => {
                        field.ShopCode = model.ShopCode;
                        field.title = model.title;
                        field.Image = model.Image
                    });
                }
            }
        });
    }


    static async addNewItem(item: any): Promise<void> {
        try {
            const table = database.get<ImageChildData>(ImageChildData.table);
            await database.write(async () => {
                await table.create((newItem: any) => {
                    newItem.title = item.title;
                    newItem.ShopCode = item.ShopCode || ''; // Make sure it's unique
                    newItem.Image = item.Image
                });
            });
            console.log('New item added successfully');
        } catch (error) {
            console.error('Error adding new item:', error);
        }
    }


}
