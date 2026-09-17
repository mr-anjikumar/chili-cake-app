import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './dish.entity';
import { Rating } from './rating.entity';
import { DishesService } from './dishes.service';
import { DishesController } from './dishes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Dish, Rating])],
  providers: [DishesService],
  controllers: [DishesController],
})
export class DishesModule {}
