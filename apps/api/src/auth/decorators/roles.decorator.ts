import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@cse-quiz/shared';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
