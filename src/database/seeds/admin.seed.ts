import { createConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/auth/entities/user.entity';
import { UserProfile } from '../../modules/user/entities/user-profile.entity';
import { UserRole } from '../../modules/auth/entities/user.entity';
import { config } from 'dotenv';
import { getDatabaseConfig } from '../../config/database.config';

// Load environment variables
config();

class AdminSeeder {
  public async run(): Promise<void> {
    console.log('🚀 Starting admin seeder...');

    let connection;
    
    try {
      // Create database connection using existing config
      const databaseConfig = getDatabaseConfig({
        get: (key: string, defaultValue?: any) => {
          const envValue = process.env[key];
          return envValue !== undefined ? envValue : defaultValue;
        },
      } as any);

      // Convert TypeOrmModuleOptions to DataSourceOptions
      const connectionOptions = {
        ...databaseConfig,
        name: 'seed-connection',
        logging: true,
      };

      connection = await createConnection(connectionOptions as any);

      console.log('✅ Database connected successfully!');

      const userRepository = connection.getRepository(User);
      const profileRepository = connection.getRepository(UserProfile);

      // Check if admin already exists
      const adminUser = await userRepository.findOne({
        where: { email: 'admin@example.com' },
        relations: ['profile'],
      });

      if (adminUser) {
        console.log('✅ Admin user already exists:', adminUser.email);

        // Update password to ensure it's correct
        const hashedPassword = await bcrypt.hash('admin123', 12);
        await userRepository.update(adminUser.id, {
          password: hashedPassword,
          role: UserRole.ADMIN,
        });
        console.log('🔑 Admin password updated');
        return;
      }

      console.log('📝 Creating new admin user...');

      // Hash password
      const hashedPassword = await bcrypt.hash('admin123', 12);

      // Create user entity
      const user = userRepository.create({
        email: 'admin@example.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
      });

      const savedUser = await userRepository.save(user);
      console.log('✅ User saved with ID:', savedUser.id);

      // Create profile entity
      const profile = profileRepository.create({
        firstName: 'Admin',
        lastName: 'User',
        bio: 'System Administrator',
        userId: savedUser.id,
      });

      await profileRepository.save(profile);
      console.log('✅ Profile saved for user ID:', savedUser.id);

      console.log('🎉 Admin user created successfully!');
      console.log('📧 Email: admin@example.com');
      console.log('🔑 Password: admin123');
      console.log('👤 Role: ADMIN');

    } catch (error) {
      console.error('❌ Error creating admin user:', error);
      throw error;
    } finally {
      if (connection) {
        await connection.close();
        console.log('🔌 Database connection closed.');
      }
    }
  }
}

// Function to run the seeder
async function bootstrap() {
  console.log('🔌 Initializing admin seeder...');
  
  try {
    const seeder = new AdminSeeder();
    await seeder.run();
    console.log('✅ Seeder completed successfully!');
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
  }
}

// Jalankan seeder
bootstrap()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Bootstrap error:', error);
    process.exit(1);
  });