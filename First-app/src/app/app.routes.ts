import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { PropertyListComponent } from '../components/property-list/property-list.component';
import { BuyComponent } from '../components/buy/buy.component';
import { RentComponent } from '../components/rent/rent.component';
import { ListPropertyComponent } from '../components/list-property/list-property.component';
import { authGuard } from '../guards/auth.guard';

export const routes: Routes = [
  { path: '', component: PropertyListComponent },
  { path: 'buy', component: BuyComponent },
  { path: 'rent', component: RentComponent },
  { path: 'list-property', component: ListPropertyComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'edit-property/:id',
    component: ListPropertyComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
