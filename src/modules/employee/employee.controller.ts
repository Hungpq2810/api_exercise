import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthGuardJwt } from '../auth/guard/auth-guard.jwt';
import { CreateEmployeeDto } from './dto/employee.dto';

@ApiTags('employee')
@Controller('/employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}
}
