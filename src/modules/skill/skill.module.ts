import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillController } from './controllers/skill.controller';
import { SkillService } from './services/skill.service';
import { SkillRepository } from './repositories/skill.repository';
import { Skill } from './entities/skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Skill])],
  controllers: [SkillController],
  providers: [
    SkillService,
    {
      provide: 'SKILL_REPOSITORY',
      useClass: SkillRepository,
    },
  ],
  exports: [SkillService],
})
export class SkillModule {}
