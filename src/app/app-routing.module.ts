import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inic',
    pathMatch: 'full'
  },
  {
    path: 'inic',
    loadChildren: () => import('./Pages/inic/inic.module').then( m => m.InicPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./Pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./Pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./Pages/main/main.module').then( m => m.MainPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./Pages/user/user.module').then( m => m.UserPageModule),
    canActivate: [authGuard]
  },







];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
