import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';



const routes: Routes = [
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
	{ path: 'tasks', component: TasksComponent },
	{ path: 'detail/:id', component: TaskDetailComponent },
	{ path: 'dashboard', component: DashboardComponent }
];

@NgModule({
	exports: [
		RouterModule
	],
	// imports: [ RouterModule.forRoot(routes) ]
	// imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
	imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule {
}
