<?php

namespace App\Http\Controllers\OrderManagement;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RefundBankDetailManagementController extends BaseOrderManagementController
{
    protected function resourceKey(): string
    {
        return 'refund-bank-details';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'Refund Bank Details',
            'description' => 'Bank details used for refund transfers.',
            'table' => 'refund_bank_details',
            'timestamp_mode' => 'full',
            'order_column' => 'refund_bank_details.id',
            'search_columns' => [
                'refund_bank_details.id',
                'returns.return_number',
                'users.name',
                'refund_bank_details.bank_name',
                'refund_bank_details.account_title',
                'refund_bank_details.account_number',
                'refund_bank_details.status',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'return_number', 'label' => 'Return #'],
                ['key' => 'user_name', 'label' => 'User'],
                ['key' => 'bank_name', 'label' => 'Bank'],
                ['key' => 'account_title', 'label' => 'Account Title'],
                ['key' => 'status', 'label' => 'Status'],
                ['key' => 'processed_at', 'label' => 'Processed At'],
            ],
            'fields' => [
                ['name' => 'return_id', 'label' => 'Return', 'type' => 'select', 'options' => 'returns'],
                ['name' => 'user_id', 'label' => 'User', 'type' => 'select', 'options' => 'users'],
                ['name' => 'bank_name', 'label' => 'Bank Name', 'type' => 'text'],
                ['name' => 'account_title', 'label' => 'Account Title', 'type' => 'text'],
                ['name' => 'account_number', 'label' => 'Account Number', 'type' => 'text'],
                ['name' => 'iban', 'label' => 'IBAN', 'type' => 'text', 'nullable' => true],
                ['name' => 'branch_code', 'label' => 'Branch Code', 'type' => 'text', 'nullable' => true],
                [
                    'name' => 'status',
                    'label' => 'Status',
                    'type' => 'select',
                    'choices' => [
                        ['value' => 'pending', 'label' => 'Pending'],
                        ['value' => 'processed', 'label' => 'Processed'],
                        ['value' => 'failed', 'label' => 'Failed'],
                    ],
                ],
                ['name' => 'processed_at', 'label' => 'Processed At', 'type' => 'datetime', 'nullable' => true],
                ['name' => 'transaction_reference', 'label' => 'Transaction Ref', 'type' => 'text', 'nullable' => true],
                ['name' => 'notes', 'label' => 'Notes', 'type' => 'textarea', 'nullable' => true],
            ],
        ];
    }

    protected function buildListQuery()
    {
        return DB::table('refund_bank_details')
            ->leftJoin('returns', 'returns.id', '=', 'refund_bank_details.return_id')
            ->leftJoin('users', 'users.id', '=', 'refund_bank_details.user_id')
            ->select('refund_bank_details.*', 'returns.return_number', 'users.name as user_name');
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        return [
            'return_id' => ['required', 'exists:returns,id'],
            'user_id' => ['required', 'exists:users,id'],
            'bank_name' => ['required', 'string', 'max:255'],
            'account_title' => ['required', 'string', 'max:255'],
            'account_number' => ['required', 'string', 'max:255'],
            'iban' => ['nullable', 'string', 'max:255'],
            'branch_code' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:pending,processed,failed'],
            'processed_at' => ['nullable', 'date'],
            'transaction_reference' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
