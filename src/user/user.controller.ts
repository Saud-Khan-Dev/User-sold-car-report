import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/decorators/serialize.decorator';
import { UserDto } from './dtos/user.dto';
@Serialize(UserDto)
@Controller('auth')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('/sign-up')
  createUser(@Body() user: CreateUserDto) {
    return this.userService.create(user.email, user.password);
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }
}
