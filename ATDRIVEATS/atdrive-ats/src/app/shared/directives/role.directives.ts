import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { RoleService } from '../../core/services/role.service';
import { UserRole } from '../../core/models/role.model';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private roleService: RoleService
  ) {}

  @Input() set appHasRole(roles: UserRole | UserRole[]) {
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    const hasRole = this.roleService.hasAnyRole(rolesArray);
    
    if (hasRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

@Directive({
  selector: '[appHasNotRole]',
  standalone: true
})
export class HasNotRoleDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private roleService: RoleService
  ) {}

  @Input() set appHasNotRole(roles: UserRole | UserRole[]) {
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    const hasRole = this.roleService.hasAnyRole(rolesArray);
    
    if (!hasRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (hasRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}