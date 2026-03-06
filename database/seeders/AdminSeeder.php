<?php

namespace Database\Seeders;

use App\Models\UserManagement\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@urbanthread.com'],
            [
                'name' => 'Admin',
                'email' => 'admin@urbanthread.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'phone' => null,
            ]
        );

        $this->command->info('Admin account created: admin@urbanthread.com / admin123');
    }
}

