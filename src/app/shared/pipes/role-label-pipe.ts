import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleLabel',
  standalone: true,
})
export class RoleLabelPipe implements PipeTransform {
  transform(role: string): string {
    switch (role) {
      case 'administrator':
        return 'Administrador';

      case 'user':
        return 'Usuario';

      default:
        return role;
    }
  }
}