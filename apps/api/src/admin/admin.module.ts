import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AIModule } from '../ai/ai.module';
import { CategoryModule } from '../category/category.module';

@Module({
    imports: [AIModule, CategoryModule],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
