import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dish } from './dish.entity';
import { Rating } from './rating.entity';

@Injectable()
export class DishesService {
  constructor(
    @InjectRepository(Dish) private dishRepo: Repository<Dish>,
    @InjectRepository(Rating) private ratingRepo: Repository<Rating>,
  ) {}

  async findAll() {
    const dishes = await this.dishRepo.find();
    const results = [];

    for (const dish of dishes) {
      const ratings = await this.ratingRepo.find({
        where: { dish_id: dish.id },
      });

      const avg =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

      results.push({ ...dish, average_rating: avg });
    }

    return results;
  }

  async create(data: Partial<Dish>) {
    const dish = this.dishRepo.create(data);
    return this.dishRepo.save(dish);
  }

  async addRating(dishId: string, rating: number) {
    const dish = await this.dishRepo.findOne({
      where: { id: dishId },
    });

    if (!dish) {
      throw new NotFoundException(`Dish with ID ${dishId} not found`);
    }

    const r = this.ratingRepo.create({
      dish_id: dishId,
      rating,
    });

    return this.ratingRepo.save(r);
  }
}
