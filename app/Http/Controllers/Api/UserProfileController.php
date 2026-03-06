<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\UserManagement\Address; // Assuming Address model exists

class UserProfileController extends Controller
{
    /**
     * Get user orders
     */
    public function orders(Request $request)
    {
        $orders = $request->user()->orders()->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Get user addresses
     */
    public function addresses(Request $request)
    {
        // Check if addresses relationship exists on the model
        if (!method_exists($request->user(), 'addresses')) {
            return response()->json([
                'success' => true,
                'data' => []
            ]);
        }

        $addresses = $request->user()->addresses()->get();
        return response()->json([
            'success' => true,
            'data' => $addresses
        ]);
    }

    /**
     * Update user profile
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'current_password' => 'nullable|required_with:new_password',
            'new_password' => 'nullable|min:8|confirmed',
        ]);

        $user->name = $validated['name'];
        $user->phone = $validated['phone'];

        if ($request->filled('new_password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect.'
                ], 422);
            }
            $user->password = Hash::make($request->new_password);
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone
            ]
        ]);
    }

    /**
     * Store a new address
     */
    public function storeAddress(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'zip' => 'required|string|max:20',
            'phone' => 'required|string|max:20',
            'is_default' => 'boolean'
        ]);

        $user = $request->user();

        // If this is the first address or set as default, reset other defaults
        if ($validated['is_default'] ?? false || $user->addresses()->count() === 0) {
            $user->addresses()->update(['is_default' => false]);
            $validated['is_default'] = true;
        }

        $address = $user->addresses()->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Address added successfully',
            'data' => $address
        ]);
    }

    /**
     * Update an existing address
     */
    public function updateAddress(Request $request, $id)
    {
        $address = $request->user()->addresses()->findOrFail($id);

        $validated = $request->validate([
            'type' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'zip' => 'required|string|max:20',
            'phone' => 'required|string|max:20',
            'is_default' => 'boolean'
        ]);

        if ($validated['is_default'] ?? false) {
            $request->user()->addresses()->where('id', '!=', $id)->update(['is_default' => false]);
        }

        $address->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Address updated successfully',
            'data' => $address
        ]);
    }

    /**
     * Delete an address
     */
    public function deleteAddress(Request $request, $id)
    {
        $address = $request->user()->addresses()->findOrFail($id);

        $wasDefault = $address->is_default;
        $address->delete();

        // If we deleted the default address, set another one as default if any exist
        if ($wasDefault) {
            $nextAddress = $request->user()->addresses()->first();
            if ($nextAddress) {
                $nextAddress->update(['is_default' => true]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Address deleted successfully'
        ]);
    }
}



