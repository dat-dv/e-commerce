import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './create-permission.dto';

import { IUpdatePermissionRequest } from '@ecommerce/shared';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) implements IUpdatePermissionRequest {}
