import knex from '../database/connection';
import { Request, Response } from 'express'

class PointsController {
    async create(req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;

        const point = {
            image: `uploads/${req.file.filename}`,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        const trx = await knex.transaction();

        const returned_ids = await trx('points').insert(point);
        const point_id = returned_ids[0];
        const point_items = items
        .split(',')
        .map((item: string) => Number(item.trim()))
        .map((item_id: number) => {
            return {
                item_id,
                point_id: point_id,
            }
        })
        await trx('point_items').insert(point_items)
        await trx.commit();
        return res.json({id: point_id, ...point})
    }
    async show(req: Request, res: Response){
        const {id} = req.params;
        const point = await knex('points').where('id', id).first();
        if(!point){
            return res.status(400).json({message: 'Not found'})
        }
        const items = await knex('items')
        .join('point_items', 'items.id', '=' , 'point_items.item_id')
        .where('point_items.point_id', point.id)
        point.items = items;
        return res.json({point})
    }
    async index(req: Request, res: Response) {
        const { city, uf, items } = req.query;
        const parsedItems = String(items).split(',').map(item => Number(item.trim()));
        const points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .where('city', 'like', String(`%${city}%`))
        .where('uf', 'like', String(`%${uf}%`))
        .whereIn('point_items.item_id', parsedItems)
        .distinct()
        .select('points.*')
        return res.json(points)
    }
}
export default PointsController;