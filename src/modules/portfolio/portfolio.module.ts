import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioController } from './controllers/portfolio.controller';
import { PortfolioService } from './services/portfolio.service';
import { PortfolioRepository } from './repositories/portfolio.repository';
import { Portfolio } from './entities/portfolio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio])],
  controllers: [PortfolioController],
  providers: [
    PortfolioService,
    {
      provide: 'PORTFOLIO_REPOSITORY',
      useClass: PortfolioRepository,
    },
  ],
  exports: [PortfolioService],
})
export class PortfolioModule {}
