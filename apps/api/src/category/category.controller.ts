import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
    CreateCategoryInput,
    UpdateCategoryInput,
    UserRole,
    createCategorySchema,
    updateCategorySchema,
} from '@cse-quiz/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body(new ZodValidationPipe(createCategorySchema)) data: CreateCategoryInput) {
        return this.categoryService.create(data);
    }

    @Get()
    findAll() {
        return this.categoryService.findAll();
    }

    @Get('tree')
    findTree() {
        return this.categoryService.findTree();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN)
    update(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(updateCategorySchema)) data: UpdateCategoryInput
    ) {
        return this.categoryService.update(id, data);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.categoryService.remove(id);
    }
}
