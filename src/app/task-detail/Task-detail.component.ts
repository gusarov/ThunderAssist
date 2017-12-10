import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../task';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TaskService } from '../task.service';
import { parseHttpResponse } from 'selenium-webdriver/http';

@Component({
	selector: 'app-task-detail',
	templateUrl: './task-detail.component.html',
	styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {

	@Input() task: Task;

	constructor(
		private route: ActivatedRoute,
		private taskService: TaskService,
		private location: Location
	) {}

	ngOnInit() {
		this.getTask();
	}

	getTask(): void {
		const id = this.route.snapshot.paramMap.get('id');
		if (id != null) {
			const nid = parseInt(id, undefined);
			this.taskService.getTask(nid)
				.subscribe(task => this.task = task);
		}
	}
	goBack(): void {
		this.location.back();
	}
	save(): void {
		this.taskService.updateTask(this.task)
			.subscribe(() => this.goBack());
	}
}
