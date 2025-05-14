import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PodcastDetailComponent } from './podcasts/podcast-detail.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'subscription', component: SubscriptionComponent, canActivate: [AuthGuard] },
  { path: 'podcasts/:id', component: PodcastDetailComponent },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
