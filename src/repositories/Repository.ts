import Model from "./Model";

/**
 * Basic API response.
 */
export interface ResponseAPI
{
	success?: boolean,
	error?: string
}

/**
 * CRUD Repository interface.
 */
export default interface Repository<M extends Model>
{
	getAll(...args: any): Model[];
	get(id: number, ...args: any): Model;
	delete(model: Model, ...args: any): any;
	update(model: Model, ...args: any): any;
	add(model: Model, ...args: any): any;
}
