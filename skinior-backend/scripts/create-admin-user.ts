import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔐 Creating admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@skinior.com' },
    });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists. Updating password...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('TT%%oo77', 12);
      
      // Update the existing admin user
      await prisma.user.update({
        where: { email: 'admin@skinior.com' },
        data: {
          password: hashedPassword,
          role: 'admin',
          isActive: true,
          firstName: 'Admin',
          lastName: 'User',
        },
      });
      
      console.log('✅ Admin user password updated successfully');
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash('TT%%oo77', 12);
      
      // Create new admin user
      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@skinior.com',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          isActive: true,
        },
      });
      
      console.log('✅ Admin user created successfully');
      console.log(`📧 Email: ${adminUser.email}`);
      console.log(`🆔 ID: ${adminUser.id}`);
    }
    
    console.log('🎉 Admin setup complete!');
    console.log('📝 Login credentials:');
    console.log('   Email: admin@skinior.com');
    console.log('   Password: TT%%oo77');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createAdminUser();
