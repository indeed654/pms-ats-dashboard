import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasRoleDirective, HasNotRoleDirective } from './directives/role.directives';

@NgModule({
  imports: [
    CommonModule,
    HasRoleDirective,
    HasNotRoleDirective
  ],
  exports: [
    HasRoleDirective,
    HasNotRoleDirective
  ]
})
export class RoleDirectivesModule { }