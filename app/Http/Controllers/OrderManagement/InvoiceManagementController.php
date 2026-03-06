<?php

namespace App\Http\Controllers\OrderManagement;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class InvoiceManagementController extends BaseOrderManagementController
{
    protected function resourceKey(): string
    {
        return 'invoices';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'Invoices',
            'description' => 'Billing documents generated for orders.',
            'table' => 'invoices',
            'timestamp_mode' => 'full',
            'order_column' => 'invoices.id',
            'search_columns' => [
                'invoices.id',
                'invoices.invoice_number',
                'orders.order_number',
                'users.name',
                'invoices.status',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'invoice_number', 'label' => 'Invoice #'],
                ['key' => 'order_number', 'label' => 'Order #'],
                ['key' => 'user_name', 'label' => 'User'],
                ['key' => 'status', 'label' => 'Status'],
                ['key' => 'total', 'label' => 'Total'],
                ['key' => 'issued_at', 'label' => 'Issued At'],
            ],
            'fields' => [
                ['name' => 'order_id', 'label' => 'Order', 'type' => 'select', 'options' => 'orders'],
                ['name' => 'user_id', 'label' => 'User', 'type' => 'select', 'options' => 'users', 'nullable' => true],
                ['name' => 'invoice_number', 'label' => 'Invoice Number', 'type' => 'text'],
                [
                    'name' => 'status',
                    'label' => 'Status',
                    'type' => 'select',
                    'choices' => [
                        ['value' => 'draft', 'label' => 'Draft'],
                        ['value' => 'issued', 'label' => 'Issued'],
                        ['value' => 'paid', 'label' => 'Paid'],
                        ['value' => 'cancelled', 'label' => 'Cancelled'],
                    ],
                ],
                ['name' => 'subtotal', 'label' => 'Subtotal', 'type' => 'decimal'],
                ['name' => 'discount_amount', 'label' => 'Discount', 'type' => 'decimal', 'nullable' => true],
                ['name' => 'tax_amount', 'label' => 'Tax', 'type' => 'decimal', 'nullable' => true],
                ['name' => 'shipping_cost', 'label' => 'Shipping Cost', 'type' => 'decimal', 'nullable' => true],
                ['name' => 'total', 'label' => 'Total', 'type' => 'decimal'],
                ['name' => 'notes', 'label' => 'Notes', 'type' => 'textarea', 'nullable' => true],
                ['name' => 'pdf_path', 'label' => 'PDF Path', 'type' => 'text', 'nullable' => true],
                ['name' => 'issued_at', 'label' => 'Issued At', 'type' => 'datetime', 'nullable' => true],
                ['name' => 'due_at', 'label' => 'Due At', 'type' => 'datetime', 'nullable' => true],
            ],
        ];
    }

    protected function buildListQuery()
    {
        return DB::table('invoices')
            ->leftJoin('orders', 'orders.id', '=', 'invoices.order_id')
            ->leftJoin('users', 'users.id', '=', 'invoices.user_id')
            ->select('invoices.*', 'orders.order_number', 'users.name as user_name');
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        return [
            'order_id' => ['required', 'exists:orders,id'],
            'user_id' => ['nullable', 'exists:users,id'],
            'invoice_number' => ['required', 'string', 'max:120', Rule::unique('invoices', 'invoice_number')->ignore($id)],
            'status' => ['required', 'in:draft,issued,paid,cancelled'],
            'subtotal' => ['required', 'numeric', 'min:0'],
            'discount_amount' => ['nullable', 'numeric', 'min:0'],
            'tax_amount' => ['nullable', 'numeric', 'min:0'],
            'shipping_cost' => ['nullable', 'numeric', 'min:0'],
            'total' => ['required', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
            'pdf_path' => ['nullable', 'string', 'max:500'],
            'issued_at' => ['nullable', 'date'],
            'due_at' => ['nullable', 'date'],
        ];
    }
}
