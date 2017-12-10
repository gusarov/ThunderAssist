import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';
import { BulbComponent } from './bulb/bulb.component';
import { TasksComponent } from './tasks/tasks.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskService } from './task.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskSearchComponent } from './task-search/task-search.component';

@NgModule({
	declarations: [
		AppComponent,
		BulbComponent,
		TasksComponent,
		TaskDetailComponent,
		MessagesComponent,
		DashboardComponent,
		TaskSearchComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		AppRoutingModule,
		HttpClientModule
	],
	providers: [
		// {provide: APP_BASE_HREF, useValue: '/'},
		TaskService,
		MessageService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
