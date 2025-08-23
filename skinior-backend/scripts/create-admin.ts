import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
	const email = 'admin@skinior.com';
	const plain = 'TT%%oo77';

	const hashed = await bcrypt.hash(plain, 12);

	const user = await prisma.user.upsert({
		where: { email },
		update: {
			password: hashed,
			role: 'admin',
			isActive: true,
			isSystem: false,
		},
		create: {
			email,
			password: hashed,
			role: 'admin',
			isActive: true,
			isSystem: false,
		},
	});

	console.log('Admin created/updated:', user.email, user.id);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

