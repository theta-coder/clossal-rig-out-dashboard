<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$req = Illuminate\Http\Request::create('/users', 'GET', ['draw' => 1]);
$req->headers->set('X-Requested-With', 'XMLHttpRequest');
$req->headers->set('Accept', 'application/json');

try {
    echo app()->call('App\Http\Controllers\UserManagement\UserController@index', ['request' => $req])->getContent();
}
catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString();
}
