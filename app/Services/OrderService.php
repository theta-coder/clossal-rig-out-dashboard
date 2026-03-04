<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    /**
     * Create a new order
     */
    public function createOrder(array $data)
    {
        return DB::transaction(function () use ($data) {
            $order = Order::create([
                'order_number' => 'UT-' . strtoupper(Str::random(8)),
                'user_id' => $data['user_id'],
                'address_id' => $data['address_id'],
                'coupon_id' => $data['coupon_id'] ?? null,
                'subtotal' => $data['subtotal'],
                'shipping_cost' => $data['shipping_cost'] ?? 0,
                'discount_amount' => $data['discount_amount'] ?? 0,
                'total' => $data['total'],
                'payment_method' => $data['payment_method'] ?? 'cod',
                'notes' => $data['notes'] ?? null,
                'status' => 'pending',
            ]);

            $order->statusHistories()->create([
                'status' => 'pending',
                'notes' => 'Order placed successfully',
            ]);

            foreach ($data['items'] as $item) {
                $product = Product::with('images')->find($item['product_id']);

                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'product_name' => $product->name,
                    'product_image' => $product->images->first()->image_path ?? '',
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'size' => $item['size'] ?? null,
                    'color' => $item['color'] ?? null,
                ]);

            // Optional: Update product stock
            }

            return $order;
        });
    }

    /**
     * Update order status
     */
    public function updateStatus(Order $order, string $status, ?string $notes = null)
    {
        $order->status = $status;
        if ($notes) {
            $order->notes = $notes;
        }
        $order->save();

        $order->statusHistories()->create([
            'status' => $status,
            'notes' => $notes ?? "Order status updated to " . ucfirst(str_replace('_', ' ', $status)),
        ]);

        return $order;
    }

    /**
     * Get available statuses
     */
    public function getStatuses()
    {
        return [
            'pending' => 'Pending',
            'confirmed' => 'Confirmed',
            'ready_to_ship' => 'Ready to Ship',
            'shipped' => 'Shipped',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled',
        ];
    }
}
