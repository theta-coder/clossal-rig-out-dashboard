-- ========================================
-- MISSING TABLES FOR E-COMMERCE + DASHBOARD
-- ========================================

-- --------------------------------------------------------
-- 1. DAILY SALES SUMMARY
-- --------------------------------------------------------

CREATE TABLE `daily_sales_summary` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `total_orders` int(11) NOT NULL DEFAULT 0,
  `total_revenue` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_customers` int(11) NOT NULL DEFAULT 0,
  `average_order_value` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_items_sold` int(11) NOT NULL DEFAULT 0,
  `refund_count` int(11) NOT NULL DEFAULT 0,
  `refund_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. MONTHLY SALES SUMMARY
-- --------------------------------------------------------

CREATE TABLE `monthly_sales_summary` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `year` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `total_orders` int(11) NOT NULL DEFAULT 0,
  `total_revenue` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_customers` int(11) NOT NULL DEFAULT 0,
  `average_order_value` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_items_sold` int(11) NOT NULL DEFAULT 0,
  `refund_count` int(11) NOT NULL DEFAULT 0,
  `refund_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. TOP PRODUCTS
-- --------------------------------------------------------

CREATE TABLE `top_products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `period` enum('daily','weekly','monthly','yearly') NOT NULL,
  `period_date` date NOT NULL,
  `units_sold` int(11) NOT NULL DEFAULT 0,
  `total_revenue` decimal(15,2) NOT NULL DEFAULT 0.00,
  `views` int(11) NOT NULL DEFAULT 0,
  `conversion_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `rank` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. TOP CUSTOMERS
-- --------------------------------------------------------

CREATE TABLE `top_customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `total_orders` int(11) NOT NULL DEFAULT 0,
  `total_spent` decimal(15,2) NOT NULL DEFAULT 0.00,
  `average_order_value` decimal(10,2) NOT NULL DEFAULT 0.00,
  `last_purchase_at` timestamp NULL DEFAULT NULL,
  `customer_since` date NULL,
  `is_vip` tinyint(1) NOT NULL DEFAULT 0,
  `lifetime_value` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. CUSTOMER SEGMENTS
-- --------------------------------------------------------

CREATE TABLE `customer_segments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'VIP, Regular, At-Risk, New, Inactive',
  `description` text DEFAULT NULL,
  `min_spending` decimal(15,2) NOT NULL DEFAULT 0.00,
  `max_spending` decimal(15,2) DEFAULT NULL,
  `min_orders` int(11) NOT NULL DEFAULT 0,
  `max_orders` int(11) DEFAULT NULL,
  `days_since_purchase` int(11) DEFAULT NULL COMMENT 'For at-risk segment',
  `total_customers` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. CUSTOMER SEGMENT MAPPING
-- --------------------------------------------------------

CREATE TABLE `customer_segment_mapping` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `segment_id` bigint(20) UNSIGNED NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. CONVERSION FUNNEL
-- --------------------------------------------------------

CREATE TABLE `conversion_funnel` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `visitors` int(11) NOT NULL DEFAULT 0,
  `product_views` int(11) NOT NULL DEFAULT 0,
  `add_to_cart` int(11) NOT NULL DEFAULT 0,
  `checkout_start` int(11) NOT NULL DEFAULT 0,
  `orders_completed` int(11) NOT NULL DEFAULT 0,
  `visitor_to_view_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `view_to_cart_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `cart_to_checkout_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `checkout_to_order_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `overall_conversion_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 8. TRAFFIC SOURCES
-- --------------------------------------------------------

CREATE TABLE `traffic_sources` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `source` enum('direct','organic','paid','social','email','referral','other') NOT NULL,
  `visitors` int(11) NOT NULL DEFAULT 0,
  `sessions` int(11) NOT NULL DEFAULT 0,
  `bounces` int(11) NOT NULL DEFAULT 0,
  `bounce_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `conversions` int(11) NOT NULL DEFAULT 0,
  `conversion_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `revenue` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 9. PAYMENT TRANSACTIONS LOG
-- --------------------------------------------------------

CREATE TABLE `payment_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `payment_method` enum('credit_card','debit_card','paypal','bank_transfer','wallet','cod') NOT NULL,
  `gateway` varchar(100) DEFAULT NULL COMMENT 'Stripe, PayPal, etc.',
  `amount` decimal(15,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'PKR',
  `status` enum('pending','completed','failed','refunded','cancelled') NOT NULL DEFAULT 'pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `reference_id` varchar(255) DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `response_data` json DEFAULT NULL,
  `attempted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 10. PAYMENT FAILURE LOGS
-- --------------------------------------------------------

CREATE TABLE `payment_failures` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `payment_method` varchar(100) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `failure_reason` text NOT NULL,
  `error_code` varchar(100) DEFAULT NULL,
  `retry_count` int(11) NOT NULL DEFAULT 0,
  `last_retry_at` timestamp NULL DEFAULT NULL,
  `is_resolved` tinyint(1) NOT NULL DEFAULT 0,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 11. LOW STOCK ALERTS
-- --------------------------------------------------------

CREATE TABLE `low_stock_alerts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `variant_id` bigint(20) UNSIGNED DEFAULT NULL,
  `current_stock` int(11) NOT NULL,
  `threshold_level` int(11) NOT NULL,
  `is_alert_sent` tinyint(1) NOT NULL DEFAULT 0,
  `alert_sent_at` timestamp NULL DEFAULT NULL,
  `is_critical` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Stock is 0 or very low',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 12. DASHBOARD PREFERENCES
-- --------------------------------------------------------

CREATE TABLE `dashboard_preferences` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `widgets` json DEFAULT NULL COMMENT 'Array of widget configurations',
  `layout` enum('grid','list','compact') NOT NULL DEFAULT 'grid',
  `default_date_range` varchar(50) DEFAULT '30days' COMMENT '7days, 30days, 90days, 1year, custom',
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 13. CURRENCY RATES
-- --------------------------------------------------------

CREATE TABLE `currency_rates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `base_currency` varchar(3) NOT NULL DEFAULT 'PKR',
  `target_currency` varchar(3) NOT NULL,
  `rate` decimal(15,8) NOT NULL,
  `source` varchar(100) DEFAULT NULL COMMENT 'API source',
  `last_updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 14. EMAIL TEMPLATES
-- --------------------------------------------------------

CREATE TABLE `email_templates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL UNIQUE,
  `subject` varchar(255) NOT NULL,
  `template_html` longtext NOT NULL,
  `template_text` longtext DEFAULT NULL,
  `variables` json DEFAULT NULL COMMENT 'Array of available variables',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `category` enum('order','payment','shipping','customer','marketing','account','system') NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 15. SMS TEMPLATES
-- --------------------------------------------------------

CREATE TABLE `sms_templates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL UNIQUE,
  `message` text NOT NULL,
  `variables` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `category` enum('order','shipping','payment','alert','marketing','otp') NOT NULL,
  `character_count` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 16. SUPPORT TICKETS
-- --------------------------------------------------------

CREATE TABLE `support_tickets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ticket_number` varchar(50) NOT NULL UNIQUE,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `category` enum('shipping','payment','product','return','account','other') NOT NULL,
  `status` enum('open','in-progress','on-hold','resolved','closed') NOT NULL DEFAULT 'open',
  `assigned_to` bigint(20) UNSIGNED DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 17. SUPPORT TICKET REPLIES
-- --------------------------------------------------------

CREATE TABLE `support_ticket_replies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ticket_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `message` longtext NOT NULL,
  `is_admin_reply` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 18. FAQs
-- --------------------------------------------------------

CREATE TABLE `faqs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` longtext NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `views` int(11) NOT NULL DEFAULT 0,
  `helpful_count` int(11) NOT NULL DEFAULT 0,
  `unhelpful_count` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 19. SYSTEM SETTINGS
-- --------------------------------------------------------

CREATE TABLE `system_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL UNIQUE,
  `value` longtext DEFAULT NULL,
  `description` text DEFAULT NULL,
  `type` enum('string','integer','decimal','boolean','array','json') NOT NULL DEFAULT 'string',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 20. GIFT CARDS
-- --------------------------------------------------------

CREATE TABLE `gift_cards` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(100) NOT NULL UNIQUE,
  `amount` decimal(15,2) NOT NULL,
  `balance` decimal(15,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'PKR',
  `sender_name` varchar(255) DEFAULT NULL,
  `recipient_email` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` enum('active','used','expired','cancelled') NOT NULL DEFAULT 'active',
  `expires_at` timestamp NULL DEFAULT NULL,
  `redeemed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `redeemed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 21. GIFT CARD REDEMPTIONS
-- --------------------------------------------------------

CREATE TABLE `gift_card_redemptions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `gift_card_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `amount_used` decimal(15,2) NOT NULL,
  `redeemed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 22. BLOG POSTS
-- --------------------------------------------------------

CREATE TABLE `blog_posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL UNIQUE,
  `content` longtext NOT NULL,
  `excerpt` text DEFAULT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `author_id` bigint(20) UNSIGNED NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `views` int(11) NOT NULL DEFAULT 0,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 23. STATIC PAGES
-- --------------------------------------------------------

CREATE TABLE `static_pages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL UNIQUE,
  `content` longtext NOT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` varchar(500) DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 24. CAMPAIGNS
-- --------------------------------------------------------

CREATE TABLE `campaigns` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('email','sms','push','social') NOT NULL,
  `target_segment_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('draft','scheduled','active','paused','completed','cancelled') NOT NULL DEFAULT 'draft',
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `total_sent` int(11) NOT NULL DEFAULT 0,
  `total_opened` int(11) NOT NULL DEFAULT 0,
  `total_clicked` int(11) NOT NULL DEFAULT 0,
  `total_converted` int(11) NOT NULL DEFAULT 0,
  `budget` decimal(15,2) DEFAULT NULL,
  `spent` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 25. CAMPAIGN METRICS
-- --------------------------------------------------------

CREATE TABLE `campaign_metrics` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `campaign_id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `sent` int(11) NOT NULL DEFAULT 0,
  `delivered` int(11) NOT NULL DEFAULT 0,
  `failed` int(11) NOT NULL DEFAULT 0,
  `opened` int(11) NOT NULL DEFAULT 0,
  `clicked` int(11) NOT NULL DEFAULT 0,
  `conversions` int(11) NOT NULL DEFAULT 0,
  `revenue` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- PRIMARY KEYS & INDEXES
-- ========================================

ALTER TABLE `daily_sales_summary` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `unique_date` (`date`);
ALTER TABLE `monthly_sales_summary` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `unique_month` (`year`, `month`);
ALTER TABLE `top_products` ADD PRIMARY KEY (`id`), ADD KEY `idx_product_id` (`product_id`), ADD KEY `idx_period` (`period`, `period_date`);
ALTER TABLE `top_customers` ADD PRIMARY KEY (`id`), ADD KEY `idx_user_id` (`user_id`);
ALTER TABLE `customer_segments` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `unique_name` (`name`);
ALTER TABLE `customer_segment_mapping` ADD PRIMARY KEY (`id`), ADD KEY `idx_user_id` (`user_id`), ADD KEY `idx_segment_id` (`segment_id`);
ALTER TABLE `conversion_funnel` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `unique_date` (`date`);
ALTER TABLE `traffic_sources` ADD PRIMARY KEY (`id`), ADD KEY `idx_date_source` (`date`, `source`);
ALTER TABLE `payment_transactions` ADD PRIMARY KEY (`id`), ADD KEY `idx_order_id` (`order_id`), ADD KEY `idx_user_id` (`user_id`), ADD KEY `idx_status` (`status`);
ALTER TABLE `payment_failures` ADD PRIMARY KEY (`id`), ADD KEY `idx_order_id` (`order_id`), ADD KEY `idx_user_id` (`user_id`);
ALTER TABLE `low_stock_alerts` ADD PRIMARY KEY (`id`), ADD KEY `idx_product_id` (`product_id`);
ALTER TABLE `dashboard_preferences` ADD PRIMARY KEY (`id`), ADD KEY `idx_user_id` (`user_id`);
ALTER TABLE `currency_rates` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `unique_pair` (`base_currency`, `target_currency`);
ALTER TABLE `email_templates` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `unique_slug` (`slug`);
ALTER TABLE `sms_templates` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `unique_slug` (`slug`);
ALTER TABLE `support_tickets` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `unique_number` (`ticket_number`), ADD KEY `idx_user_id` (`user_id`), ADD KEY `idx_status` (`status`);
ALTER TABLE `support_ticket_replies` ADD PRIMARY KEY (`id`), ADD KEY `idx_ticket_id` (`ticket_id`);
ALTER TABLE `faqs` ADD PRIMARY KEY (`id`), ADD KEY `idx_category` (`category`);
ALTER TABLE `system_settings` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `unique_key` (`key`);
ALTER TABLE `gift_cards` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `unique_code` (`code`);
ALTER TABLE `gift_card_redemptions` ADD PRIMARY KEY (`id`), ADD KEY `idx_gift_card_id` (`gift_card_id`);
ALTER TABLE `blog_posts` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `unique_slug` (`slug`), ADD KEY `idx_author_id` (`author_id`);
ALTER TABLE `static_pages` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `unique_slug` (`slug`);
ALTER TABLE `campaigns` ADD PRIMARY KEY (`id`), ADD KEY `idx_status` (`status`), ADD KEY `idx_type` (`type`);
ALTER TABLE `campaign_metrics` ADD PRIMARY KEY (`id`), ADD KEY `idx_campaign_id` (`campaign_id`), ADD KEY `idx_date` (`date`);

-- ========================================
-- AUTO INCREMENT
-- ========================================

ALTER TABLE `daily_sales_summary` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `monthly_sales_summary` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `top_products` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `top_customers` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `customer_segments` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `customer_segment_mapping` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `conversion_funnel` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `traffic_sources` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `payment_transactions` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `payment_failures` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `low_stock_alerts` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `dashboard_preferences` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `currency_rates` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `email_templates` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `sms_templates` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `support_tickets` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `support_ticket_replies` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `faqs` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `system_settings` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `gift_cards` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `gift_card_redemptions` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `blog_posts` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `static_pages` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `campaigns` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `campaign_metrics` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

-- ========================================
-- FOREIGN KEY CONSTRAINTS
-- ========================================

ALTER TABLE `customer_segment_mapping`
  ADD CONSTRAINT `fk_segment_mapping_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_segment_mapping_segment` FOREIGN KEY (`segment_id`) REFERENCES `customer_segments` (`id`) ON DELETE CASCADE;

ALTER TABLE `payment_transactions`
  ADD CONSTRAINT `fk_payment_trans_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_payment_trans_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `payment_failures`
  ADD CONSTRAINT `fk_payment_fail_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_payment_fail_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `dashboard_preferences`
  ADD CONSTRAINT `fk_dashboard_pref_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `support_tickets`
  ADD CONSTRAINT `fk_support_ticket_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_support_ticket_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_support_ticket_admin` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `support_ticket_replies`
  ADD CONSTRAINT `fk_support_reply_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_support_reply_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `gift_cards`
  ADD CONSTRAINT `fk_gift_card_user` FOREIGN KEY (`redeemed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `gift_card_redemptions`
  ADD CONSTRAINT `fk_gift_card_redemption` FOREIGN KEY (`gift_card_id`) REFERENCES `gift_cards` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_gift_card_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

ALTER TABLE `blog_posts`
  ADD CONSTRAINT `fk_blog_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `campaigns`
  ADD CONSTRAINT `fk_campaign_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_campaign_segment` FOREIGN KEY (`target_segment_id`) REFERENCES `customer_segments` (`id`) ON DELETE SET NULL;

ALTER TABLE `campaign_metrics`
  ADD CONSTRAINT `fk_campaign_metrics` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
