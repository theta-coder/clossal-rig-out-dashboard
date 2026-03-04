<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $modules = [
            'categories',
            'products',
            'sizes',
            'colors',
            'orders',
            'users',
            'roles',
            'reviews',
            'coupons',
            'subscribers',
            'messages',
            'settings',
        ];

        $actions = ['show', 'create', 'edit', 'delete'];

        $permissions = ['dashboard_access'];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                // Generates e.g., show_products, create_products
                $permissions[] = "{$action}_{$module}";
            }
        }

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create Admin role and assign all permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions($permissions);

        // Assign Admin role to first user if exists
        $user = User::where('role', 'admin')->first() ?: User::first();
        if ($user) {
            $user->assignRole($adminRole);
        }
    }
}
