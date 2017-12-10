import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Task } from './task';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class TaskService {
	private tasksUrl = 'api/tasks';  // URL to web api

	constructor(private http: HttpClient, private messageService: MessageService) { }

	getTasks(): Observable<Task[]> {
		this.messageService.add('TaskService: fetched tasks');
		return this.http.get<Task[]>(this.tasksUrl)
			.pipe(
				tap(tasks => this.log(`fetched tasks`)),
				catchError(this.handleError('getTasks', []))
			)
			;
	}

	private handleError<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error); // log to console instead
			this.log(`${operation} failed: ${error.message}`);
			return of(result as T);
		};
	}

	getTask(id: number): Observable<Task> {
		const url = `${this.tasksUrl}/${id}`;
		return this.http.get<Task>(url).pipe(
			tap(_ => this.log(`fetched task id=${id}`)),
			catchError(this.handleError<Task>(`getTask id=${id}`))
		);
	}

	private log(message: string) {
		this.messageService.add('TaskService: ' + message);
	}

	/** PUT: update the task on the server */
	updateTask (task: Task): Observable<any> {
		return this.http.put(this.tasksUrl, task, httpOptions).pipe(
			tap(_ => this.log(`updated task id=${task.id}`)),
			catchError(this.handleError<any>('updateTask'))
		);
	}

	/** POST: add a new task to the server */
	addTask (task: Task): Observable<Task> {
		return this.http.post<Task>(this.tasksUrl, task, httpOptions).pipe(
			tap((task: Task) => this.log(`added task w/ id=${task.id}`)),
			catchError(this.handleError<Task>('addTask'))
		);
	}

	/** DELETE: delete the task from the server */
	deleteTask (task: Task | number): Observable<Task> {
		const id = typeof task === 'number' ? task : task.id;
		const url = `${this.tasksUrl}/${id}`;

		return this.http.delete<Task>(url, httpOptions).pipe(
			tap(_ => this.log(`deleted task id=${id}`)),
			catchError(this.handleError<Task>('deleteTask'))
		);
	}

	/* GET tasks whose name contains search term */
	searchTasks(term: string): Observable<Task[]> {
		if (!term.trim()) {
		// if not search term, return empty task array.
		return of([]);
		}
		return this.http.get<Task[]>(`api/tasks/?name=${term}`).pipe(
		tap(_ => this.log(`found tasks matching "${term}"`)),
		catchError(this.handleError<Task[]>('searchTasks', []))
		);
	}
}
