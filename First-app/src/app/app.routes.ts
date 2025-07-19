import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { PropertyListComponent } from '../components/property-list/property-list.component';
import { BuyComponent } from '../components/buy/buy.component';
import { RentComponent } from '../components/rent/rent.component';
import { ListPropertyComponent } from '../components/list-property/list-property.component';
import { authGuard } from '../guards/auth.guard';
import { PropertyCardComponent } from '../components/property-card/property-card.component';
import { PropertyDetailsComponent } from '../components/property-details/property-details.component';
import { MyPropertiesComponent } from '../components/my-properties/my-properties.component';

export const routes: Routes = [
  { path: '', redirectTo: '/properties', pathMatch: 'full' },
  { path: 'properties', component: PropertyListComponent },
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
  {
    path: 'my-properties',
    component: MyPropertiesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'property/:id',
    component: PropertyDetailsComponent
  },
  { path: '**', redirectTo: '' }
];
