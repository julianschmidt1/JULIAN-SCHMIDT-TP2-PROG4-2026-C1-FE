import { Pipe, PipeTransform } from '@angular/core';

import { UserResponse } from '../../features/auth/models/user-response';

@Pipe({
  name: 'fullName',
  standalone: true,
})
export class FullNamePipe implements PipeTransform {
  transform(user: UserResponse): string {
    return `${user.firstName} ${user.lastName}`;
  }
}