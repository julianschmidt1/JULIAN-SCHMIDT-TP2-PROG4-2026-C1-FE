import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userStatus',
  standalone: true,
})
export class UserStatusPipe implements PipeTransform {
  transform(isActive: boolean): string {
    return isActive ? 'Activo' : 'Deshabilitado';
  }
}