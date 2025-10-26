import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QualificationController } from './controllers/qualification.controller';
import { QualificationService } from './services/qualification.service';
import { QualificationRepository } from './repositories/qualification.repository';
import { Qualification } from './entities/qualification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Qualification])],
  controllers: [QualificationController],
  providers: [
    QualificationService,
    {
      provide: 'QUALIFICATION_REPOSITORY',
      useClass: QualificationRepository,
    },
  ],
  exports: [QualificationService],
})
export class QualificationModule {}
