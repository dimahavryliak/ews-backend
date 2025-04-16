import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  create(eventData: Partial<Event>) {
    const event = this.eventRepository.create(eventData);
    return this.eventRepository.save(event);
  }

  findAll() {
    return this.eventRepository.find();
  }

  findOne(id: number) {
    return this.eventRepository.findOneBy({ id });
  }

  async update(id: number, updateData: Partial<Event>) {
    const event = await this.eventRepository.preload({
      id: id,
      ...updateData,
    });
    if (!event) throw new NotFoundException(`Event #${id} not found`);
    return this.eventRepository.save(event);
  }

  async remove(id: number) {
    const event = await this.findOne(id);
    if (!event) {
      throw new NotFoundException(`Event #${id} not found`);
    }
    return this.eventRepository.remove(event);
  }
}
