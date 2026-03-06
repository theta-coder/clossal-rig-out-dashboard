<?php

namespace App\Services;

use App\Models\Order;
use App\Models\ProductCatalog\Product;
use App\Models\ProductCatalog\ProductVariant;
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

                $orderItem = [
                    'product_id' => $item['product_id'],
                    'variant_id' => $item['variant_id'] ?? null,
                    'product_name' => $product->name,
                    'product_image' => $product->images->first()->image_path ?? '',
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'size' => $item['size'] ?? null,
                    'color' => $item['color'] ?? null,
                ];

                // If variant_id is provided, use variant specific info
                if (!empty($item['variant_id'])) {
                    $variant = ProductVariant::with(['variantImages', 'size', 'color'])->find($item['variant_id']);
                    if ($variant) {
                        $orderItem['size'] = $variant->size->name ?? $orderItem['size'];
                        $orderItem['color'] = $variant->color->name ?? $orderItem['color'];
                        $primaryVariantImage = $variant->variantImages->firstWhere('is_primary', true) ?? $variant->variantImages->first();
                        if ($primaryVariantImage) {
                            $orderItem['product_image'] = $primaryVariantImage->image_path;
                        }

                        // Deduct variant stock
                        if ($variant->stock >= $item['quantity']) {
                            $variant->decrement('stock', $item['quantity']);
                        }
                    }
                }
                else {
                // Falls back to simple product stock if no variant used
                // Note: This matches the old behavior where stock might be on product_sizes pivot
                }

                $order->items()->create($orderItem);
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
