import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DishesService } from './dishes.service';

@Controller('dishes')
export class DishesController {
  constructor(private dishesService: DishesService) {}

  @Get()
  findAll() {
    return this.dishesService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.dishesService.create(body);
  }

  @Post(':id/ratings')
  addRating(@Param('id') id: string, @Body('rating') rating: number) {
    return this.dishesService.addRating(id, rating);
  }
}
