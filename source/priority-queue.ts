import {Queue, RunFunction} from './queue';
import lowerBound from './lower-bound';
import {QueueAddOptions} from './options';

export interface PriorityQueueOptions extends QueueAddOptions {
	priority?: number;
}
// 内建的queue class，可以对外界所替换
export default class PriorityQueue implements Queue<RunFunction, PriorityQueueOptions> {
	private readonly _queue: Array<PriorityQueueOptions & {run: RunFunction}> = [];
	// 代理了一层，方便对索引进行处理
	enqueue(run: RunFunction, options?: Partial<PriorityQueueOptions>): void {
		options = {
			priority: 0,
			...options
		};

		const element = {
			priority: options.priority,
			run
		};

		if (this.size && this._queue[this.size - 1].priority! >= options.priority!) {
			// 正常情况下，push到队列尾部即可
			this._queue.push(element);
			return;
		}

		const index = lowerBound(
			this._queue, element,
			(a: Readonly<PriorityQueueOptions>, b: Readonly<PriorityQueueOptions>) => b.priority! - a.priority!
		);
		this._queue.splice(index, 0, element);
	}

	dequeue(): RunFunction | undefined {
		// 正确情况下，出队列即可
		const item = this._queue.shift();
		// 同时执行其run函数
		return item?.run;
	}

	filter(options: Readonly<Partial<PriorityQueueOptions>>): RunFunction[] {
		return this._queue.filter(
			(element: Readonly<PriorityQueueOptions>) => element.priority === options.priority
		).map((element: Readonly<{ run: RunFunction }>) => element.run);
	}

	get size(): number {
		return this._queue.length;
	}
}
