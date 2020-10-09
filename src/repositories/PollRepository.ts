import axios, {AxiosResponse} from "axios";
import Repository, {ResponseAPI} from "./Repository";
import Model from "./Model";

export interface Poll extends Model
{
	id: number,
	question: string,
	entries: PollEntry[],
	users: PollUser[],
	isVoted: boolean,
}

export interface PollEntry
{
	value: string,
	voteCount: number
}

export interface PollUser
{
	ip: string
}

export interface PollGetAPI extends ResponseAPI
{
	poll: Poll
}

export interface PollCreateAPI extends ResponseAPI
{
	poll: Poll
}

/**
 * Repository for managing Polls
 */
export default class PollRepository implements Repository<Poll>
{
	private static instance: PollRepository;

	/**
	 * Singleton poll repository.
	 * @private
	 */
	private constructor() { }

	/**
	 * Get the singleton instance.
	 */
	public static getInstance(): PollRepository
	{
		if (!PollRepository.instance)
			PollRepository.instance = new PollRepository();
		return PollRepository.instance;
	}

	/**
	 * Get a poll by ID.
	 * @param id - The poll ID.
	 */
	public async get(id: number | string): Promise<PollGetAPI | null>
	{
		try
		{
			const response: AxiosResponse<PollGetAPI> = await axios.post(
				`${process.env.REACT_APP_BACKEND_HOST}/api/poll/${id}`);
			return response.data;
		}
		catch (e)
		{
			console.log(e);
		}
		return null;
	};

	/**
	 * Create a poll.
	 * @param model - The poll model.
	 */
	public async add(model: Poll): Promise<PollCreateAPI | null>
	{
		try
		{
			const response: AxiosResponse<PollCreateAPI> = await axios.post(
				`${process.env.REACT_APP_BACKEND_HOST}/api/poll/create`, {
				question: model.question,
				entries: model.entries
			});
			return response.data;
		}
		catch (e)
		{
			console.log(e);
		}
		return null;
	}

	/**
	 * Update the poll.
	 * @param model - The poll model.
	 * @param entryId - The entry id to vote.
	 */
	public async update(model: Poll, entryId: string | number): Promise<PollCreateAPI | null>
	{
		try
		{
			const response: AxiosResponse<PollCreateAPI> = await axios.post(
				`${process.env.REACT_APP_BACKEND_HOST}/api/poll/${model.id}/${entryId}`);
			return response.data;
		}
		catch (e)
		{
			console.log(e);
		}
		return null;
	}

	public delete(model: Poll): boolean
	{
		throw new Error("Method not implemented.");
	}

	public getAll(): Poll[]
	{
		throw new Error("Method not implemented.");
	}
}
