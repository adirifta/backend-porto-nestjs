import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutController } from './controllers/about.controller';
import { AboutService } from './services/about.service';
import { About } from './entities/about.entity';
import { AboutRepository } from './repositories/about.repository';

@Module({
  imports: [TypeOrmModule.forFeature([About])],
  controllers: [AboutController],
  providers: [
    AboutService,
    {
      provide: 'ABOUT_REPOSITORY',
      useClass: AboutRepository,
    },
  ],
  exports: [AboutService],
})
export class AboutModule {}
